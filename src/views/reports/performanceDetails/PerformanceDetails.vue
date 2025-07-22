<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { usePerformanceStore } from '@/stores/performance'; 
import { storeToRefs } from 'pinia';

const performanceStore = usePerformanceStore()
const { fieldCondition } = storeToRefs(performanceStore)
const { 
  fetchPerformanceDetail, 
  setAreaCd,
  resetFieldCondition 
} = performanceStore



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
            Account settings
          </h2>

          <form @submit.prevent="searchReport">
            <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
              <div>
                <label class="floating-label mt-6">
                  <input v-model="fieldCondition.areaCd"
                    class="input bg-transparent input-primary text-gray-500 placeholder:text-gray-500 mt-2 w-full" required
                    type="text" placeholder="請輸入統編" />
                  <span class="text-xl font-semibold">區域中心代碼</span>
                </label>
              </div>

              <div>
                <label class="floating-label mt-6">
                  <input v-model="fieldCondition.clientCd"
                    class="input bg-transparent input-primary text-gray-500 placeholder:text-gray-500 mt-2 w-full" required
                    type="text" placeholder="請輸入統編" />
                  <span class="text-xl font-semibold">統編</span>
                </label>
              </div>

              <div>
                <label class="floating-label mt-6">
                  <input v-model="fieldCondition.startDataMonth" class="input bg-transparent input-primary text-gray-500 mt-2 w-full"
                    type="month" required />
                  <span>
                    開始日期
                  </span>
                </label>
              </div>

              <div>
                <label class="floating-label mt-6">
                  <input v-model="fieldCondition.endDataMonth" class="input bg-transparent input-primary text-gray-500 mt-2 w-full"
                    type="month" required />
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
