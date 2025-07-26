<template>
	<router-view v-slot="{ Component }">
		<Transition name="fade">
			<component :is="Component" v-if="mount" />
		</Transition>
	</router-view>
</template>

<script lang="ts" setup>
import { watch, ref, nextTick } from 'vue'
import { useSettingStore } from '@/stores/modules/setting'

const mount = ref(true)
const settingStore = useSettingStore()
watch(
	() => settingStore.refresh,
	() => {
		mount.value = false
		nextTick(() => {
			mount.value = true
		})
	}
)
</script>

<style scoped lang="scss">
.fade-enter-from {
	transform: scale(0);
}

.fade-leave-to {
	transform: scale(1);
}

.fade-enter-active {
	transition: all 0.3s;
}
</style>
