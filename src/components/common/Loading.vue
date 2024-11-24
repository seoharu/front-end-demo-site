<template>
  <Transition name="fade">
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <!-- 메인 스피너 -->
        <div class="spinner-container">
          <div class="spinner-outer"></div>
          <div class="spinner-inner"></div>
          <!-- 영화 릴 아이콘 -->
          <i class="fas fa-film film-icon"></i>
        </div>
        <!-- 로딩 메시지 -->
        <div class="loading-content">
          <p v-if="message" class="loading-message">{{ message }}</p>
          <p class="loading-submessage">{{ getRandomLoadingMessage() }}</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Loading',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: '영화 정보를 불러오는 중...'
    }
  },
  data() {
    return {
      loadingMessages: [
        '영화 정보를 가져오고 있습니다',
        '잠시만 기다려주세요',
        '최신 영화 데이터를 준비중입니다',
        '곧 멋진 영화들을 보여드릴게요'
      ]
    }
  },
  methods: {
    getRandomLoadingMessage() {
      const index = Math.floor(Math.random() * this.loadingMessages.length)
      return this.loadingMessages[index]
    }
  }
}
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  text-align: center;
  padding: 2rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.1);
}

.spinner-container {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
}

.spinner-outer {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 6px solid transparent;
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

.spinner-inner {
  position: absolute;
  top: 15%;
  left: 15%;
  width: 70%;
  height: 70%;
  border: 6px solid transparent;
  border-top-color: #e74c3c;
  border-radius: 50%;
  animation: spin 1s linear infinite reverse;
}

.film-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  color: #fff;
  animation: pulse 2s infinite;
}

.loading-content {
  margin-top: 1.5rem;
}

.loading-message {
  color: white;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.loading-submessage {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

/* 애니메이션 정의 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 트랜지션 효과 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>