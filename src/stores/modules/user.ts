import { defineStore } from "pinia";
import { ref } from "vue";
import { doLogin } from "@/api/user";
import { useRouter } from "vue-router";

export const useUserStore = defineStore("user", () => {
  const router = useRouter();

  // 使用者信息
  const userInfo = ref({
    empId: "",
  });

  // 登入方法
  async function login(empId: string, password: string) {
    try {
      const response = await doLogin({ empId, password });
      console.log("登入回應:", response);
      if (response.data.code === 200) {
          userInfo.value.empId = response.data.empId;
      } else {
        router.push({
            name: "error",
            params: { code: response.data.code, message: response.data.message },
        });
      }
    } catch (error) {
        router.push({
            name: "error",
            params: { code: 500, message: "登入失敗，請稍後再試" },
        });
    }
  }

  return {
    userInfo,
    login,
  };
});
