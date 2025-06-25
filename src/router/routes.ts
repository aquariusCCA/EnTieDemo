import type { RouteLocationNormalized } from "vue-router";

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
    component: () => import("@/layout/DashboardLayout.vue"), // 懒加载DashboardLayout组件
    redirect: "/home", // 重定向到/home
    meta: { breadcrumb: "主控台" },
    children: [
      {
        name: "home",
        path: "home",
        component: () => import("@/views/home/Home.vue"), // 懒加载Home组件
        meta: { breadcrumb: "首頁" },
      },
    ],
  },
  {
    name: "error",
    path: "/error/:code/:message", // 捕获错误ID和消息
    component: () => import("@/views/error/Error.vue"), // 懒加载Error组件
  },
  // ★ 放在最後，避免攔截到其他有效路由
  {
    path: "/:pathMatch(.*)*",
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
  //   meta: { breadcrumb: "報表" },
  //   children: [
  //     {
  //       name: "performance-details", // 路由名稱：小寫 + 連字符
  //       path: "performance-details",
  //       meta: { breadcrumb: "績效查詢" },
  //       component: () =>
  //         import("@/views/reports/performanceDetails/PerformanceDetails.vue"), // 懶加载PerformanceDetails组件
  //     },
  //   ],
  // },
  // {
  //   name: "test1",
  //   path: "/test1",
  //   component: () => import("@/layout/Layout.vue"), // 懒加载Test组件
  //   redirect: "/test1/child", // 重定向到/test1/child
  //   meta: { breadcrumb: "測試1" },
  //   children: [
  //     {
  //       name: "child",
  //       path: "child",
  //       meta: { breadcrumb: "測試1-子路由" },
  //       component: () => import("@/views/Test1Child.vue"), // 懒加载Test1Child组件
  //     },
  //   ],
  // },
];
