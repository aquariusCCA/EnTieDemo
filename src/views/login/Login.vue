<template>
  <div class="login-container">
    <transition name="form-slide">
      <div v-show="showForm" class="login-wrapper">
        <!-- 標題 -->
        <transition name="title-slide" appear>
          <h2 class="form-title">登入系統</h2>
        </transition>

        <!-- 表單 -->
        <el-form
          ref="loginForm"
          class="login-form"
          :model="form"
          :rules="rules"
          label-position="top"
        >
          <transition name="input-slide" appear>
            <el-form-item label="帳號" prop="username">
              <el-input v-model="form.username" placeholder="請輸入帳號" />
            </el-form-item>
          </transition>

          <transition name="input-slide" appear>
            <el-form-item label="密碼" prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="請輸入密碼"
                show-password
              />
            </el-form-item>
          </transition>

          <transition name="input-slide" appear>
            <el-form-item>
              <el-button type="primary" @click="onSubmit" class="login-button">登入</el-button>
            </el-form-item>
          </transition>
        </el-form>

        <!-- 提示區塊 -->
        <transition name="hint-slide" appear>
          <p class="hint-text">
            密碼同電腦開機時所輸入的密碼，輸入錯誤三次以上會鎖住電腦。
          </p>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showForm = ref(false)
const form = ref({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '請輸入帳號', trigger: 'blur' }],
  password: [{ required: true, message: '請輸入密碼', trigger: 'blur' }]
}

const onSubmit = () => {
  console.log('登入資料：', form.value)
}

onMounted(() => {
  showForm.value = true
})
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 1rem;
  background: linear-gradient(135deg, #f0f3f8, #d9e4f5);
}

.login-wrapper {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.form-title {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #303133;
}

.login-form {
  width: 100%;
}

.login-button {
  width: 100%;
}

/* 新增提示文字樣式 */
.hint-text {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #909399;
  text-align: center;
  line-height: 1.4;
}

/* --- 過渡動畫 --- */
.form-slide-enter-active {
  animation: form-slide-in 0.6s ease-out forwards;
}
@keyframes form-slide-in {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.input-slide-enter-active {
  animation: input-slide-in 0.5s ease-out forwards;
}
@keyframes input-slide-in {
  0% {
    transform: translateX(50%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.title-slide-enter-active {
  animation: title-slide-in 0.5s ease-out forwards;
}
@keyframes title-slide-in {
  0% {
    transform: translateX(50%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 提示文字過渡動畫 */
.hint-slide-enter-active {
  animation: hint-slide-in 0.5s ease-out forwards;
}
@keyframes hint-slide-in {
  0% {
    transform: translateX(30%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

/* RWD */
@media (max-width: 480px) {
  .login-wrapper {
    padding: 1.5rem;
    box-shadow: none;
  }

  .form-title {
    font-size: 1.25rem;
  }

  .hint-text {
    font-size: 0.75rem;
  }
}
</style>
