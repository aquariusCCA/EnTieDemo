// 第一步：引入createRouter
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";

// 第二步：创建路由器
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL), // 路由器的工作模式
  routes, // 路由规则
});

// 暴露出去router
export default router;
