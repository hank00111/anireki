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

type RouteAuthMessageKey = keyof typeof ROUTE_AUTH_MESSAGES;

let consoleAccessCache: boolean | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30秒

router.onError(() => {
	const errorStore = useErrorStore();
	errorStore.addError("ページの読み込み中にエラーが発生しました", "error");
});

router.beforeEach(async (to) => {
	try {
		if (to.path.includes("/auth/") || to.query.code) {
			return true;
		}

		const requiresLogin = to.matched.some((record) => record.meta.requiresLogin);
		const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
		
		if (!requiresLogin && !requiresAuth) {
			return true;
		}

		const userControll = useUserControl();
		const loginModalStore = useLoginModalStore();

		if (userControll.isInitializing) {
			try {
				await userControll.getUser(0); 
			} catch (error) {
				//
			}
		}

		if (!userControll.isInitialized) {
			await userControll.getUser(0);
		}

		if (!userControll.isLogin) {
			const routeKey = to.name as string;
			const routeInfo = requiresAuth 
				? ROUTE_AUTH_MESSAGES.admin
				: (routeKey in ROUTE_AUTH_MESSAGES 
					? ROUTE_AUTH_MESSAGES[routeKey as RouteAuthMessageKey] 
					: ROUTE_AUTH_MESSAGES.default);
				
			loginModalStore.showModal(routeInfo.title, routeInfo.message, to);
			return { name: "home" }; 
		}

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
				return { name: "home" };
			}
		}

		return true; // 允許導航
	} catch (error) {
		const errorStore = useErrorStore();
		errorStore.addError("ページの読み込み中にエラーが発生しました", "error");
		return { name: "home" };
	}
});

router.afterEach((to) => {
	if (to.meta.seoKey) {
		updateSEO(to.meta.seoKey as string);
	}
});

export default router;
