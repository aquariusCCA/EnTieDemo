import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import pinia from "./stores/index.ts";

import "@/styles/index.scss";

// 引入 Element Plus 组件库
// 以及它的样式和中文语言包
import ElementPlus from "element-plus";
import { zhTw } from "element-plus/es/locales.mjs";
import "element-plus/dist/index.css";

import { registerComponents } from "./components";

import { worker } from "./mocks/browser";
import { setSeeds } from "@/mocks/seeds";

// 引入svg
import 'virtual:svg-icons-register'

// 引入permission
import '@/router/permission'

// 引入进度条nprogress样式
import 'nprogress/nprogress.css'

// 開發環境可使用API假資料
if (import.meta.env.DEV) {
  console.log("這是開發環境，將使用假資料API");
  // 注入假資料
  setSeeds();

  // 啟動 MSW 假資料服務
  await worker.start({
    onUnhandledRequest: "bypass", // 不顯示任何警告，直接放行
  });
}

const app = createApp(App); 
app.use(pinia); // 使用 Pinia 状态管理
app.use(router);
app.use(ElementPlus, {
  locale: zhTw,
});

// 全局注册组件
registerComponents(app);

app.mount("#app");
