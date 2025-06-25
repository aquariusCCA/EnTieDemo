<template>
    <nav class="breadcrumbs max-w-3xs text-sm text-gray-500">
        <ul class="">
            <li 
                v-for="(item, idx) in breadcrumbs" 
                :key="idx" 
                class="cursor-pointer"
                @click="clickBreadcrumb(item)"
            >
                {{ item.text }}
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

interface Crumb {
    text: string;
    to: { name: string; params: Record<string, any> };
}

function clickBreadcrumb(item: Crumb) {
    console.log("Breadcrumb clicked", item);
    // 添加點擊麵包屑的邏輯
    router.push({ name: item.to.name, params: item.to.params })
}

const breadcrumbs = computed<Crumb[]>(() => {
    // route.matched 儲存了從根到當前的所有匹配記錄
    return route.matched
        .filter((record) => record.meta.title) // 只選有設定 breadcrumb 的路由
        .map((record) => ({
            text: String(record.meta.title),
            to: {
                name: record.name as string,
                params: route.params, // 帶上目前的 params（如果有的話）
            },
        }));
});
</script>
