import axios from "axios";
import { ElMessage } from "element-plus";

const API_MODE = {
  TEST: "test",
  PROD: "",
};

// 決定目前模式
const CURRENT_MODE = import.meta.env.DEV ? API_MODE.TEST : API_MODE.PROD;

const request = axios.create({
  baseURL: import.meta.env.VITE_SERVER,
  timeout: 8000,
  withCredentials: true, //携带cookie
});

//添加请求拦截器
request.interceptors.request.use((config) => {
  if (CURRENT_MODE === API_MODE.TEST) {
    // POST 時，把 mode/fakeData 放到 body
    if (config.method === "post" && config.data) {
      config.data = {
        ...(config.data as object),
        mode: API_MODE.TEST,
      };
    }
    // GET 時，把 mode 放到 query
    if (config.method === "get") {
      config.params = {
        ...(config.params as object),
        mode: API_MODE.TEST,
      };
    }
  }

  return config;
});

// 添加相应拦截器
request.interceptors.response.use(
  (res) => {
    // 成功回调
    console.log("请求成功", res);
    return res;
  },
  (err) => {
    // 失败回调
    let message = "";
    let status = err.response.status;
    switch (status) {
      case 400:
        message = "请求错误";
        break;
      case 401:
        message = "未授权，请登录";
        break;
      case 403:
        message = "拒绝访问";
        break;
      case 404:
        message = "请求地址出错";
        break;
      case 408:
        message = "请求超时";
        break;
      case 500:
        message = "服务器内部错误";
        break;
      case 501:
        message = "服务未实现";
        break;
      default:
        message = "连接错误";
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
