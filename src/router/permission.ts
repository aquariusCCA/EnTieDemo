import router from "@/router";
// 若專案已安裝型別，這行可移除 @ts-ignore
// @ts-ignore
import NProgress from "nprogress";
import { useUserStore } from "@/stores/modules/user";
import { getCsrfToken } from "@/utils/auth";
import { ElNotification } from "element-plus";
import { isRelogin } from '@/utils/request'

router.beforeEach(async (to, from) => {
  NProgress.start();

  const userStore = useUserStore();
  const csrf = getCsrfToken();

  // 未帶 CSRF（視為未登入）
  if (!csrf) {
    if (to.path === "/login") return true;               // 放行登入頁
    return { path: "/login", replace: true };            // 其他一律導到登入
  }

  // 已帶 CSRF → 視為已登入
  if (to.path === "/login") {
    return "/";                                          // 已登入不進登入頁
  }

  // 使用者資訊尚未初始化 → 先抓取資訊
  const account = userStore.userInfo?.loginUser?.account ?? "";
  if (!account) {
    try {
      const res = await userStore.fetchUserInfo();
      // 可能需要等待動態路由註冊完成，故使用 replace 重新解析目標
      return { ...to, replace: true };
    } catch (e) {
      userStore.logout().then(() => {
        ElNotification.error({
          title: "獲取使用者信息失敗",
          message: String(e),
        });
        return { path: "/login", replace: true };
      }).catch(() => {
        ElNotification.error({
          title: "獲取使用者信息失敗",
          message: String(e),
        });

        return false // 阻止路由變更
      });
    }
  }

  // 其餘情況放行
  return true;
});

router.afterEach(() => {
  NProgress.done();
});
