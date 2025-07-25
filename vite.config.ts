import { fileURLToPath, URL } from 'node:url'
import path from "path";
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
// svg插件
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 獲取各種環境下對應的變量
  const env = loadEnv(mode, process.cwd());

  return {
    base: env.VITE_APP_BASE_URL, // 设置基础路径
    plugins: [
      vue(), 
      vueDevTools(), 
      tailwindcss(),
      // 配置 SVG 图标插件
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/icons")], // 存放svg图标路径
        symbolId: "icon-[dir]-[name]",
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)), // 相对路径别名配置，使用 @ 代替 src
      },
    }
  };
});

