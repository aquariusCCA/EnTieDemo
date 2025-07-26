<template>
	<template v-for="menu in menuList" :key="menu.path">
		<template v-if="!menu.meta.hidden">
			<!-- 1.没有子菜单的路由 -->
			<el-menu-item v-if="!menu.children" :index="menu.path" @click="toMenu">
				<el-icon>
					<component :is="menu.meta.icon" />
				</el-icon>
				<span>{{ menu.meta.name }}</span>
			</el-menu-item>
			<!-- 2.单个子菜单的路由 -->
			<el-menu-item v-if="menu.children && menu.children.length == 1" :index="menu.children[0].path"
				@click="toMenu">
				<el-icon>
					<component :is="menu.children[0].meta.icon" />
				</el-icon>
				<span>{{ menu.children[0].meta.name }}</span>
			</el-menu-item>
			<!-- 3.多个子菜单的路由-->
			<el-sub-menu v-if="menu.children && menu.children.length > 1" :index="menu.path">
				<template #title>
					<el-icon>
						<component :is="menu.meta.icon" />
					</el-icon>
					<span>{{ menu.meta.name }}</span>
				</template>
				<Menu :menu-list="menu.children"></Menu>
			</el-sub-menu>
		</template>
	</template>
</template>

<script lang="ts" setup>
import router from '@/router'
defineProps(['menuList'])
// @ts-ignore
const toMenu = vc => {
	router.push({ path: vc.index })
}
</script>

<script lang="ts">
export default {
	name: 'Menu'
}
</script>

<style scoped lang="scss"></style>
