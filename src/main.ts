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

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ElementPlus, {
  locale: zhTw,
})

// 全局注册组件
registerComponents(app)

app.mount('#app')
