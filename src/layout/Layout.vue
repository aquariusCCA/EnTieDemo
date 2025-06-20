<template>
  <el-container class="layout-container">
    <el-aside :width="asideWidth">
      <AppMenu />
    </el-aside>
    <el-container>
      <el-header>
        <AppHeader />
      </el-header>
      <el-main class="app-main">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
import AppMenu from './AppMenu.vue';
import AppHeader from './AppHeader.vue';
import { useAppStore } from '@/stores/modules/app';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const appStore = useAppStore();
const { isCollapse } = storeToRefs(appStore);

// 使用 computed 計算出 aside 的寬度
const asideWidth = computed(() => (isCollapse.value ? '64px' : '300px'));

</script>

<style scoped lang="scss">
.layout-container {
  display: flex;
  /* 確保 flex 佈局 */
  height: 100vh;

  /* 讓側邊欄的寬度變化可過渡 */
  .el-aside {
    transition: width 0.3s ease;
    /* 若 Element Plus 本身有強制 inline style，需加上 !important */
    /* transition: width 0.3s ease !important; */
  }

  /* 讓 header、main 隨容器寬度變化時也能順滑 */
  .el-container>.el-container {
    /* 這層包住 header + main 的容器 */
    transition: width 0.3s ease;
  }

  .el-header,
  .app-main {
    transition: padding 0.3s ease, margin 0.3s ease;
    /* 若你 header/main 有其他因 collapse 而變化的屬性，也一併加上過渡 */
  }

  .app-main {
    flex-grow: 1;
  }
}
</style>