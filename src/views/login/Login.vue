<template>
  <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
        <svg class="w-10 h-10" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M364.61 390.213C304.625 450.196 207.37 450.196 147.386 390.213C117.394 360.22 102.398 320.911 102.398 281.6C102.398 242.291 117.394 202.981 147.386 172.989C147.386 230.4 153.6 281.6 230.4 307.2C230.4 256 256 102.4 294.4 76.7999C320 128 334.618 142.997 364.608 172.989C394.601 202.981 409.597 242.291 409.597 281.6C409.597 320.911 394.601 360.22 364.61 390.213Z"
            fill="#4C51BF" stroke="#4C51BF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path
            d="M201.694 387.105C231.686 417.098 280.312 417.098 310.305 387.105C325.301 372.109 332.8 352.456 332.8 332.8C332.8 313.144 325.301 293.491 310.305 278.495C295.309 263.498 288 256 275.2 230.4C256 243.2 243.201 320 243.201 345.6C201.694 345.6 179.2 332.8 179.2 332.8C179.2 352.456 186.698 372.109 201.694 387.105Z"
            fill="white" />
        </svg>
        <span class="text-2xl font-semibold text-gray-700">登入系統</span>
      </div>

      <!-- 表單 -->
      <form class="mt-4"  @submit.prevent="clickLoginButton">
        <!-- 帳號 -->
        <label class="floating-label mt-6">
          <input 
            v-model="empId"
            type="text" 
            required
            placeholder="請輸入帳號" 
            class="w-full input input-primary bg-white text-black" 
          />
          <span class="text-xl font-semibold">帳號</span>
        </label>

        <!-- 密碼 -->
        <label class="floating-label mt-6">
          <input
            v-model="password"
            type="password" 
            required
            placeholder="請輸入密碼"
            class="w-full input input-primary bg-white text-black"   
          />
          <span class="text-xl font-semibold">密碼</span>
        </label>

        <p class="mt-2 text-sm text-gray-600 leading-snug">
          密碼同電腦開機時所輸入的密碼，輸入錯誤三次以上會鎖住電腦。
        </p>

        <div class="mt-6">
          <button class="w-full btn btn-primary">登錄</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const empId = ref('')
const password = ref('')

const userStore = useUserStore()
const { login } = userStore

async function clickLoginButton() {
  await login(empId.value, password.value)
}
</script>