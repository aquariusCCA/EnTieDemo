<template>
	<div class="title">
		<p>{{ title }}</p>
		<img src="@/assets/images/dataScreen-title.png" alt="title" />
	</div>
</template>

<script lang="ts" setup>
defineProps(['title'])
</script>

<style scoped lang="scss">
.title {
	color: #fff;
}
</style>
