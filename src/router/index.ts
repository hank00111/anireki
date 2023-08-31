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
    path: "/:pathMatch(.*)*",
    name: "404  ",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
