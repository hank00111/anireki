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

// Context7 best practice: Add navigation error handler
router.onError((error) => {
	console.error('[ERROR] [Router] Navigation error:', error);
	
	// Context7 best practice: Import error store dynamically to avoid circular dependencies
	import('@/stores/errorStore').then(({ useErrorStore }) => {
		const errorStore = useErrorStore();
		errorStore.addError("ページの読み込み中にエラーが発生しました", "error");
	}).catch(console.error);
});

router.beforeEach(async (to, _from, next) => {
	// Context7 best practice: Call stores before any await operations
	const userControll = useUserControl();
	const loginModalStore = useLoginModalStore();

	try {
		// Context7 CRITICAL FIX: Avoid infinite loops - only initialize if not already in progress
		// and not from OAuth callback to prevent redirect loops
		const isOAuthCallback = to.path.includes('/auth/') || to.query.code;
		
		if (!userControll.isInitialized && !userControll.isInitializing && !isOAuthCallback) {
			console.log("[INFO] [Router] Initializing user state");
			await userControll.getUser(0);
		}

		// Context7 fix: Check authentication only for routes that require it
		const requiresLogin = to.matched.some(record => record.meta.requiresLogin);
		const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

		if (requiresLogin || requiresAuth) {
			// Context7 best practice: Single login check for all authenticated routes
			if (!userControll.isLogin) {
				// Context7 best practice: Dynamic title and message based on route type
				let routeInfo;
				
				if (requiresAuth) {
					// Admin routes
					routeInfo = {
						title: "管理者ログインが必要",
						message: "管理者コンソールにアクセスするにはログインが必要です"
					};
				} else {
					// User routes
					const routeNames: Record<string, { title: string; message: string }> = {
						history: {
							title: "視聴履歴",
							message: "視聴履歴を確認するにはログインが必要です"
						},
						watchlater: {
							title: "後で見る",
							message: "視聴予定リストを確認するにはログインが必要です"
						}
					};

					routeInfo = routeNames[to.name as string] || {
						title: "ログインが必要",
						message: "このページを表示するにはログインが必要です"
					};
				}

				// Context7 best practice: Save pending route before showing modal
				loginModalStore.showModal(routeInfo.title, routeInfo.message, to);
				next({ name: "home" });
				return;
			}

			// Context7 fix: Only check console access for admin routes (requiresAuth)
			if (requiresAuth) {
				const isAd = await userControll.getConsole();
				if (!isAd) {
					console.log("[WARN] [Router] Console access denied for user");
					// Context7 improvement: Better user feedback for denied access
					const errorStore = (await import('@/stores/errorStore')).useErrorStore();
					errorStore.addError("管理者権限が必要です", "warning");
					next({ name: "home" });
					return;
				}
			}
		}

		next(); // Context7 best practice: Always call next()
	} catch (error) {
		console.error('[ERROR] [Router] Navigation guard error:', error);
		// Context7 improvement: Better error recovery
		const errorStore = (await import('@/stores/errorStore')).useErrorStore();
		errorStore.addError("ページの読み込み中にエラーが発生しました", "error");
		next({ name: "home" }); // Fallback to home on error
	}
});

router.afterEach((to) => {
	if (to.meta.seoKey) {
		updateSEO(to.meta.seoKey as string);
	}
});

export default router;
