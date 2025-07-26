import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


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
const pinia = createPinia(); // 引入持久化插件
// 使用持久化插件
// piniaPluginPersistedstate 是一个插件，用于将 Pinia 的状态持久化到本地存储中
// 这样即使页面刷新，状态也能保持
pinia.use(piniaPluginPersistedstate)
app.use(pinia); // 使用 Pinia 状态管理
app.use(router);
app.use(ElementPlus, {
  locale: zhTw,
});

// 全局注册组件
registerComponents(app);

app.mount("#app");
