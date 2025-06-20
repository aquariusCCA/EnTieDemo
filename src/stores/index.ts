import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 引入持久化插件
const pinia = createPinia();
// 使用持久化插件
// piniaPluginPersistedstate 是一个插件，用于将 Pinia 的状态持久化到本地存储中
// 这样即使页面刷新，状态也能保持
pinia.use(piniaPluginPersistedstate)

// 对外暴露：入口文件需要安装仓库
export default pinia;