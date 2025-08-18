<script setup lang="ts">
import { onMounted, onUnmounted, computed, reactive, ref } from 'vue'
import { usePerformanceStore } from '@/stores/modules/performance';
import { useUserStore } from '@/stores/modules/user';
import { storeToRefs } from 'pinia';
// 導入 Element Plus icon
import { User, Lock } from '@element-plus/icons-vue';
// 表單驗證 ref
import type { FormInstance } from 'element-plus'
import { ElLoading, ElNotification } from 'element-plus'
import { downloadBlob } from '@/utils/download'

const performanceStore = usePerformanceStore()
const { fieldCondition } = storeToRefs(performanceStore)
const {
  fetchPerformanceBlob,
  setAreaCd,
  doPerformanceDetailPreCheck
} = performanceStore

const userStore = useUserStore()
const { areaCd } = storeToRefs(userStore)


const ruleFormRef = ref<FormInstance>()

// 結束月份不可早於起始月份
function validateEndMonth(_: any, value: string, callback: (error?: Error) => void) {
  const { startDataMonth } = fieldCondition.value

  // 先讓 required 規則處理空值
  if (!startDataMonth || !value) return callback()

  if (Number(value) < Number(startDataMonth)) {
    callback(new Error('結束月份不得早於起始月份'))
  } else {
    callback()
  }
}

const ALLOWED_AREA = new Set([
  '711', '712', '713', '717', '718', '722', '726', '731', '736', '924', '983'
])
const ALLOWED_SET = new Set(ALLOWED_AREA)

const validateAreaCd = (_rule: any, value: any, callback: (error?: Error) => void) => {
  const v = String(value ?? '').trim()

  // 非必填：空字串直接通過
  if (v === '') return callback()

  // 有填寫才檢查格式與白名單
  if (!/^\d{3}$/.test(v)) {
    return callback(new Error('若填寫，僅可輸入「3 碼數字」'))
  }
  if (!ALLOWED_SET.has(v)) {
    return callback(new Error(`僅允許：${Array.from(ALLOWED_AREA).join(', ')}`))
  }
  callback()
}

// 表單驗證規則
const rules = ref({
  rmEmpNr: [
    {
      pattern: /^[a-zA-Z0-9]+$/,
      trigger: 'blur',
      message: '請輸入英數字',
    }
  ],
  areaCd: [
    { validator: validateAreaCd, trigger: ['blur', 'change'] }
  ],
  startDataMonth: [
    {
      required: true,
      message: '請選擇起始月份',
      trigger: 'change',
    }
  ],
  endDataMonth: [
    {
      required: true,
      message: '請選擇結束月份',
      trigger: 'change',
    },
    { validator: validateEndMonth, trigger: 'change' },
  ],
})

const loading = ref(false)

// 只有 924、983 可以編輯，其他都禁用
const allowed = ['924', '983']
const isAreaCdDisabled = computed(() => !allowed.includes(areaCd.value))

async function searchReport() {
  const formEl = ruleFormRef.value
  if (!formEl) return

  const { rmEmpNr, areaCd, clientCd } = fieldCondition.value

  if (!rmEmpNr && !areaCd && !clientCd) {
    ElNotification.error({
      title: '錯誤',
      message: '請至少填寫一個欄位：員編、區域中心代碼或統編'
    })
    return
  }

  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log('表單驗證通過，開始生成報表')

      const loading = ElLoading.service({
        lock: true,
        text: '報表生成中，請稍候 …',
        background: 'rgba(0,0,0,0.3)'
      })

      try {
        const isExists = await doPerformanceDetailPreCheck();
        console.log('isExists', isExists)

        const blob = await fetchPerformanceBlob()
        
        const { areaCd, rmEmpNr, clientCd } = fieldCondition.value
        const fileName = areaCd != '' ? `${areaCd}.xlsx` : rmEmpNr ? `${rmEmpNr}.xlsx` : `${clientCd}.xlsx`
        downloadBlob(blob, fileName)

        ElNotification.success('報表下載已完成')
      } catch (err) {
        console.error('報表生成失敗:', err)
        ElNotification.error({
          title: '報表生成失敗',
          message: String(err)
        })
      } finally {
        loading.close()
      }
    } else {
      console.log('表單驗證失敗:', fields)
    }
  })
}

onMounted(() => {
  setAreaCd();
})
</script>

<template>
  <div class="query">
    <h2 class="query__title">查詢績效明細</h2>
    <div class="query__hint"><span class="query__required">＊</span>為必填欄位，請務必填寫完整。</div>

    <el-form ref="ruleFormRef" :model="fieldCondition" :rules="rules" label-position="top" status-icon @submit.prevent
      class="query__form">
      <div class="query__form-grid">
        <el-form-item prop="rmEmpNr" label="員編" class="query__form-item">
          <el-input v-model="fieldCondition.rmEmpNr" :prefix-icon="User" autocomplete="username" />
        </el-form-item>

        <el-form-item prop="clientCd" label="統編" class="query__form-item">
          <el-input v-model="fieldCondition.clientCd" :prefix-icon="Lock" autocomplete="current-password" />
        </el-form-item>

        <el-form-item prop="areaCd" label="區域中心代碼" class="query__form-item">
          <el-input v-model="fieldCondition.areaCd" :prefix-icon="Lock" autocomplete="current-password"
            :disabled="isAreaCdDisabled" />
        </el-form-item>

        <el-form-item prop="startDataMonth" label="起始月份" class="query__form-item">
          <el-date-picker class="query__month-picker" v-model="fieldCondition.startDataMonth" type="month"
            format="YYYY-MM" value-format="YYYYMM" placeholder="選擇起始月份" />
        </el-form-item>

        <el-form-item prop="endDataMonth" label="結束月份" class="query__form-item">
          <el-date-picker v-model="fieldCondition.endDataMonth" type="month" format="YYYY-MM" value-format="YYYYMM"
            placeholder="選擇結束月份" />
        </el-form-item>
      </div>
    </el-form>

    <div class="query__button-wrapper">
      <el-button class="query__button" type="primary" :loading="loading" @click="searchReport">
        搜尋
      </el-button>
    </div>
  </div>
</template>


<style scoped lang="scss">
:deep(.el-input) {
  width: 100%;
}

.query {
  padding: 2rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  font-family: "Helvetica Neue", "Segoe UI", sans-serif;
  color: #333;

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #222;
  }

  &__hint {
    font-size: 0.95rem;
    color: #666;
    margin-bottom: 1.5rem;
  }

  &__required {
    color: #e53935;
    font-weight: bold;
  }

  &__form {
    margin-bottom: 2rem;

    &-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;

      @media screen and (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    &-item {
      width: 100%;
    }
  }

  &__month-picker {
    width: 100%;
  }

  &__button-wrapper {
    text-align: right;
    margin-top: 1rem;
  }

  &__button {
    padding: 0.6rem 2rem;
    font-size: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 123, 255, 0.3);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
    }
  }
}
</style>