<template>
  <div class="auth-container">
    <div class="auth-card" :class="{ 'flipped': isSignUp }">
      <div class="card-front">
        <LoginForm
          v-if="!isSignUp"
          @toggle-auth="toggleAuthMode"
          @login-success="handleLoginSuccess"
        />
      </div>
      <div class="card-back">
        <RegisterForm
          v-if="isSignUp"
          @toggle-auth="toggleAuthMode"
          @register-success="handleRegisterSuccess"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

// eslint-disable-next-line no-undef
defineOptions({
  name: 'SignIn'
})

const router = useRouter()
const isSignUp = ref(false)

const toggleAuthMode = () => {
  isSignUp.value = !isSignUp.value
}

const handleLoginSuccess = () => {
  router.push('/')
}

const handleRegisterSuccess = () => {
  isSignUp.value = false
}
</script>

<style scoped lang="scss">
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  perspective: 2000px;
}

.auth-card {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 500px;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &.flipped {
    transform: rotateY(180deg);
  }
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;

  // 유리 모핑 효과
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  // 입체감을 위한 그라데이션 테두리
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 16px;
    padding: 1px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 100%
    );
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }
}

.card-back {
  transform: rotateY(180deg);
}

// 폼 스타일
:deep(.auth-form) {
  h2 {
    text-align: center;
    margin-bottom: 24px;
    font-size: 24px;
    font-weight: 600;
    color: #1a1a1a;

    &::after {
      content: '';
      display: block;
      width: 40px;
      height: 2px;
      background: #3b82f6;
      margin: 8px auto 0;
      transition: width 0.3s ease;
    }
  }

  .toggle-button {
    position: relative;
    width: 100%;
    margin-top: 16px;
    padding: 12px;
    background: none;
    border: none;
    color: #3b82f6;
    font-size: 14px;
    cursor: pointer;
    overflow: hidden;
    transition: color 0.3s ease;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 150%;
      height: 150%;
      background: rgba(59, 130, 246, 0.1);
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0);
      transition: transform 0.4s ease;
    }

    &:hover {
      color: #2563eb;

      &::before {
        transform: translate(-50%, -50%) scale(1);
      }
    }
  }
}

// 입력 필드와 버튼에 대한 호버 효과
:deep(.form-input),
:deep(.form-button) {
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .auth-card {
    height: auto;
    min-height: 500px;
  }

  .card-front,
  .card-back {
    padding: 20px;
  }
}



</style>
