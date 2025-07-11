import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { ElMessage } from "element-plus";
import router from "@/router"; // ← 直接匯入 router 實例

export enum ApiMode {
  TEST = 'test',
  PROD = '',
}

// 定義 BizError
export class BizError extends Error {
  public code: number;
  constructor(code: number, message?: string) {
    super(message);
    this.name = 'BizError';
    this.code = code;
    // TS 必要：恢復正確的原型鏈
    Object.setPrototypeOf(this, BizError.prototype);
  }
}

/** 是否為開發／測試模式 */
const isTestMode = import.meta.env.DEV

const request = axios.create({
  baseURL: import.meta.env.VITE_SERVER,
  timeout: 8000,
  withCredentials: true, //携带cookie
});

/** 統一注入測試參數 */
function injectTestParams(config: AxiosRequestConfig) {
  if (!isTestMode) return

  const marker = { mode: ApiMode.TEST }
  const method = (config.method ?? 'get').toLowerCase()

  // POST / PUT / PATCH / DELETE：把 mode 放到 body
  if (['post', 'put', 'patch', 'delete'].includes(method)) {
    config.data = {
      ...(config.data as object || {}),
      ...marker,
    }
  }
  // 其餘方法：放到 query params
  else {
    config.params = {
      ...(config.params as object || {}),
      ...marker,
    }
  }
}

//添加请求拦截器
request.interceptors.request.use(config => {
  injectTestParams(config)
  return config
})

// 添加相应拦截器
request.interceptors.response.use(
  (res) => {
    // 成功回调
    console.log("请求成功", res);
    const { code, message } = res.data;

    if(code === 200) { 
      return res
    } else {
      // 统一将业务错误通过 reject 抛出，方便调用方 catch
      return Promise.reject(new BizError(code, message || `Error code: ${code}`));
    }
  },
  (err) => {
    // 失败回调（HTTP 层面）
    console.error("请求失败", err);
    let message = "";
    let status = err.response.status;

    switch (status) {
      case 400:
        message = "請求錯誤";
        break;
      case 401:
        message = "未授權";
        break;
      case 403:
        message = "禁止訪問(沒有權限操作)";
        break;
      case 404:
        message = "請求地址出錯";
        break;
      case 500:
        message = "伺服器內部錯誤";
        break;
      default:
        message = "連接錯誤";
        break;
    }

    ElMessage({
      type: "error",
      message,
    });

    return Promise.reject(err);
  }
);

export default request;
