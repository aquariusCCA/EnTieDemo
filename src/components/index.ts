import type { App } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export function registerComponents(app: App): void {
  // 遍歷並全局註冊每個 icon 組件
  Object.entries(ElementPlusIconsVue).forEach(([componentName, component]) => {
    app.component(componentName, component)
  })
}
