<template>
  <div>
    <!-- 表單 -->
    <el-form
      ref="loginFormRef"
      class="login-form"
      :model="form"
      :rules="rules"
      label-position="top"
    >
      <!-- 統編 -->
      <el-form-item label="統編" prop="clientID">
        <el-input v-model="form.clientID" placeholder="請輸入統編" />
      </el-form-item>

      <!-- 日期範圍 -->
      <el-form-item label="日期範圍" prop="dateRange">
        <el-date-picker
          v-model="form.dateRange"
          type="daterange"
          :range-separator="'至'"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
        />
      </el-form-item>
    </el-form>

    <!-- 按鈕 -->
    <div class="button__row" style="margin-top: 16px;">
      <el-button plain @click="resetForm">清空</el-button>
      <el-button type="primary" @click="submitForm">搜尋</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'

// 1. 取得 el-form 實例，之後用來 validate、clearValidate
const loginFormRef = ref<FormInstance>()

// 2. 表單資料；用 reactive 以利型別推斷
const form = reactive({
  clientID: '',                       // 統編
  dateRange: [] as [Date, Date] | []  // 日期範圍
})

// 3. 驗證規則
const rules = reactive({
  clientID: [
    { required: true, message: '請輸入統編', trigger: 'blur' },
    { pattern: /^\d+$/, message: '統編僅能為數字', trigger: 'blur' }
  ],
  dateRange: [
    { type: 'array', required: true, message: '請選擇日期範圍', trigger: 'change' }
  ]
})

// 4. 重置表單：清空欄位並清除驗證狀態
function resetForm() {
  loginFormRef.value?.clearValidate()
  form.clientID = ''
  form.dateRange = []
}

// 5. 提交表單：驗證通過才執行搜尋邏輯
function submitForm() {
  loginFormRef.value?.validate(valid => {
    if (!valid) {
      console.warn('表單驗證未通過')
      return
    }
    // TODO: 在這裡呼叫後端 API 或進行其他搜尋邏輯
    console.log('搜尋參數：', form)
  })
}
</script>

<style scoped lang="scss">
.button__row {
  display: flex;
  justify-content: center;
}
</style>