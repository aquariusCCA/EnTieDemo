import type { RouteLocationNormalized } from "vue-router";

export const routes = [
  {
    name: "login",
    path: "/login",
    component: () => import("@/views/login/Login.vue"), // 懒加载Login组件
    meta: { showInMenu: false },           
  },
  {
    name: "layout",
    path: "/",
    component: () => import("@/layout/DashboardLayout.vue"), // 懒加载DashboardLayout组件
    redirect: "/home", // 重定向到/home
    meta: { title: "主控台", showInMenu: true },
    children: [
      {
        name: "home",
        path: "home",
        component: () => import("@/views/home/Home.vue"), // 懒加载Home组件
        meta: { title: "首頁", showInMenu: true },
      },
    ],
  },
  {
    name: "error",
    path: "/error/:code/:message", // 捕获错误ID和消息
    component: () => import("@/views/error/Error.vue"), // 懒加载Error组件
    meta: { showInMenu: false },
  },
  // ★ 放在最後，避免攔截到其他有效路由
  {
    path: "/:pathMatch(.*)*",
    meta: { showInMenu: false },
    redirect: (to: RouteLocationNormalized) => ({
      name: "error",
      params: {
        code: 404,
        message: "Page Not Found",
      },
    }),
  },
  // {
  //   name: "reports",
  //   path: "/reports",
  //   component: () => import("@/layout/Layout.vue"), // 懒加载
  //   redirect: "/reports/performance-details", // 重定向到/reports/performance-details
  //   meta: { title: "報表" },
  //   children: [
  //     {
  //       name: "performance-details", // 路由名稱：小寫 + 連字符
  //       path: "performance-details",
  //       meta: { title: "績效查詢" },
  //       component: () =>
  //         import("@/views/reports/performanceDetails/PerformanceDetails.vue"), // 懶加载PerformanceDetails组件
  //     },
  //   ],
  // },
  {
    name: "test1",
    path: "/test1",
    component: () => import("@/layout/DashboardLayout.vue"), 
    // redirect: "/test1/child", // 重定向到/test1/child
    meta: { title: "測試1", showInMenu: true },
    // children: [
    //   {
    //     name: "child",
    //     path: "child",
    //     meta: { title: "測試1-子路由" },
    //     component: () => import("@/views/Test1Child.vue"), // 懒加载Test1Child组件
    //   },
    // ],
  },
];
