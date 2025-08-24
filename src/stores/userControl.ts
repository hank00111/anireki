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
		// Context7 best practice: Use getters for computed values
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
			// Context7 best practice: Reset all state flags for clean logout
			this.isInitialized = false;
			this.isInitializing = false;
			console.log("[INFO] [UserControl] User state reset completely");
		},
		// Context7 best practice: Extract OAuth redirect logic into separate method
		redirectToOAuth(returnUrl?: string) {
			// Context7 security improvement: Validate and sanitize return URL
			let safeReturnUrl = returnUrl || (window.location.pathname + window.location.search);
			
			// Context7 security: Ensure return URL is relative and safe
			if (safeReturnUrl.startsWith('http://') || safeReturnUrl.startsWith('https://')) {
				// If absolute URL, only allow same origin
				try {
					const url = new URL(safeReturnUrl);
					if (url.origin !== window.location.origin) {
						console.warn("[SECURITY] [UserControl] External return URL blocked:", safeReturnUrl);
						safeReturnUrl = '/';
					} else {
						safeReturnUrl = url.pathname + url.search + url.hash;
					}
				} catch {
					console.warn("[SECURITY] [UserControl] Invalid return URL blocked:", safeReturnUrl);
					safeReturnUrl = '/';
				}
			}
			
			// Context7 security: Remove any potentially dangerous characters
			safeReturnUrl = safeReturnUrl.replace(/[<>"']/g, '');
			
			const encodedReturnUrl = encodeURIComponent(safeReturnUrl);
			const oauthUrl = `https://a2.anireki.com/v2/auth/google?returnUrl=${encodedReturnUrl}`;
			
			console.log(`[INFO] [UserControl] Redirecting to Google OAuth with return URL: ${safeReturnUrl}`);
			window.location.href = oauthUrl;
		},

		async getUser(src?: number, returnUrl?: string) {
			// Context7 fix: Handle OAuth redirect even when initialized
			if (src === 1) {
				// Force OAuth redirect regardless of initialization state
				console.log("[INFO] [UserControl] Initiating OAuth login");
				this.redirectToOAuth(returnUrl);
				return;
			}

			// Context7 fix: Prevent race conditions with proper state management
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
							// Context7 fix: Handle case where initialization was interrupted
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
					
					console.log("[SUCCESS] [UserControl] User authenticated successfully");
				}
			} catch (error: any) {
				this.resetUserState();
				
				const errorStatus = error.response?.status;
				const errorStore = useErrorStore();

				if (errorStatus === 401) {
					// Context7 fix: Handle unauthorized consistently
					if (src === 1) {
						this.redirectToOAuth(returnUrl);
						return;
					}
				} else if (errorStatus === 503) {
					console.error("[ERROR] [UserControl] Authentication service unavailable");
					errorStore.addError("認証サービスが一時的に利用できません。しばらくしてから再試行してください。", "warning");
				} else if (errorStatus === 404) {
					console.error("[ERROR] [UserControl] User data not found");
					// Context7 best practice: Offer re-login for missing user data
					if (src === 1) {
						errorStore.addError("ユーザーデータが見つかりません。再ログインしてください。", "error");
					}
				} else {
					console.error("[ERROR] [UserControl] Authentication check failed:", errorStatus || error.message);
					errorStore.addError("認証チェックに失敗しました", "error");
				}
			} finally {
				// Context7 fix: Always mark as initialized to prevent infinite loops
				this.isInitialized = true;
				this.isInitializing = false;
			}
		},
		async getConsole() {
			// Context7 best practice: Check if user is logged in first
			if (!this.isLogin) {
				console.log("[WARN] [UserControl] Console access check failed - user not logged in");
				this.checkConsole = false;
				return false;
			}

			try {
				let res = await axiosInstance.get("/auth/console");
				if (res.status === 200) {
					this.checkConsole = true;
					console.log("[SUCCESS] [UserControl] Console access granted");
					return true;
				} else {
					this.checkConsole = false;
					console.log("[INFO] [UserControl] Console access denied by server");
					return false;
				}
			} catch (error) {
				this.checkConsole = false;
				console.error("[ERROR] [UserControl] Console access check failed:", error);
				const errorStore = useErrorStore();
				errorStore.addError("コンソールアクセス権限の取得に失敗しました", "error");
				return false;
			}
		},
		async logout() {
			try {
				await axiosInstance.post("/auth/logout");
				this.resetUserState();
				// Context7 fix: Keep isInitialized true to prevent unnecessary re-initialization
				// User should be able to login again without full re-initialization
				console.log("[SUCCESS] [UserControl] User logged out successfully");
			} catch (error) {
				const errorStore = useErrorStore();
				errorStore.addError("ログアウトに失敗しました", "error");
				console.error("[ERROR] [UserControl] Failed to logout:", error);
				// Context7 best practice: Reset user state even if logout request fails
				this.resetUserState();
			}
		},
		
		// Context7 best practice: Add explicit re-login method
		async reLogin(returnUrl?: string) {
			this.resetUserState();
			this.isInitialized = false; // Force re-initialization for re-login
			await this.getUser(1, returnUrl);
		},
		
		// Context7 best practice: Add method to check authentication status
		async refreshAuthStatus() {
			if (!this.isInitialized) {
				await this.getUser(0);
			}
			return this.isLogin;
		},
	},
	// persist: true,
});
