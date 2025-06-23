import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 獲取各種環境下對應的變量
  const env = loadEnv(mode, process.cwd());

  const baseApi = env.VITE_APP_BASE_API // 例如 '/prod-api'
  console.log('Base API:', baseApi);

  return {
    base: env.VITE_APP_BASE_URL, // 设置基础路径
    plugins: [vue(), vueDevTools(), tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)), // 相对路径别名配置，使用 @ 代替 src
      },
    },
    server: {
      proxy: {
        [baseApi]: {
          target: env.VITE_SERVE, //获取数据的服务器地址设置
          changeOrigin: true, //需要代理跨域
          rewrite: (path) => {
            // 重写路径，去掉 baseApi 前缀
            console.log(`Rewriting path: ${path} to ${path.replace(new RegExp(`^${baseApi}`), '')}`);
            return path.replace(new RegExp(`^${baseApi}`), '');
          }
        },
      }
    },
  };
});

