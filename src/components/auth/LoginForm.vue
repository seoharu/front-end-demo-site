<template>
  <form class="auth-form" @submit.prevent="handleSubmit">
    <h2>로그인</h2>

    <FormInput
      v-model="form.email"
      type="email"
      placeholder="이메일"
      :error="errors.email"
    />

    <FormInput
      v-model="form.password"
      type="password"
      placeholder="비밀번호 (TMDB API Key)"
      :error="errors.password"
    />
    <FormCheckbox
      v-model="form.rememberMe"
      label="로그인 상태 유지"
    />

    <FormButton :loading="isLoading">
      로그인
    </FormButton>

    <button
      type="button"
      class="toggle-button"
      @click="$emit('toggle-auth')"
    >
      계정이 없으신가요? 회원가입
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import FormInput from '@/components/common/Form/FormInput.vue'
import FormButton from '@/components/common/Form/FormButton.vue'
import FormCheckbox from '@/components/common/Form/FormCheckbox.vue'
import { useAuth } from '@/composables/useAuth'

const { login } = useAuth()
// eslint-disable-next-line no-undef
const emit = defineEmits<{
  (e: 'toggle-auth'): void
  (e: 'login-success'): void
}>()

const isLoading = ref(false)

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  email: '',
  password: ''
})

const handleSubmit = async () => {
  try {
    isLoading.value = true
    errors.email = ''
    errors.password = ''

   const result = await login(form)
    if (result.success) {
      emit('login-success')
    } else {
      // 에러 메시지에 따라 적절한 필드에 에러 표시
      if (result.error?.includes('이메일')) {
        errors.email = result.error
      } else {
        errors.password = result.error
      }
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.auth-form {
  padding: 40px;

  h2 {
    text-align: center;
    margin-bottom: 24px;
    font-size: 24px;
    font-weight: 600;
  }
}

.toggle-button {
  width: 100%;
  margin-top: 16px;
  padding: 12px;
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
