import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from './stores'
import '@/styles/index.scss'

// 引入 Element Plus 组件库
// 以及它的样式和中文语言包
import ElementPlus from 'element-plus'
import { zhTw } from 'element-plus/es/locales.mjs'
import 'element-plus/dist/index.css'
import './styles/element-vars.scss'

// 引入 Tailwind CSS
import './styles/tailwind.css'

import { registerComponents } from './components'

import { worker } from './mocks/browser'

// 開發環境可使用API假資料
if (import.meta.env.DEV) {
  console.log('這是開發環境，將使用假資料API');
  // 啟動 MSW 假資料服務
  worker.start({
    onUnhandledRequest: 'bypass', // 不顯示任何警告，直接放行
  })
}

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ElementPlus, {
  locale: zhTw,
})

// 全局注册组件
registerComponents(app)

app.mount('#app')
