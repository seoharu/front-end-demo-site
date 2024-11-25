<template>
  <div class="auth-container">
    <div class="auth-card" :class="{ 'flipped': isSignUp }">

      <div class="card-front">
        <div class="logo-section">
          <h1>MOVIES</h1>
          <p>Welcome back to movies</p>
        </div>
        <LoginForm
          v-if="!isSignUp"
          @toggle-auth="toggleAuthMode"
          @login-success="handleLoginSuccess"
        />
      </div>
      <div class="card-back">
        <div class="logo-section">
          <h1>JOIN US</h1>
          <p>Create your account</p>
        </div>
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
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  perspective: 2000px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 150%;
    height: 150%;
    background: radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
    animation: pulse 15s infinite;
  }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 0.3; }
  100% { transform: scale(1); opacity: 0.5; }
}

.auth-card {
  position: relative;
  width: 100%;
  max-width: 420px;
  height: 600px;
  transform-style: preserve-3d;
  transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);

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
  border-radius: 24px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

.card-back {
  transform: rotateY(180deg);
}

.logo-section {
  text-align: center;
  margin-bottom: 2.5rem;

  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 2px;
    margin-bottom: 0.5rem;
  }

  p {
    color: #64748b;
    font-size: 1.1rem;
  }
}

:deep(.auth-form) {
  h2 {
    display: none;
  }

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #1e293b;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;

      &:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        outline: none;
      }
    }
  }

  .form-button {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
    }
  }

  .toggle-button {
    width: 100%;
    margin-top: 1.5rem;
    padding: 1rem;
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    border: none;
    border-radius: 12px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(59, 130, 246, 0.15);
      transform: translateY(-2px);
    }
  }
}

@media (max-width: 480px) {
 .auth-card {
   height: auto;
   min-height: 580px;
   width: 90%; // Added
   max-width: 360px; // Added
 }

 .card-front,
 .card-back {
   padding: 20px 15px; // Modified
 }

 .logo-section {
   margin-bottom: 1.5rem; // Reduced

   h1 {
     font-size: 2rem; // Smaller
     margin-bottom: 0.3rem; // Added
   }

   p {
     font-size: 0.9rem; // Smaller
   }
 }

 :deep(.auth-form) {
   .form-group {
     margin-bottom: 1rem; // Reduced

     label {
       font-size: 0.9rem; // Added
     }

     input {
       padding: 0.6rem 0.8rem; // Smaller
       font-size: 0.9rem; // Smaller
     }
   }

   .form-button {
     padding: 0.8rem; // Smaller
     font-size: 0.9rem; // Smaller
   }

   .toggle-button {
     margin-top: 1rem; // Reduced
     padding: 0.8rem; // Smaller
     font-size: 0.85rem; // Smaller
   }
 }
}

@media (max-width: 360px) { // Added smaller breakpoint
 .auth-card {
   min-height: 540px;
 }

 .logo-section h1 {
   font-size: 1.8rem;
 }
}
</style>
