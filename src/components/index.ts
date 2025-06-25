import type { App } from 'vue'
import Breadcrumb from './Breadcrumb.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export function registerComponents(app: App): void {
  // 遍歷並全局註冊每個 icon 組件
  Object.entries(ElementPlusIconsVue).forEach(([componentName, component]) => {
    app.component(componentName, component)
  })

  // 全局註冊 Breadcrumb 組件
  app.component('Breadcrumb', Breadcrumb)
}
