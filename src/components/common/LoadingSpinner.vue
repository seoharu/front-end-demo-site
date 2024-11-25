<template>
  <div v-if="loading" :class="[
    'loading-overlay',
    { 'full-screen': type === 'full' },
    { 'content-only': type === 'content' },
    { 'inline': type === 'inline' }
  ]">
    <div class="loading-spinner">
      <!-- 메인 스피너 -->
      <div class="spinner-container">
        <div class="spinner-outer"></div>
        <div class="spinner-inner"></div>
        <i class="fas fa-film film-icon"></i>
      </div>
      <!-- 로딩 메시지 -->
      <p v-if="message" class="loading-message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: '로딩 중...'
  },
  type: {
    type: String,
    default: 'full',
    validator: (value) => ['full', 'content', 'inline'].includes(value)
  }
});
</script>

<style scoped>
.loading-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 9999;
}

.full-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.content-only {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

.inline {
  padding: 1rem;
  border-radius: 0.5rem;
  background: rgba(0, 0, 0, 0.3);
}

.spinner-container {
  position: relative;
  width: 60px;
  height: 60px;
}

.spinner-outer {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-inner {
  position: absolute;
  top: 15%;
  left: 15%;
  width: 70%;
  height: 70%;
  border: 4px solid transparent;
  border-top-color: #e74c3c;
  border-radius: 50%;
  animation: spin 0.8s linear infinite reverse;
}

.film-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 1.2rem;
  animation: pulse 2s infinite;
}

.loading-message {
  margin-top: 1rem;
  color: white;
  font-size: 0.9rem;
  text-align: center;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>