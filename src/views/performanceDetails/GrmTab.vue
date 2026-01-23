<template>
    <div>
        <el-form 
            ref="ruleFormRef" 
            :model="grmFieldCondition" 
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
                        v-model="grmFieldCondition.startDataMonth" 
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
                        v-model="grmFieldCondition.endDataMonth" 
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
                        v-model="grmFieldCondition.areaCd" 
                        clearable
                        :disabled="isAreaCenter" 
                    >
                        <el-option
                            v-for="item in areaCdOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item 
                    prop="grmId" 
                    label="集團戶ID"   
                    class="query__form-item"
                >
                    <el-input 
                        v-model="grmFieldCondition.grmId" 
                        :prefix-icon="Lock" 
                        autocomplete="current-password" 
                    />
                </el-form-item>

                <el-form-item 
                    prop="groupName" 
                    label="集團戶名稱"   
                    class="query__form-item"
                >
                    <el-input 
                        v-model="grmFieldCondition.groupName" 
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
                        v-model="grmFieldCondition.dateRangePreset" 
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
import { ref, watch, computed } from 'vue'
import { usePerformanceStore } from '@/stores/modules/performance';
import { useUserStore } from '@/stores/modules/user';
import { storeToRefs } from 'pinia';
import { Lock } from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus'
import { ElLoading, ElNotification } from 'element-plus'
import { downloadBlob } from '@/utils/download'

const performanceStore = usePerformanceStore()
const { 
    grmFieldCondition,
    areaCdOptions 
} = storeToRefs(performanceStore)
const {
    fetchGrmPerformanceBlob,
    doGrmPerformanceDetailPreCheck,
} = performanceStore

const userStore = useUserStore()
const { isAreaCenter } = storeToRefs(userStore)

const ruleFormRef = ref<FormInstance>()

const dateOptions = computed(() => buildDateOptions());

// 結束月份不可早於起始月份
function validateEndMonth(_: any, value: string, callback: (error?: Error) => void) {
    const { startDataMonth } = grmFieldCondition.value

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

type DateOption = { value: string; label: string };

/**
 * 產生年度下拉選項：
 * - 永遠顯示「今年 - 5」到「今年 - 1」(共 5 個完整年度)
 * - 最後加上 recentYear
 */
function buildDateOptions(base: Date = new Date(), yearsCount = 5): DateOption[] {
  const thisYear = base.getFullYear();      // e.g. 2026
  const startYear = thisYear - yearsCount;  // e.g. 2021
  const endYear = thisYear - 1;             // e.g. 2025

  const years: DateOption[] = Array.from(
    { length: yearsCount },
    (_, i) => {
      const y = startYear + i;
      return { value: String(y), label: `${y}年度` };
    }
  );

  return [
    ...years,
    { value: "recentYear", label: "近一年度" },
  ];
}

/** 工具：YYYYMM 格式化 */
const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const yyyymm = (y: number, m: number) => `${y}${pad2(m)}`;

/** 近一年度：以當前月份為結束，往前推 11 個月為開始（皆含） */
function setRecentYearRange(base: Date = new Date()): void {
  // 1..12
  const endY = base.getFullYear();
  const endM = base.getMonth() + 1;

  // 以「年*12 + (月-1)」做線性月序，避免 Date 邊界問題
  const endIndex = endY * 12 + (endM - 1);
  const startIndex = endIndex - 11;

  const startY = Math.floor(startIndex / 12);
  const startM = (startIndex % 12) + 1;

  grmFieldCondition.value.startDataMonth = yyyymm(startY, startM);
  grmFieldCondition.value.endDataMonth = yyyymm(endY, endM);
}


/** 數字年份：固定 1 月 ~ 12 月 */
function setYearRange(year: number) {
  grmFieldCondition.value.startDataMonth = yyyymm(year, 1);
  grmFieldCondition.value.endDataMonth = yyyymm(year, 12);
}

/** 監聽快捷選擇 */
watch(
  () => grmFieldCondition.value.dateRangePreset,
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

    const { grmId, groupName } = grmFieldCondition.value

    // 檢查 groupName 是否只有填寫 '集團'
    if (groupName && groupName === '集團') {
        ElNotification.error({
            title: '錯誤',
            message: '請填寫正確的集團戶名稱'
        })
        return
    }

    if (!grmId && !groupName) {
        ElNotification.error({
            title: '錯誤',
            message: '請至少填寫一個欄位：集團戶名稱或集團戶ID'
        })
        return
    }

    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const loading = ElLoading.service({
                lock: true,
                text: '報表生成中，請稍候 …',
                background: 'rgba(0,0,0,0.3)'
            })

            try {
                const isExists = await doGrmPerformanceDetailPreCheck();

                const blob = await fetchGrmPerformanceBlob()

                const { areaCd, grmId, groupName } = grmFieldCondition.value
                const fileName = 
                    areaCd != '' ? `${areaCd}.xlsx` : 
                    grmId !== '' ? `${grmId}.xlsx` : `${groupName}.xlsx`
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