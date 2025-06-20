// 第一步：引入createRouter
import { createRouter, createWebHistory } from 'vue-router'

// 第二步：创建路由器
const router = createRouter({
  history: createWebHistory(), // 路由器的工作模式
  routes: [ // 一个一个的路由规则
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login/Login.vue') // 懒加载Login组件
    }
  ]
})

// 暴露出去router
export default router
