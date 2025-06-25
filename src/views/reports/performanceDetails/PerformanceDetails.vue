<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const form = reactive({
  clientID: '',
  startDate: '',
  endDate: '',
})

function searchReport() {
  console.log('Searching report with:', {
    clientID: form.clientID,
    startDate: form.startDate,
    endDate: form.endDate,
  });

  // 驗證日期格式：結束日期不得早於開始日期
  if (form.startDate && form.endDate && form.startDate > form.endDate) {
    ElMessage({
      message: '結束日期不得早於開始日期',
      type: 'warning',
    })
    return;
  }
}

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
                <label class="text-gray-700" for="username">統編</label>
                <input 
                  v-model="form.clientID"
                  class="input bg-transparent input-primary text-gray-500 placeholder:text-gray-500 mt-2" 
                  required
                  type="text" 
                  placeholder="請輸入統編" 
                />
              </div>

              <div>
                <label class="text-gray-700" for="emailAddress">開始日期</label>
                <input 
                  v-model="form.startDate"
                  class="input bg-transparent input-primary text-gray-500 mt-2" 
                  type="month"
                  required
                />
              </div>

              <div>
                <label class="text-gray-700" for="password">結束日期</label>
                <input 
                  v-model="form.endDate"
                  class="input bg-transparent input-primary text-gray-500 mt-2" 
                  type="month"
                  required
                />
              </div>
            </div>

            <div class="mt-4">
              <button class="btn btn-primary w-full">搜尋</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
