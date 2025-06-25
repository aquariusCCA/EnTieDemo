<script setup lang="ts">
import { ref } from 'vue'

interface User {
  username: string
  email: string
  password: string
  confirm: string
}

const user = ref<User>({
  username: '',
  email: '',
  password: '',
  confirm: '',
})

function register() {
  const data = JSON.parse(JSON.stringify(user.value))
  // eslint-disable-next-line no-console
  console.log('Registered: ', data)
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

          <form @submit.prevent="register">
            <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
              <div>
                <label class="text-gray-700" for="username">統編</label>
                <input 
                  class="input bg-transparent input-primary placeholder:text-gray-500 mt-2" 
                  required
                  type="text" 
                  placeholder="請輸入統編" 
                />
              </div>

              <div>
                <label class="text-gray-700" for="emailAddress">日期範圍</label>
                <input 
                  class="input bg-transparent input-primary text-gray-500 mt-2" 
                  type="date" 
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
