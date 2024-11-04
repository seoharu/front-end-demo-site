<template>
  <div class="auth-container">
    <div class="auth-wrapper" :class="{ 'slide-signup': isSignUp }">
      <LoginForm
        v-if="!isSignUp"
        @toggle-auth="toggleAuthMode"
        @login-success="handleLoginSuccess"
      />
      <RegisterForm
        v-else
        @toggle-auth="toggleAuthMode"
        @register-success="handleRegisterSuccess"
      />
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
}

.auth-wrapper {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
</style>
