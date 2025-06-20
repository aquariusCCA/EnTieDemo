<template>
  <div class="home-container">
    <transition name="fade">
      <el-card class="welcome-card" v-if="showCard">
        <div class="welcome-content">
          <h2>歡迎回來，{{ userName }}！</h2>
          <p>{{ currentTime }}</p>
        </div>
      </el-card>
    </transition>
    <!-- 未來可依需求新增其他模組 -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import { ElCard } from 'element-plus';

export default defineComponent({
  name: 'HomePage',
  components: { ElCard },
  setup() {
    const userName = ref('使用者');  // 後端登入資訊替換
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

    return { userName, currentTime, showCard };
  },
});
</script>

<style scoped lang="scss">
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  box-sizing: border-box;
}

.welcome-card {
  width: 100%;
  max-width: 600px;
  transition: all 0.3s ease-in-out;
}

.welcome-content {
  text-align: center;
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

/* RWD */
@media (max-width: 768px) {
  .home-container {
    padding: 10px;
  }
  .welcome-card {
    padding: 10px;
  }
  .welcome-content h2 {
    font-size: 1.2rem;
  }
  .welcome-content p {
    font-size: 1rem;
  }
}
</style>