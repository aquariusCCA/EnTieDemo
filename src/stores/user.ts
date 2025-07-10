import { defineStore } from "pinia";
import { ref } from "vue";
import { doLogin } from "@/api/user";
import router from "@/router"; // ← 直接匯入 router 實例
import { ElMessage } from "element-plus";

const initUserInfo = {
  account: "",
  upn: "",
  displayName: "",
  email: "",
  roles: [],
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
        if (response.data.code === 200) {
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

          // 導向到首頁
          router.push({ name: "home" });
        } else {
          ElMessage({
            type: "error",
            message: response.data.message,
          });
        }
      } catch (error) {
        router.push({
          name: "error",
          params: { code: 500, message: "登入失敗，請稍後再試" },
        });
      }
    }

    // 登出
    function logout() {
      // 清除使用者資訊
      userInfo.value = { ...initUserInfo };
      // 設置未登入狀態
      isLoggedIn.value = false;
      // 導向到登入頁面
      router.push({ name: "login" });
    }

    return {
      userInfo,
      isLoggedIn,
      login,
      logout,
    };
  },
  {
    persist: true, // 啟用持久化
  }
);
