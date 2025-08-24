import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/frontend/Home.vue";
import History from "@/pages/frontend/user/History.vue";
import Console from "@/pages/backend/Console.vue";
import NotFound from "@/pages/NotFound.vue";
import AddWorks from "@/pages/backend/anime/AddWorks.vue";
import Works from "@/pages/backend/anime/Works.vue";
import WorksList from "@/pages/backend/anime/WorksList.vue";
// import WatchLater from "@/pages/frontend/user/WatchLater.vue";
import { useUserControl } from "@/stores/userControl";
import { useLoginModalStore } from "@/stores/loginModalStore";
import { useErrorStore } from "@/stores/errorStore";
import { updateSEO } from "@/utils/seo";

const routes = [
	{
		path: "/",
		name: "home",
		component: Home,
		meta: {
			title: "首頁 - Anireki",
			titleEn: "Home - Anireki | Anime Tracker",
			titleJa: "ホーム - Anireki | アニメトラッカー",
			keepAlive: true,
			seoKey: "home",
		},
	},
	{
		path: "/history",
		name: "history",
		component: History,
		meta: {
			title: "觀看紀錄 - Anireki",
			titleEn: "Watch History - Anireki",
			titleJa: "視聴履歴 - Anireki",
			seoKey: "history",
			requiresLogin: true,
		},
	},
	// {
	// 	path: "/watchlater",
	// 	name: "watchlater",
	// 	component: WatchLater,
	// 	meta: {
	// 		title: "待看清單 - Anireki",
	// 		titleEn: "Watch Later - Anireki",
	// 		titleJa: "後で見る - Anireki",
	// 		seoKey: "watchlater",
	// 		requiresLogin: true,
	// 	},
	// },
	{
		path: "/console",
		name: "console",
		component: Console,
		meta: {
			title: "Console - Anireki",
			titleEn: "Console - Anireki",
			titleJa: "コンソール - Anireki",
			requiresAuth: true,
		},
	},
	{
		path: "/console/addworks",
		name: "addworks",
		component: AddWorks,
		meta: {
			title: "AddWorks - Anireki",
			titleEn: "Add Works - Anireki",
			titleJa: "作品追加 - Anireki",
			requiresAuth: true,
		},
	},
	{
		path: "/console/works/:id",
		name: "works",
		component: Works,
		meta: {
			title: "Works - Anireki",
			titleEn: "Works - Anireki",
			titleJa: "作品 - Anireki",
			requiresAuth: true,
		},
	},
	{
		path: "/console/works",
		name: "workslist",
		component: WorksList,
		meta: {
			title: "Works - Anireki",
			titleEn: "Works List - Anireki",
			titleJa: "作品リスト - Anireki",
			requiresAuth: true,
		},
	},
	{
		path: "/:pathMatch(.*)*",
		name: "404",
		component: NotFound,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

// 預定義常量和緩存（避免重複創建對象）
const ROUTE_AUTH_MESSAGES = {
	admin: {
		title: "管理者ログインが必要",
		message: "管理者コンソールにアクセスするにはログインが必要です",
	},
	history: {
		title: "視聴履歴",
		message: "視聴履歴を確認するにはログインが必要です",
	},
	watchlater: {
		title: "後で見る",
		message: "視聴予定リストを確認するにはログインが必要です",
	},
	default: {
		title: "ログインが必要",
		message: "このページを表示するにはログインが必要です",
	}
} as const;

// 類型定義
type RouteAuthMessageKey = keyof typeof ROUTE_AUTH_MESSAGES;

// 簡單的緩存機制
let consoleAccessCache: boolean | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30秒

router.onError(() => {
	const errorStore = useErrorStore();
	errorStore.addError("ページの読み込み中にエラーが発生しました", "error");
});

// 使用現代 Vue Router 4 語法（移除廢棄的 next）
router.beforeEach(async (to) => {
	try {
		// 🚀 最早返回：OAuth 回調快速通道
		if (to.path.includes("/auth/") || to.query.code) {
			return true;
		}

		// 🚀 提前檢查：路由權限需求
		const requiresLogin = to.matched.some((record) => record.meta.requiresLogin);
		const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
		
		// 🚀 最早返回：不需要認證的路由
		if (!requiresLogin && !requiresAuth) {
			return true;
		}

		// 延遲初始化 Store（只在需要時）
		const userControll = useUserControl();
		const loginModalStore = useLoginModalStore();

		// 🚀 條件式用戶初始化
		if (!userControll.isInitialized && !userControll.isInitializing) {
			await userControll.getUser(0);
		}

		// 🚀 檢查登入狀態
		if (!userControll.isLogin) {
			const routeKey = to.name as string;
			const routeInfo = requiresAuth 
				? ROUTE_AUTH_MESSAGES.admin
				: (routeKey in ROUTE_AUTH_MESSAGES 
					? ROUTE_AUTH_MESSAGES[routeKey as RouteAuthMessageKey] 
					: ROUTE_AUTH_MESSAGES.default);
				
			loginModalStore.showModal(routeInfo.title, routeInfo.message, to);
			return { name: "home" }; // 使用現代語法返回重定向
		}

		// 🚀 緩存的管理員權限檢查
		if (requiresAuth) {
			const now = Date.now();
			
			let hasConsoleAccess: boolean;
			if (consoleAccessCache !== null && (now - cacheTimestamp) < CACHE_DURATION) {
				hasConsoleAccess = consoleAccessCache;
			} else {
				hasConsoleAccess = await userControll.getConsole();
				consoleAccessCache = hasConsoleAccess;
				cacheTimestamp = now;
			}

			if (!hasConsoleAccess) {
				const errorStore = useErrorStore();
				errorStore.addError("管理者権限が必要です", "warning");
				return { name: "home" }; // 使用現代語法返回重定向
			}
		}

		return true; // 允許導航
	} catch (error) {
		const errorStore = useErrorStore();
		errorStore.addError("ページの読み込み中にエラーが発生しました", "error");
		return { name: "home" }; // 發生錯誤時重定向到首頁
	}
});

router.afterEach((to) => {
	if (to.meta.seoKey) {
		updateSEO(to.meta.seoKey as string);
	}
});

export default router;
