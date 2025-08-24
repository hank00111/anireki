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
			// 如果已初始化，直接返回
			if (this.isInitialized) {
				return;
			}

			// 如果正在初始化，返回等待 Promise - Context7 最佳實踐
			if (this.isInitializing) {
				return new Promise<void>((resolve, reject) => {
					const timeout = setTimeout(() => {
						reject(new Error("User initialization timeout"));
					}, 10000); // 10秒超時

					const checkInitialized = () => {
						if (this.isInitialized) {
							clearTimeout(timeout);
							resolve();
						} else if (this.isInitializing) {
							setTimeout(checkInitialized, 100);
						} else {
							// 初始化被中斷（失敗情況）
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
					this.isInitialized = true; // 成功後才標記為已初始化
				} else if (res.status === 204) {
					this.resetUserState();
					this.isInitialized = true; // 無用戶狀態也是有效的初始化結果

					// 只有明確要求自動登入時才跳轉
					if (src === 1) {
						window.location.href = "https://a2.anireki.com/v2/auth/google";
						return; // 跳轉後不繼續執行
					}
				}
			} catch (error) {
				this.resetUserState();
				// 錯誤情況下不標記為已初始化，允許重試
				this.isInitialized = false;

				const errorStore = useErrorStore();
				errorStore.addError("無法取得使用者資訊", "error");
				console.error("Failed to get user info:", error);

				throw error; // 重新拋出錯誤供調用者處理
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
