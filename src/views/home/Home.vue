<template>
  <div class="home-container">
    <transition name="fade">
      <el-card class="welcome-card" v-if="showCard">
        <div class="welcome-content">
          <h2>歡迎回來，{{ userName }}！</h2>
          <p>{{ currentTime }}</p>
        </div>

        <div class="image-container">
          <svg-icon name="welcome" :size="450" />
        </div>
      </el-card>
    </transition>
  </div>
</template>


<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { ElCard } from 'element-plus';
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia';

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const userName = computed(() => {
  return userInfo.value.displayName || userInfo.value.account || '使用者';
});
const currentTime = ref('');
const showCard = ref(false);
let timer: number;

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleString('zh-TW', { hour12: false });
};

onMounted(() => {
  // 載入時顯示並啟動畫面過渡
  showCard.value = true;
  updateTime();
  timer = window.setInterval(updateTime, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timer);
});
</script>

<style scoped lang="scss">
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 85vh;
  background-color: #f9fafb; // 柔和背景色
  box-sizing: border-box;
}

.welcome-card {
  width: 100%;
  max-width: 640px;
  padding: 30px 40px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  background-color: #fff;
  transition: all 0.3s ease-in-out;
}

.welcome-content {
  text-align: center;

  h2 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 10px;
    color: #1f2937;
  }

  p {
    font-size: 1.125rem;
    color: #6b7280;
  }
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 32px;

  svg {
    max-width: 100%;
    height: auto;
    max-height: 300px;
  }
}

/* Fade 過渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* RWD 手機樣式 */
@media (max-width: 768px) {
  .home-container {
    padding: 20px 10px;
  }

  .welcome-card {
    padding: 20px;
  }

  .welcome-content h2 {
    font-size: 1.5rem;
  }

  .welcome-content p {
    font-size: 1rem;
  }

  .image-container {
    margin-top: 24px;
  }

  svg {
    max-height: 220px;
  }
}
</style>
