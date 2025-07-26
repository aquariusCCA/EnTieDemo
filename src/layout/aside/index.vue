<template>
  <Logo />
  <el-scrollbar>
    <el-menu
      background-color="#1E293B"
      text-color="#CBD5E1"
      :default-active="route.path"
      :collapse="settingStore.fold"
      :router="true"
    >

      <Menu :menu-list="routes" />
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts" setup name="Aside">
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import { useUserStore } from '@/stores/user'
import { useSettingStore } from '@/stores/setting'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { routes } = storeToRefs(userStore)
const settingStore = useSettingStore()
const route = useRoute()
</script>

<style scoped lang="scss">
.el-scrollbar {
  height: calc(100vh - $logo-height);

  .el-menu {
    border-right: none;
  }
}
</style>
