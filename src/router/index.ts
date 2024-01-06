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

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: { title: "首頁 - Anireki", keepAlive: true },
  },
  {
    path: "/history",
    name: "history",
    component: History,
    meta: { title: "觀看紀錄 - Anireki" },
  },
  {
    path: "/watchlater",
    name: "watchlater",
    component: WatchLater,
    meta: { title: "待看清單 - Anireki" },
  },
  {
    path: "/console",
    name: "console",
    component: Console,
    meta: { title: "Console - Anireki", requiresAuth: true },
  },
  {
    path: "/console/addworks",
    name: "addworks",
    component: AddWorks,
    meta: { title: "AddWorks - Anireki", requiresAuth: true },
  },
  {
    path: "/console/works/:id",
    name: "works",
    component: Works,
    meta: { title: "Works - Anireki", requiresAuth: true },
  },
  {
    path: "/console/works",
    name: "workslist",
    component: WorksList,
    meta: { title: "Works - Anireki", requiresAuth: true },
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
export default router;
