<template>
  <!-- 整頁中心容器 -->
  <main v-loading="loading" class="login">
    <!-- 卡片 -->
    <section class="login__card">
      <svg class="login__icon" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M364.61 390.213C304.625 450.196 207.37 450.196 147.386 390.213C117.394 360.22 102.398 320.911 102.398 281.6C102.398 242.291 117.394 202.981 147.386 172.989C147.386 230.4 153.6 281.6 230.4 307.2C230.4 256 256 102.4 294.4 76.7999C320 128 334.618 142.997 364.608 172.989C394.601 202.981 409.597 242.291 409.597 281.6C409.597 320.911 394.601 360.22 364.61 390.213Z"
          fill="#4C51BF" stroke="#4C51BF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path
          d="M201.694 387.105C231.686 417.098 280.312 417.098 310.305 387.105C325.301 372.109 332.8 352.456 332.8 332.8C332.8 313.144 325.301 293.491 310.305 278.495C295.309 263.498 288 256 275.2 230.4C256 243.2 243.201 320 243.201 345.6C201.694 345.6 179.2 332.8 179.2 332.8C179.2 352.456 186.698 372.109 201.694 387.105Z"
          fill="white" />
      </svg>

      <h1 class="login__title">登入系統</h1>

      <!-- 表單 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" :label-position="'top'" status-icon
        @submit.prevent class="login__form">

        <el-form-item prop="empId" label="員工編號">
          <el-input id="empId" v-model="loginForm.empId" :prefix-icon="User" autocomplete="username" />
        </el-form-item>

        <el-form-item prop="password" label="密碼">
          <el-input id="password" v-model="loginForm.password" type="password" :prefix-icon="Lock" show-password
            autocomplete="current-password" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login__submit" :loading="loading" @click="toLogin">
            登入
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 備註訊息 -->
      <p class="login__warning">
        密碼同電腦開機時所輸入的密碼，錯誤三次以上會鎖住電腦！
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import { Lock, User } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/date'
import router from '@/router'

const userStore = useUserStore()
const { login } = userStore

interface RuleForm { empId: string; password: string }
const loginForm = reactive<RuleForm>({ empId: '', password: '' })
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const toLogin = async () => {
  const formEl = loginFormRef.value
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log('submit!')
      loading.value = true

      try {
        await login(loginForm.empId, loginForm.password)

        ElNotification.success({
          title: '登入成功',
          message: `${getTime()}好！歡迎你`
        })

        router.push({ name: 'Home' })
      } catch (err) {
        console.error('Login failed:', err)
        ElNotification.error({
          title: '登入失敗',
          message: String(err)
        });
      } finally {
        loading.value = false
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

const loginRules: FormRules<RuleForm> = {
  empId: [
    { required: true, message: '請輸入帳號', trigger: ['blur', 'change'] },
    {
      pattern: /^[0-9]+$/, trigger: 'blur', message: '請輸入數字',
    }
  ],
  password: [{ required: true, message: '請輸入密碼', trigger: ['blur', 'change'] }]
}
</script>

<style scoped lang="scss">
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6; // 等同於 Tailwind 的 bg-gray-100
  padding: 1rem;

  @media (min-width: 768px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  &__card {
    width: 100%;
    max-width: 24rem; // 384px
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
    background-color: #ffffff;
    border-radius: 0.75rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  &__icon {
    width: 2.5rem;
    height: 2.5rem;
  }

  &__title {
    font-size: 1.5rem; // text-2xl
    font-weight: 600;
    color: #374151; // text-gray-700
  }

  &__form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__submit {
    width: 100%;
  }

  &__warning {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #dc2626;
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.375rem;
    text-align: center;
  }
}
</style>
