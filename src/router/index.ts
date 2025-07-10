// 第一步：引入createRouter
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

// 第二步：创建路由器
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL), // 路由器的工作模式
  routes, // 路由规则
});

// 第三步：路由守衛
// const userStore = useUserStore(pinia)

router.beforeEach(async (to, _from, next) => {
  const userStore = useUserStore()
  // 免驗證的頁面列表
  const accessableRoutes = ['login', 'error']
  if (accessableRoutes.includes(to.name as string)) {
    next();
    return;
  }

  // 獲取使用者登入狀態
  const { isLoggedIn } = storeToRefs(userStore)
  console.log('isLoggedIn', isLoggedIn.value)
  // 如果使用者未登入，則重定向到登入頁面
  if (!isLoggedIn.value) {
    next({ name: "login" });
    return;
  }

  // 如果使用者已登入，則繼續導航到目標頁面
  next();
});

// 暴露出去router
export default router;
