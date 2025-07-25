<template>
	<div>
		<svg :style="{ width: size, height: size }">
			<use :xlink:href="prefix + name" :fill="color"></use>
		</svg>
	</div>
</template>

<script lang="ts" setup>
defineProps({
	prefix: {
		type: String,
		default: '#icon-'
	},
	name: {
		type: String,
		default: 'phone'
	},
	color: {
		type: String,
		default: ''
	},
	size: {
		type: Number,
		default: 30
	}
})
</script>

<style scoped></style>
