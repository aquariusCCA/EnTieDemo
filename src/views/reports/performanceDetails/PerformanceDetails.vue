<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { usePerformanceStore } from '@/stores/performance'; 
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

const performanceStore = usePerformanceStore()
const { fieldCondition } = storeToRefs(performanceStore)
const { 
  fetchPerformanceDetail, 
  setAreaCd,
  resetFieldCondition 
} = performanceStore

const userStore = useUserStore()
const { areaCd } = storeToRefs(userStore)

// 只有 924、983 可以編輯，其他都禁用
const allowed = ['924', '983']
const isAreaCdDisabled = computed(() => !allowed.includes(areaCd.value))


async function searchReport() {
  await fetchPerformanceDetail()
}

onMounted(() => {
  setAreaCd();
})

onUnmounted(() => {
  resetFieldCondition()
})
</script>

<template>
  <div>
    <div class="mt-8">
      <div class="mt-4">
        <div class="p-6 bg-white rounded-md shadow-md">
          <h2 class="text-lg font-semibold text-gray-700 capitalize">
            查詢績效明細
          </h2>

          <div class="mt-4 text-sm text-gray-500">
            ※ 紅色欄位為必填欄位，請務必填寫完整。
          </div>

          <form @submit.prevent="searchReport">
            <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
              <div>
                <label class="floating-label mt-6">
                  <input 
                    v-model="fieldCondition.rmEmpNr"
                    class="input bg-transparent input-primary text-gray-500 placeholder:text-gray-500 mt-2 w-full"
                    type="text" 
                    placeholder="請輸入員編" 
                  />
                  <span class="text-xl font-semibold">員編</span>
                </label>
              </div>

              <div>
                <label class="floating-label mt-6">
                  <input 
                    v-model="fieldCondition.clientCd"
                    class="input bg-transparent input-primary text-gray-500 placeholder:text-gray-500 mt-2 w-full"
                    type="text" 
                    placeholder="請輸入統編" 
                  />
                  <span class="text-xl font-semibold">統編</span>
                </label>
              </div>

              <div>
                <label class="floating-label mt-6">
                  <input 
                    v-model="fieldCondition.areaCd"
                    class="input bg-transparent input-error text-gray-500 mt-2 w-full disabled:bg-gray-100 placeholder:text-gray-500 disabled:text-gray-400 disabled:placeholder-gray-400" 
                    required
                    type="text" 
                    placeholder="請輸入區域中心代碼" 
                    :disabled="isAreaCdDisabled"
                  />
                  <span class="text-xl font-semibold">區域中心代碼</span>
                </label>
              </div>

              <div>
                <label class="floating-label mt-6">
                  <input 
                    v-model="fieldCondition.startDataMonth" 
                    class="input bg-transparent input-error text-gray-500 mt-2 w-full"
                    type="month" 
                    required 
                  />
                  <span>
                    開始日期
                  </span>
                </label>
              </div>

              <div>
                <label class="floating-label mt-6">
                  <input 
                    v-model="fieldCondition.endDataMonth" 
                    class="input bg-transparent input-error text-gray-500 mt-2 w-full"
                    type="month" 
                    required 
                  />
                  <span>
                    結束日期
                  </span>
                </label>
              </div>
            </div>

            <div class="flex justify-center mt-4">
              <button class="btn btn-primary w-1/2">搜尋</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
