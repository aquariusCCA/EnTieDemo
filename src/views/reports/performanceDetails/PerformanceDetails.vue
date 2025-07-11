<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getUsers } from "@/api/test";
import { BizError } from "@/utils/request";

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

onMounted(async () => {
  try {
    // 初始化或其他操作
    const resp = await getUsers();
    console.log('getUsers response:', resp);
  } catch (error) {
    if (error instanceof BizError) {
      console.error("登出失敗:", error.message);
      console.error("登出失敗:", error.code);
      ElMessage({
        type: "error",
        message: error.message,
      });
    }
  }
});
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
                  <input v-model="form.clientID"
                    class="input bg-transparent input-primary text-gray-500 placeholder:text-gray-500 mt-2 w-full" required
                    type="text" placeholder="請輸入統編" />
                  <span class="text-xl font-semibold">統編</span>
                </label>
              </div>

              <div>
                <label class="floating-label mt-6">
                  <input v-model="form.startDate" class="input bg-transparent input-primary text-gray-500 mt-2 w-full"
                    type="month" required />
                  <span>
                    開始日期
                  </span>
                </label>
              </div>

              <div>
                <label class="floating-label mt-6">
                  <input v-model="form.endDate" class="input bg-transparent input-primary text-gray-500 mt-2 w-full"
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
