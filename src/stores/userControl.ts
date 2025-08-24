import axiosInstance from "@/api";
import LZString from "lz-string";
import { defineStore } from "pinia";
import { useErrorStore } from "@/stores/errorStore";

export const useUserControl = defineStore("login", {
	state: () => ({
		isLogin: false,
		checkConsole: false,
		name: "",
		picture: "",
		consoleAccess: false,
		isInitialized: false,
		isInitializing: false,
	}),
	actions: {
		resetUserState() {
			this.name = "";
			this.picture = "";
			this.isLogin = false;
			this.consoleAccess = false;
			this.checkConsole = false;
		},
		async getUser(src?: number) {
			if (this.isInitialized) {
				return;
			}

			if (this.isInitializing) {
				return new Promise<void>((resolve, reject) => {
					const timeout = setTimeout(() => {
						reject(new Error("User initialization timeout"));
					}, 10000);
					const checkInitialized = () => {
						if (this.isInitialized) {
							clearTimeout(timeout);
							resolve();
						} else if (this.isInitializing) {
							setTimeout(checkInitialized, 100);
						} else {
							clearTimeout(timeout);
							reject(new Error("User initialization interrupted"));
						}
					};
					checkInitialized();
				});
			}

			this.isInitializing = true;

			try {
				const res = await axiosInstance.get("/auth/user");

				if (res.status === 200) {
					const data = JSON.parse(LZString.decompressFromUTF16(res.data));
					this.isLogin = true;
					this.name = data.name;
					this.picture = data.picture;
					this.consoleAccess = data.console || false;
					this.isInitialized = true;
				}
			} catch (error: any) {
				this.resetUserState();
				if (error.response?.status === 401) {
					this.isInitialized = false;
					if (src === 1) {
						console.log("[AUTH] Redirecting to Google OAuth for auto-login");
						window.location.href = "https://a2.anireki.com/v2/auth/google";
						return;
					}
				} else {
					console.error("Authentication check failed:", error.response?.status || error.message);
					this.isInitialized = false;
					const errorStore = useErrorStore();
					errorStore.addError("無法取得使用者資訊", "error");
				}

				throw error;
			} finally {
				this.isInitializing = false;
			}
		},
		async getConsole() {
			try {
				let res = await axiosInstance.get("/auth/console");
				if (res.status === 200) {
					this.checkConsole = true;
					return true;
				} else {
					this.checkConsole = false;
					return false;
				}
			} catch (error) {
				this.checkConsole = false;
				const errorStore = useErrorStore();
				errorStore.addError("無法取得控制台權限", "error");
				return false;
			}
		},
		async logout() {
			try {
				await axiosInstance.post("/auth/logout");
				this.resetUserState();
			} catch (error) {
				const errorStore = useErrorStore();
				errorStore.addError("登出失敗", "error");
				console.error("Failed to logout:", error);
			}
		},
	},
	// persist: true,
});
