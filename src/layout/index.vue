<template>
	<div class="layout-container">
		<div class="layout-aside" :class="settingStore.fold ? 'fold' : ''">
			<Aside></Aside>
		</div>
		<div class="layout-tabbar" :class="settingStore.fold ? 'fold' : ''">
			<Tabbar></Tabbar>
		</div>
		<div class="layout-main" :class="settingStore.fold ? 'fold' : ''">
			<Main></Main>
		</div>
	</div>
</template>

<script lang="ts" setup>
import Aside from './aside/index.vue'
import Tabbar from './tabbar/index.vue'
import Main from './main/index.vue'
import { useSettingStore } from '@/stores/modules/setting'
import { storeToRefs } from 'pinia';

const settingStore = useSettingStore()
const { fold } = storeToRefs(settingStore)
</script>

<style scoped lang="scss">
.layout-container {
	height: 100vh;
	position: relative;
	overflow: hidden;

	.layout-aside {
		position: relative;
		z-index: 20;
		height: 100vh;
		width: $aside-width;
		background-color: $aside-color;
		transition: all 0.3s ease;

		&.fold {
			width: $aside-fold-width;
		}
	}

	.layout-tabbar {
		position: absolute;
		top: 0;
		left: $aside-width;
		height: $tabbar-height;
		width: calc(100vw - $aside-width);
		box-shadow: 0 0 1px;
		transition: all 0.3s ease;

		&.fold {
			width: calc(100vw - $aside-fold-width);
			left: $aside-fold-width;
		}
	}

	.layout-main {
		position: absolute;
		top: $tabbar-height;
		left: $aside-width;
		padding: 20px;
		height: calc(100vh - $tabbar-height);
		width: calc(100vw - $aside-width);
		overflow: hidden;
		transition: all 0.3s ease;

		&.fold {
			width: calc(100vw - $aside-fold-width);
			left: $aside-fold-width;
		}
	}

	.layout-overlay {
		position: fixed;
		z-index: 10;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(36, 39, 59, 0.8);
		transform: scale(1.1);
		opacity: 0;
		pointer-events: none;
		transition: transform 0.3s ease, opacity 0.3s ease;

		&.fold {
			transform: scale(1);
			opacity: 1;
			pointer-events: auto;
		}
	}
}
</style>
