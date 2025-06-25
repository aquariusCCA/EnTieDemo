<template>
  <ul class="menu w-full">
    <template v-for="(item, idx) in menuItems" :key="idx">
      <!-- 有子路由 → 用 details/summary 包裹 -->
      <template v-if="item.children && item.children.length">
        <li>
          <details open >
            <summary>{{ item.meta?.title || item.name }}</summary>
            
            <ul>
              <li v-for="(e, idx) in item.children">
                <a href="#" @click.prevent="clickMenu(e)">{{ e.meta?.title || e.name }}</a>
              </li>
            </ul>
          </details>
        </li>
      </template>
      <!-- 無子路由 → 普通連結 -->
      <template v-else>
        <li>
          <a 
            href="#"
            @click.prevent="clickMenu(item)"  
          >{{ item.meta?.title || item.name }}</a>
        </li>
      </template>
    </template>
  </ul>
</template>

<script lang="ts" setup>
import type { RouteRecordRaw } from 'vue-router';
import { useRoute, useRouter } from "vue-router";

defineProps(['menuItems'])

const route = useRoute();
const router = useRouter();

function clickMenu(item: RouteRecordRaw) {
  console.log("Menu clicked", item);
  // 添加點擊菜單的邏輯
  router.push({ name: item.name as string, params: route.params });
}
</script>
