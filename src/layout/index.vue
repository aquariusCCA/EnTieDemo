<template>
	<div class="layout-container" :class="{ 'is-fold': fold }">
		<aside class="layout-aside">
			<Aside />
		</aside>

		<header class="layout-tabbar">
			<Tabbar />
		</header>

		<main class="layout-main">
			<Main />
		</main>

		<!-- overlay 僅在手機裝置且展開側邊欄時才顯示 -->
		<div class="layout-overlay" v-if="isMobile && !fold" @click="toggleFold" />
	</div>
</template>


<script lang="ts" setup>
import Aside from './aside/index.vue'
import Tabbar from './tabbar/index.vue'
import Main from './main/index.vue'
import { useSettingStore } from '@/stores/modules/setting'
import { storeToRefs } from 'pinia'
import { ref, onMounted, onUnmounted } from 'vue'

const settingStore = useSettingStore()
const { fold } = storeToRefs(settingStore)
const { toggleFold } = settingStore

// 判斷是否為手機裝置
const isMobile = ref(window.innerWidth <= 768)
const handleResize = () => {
	isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
	window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
	window.removeEventListener('resize', handleResize)
})
</script>


<style scoped lang="scss">
$aside-width: 240px;
$aside-fold-width: 64px;
$tabbar-height: 56px;
$aside-color: #24273b;
$transition-width: 0.4s cubic-bezier(0.23, 1, 0.32, 1);
$transition-text: 0.25s ease-out;

.layout-container {
	--aside-size: #{$aside-width};
	height: 100vh;
	display: grid;
	grid-template-columns: var(--aside-size) 1fr;
	grid-template-rows: $tabbar-height 1fr;
	grid-template-areas:
		"aside tabbar"
		"aside main";
	overflow: hidden;
	transition: grid-template-columns $transition-width;

	&.is-fold {
		--aside-size: #{$aside-fold-width};
	}

	.layout-aside {
		grid-area: aside;
		background: $aside-color;
		width: var(--aside-size);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		transition: width $transition-width;

		// 新增文字過渡動畫
		* {
			transition: opacity 0.2s ease, transform 0.2s ease;
		}

		.is-fold & * {
			opacity: 0;
			transform: translateX(-10px);
		}
	}

	.layout-tabbar {
		grid-area: tabbar;
		background: #fff;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
		z-index: 5;
	}

	.layout-main {
		grid-area: main;
		padding: 20px;
		overflow: auto;
		background: #f7f8fa;
	}
}

// 👉 Media Query
@media (max-width: 768px) {
	.layout-container {
		grid-template-columns: 1fr;
		grid-template-rows: $tabbar-height 1fr;
		grid-template-areas:
			"tabbar"
			"main";

		.layout-aside {
			position: fixed;
			top: 0;
			left: -100%;
			height: 100vh;
			width: $aside-width;
			transition: left $transition-width;
			z-index: 20;
		}

		// 展開時
		&:not(.is-fold) .layout-aside {
			left: 0;
		}

		.layout-tabbar {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			z-index: 15;
		}

		.layout-main {
			height: calc(100vh - $tabbar-height);
			padding-top: $tabbar-height;
		}

		.layout-overlay {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(36, 39, 59, 0.6);
			opacity: 0;
			pointer-events: none;
			transition: opacity $transition-text;
			z-index: 18;
			opacity: 1;
			pointer-events: auto;
		}
	}
}
</style>
