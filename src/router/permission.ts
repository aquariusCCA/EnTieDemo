import router from "@/router";
// @ts-ignore
import NProgress from "nprogress";
import { useUserStore } from "@/stores/modules/user";
import { getIsLoggedIn } from "@/utils/auth";

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const userStore = useUserStore();
  console.log("路由守衛觸發，當前路由:", router.getRoutes());
  console.log("userStore:", userStore.userInfo);
  console.log("getIsLoggedIn():", getIsLoggedIn());
  if (getIsLoggedIn()) {
    if (to.path === "/login") {
      next("/");
    } else {
      if (userStore.userInfo.loginUser.account === "") {
        // 用户信息不存在, 获取一次用户信息, 再放行
        try {
          await userStore.fetchUserInfo();
          //刷新的时候, 有可能获取到用户信息后, 异步路由还没有加载完毕, 出现页面空白的效果, 加上 {...to}
          next({ ...to, replace: true });
        } catch (e) {
          // 当获取不到用户信息, 清空token及用户信息, 回到登录页
          userStore.logout();
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
