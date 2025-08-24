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
	getters: {
		isAuthenticated: (state) => state.isLogin,
		hasConsoleAccess: (state) => state.checkConsole && state.consoleAccess,
		userDisplayName: (state) => state.name || "Unknown User",
		initializationStatus: (state) => {
			if (state.isInitializing) return "initializing";
			if (state.isInitialized) return "completed";
			return "pending";
		}
	},
	actions: {
		resetUserState() {
			this.name = "";
			this.picture = "";
			this.isLogin = false;
			this.consoleAccess = false;
			this.checkConsole = false;
			this.isInitialized = false;
			this.isInitializing = false;
		},
		redirectToOAuth(returnUrl?: string) {
			let safeReturnUrl = returnUrl || (window.location.pathname + window.location.search);
			
			if (safeReturnUrl.startsWith('http://') || safeReturnUrl.startsWith('https://')) {
				try {
					const url = new URL(safeReturnUrl);
					if (url.origin !== window.location.origin) {
						console.warn("[SECURITY] [UserControl] External return URL blocked:", safeReturnUrl);
						safeReturnUrl = '/';
					} else {
						safeReturnUrl = url.pathname + url.search + url.hash;
					}
				} catch {
					safeReturnUrl = '/';
				}
			}
			
			safeReturnUrl = safeReturnUrl.replace(/[<>"']/g, '');
			
			const encodedReturnUrl = encodeURIComponent(safeReturnUrl);
			const oauthUrl = `https://a2.anireki.com/v2/auth/google?returnUrl=${encodedReturnUrl}`;
			
			window.location.href = oauthUrl;
		},

		async getUser(src?: number, returnUrl?: string) {
			if (src === 1) {
				this.redirectToOAuth(returnUrl);
				return;
			}

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
						} else if (!this.isInitializing) {
							clearTimeout(timeout);
							reject(new Error("User initialization interrupted"));
						} else {
							setTimeout(checkInitialized, 100);
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
					
				}
			} catch (error: any) {
				this.resetUserState();
				
				const errorStatus = error.response?.status;
				const errorStore = useErrorStore();

				const isAppStartup = src === 0;

				if (errorStatus === 401) {
					if (src === 1) {
						this.redirectToOAuth(returnUrl);
						return;
					}
				} else if (errorStatus === 503) {
					if (!isAppStartup) {
						errorStore.addError("認証サービスが一時的に利用できません。しばらくしてから再試行してください。", "warning");
					}
				} else if (errorStatus === 404) {
					if (src === 1) {
						errorStore.addError("ユーザーデータが見つかりません。再ログインしてください。", "error");
					}
				} else {
					if (!isAppStartup) {
						errorStore.addError("認証チェックに失敗しました", "error");
					}
				}
			} finally {
				this.isInitialized = true;
				this.isInitializing = false;
			}
		},
		async getConsole() {
			if (!this.isLogin) {
				this.checkConsole = false;
				return false;
			}

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
				errorStore.addError("コンソールアクセス権限の取得に失敗しました", "error");
				return false;
			}
		},
		async logout() {
			try {
				await axiosInstance.post("/auth/logout");
				this.resetUserState();
			} catch (error) {
				const errorStore = useErrorStore();
				errorStore.addError("ログアウトに失敗しました", "error");
				this.resetUserState();
			}
		},
		
		async reLogin(returnUrl?: string) {
			this.resetUserState();
			this.isInitialized = false; 
			await this.getUser(1, returnUrl);
		},
		
		async refreshAuthStatus() {
			if (!this.isInitialized) {
				await this.getUser(0);
			}
			return this.isLogin;
		},
	},
	// persist: true,
});
