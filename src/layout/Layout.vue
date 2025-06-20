<template>
  <el-container class="layout">
    <!-- 引入 AppMenu -->
    <el-header class="header">
      <AppMenu />
    </el-header>

    <!-- MAIN + TRANSITION -->
    <el-main class="main">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import AppMenu from './AppMenu.vue';
// 其他邏輯不變
</script>

<style scoped lang="scss">
/* 原有樣式保留 */
</style>
