<template>
	<div class="tabbar">
		<div class="tabbar__left">
			<el-icon class="tabbar__fold-icon" @click="handleFold">
				<component :is="settingStore.fold ? 'Expand' : 'Fold'" />
			</el-icon>
			<el-breadcrumb separator=">">
				<el-breadcrumb-item v-for="x in route.matched" v-show="x.meta.name" :to="{ path: x.path }"
					:key="x.path">
					{{ x.meta.name }}
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="tabbar__right">
			<el-button icon="Refresh" circle @click="handleRefresh" />
			<el-button icon="FullScreen" circle @click="handleFullScreen" />
			<el-dropdown>
				<span class="tabbar__user">
					{{ userStore.userInfo.loginUser.displayName }}
					<el-icon class="tabbar__user-icon">
						<arrow-down />
					</el-icon>
				</span>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
	</div>
</template>

<script lang="ts" setup name="Tabbar">
import { useRoute } from 'vue-router'
import { useSettingStore } from '@/stores/modules/setting'
import { useUserStore } from '@/stores/modules/user'
import { ElMessageBox, ElNotification } from 'element-plus'
import router from '@/router'

const route = useRoute()
const settingStore = useSettingStore()
const userStore = useUserStore()

// 折叠菜单
const handleFold = () => {
	settingStore.changeFold()
}

// 刷新
const handleRefresh = () => {
	settingStore.changeRefresh()
}

// 全屏
const handleFullScreen = () => {
	if (document.fullscreenElement) {
		document.exitFullscreen()
	} else {
		document.documentElement.requestFullscreen()
	}
}

// 退出登录
const handleLogout = async () => {
	ElMessageBox.confirm('確定註銷並退出系統嗎？', '提示', {
		confirmButtonText: '確定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		userStore.logout().then(() => {
			router.push({ name: 'Login' })
		}).catch((e) => {
			ElNotification.error({
				title: '退出登錄失敗',
				message: String(e)
			})
		})
	}).catch((e) => { 
		ElNotification.error({
			title: '退出登錄失敗',
			message: String(e)
		})
	})
}
</script>

<style scoped lang="scss">
.tabbar {
	width: 100%;
	height: 100%;
	padding: 10px 0;
	display: flex;
	justify-content: space-between;
	align-items: center;

	&__left {
		display: flex;
		align-items: center;

		&>.tabbar__fold-icon {
			margin: 0 10px;
			cursor: pointer;
		}
	}

	&__right {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	&__user {
		cursor: pointer;
		margin-right: 10px;
		display: flex;
		align-items: center;
	}

	&__user-icon {
		margin-left: 5px;
	}
}

// 調整 Element-UI 按鈕之間的間距
.el-button+.el-button {
	margin-left: 0;
}

// RWD：小於 425px 隱藏麵包屑
@media (max-width: 425px) {
	.tabbar__left .el-breadcrumb {
		display: none;
	}
}
</style>
