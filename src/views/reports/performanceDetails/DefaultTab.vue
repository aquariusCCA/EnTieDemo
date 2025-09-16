<template>
    <div>
        <el-form 
            ref="ruleFormRef" 
            :model="fieldCondition" 
            :rules="rules" 
            label-position="top" 
            status-icon
            @submit.prevent 
            class="query__form"
        >
            <div class="query__form-grid">
                <el-form-item 
                    prop="startDataMonth" 
                    label="起始月份" 
                    class="query__form-item"
                >
                    <el-date-picker 
                        v-model="fieldCondition.startDataMonth" 
                        type="month"
                        format="YYYY-MM" 
                        value-format="YYYYMM" 
                        placeholder="選擇起始月份" 
                    />
                </el-form-item>

                <el-form-item 
                    prop="endDataMonth" 
                    label="結束月份" 
                    class="query__form-item"
                >
                    <el-date-picker 
                        v-model="fieldCondition.endDataMonth" 
                        type="month" 
                        format="YYYY-MM"
                        value-format="YYYYMM" 
                        placeholder="選擇結束月份" 
                    />
                </el-form-item>

                <el-form-item 
                    prop="areaCd" 
                    label="區域中心代碼" 
                    class="query__form-item"
                >
                    <el-select 
                        v-model="fieldCondition.areaCd" 
                        clearable
                        :disabled="isAreaCenter" 
                    >
                        <el-option
                            v-for="item in areacdOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item 
                    prop="rmEmpNr" 
                    label="員編" 
                    class="query__form-item"
                >
                    <el-input 
                        v-model="fieldCondition.rmEmpNr" 
                        :prefix-icon="User" 
                        autocomplete="username" 
                    />
                </el-form-item>

                <el-form-item 
                    prop="clientCd" 
                    label="統編" 
                    class="query__form-item"
                >
                    <el-input 
                        v-model="fieldCondition.clientCd" 
                        :prefix-icon="Lock" 
                        autocomplete="current-password" 
                    />
                </el-form-item>

                <el-form-item 
                    prop="dateRangePreset" 
                    label="時間快捷選擇" 
                    class="query__form-item"
                >
                    <el-select 
                        v-model="fieldCondition.dateRangePreset"
                        clearable 
                    >
                        <el-option
                            v-for="item in dateOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
            </div>
        </el-form>

        <div class="query__button-wrapper">
            <el-button 
                class="query__button" 
                type="primary" 
                :loading="loading" 
                @click="searchReport"
            >
                搜尋
            </el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { usePerformanceStore } from '@/stores/modules/performance';
import { useUserStore } from '@/stores/modules/user';
import { storeToRefs } from 'pinia';
import { User, Lock } from '@element-plus/icons-vue';
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
const { isAreaCenter } = storeToRefs(userStore)

const ruleFormRef = ref<FormInstance>()

const areacdOptions = [
  {
    value: '711',
    label: '北一區',
  },
  {
    value: '712',
    label: '北二區',
  },
  {
    value: '713',
    label: '北三區',
  },
  {
    value: '717',
    label: '北五區',
  },
  {
    value: '718',
    label: '北六區',
  },
  {
    value: '722',
    label: '北八區',
  },
  {
    value: '726',
    label: '桃竹區',
  },
  {
    value: '731',
    label: '台中區',
  },
  {
    value: '736',
    label: '南部區',
  },
  {
    value: '924',
    label: '法授部',
  },
  {
    value: '983',
    label: '法業部',
  },
]

const dateOptions = [
    {
        value: '2020',
        label: '2020年度',
    },
    {
        value: '2021',
        label: '2021年度',
    },
    {
        value: '2022',
        label: '2022年度',
    },
    {
        value: '2023',
        label: '2023年度',
    },
    {
        value: '2024',
        label: '2024年度',
    },
    {
        value: 'recentYear',
        label: '近一年度'
    }
]

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

// 表單驗證規則
const rules = ref({
    rmEmpNr: [
        {
            pattern: /^[a-zA-Z0-9]+$/,
            trigger: 'blur',
            message: '請輸入英數字',
        }
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

/** 工具：YYYYMM 格式化 */
const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const yyyymm = (y: number, m: number) => `${y}${pad2(m)}`;

/** 近一年度：當年 1 月 ~ 本月 */
function setRecentYearRange() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1; // 1-12
  fieldCondition.value.startDataMonth = yyyymm(y, 1);
  fieldCondition.value.endDataMonth = yyyymm(y, m);
}

/** 數字年份：固定 1 月 ~ 12 月 */
function setYearRange(year: number) {
  fieldCondition.value.startDataMonth = yyyymm(year, 1);
  fieldCondition.value.endDataMonth = yyyymm(year, 12);
  console.log('setYearRange', fieldCondition.value);
}

/** 監聽快捷選擇 */
watch(
  () => fieldCondition.value.dateRangePreset,
  (val) => {
    if (!val) return;
    if (val === "recentYear") {
      setRecentYearRange();
    } else if (/^\d{4}$/.test(val)) {
      setYearRange(Number(val));
    }
  }
);

const loading = ref(false)

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
</script>

<style scoped lang="scss">
:deep(.el-input) {
  width: 100%;
}

.query__form {
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