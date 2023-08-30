import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";

const routes = [
  {
    path: "/",
    component: Home,
    meta: { title: "首頁 - Anireki" },
  },
  //   {
  //     path: "/history",
  //     component: History,
  //     meta: { title: "觀看紀錄 - Anireki" },
  //   },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
