import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { ElMessage } from "element-plus";
import router from "@/router"; // ← 直接匯入 router 實例

export enum ApiMode {
  TEST = "test",
  PROD = "",
}

// 定義 BizError
export class BizError extends Error {
  public code: number;
  constructor(code: number, message?: string) {
    super(message);
    this.name = "BizError";
    this.code = code;
    // TS 必要：恢復正確的原型鏈
    Object.setPrototypeOf(this, BizError.prototype);
  }
}

/** 是否為開發／測試模式 */
const isTestMode = import.meta.env.DEV;

const request = axios.create({
  baseURL: import.meta.env.VITE_SERVER,
  timeout: 8000,
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
  return config;
});

// 添加相应拦截器
request.interceptors.response.use(
  async (res) => {
    console.log("请求成功", res);

    // 只有在下載 Blob 時才做下面檢查
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
        } catch {
          // parse 失敗也要當 session 過期或未知錯誤
          return Promise.reject(new BizError(500, "未知錯誤，請重新登入"));
        }
        return Promise.reject(
          new BizError(obj.code || 500, obj.message || "Session 已過期")
        );
      }
      return res;
    }

    // —— 原有：JSON 業務邏輯檢查
    const { code, message } = res.data;

    if (code === 200) {
      return res;
    } else {
      // 统一将业务错误通过 reject 抛出，方便调用方 catch
      return Promise.reject(
        new BizError(code, message || `Error code: ${code}`)
      );
    }
  },
  (err) => {
    console.error("请求失败", err);
    const  message = err.message || "未知錯誤，請稍後重試";
    ElMessage({
      type: "error",
      message,
    });
    return Promise.reject(err);
  }
);

export default request;
