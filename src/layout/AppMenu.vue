<template>
  <div>
    <el-menu :default-active="activePath" router mode="horizontal">
      <template v-for="item in menuData">
        <!-- 有子路由，渲染子菜单 -->
        <el-sub-menu v-if="item.children" :index="item.path" :key="item.path + '-submenu'">
          <template #title>
            <span>{{ item.meta?.title }}</span>
          </template>
          <el-menu-item v-for="child in item.children" :index="item.path + '/' + child.path" :key="child.path">
            {{ child.meta?.title }}
          </el-menu-item>
        </el-sub-menu>
        <!-- 无子路由，渲染普通菜单 -->
        <el-menu-item v-else :index="item.path" :key="item.path">
          <span>{{ item.meta?.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
    <el-button type="primary">登出</el-button>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 当前激活的路由路径，用于菜单高亮
const activePath = computed(() => route.fullPath);

// 从 router.options.routes 中提取出带 meta.title 的项
const menuData = computed(() => {
  return (router.options.routes as any[])
    .filter(r => r.meta && r.meta.title)
    .map(r => {
      const item = { ...r };
      if (r.children) {
        item.children = (r.children as any[])
          .filter(c => c.meta && c.meta.title);
      }
      return item;
    });
});

onMounted(() => {
  console.log('Menu component mounted', menuData.value);
});
</script>

<style scoped lang="scss">
.logout-button {
  margin-left: auto;
}
</style>