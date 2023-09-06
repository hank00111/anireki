import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import History from "../pages/History.vue";
import Console from "../pages/Console.vue";
import NotFound from "../pages/NotFound.vue";
import { useUserControl } from "../stores/userControl";
import { useAnimeWorks } from "../stores/animeWorks";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: { title: "首頁 - Anireki" },
  },
  {
    path: "/history",
    name: "history",
    component: History,
    meta: { title: "觀看紀錄 - Anireki" },
  },
  {
    path: "/console",
    name: "console",
    component: Console,
    meta: { title: "觀看紀錄 - Anireki", requiresAuth: true },
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
  const animeWorks = useAnimeWorks();
  if (to.name === "home") {
    await animeWorks.getCurrentSeason();
  }
  if (to.name === "console") {
    const userControll = useUserControl();
    const isAd = await userControll.getConsole();
    if (!isAd && to.meta.requiresAuth) {
      console.log("error");
      return { name: "home" };
    }
  }
});
export default router;
