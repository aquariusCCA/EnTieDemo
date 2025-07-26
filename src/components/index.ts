import type { App, Component } from "vue";
import SvgIcon from "@/components/SvgIcon/index.vue";
import Title from '@/components/Title/index.vue'
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// 自定义图标
const globalComponents: { [name: string]: Component } = {
  SvgIcon,
  Title
};

export function registerComponents(app: App): void {
  // 遍歷並全局註冊每個 icon 組件
  Object.entries(ElementPlusIconsVue).forEach(([componentName, component]) => {
    app.component(componentName, component);
  });

  Object.keys(globalComponents).forEach((key: string) => {
    app.component(key, globalComponents[key]);
  });
}
