import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import History from "../pages/History.vue";
import NotFound from "../pages/NotFound.vue";

const routes = [
  {
    path: "/",
    component: Home,
    meta: { title: "首頁 - Anireki" },
  },
  {
    path: "/history",
    component: History,
    meta: { title: "觀看紀錄 - Anireki" },
  },
  {
    path: "/404",
    name: "404",
    component: NotFound,
  },
  {
    path: "/:pathMatch(.*)",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
