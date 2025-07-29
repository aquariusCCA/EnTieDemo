import router from "@/router";
// @ts-ignore
import NProgress from "nprogress";
import { useUserStore } from "@/stores/modules/user";
import { getCsrfToken } from "@/utils/auth";
import { ElNotification } from 'element-plus'

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const userStore = useUserStore();
  console.log("路由守衛觸發，當前路由:", router.getRoutes());
  console.log("userStore:", userStore.userInfo);
  console.log("getCsrfToken():", getCsrfToken());
  if (getCsrfToken()) {
    if (to.path === "/login") {
      next("/");
    } else {
      if (userStore.userInfo.loginUser.account === "") {
        // 用戶信息不存在, 獲取一次使用者信息, 再放行
        try {
          await userStore.fetchUserInfo();
          // 刷新的時候，有可能獲取到使用者信息後，異步路由還沒有加載完畢，出現頁面空白的效果，加上 {...to}
          next({ ...to, replace: true });
        } catch (e) {
          // 當獲取不到使用者信息時, 清空 token 及使用者信息, 回到登入頁
          userStore.logout();
          ElNotification.error({
            title: '獲取使用者信息失敗',
            message: String(e),
          });
          next({ path: "/login" });
        }
      } else {
        next();
      }
    }
  } else {
    if (to.path === "/login") {
      next();
    } else {
      next("/login");
    }
  }
});

router.afterEach((to, from) => {
  NProgress.done();
});
