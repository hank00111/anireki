import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import History from "../pages/History.vue";
import Console from "../pages/Console.vue";
import NotFound from "../pages/NotFound.vue";
import AddWorks from "../pages/AddWorks.vue";
import Works from "../pages/Works.vue";
import WorksList from "../pages/WorksList.vue"; 
import WatchLater from "../pages/WatchLater.vue";
import { useUserControl } from "../stores/userControl";
import { updateSEO } from "../utils/seo";

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
      seoKey: "home"
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
      seoKey: "history"
    },
  },
  {
    path: "/watchlater",
    name: "watchlater",
    component: WatchLater,
    meta: { 
      title: "待看清單 - Anireki",
      titleEn: "Watch Later - Anireki", 
      titleJa: "後で見る - Anireki",
      seoKey: "watchlater"
    },
  },
  {
    path: "/console",
    name: "console",
    component: Console,
    meta: { 
      title: "Console - Anireki", 
      titleEn: "Console - Anireki",
      titleJa: "コンソール - Anireki",
      requiresAuth: true 
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
      requiresAuth: true 
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
      requiresAuth: true 
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
      requiresAuth: true 
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
  if (to.name === "console" || to.name === "addworks" || to.name === "works" || to.name === "workslist") {
    const userControll = useUserControl();
    const isAd = await userControll.getConsole();
    if (!isAd && to.meta.requiresAuth) {
      console.log("error");
      return { name: "home" };
    }
  }
});

// After each route navigation, update SEO
router.afterEach((to) => {
  // Update SEO data if available
  if (to.meta.seoKey) {
    updateSEO(to.meta.seoKey as string);
  }
});

export default router;
