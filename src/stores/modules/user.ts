import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { doLogin, doLogout, doFetchUserInfo } from "@/api/user";
import router from "@/router"; // ← 直接匯入 router 實例
import { setCsrfToken, removeCsrfToken } from "@/utils/auth";
import { cloneDeep } from "lodash";
import { constantRoutes, asyncRoutes, anyRoute } from "@/router/routes";

const initUserInfo = {
  routes: [],
  buttons: [],
  roles: [],
  name: "",
  loginUser: {
    account: "",
    upn: "",
    displayName: "",
    email: "",
    roles: [] as string[],
    department: "",
    office: "",
  },
};

export const useUserStore = defineStore("user", () => {
  // 使用者信息
  const userInfo = ref({ ...initUserInfo });

  // 路由列表
  const routes = ref([...constantRoutes]);

  // 登入方法
  async function login(empId: string, password: string) {
    return new Promise((resolve, reject) => {
      doLogin({ empId, password })
        .then((res) => {
          console.log("登入成功:", res);
          const { csrfToken } = res.data;
          setCsrfToken(csrfToken);
          resolve("ok");
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // 獲取使用者權限
  async function fetchUserInfo() {
    return new Promise((resolve, reject) => {
      doFetchUserInfo()
        .then((response) => {
          console.log("獲取使用者信息回應:", response);
          const { routes, buttons, roles, name, loginUser } = response.data;
          userInfo.value = {
            routes,
            buttons,
            roles,
            name,
            loginUser: {
              account: loginUser.account || "",
              upn: loginUser.upn || "",
              displayName: loginUser.displayName || "",
              email: loginUser.email || "",
              roles: loginUser.roles || [],
              department: loginUser.department || "",
              office: loginUser.office || "",
            },
          };
          // 1.过滤异步路由, 作为用户菜单展示
          let filterRoutes = filterAsyncRoutes(cloneDeep(asyncRoutes), routes);
          routes.value = [...constantRoutes, ...filterRoutes];
          // 2.将过滤后的异步路由, 追加到路由器中
          filterRoutes.forEach((route) => {
            router.addRoute(route);
          });
          // 3.添加任意路由
          router.addRoute(anyRoute);
          resolve("ok");
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function filterAsyncRoutes(asyncRoutes: any[], userRoutes: string[]) {
    return asyncRoutes.filter((route) => {
      if (userRoutes.includes(route.name)) {
        if (route.children && route.children.length > 0) {
          route.children = filterAsyncRoutes(route.children, userRoutes);
        }
        return true;
      }
    });
  }

  // 登出
  async function logout() {
    return new Promise((resolve, reject) => {
      doLogout()
        .then((response) => {
          console.log("登出回應:", response);
          clearUserInfo();
          resolve("ok");
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // 清除客戶端使用者資訊
  function clearUserInfo() {
    console.log("清除使用者資訊");
    // 清除使用者資訊
    userInfo.value = { ...initUserInfo };
    // 重設路由
    routes.value = [...constantRoutes];
    // 清除 csrfToken
    removeCsrfToken();
  }

  // 提取區域中心代碼x
  const areaCd = computed(() => {
    const roles = userInfo.value.loginUser.roles;
    if (!roles?.length) return "";

    // 遍歷每個 role 字串
    for (const roleStr of roles) {
      // 全域搜尋所有 OU=xxx
      const regex = /OU=([^\s,]+)/g;
      let match: RegExpExecArray | null;

      while ((match = regex.exec(roleStr)) !== null) {
        const ou = match[1]; // e.g. "924ABC" 或 "XYZ001"
        const code = ou.slice(0, 3); // 取前三碼

        // 只要前三碼完全是數字，就認為合法、直接回傳
        if (/^\d{3}$/.test(code)) {
          return code;
        }
      }
    }

    // 全部都掃過了，沒符合的就回空
    return "";
  });

  // 判斷是否為區域中心人員(不是 924 或 983)
  const isAreaCenter = computed(() => {
    const areaCode = areaCd.value;
    return areaCode && !["924", "983"].includes(areaCode);
  });

  return {
    userInfo,
    routes,
    areaCd,
    isAreaCenter,
    login,
    fetchUserInfo,
    logout,
    clearUserInfo,
  };
});
