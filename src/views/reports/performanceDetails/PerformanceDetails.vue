<script setup lang="ts">
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import DefaultTab from './DefaultTab.vue'
import GrmTab from './GrmTab.vue'

const activeName = ref('default')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<template>
  <div class="query">
    <h2 class="query__title">查詢績效明細</h2>
    <div class="query__hint">
      <span class="query__required">＊</span>為必填欄位，請務必填寫完整。
    </div>

    <el-tabs
      v-model="activeName"
      type="border-card"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane label="績效查詢" name="default">
        <DefaultTab />
      </el-tab-pane>
      <el-tab-pane label="集團績效查詢" name="grm">
        <GrmTab />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<style scoped lang="scss">
.query {
  padding: 2rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  font-family: "Helvetica Neue", "Segoe UI", sans-serif;
  color: #333;

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #222;
  }

  &__hint {
    font-size: 0.95rem;
    color: #666;
    margin-bottom: 1.5rem;
  }

    &__required {
    color: #e53935;
    font-weight: bold;
  }
}
</style>