import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { doLogin, doLogout } from "@/api/user";
import router from "@/router"; // ← 直接匯入 router 實例
import { ElMessage } from "element-plus";
import { BizError } from "@/utils/request";

const initUserInfo = {
  account: "",
  upn: "",
  displayName: "",
  email: "",
  roles: [] as string[],
  department: "",
  office: "",
};

export const useUserStore = defineStore(
  "user",
  () => {
    // 使用者信息
    const userInfo = ref({ ...initUserInfo });

    // 是否已登入
    const isLoggedIn = ref(false);

    // 登入方法
    async function login(empId: string, password: string) {
      try {
        const response = await doLogin({ empId, password });
        console.log("登入回應:", response);
        // 登入成功，儲存使用者資訊
        userInfo.value = {
          account: response.data.data.account,
          upn: response.data.data.upn,
          displayName: response.data.data.displayName,
          email: response.data.data.email,
          roles: response.data.data.roles,
          department: response.data.data.department,
          office: response.data.data.office,
        };

        // 設置已登入狀態
        isLoggedIn.value = true;

        // 顯示成功訊息
        ElMessage({
          type: "success",
          message: "歡迎回來，" + userInfo.value.displayName + "！",
        });

        // 導向到首頁
        router.push({ name: "home" });
      } catch (error) {
        if (error instanceof BizError) {
          console.error("登入失敗:", error.message);
          console.error("登入失敗:", error.code);
          ElMessage({
            type: "error",
            message: error.message,
          });
        }
      }
    }

    // 登出
    async function logout() {
      try {
        // 呼叫登出 API
        const resp = await doLogout();
        console.log("登出回應:", resp);

        // 清除使用者資訊
        userInfo.value = { ...initUserInfo };
        // 設置未登入狀態
        isLoggedIn.value = false;
        ElMessage({
          type: "success",
          message: resp.data.message,
        });
        // 導向到登入頁面
        router.push({ name: "login" });
      } catch (error) {
        if (error instanceof BizError) {
          console.error("登出失敗:", error.message);
          console.error("登出失敗:", error.code);
          ElMessage({
            type: "error",
            message: error.message,
          });
        }
      }
    }

    // 提取區域中心代碼
    // function extractAreaCd(): string {
    //   const roles = userInfo.value.roles;
    //   if (!roles || roles.length === 0) return "";

    //   const match = roles[0].match(/OU=([^\s,]+)/g);
    //   if (!match || match.length === 0) return "";

    //   const ouValue = match[0].split("=")[1];
    //   return ouValue.slice(0, 3);
    // }
    const areaCd = computed(() => {
      const roles = userInfo.value.roles;
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

    return {
      userInfo,
      isLoggedIn,
      areaCd,
      login,
      logout,
    };
  },
  {
    // 啟用持久化
    persist: {
      storage: sessionStorage, // 使用 sessionStorage 來持久化
    },
  }
);
