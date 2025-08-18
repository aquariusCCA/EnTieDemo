import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { ElMessage, ElLoading} from "element-plus";
import { getCsrfToken } from "@/utils/auth";
import { useUserStore } from "@/stores/modules/user";
import router from '@/router'

// 是否显示重新登录
export let isRelogin = { show: false };

export enum ApiMode {
  TEST = "test",
  PROD = "",
}

/** 是否為開發／測試模式 */
const isTestMode = import.meta.env.DEV;

const request = axios.create({
  baseURL: import.meta.env.VITE_SERVER,
  timeout: 150000,
  withCredentials: true, //携带cookie
});

/** 統一注入測試參數 */
function injectTestParams(config: AxiosRequestConfig) {
  if (!isTestMode) return;

  const marker = { mode: ApiMode.TEST };
  const method = (config.method ?? "get").toLowerCase();

  // POST / PUT / PATCH / DELETE：把 mode 放到 body
  if (["post", "put", "patch", "delete"].includes(method)) {
    config.data = {
      ...((config.data as object) || {}),
      ...marker,
    };
  }
  // 其餘方法：放到 query params
  else {
    config.params = {
      ...((config.params as object) || {}),
      ...marker,
    };
  }
}

//添加请求拦截器
request.interceptors.request.use((config) => {
  injectTestParams(config);
  // 注入 CSRF Token
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    config.headers["X-CSRF-Token"] = csrfToken;
  }
  return config;
});

// 添加相应拦截器
request.interceptors.response.use(
  async (res) => {
    console.log("请求成功", res);

    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;

    // 获取错误信息
    const message = res.data.message || "未知錯誤";

    // 二进制数据则直接返回
    if (res.config.responseType === "blob") {
      const contentType = res.headers["content-type"] || "";
      // 若 Content-Type 看起來不是 excel，而是 json 或 html → 當作錯誤處理
      if (
        contentType.includes("application/json") ||
        contentType.includes("text/html")
      ) {
        // 將 Blob 轉成文字，再 parse JSON 拋出 BizError
        const text = await new Response(res.data).text();
        let obj: any;
        try {
          obj = JSON.parse(text);
          console.error("下載報表失敗:", obj);
        } catch {
          // parse 失敗也要當 session 過期或未知錯誤
          return Promise.reject("未知錯誤，請重新登入");
        }
        return Promise.reject(obj.message || "Session 已過期");
      }
      return res;
    }

    if (code === 440) {
      useUserStore().clearUserInfo();
      ElMessage.error({
        message: "無效的會話，或者會話已過期，請重新登錄。",
        duration: 5 * 1000,
      });
      router.push({ name: "Login" });
      return Promise.reject("無效的會話，或者會話已過期，請重新登錄。");
    } else if (code !== 200) {
      ElMessage.error({
        message: message,
        duration: 5 * 1000,
      });
      return Promise.reject(message);
    } else {
      return Promise.resolve(res.data);
    }
  },
  (error) => {
    console.error("請求失敗", error);
    let message = error.message || "未知錯誤";

    if (message === "Network Error") message = "後端介面連線異常";
    else if (message.includes("timeout")) message = "系統介面請求逾時";
    else if (message.includes("Request failed with status code"))
      message = `系統介面 ${message.slice(-3)} 異常`;

    ElMessage.error({ message, duration: 5 * 1000 });
    return Promise.reject(error);
  }
);

export default request;