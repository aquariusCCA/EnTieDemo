import type { RouteLocationGeneric, RouteLocationRaw } from "vue-router";

export const constantRoutes = [
  {
    name: "Login",
    path: "/login",
    component: () => import("@/views/login/Login.vue"), // 懒加载Login组件
    meta: {
      name: "登錄",
      hidden: true,
      icon: "",
    },
  },
  {
    name: "Layout",
    path: "/",
    component: () => import("@/layout/index.vue"), // 懒加载Layout组件
    redirect: "/home", // 重定向到/home
    meta: {
      name: "",
      hidden: false,
      icon: "",
    },
    children: [
      {
        name: "Home",
        path: "/home",
        component: () => import("@/views/home/Home.vue"), // 懒加载Home组件
        meta: {
          name: "首頁",
          hidden: false,
          icon: "House", // <el-icon><House /></el-icon>
        },
      },
    ],
  },
  {
    name: "Reports",
    path: "/reports",
    component: () => import("@/layout/index.vue"), // 懒加载Layout组件
    redirect: "/reports/performanceDetails", // 重定向到/reports/performance-details
    meta: {
      name: "報表",
      hidden: false,
      icon: "Document", // <el-icon><Document /></el-icon>
    },
    children: [
      {
        name: "PerformanceDetails",
        path: "/reports/performanceDetails",
        component: () =>
          import("@/views/reports/performanceDetails/PerformanceDetails.vue"), // 懶加载PerformanceDetails组件
        meta: {
          name: "績效查詢",
          hidden: false,
          icon: "Document",
        },
      },
    ],
  },
  {
    name: "Loan",
    path: "/loan",
    component: () => import("@/layout/index.vue"), // 懒加载Layout组件
    redirect: "/loan/index", // 重定向到/loan/index
    meta: {
      name: "預估",
      hidden: false,
      icon: "Money",
    },
    children: [
      {
        name: "LoanIndex",
        path: "/loan/index",
        component: () => import("@/views/loan/index.vue"), // 懒加载LoanIndex组件
        meta: {
          name: "放款預估",
          hidden: false,
          icon: "Money",
        },
      }
    ],
  },
  {
    path: "/404",
    component: () => import("@/views/error/404.vue"), // 懒加载404组件
    name: "404",
    meta: {
      name: "404",
      hidden: true,
      icon: "",
    },
  },
];

// 異步路由
export const asyncRoutes = [];

// 任意路由
export const anyRoute = {
  path: "/:pathMatch(.*)*",
  redirect: "/404",
  name: "Any",
  meta: {
    name: "任意",
    hidden: true,
    icon: "",
  },
};
