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

router.beforeEach(async (to) => {
	const userControll = useUserControl();

	// if (!userControll.isInitialized) {
	// 	await userControll.getUser(0);
	// }

	if ((to.name === "history" || to.name === "watchlater") && to.meta.requiresLogin) {
		if (!userControll.isLogin) {
			const loginModalStore = useLoginModalStore();
			const title = to.name === "history" ? "視聴履歴" : "後で見る";
			const message =
				to.name === "history"
					? "視聴履歴を確認するにはログインが必要です"
					: "視聴予定リストを確認するにはログインが必要です";

			loginModalStore.showModal(title, message);
			return { name: "home" };
		}
	}

	if (to.name === "console" || to.name === "addworks" || to.name === "works" || to.name === "workslist") {
		const isAd = await userControll.getConsole();
		if (!isAd && to.meta.requiresAuth) {
			console.log("error");
			return { name: "home" };
		}
	}
});

router.afterEach((to) => {
	if (to.meta.seoKey) {
		updateSEO(to.meta.seoKey as string);
	}
});

export default router;
