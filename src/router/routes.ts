export const routes = [
  // 一个一个的路由规则
  {
    name: "login",
    path: "/login",
    component: () => import("@/views/login/Login.vue"), // 懒加载Login组件
  },
  {
    name: "layout",
    path: "/",
    component: () => import("@/layout/Layout.vue"), // 懒加载Layout组件
    redirect: "/home", // 重定向到/home
    children: [
      {
        name: "home",
        path: "home",
        component: () => import("@/views/home/Home.vue"), // 懒加载Home组件
      },
    ],
  },
  {
    name: "reports",
    path: "/reports",
    component: () => import("@/layout/Layout.vue"), // 懒加载
    redirect: "/reports/performance-details", // 重定向到/reports/performance-details
    meta: { title: '報表' },
    children: [
      {
        name: "performance-details", // 路由名稱：小寫 + 連字符
        path: "performance-details",
        meta: { title: '績效查詢' },
        component: () =>
          import("@/views/reports/performanceDetails/PerformanceDetails.vue"), // 懶加载PerformanceDetails组件
      },
    ],
  },
  {
    name: "test1",
    path: "/test1",
    component: () => import("@/layout/Layout.vue"), // 懒加载Test组件
    redirect: "/test1/child", // 重定向到/test1/child
    meta: { title: '測試1' },
    children: [
        {
            name: "child",
            path: "child",
            meta: { title: '測試1-子路由' },
            component: () => import("@/views/Test1Child.vue"), // 懒加载Test1Child组件
        }
    ]
    },
]