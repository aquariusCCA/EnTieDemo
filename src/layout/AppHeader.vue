<template>
  <div class="app-header">
    <!-- 摺疊按鈕 -->
    <template v-if="isCollapse">
      <el-icon @click="toggleCollapse">
        <Expand />
      </el-icon>
    </template>
    <template v-else>
      <el-icon @click="toggleCollapse">
        <Fold />
      </el-icon>
    </template>

    <el-breadcrumb class="breadcrumb" :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
      <el-breadcrumb-item>promotion management</el-breadcrumb-item>
      <el-breadcrumb-item>promotion list</el-breadcrumb-item>
      <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="toolbar">
      <el-dropdown>
        <el-icon style="margin-right: 8px; margin-top: 1px">
          <setting />
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>View</el-dropdown-item>
            <el-dropdown-item>Add</el-dropdown-item>
            <el-dropdown-item>Delete</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span>Tom</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/modules/app'
import { storeToRefs } from 'pinia'

const appStore = useAppStore()
const { isCollapse } = storeToRefs(appStore)
const { toggleCollapse } = appStore
</script>

<style scoped lang="scss">
.app-header {
  display: flex;
  align-items: center;
  /* 垂直置中 */
  gap: 20px;
  padding: 20px;
}

.toolbar {
  margin-left: auto;
  /* 將 toolbar 往右推到底 */
  display: flex;
  align-items: center;
  /* 如果裡面有 icon/text，也可以垂直置中 */
  gap: 8px;
  /* 項目間距 */
}

.breadcrumb {
  @media (max-width: 768px) {
    display: none;
  }
}
</style>
