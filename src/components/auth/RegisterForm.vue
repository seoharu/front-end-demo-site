<template>
  <form class="auth-form" @submit.prevent="handleSubmit">
    <h2>회원가입</h2>
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
    <FormInput
      v-model="form.confirmPassword"
      type="password"
      placeholder="비밀번호 확인"
      :error="errors.confirmPassword"
    />
    <FormCheckbox
      v-model="form.agreement"
      label="이용약관에 동의합니다"
    />
    <FormButton :loading="isLoading">
      회원가입
    </FormButton>
    <button
      type="button"
      class="toggle-button"
      @click="$emit('toggle-auth')"
    >
      이미 계정이 있으신가요? 로그인
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import FormInput from '@/components/common/FormInput.vue'
import FormButton from '@/components/common/FormButton.vue'
import FormCheckbox from '@/components/common/FormCheckbox.vue'

const emit = defineEmits<{
  (e: 'toggle-auth'): void
  (e: 'register-success'): void
}>()

const isLoading = ref(false)

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

const errors = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

const handleSubmit = async () => {
  try {
    isLoading.value = true

    // 이메일 검증
    if (!form.email.includes('@')) {
      errors.email = '유효한 이메일을 입력해주세요'
      return
    }

    // 비밀번호 확인
    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = '비밀번호가 일치하지 않습니다'
      return
    }

    // 약관 동의 확인
    if (!form.agreement) {
      errors.confirmPassword = '이용약관에 동의해주세요'
      return
    }

    // TODO: 회원가입 로직 구현
    await new Promise(resolve => setTimeout(resolve, 1000))
    emit('register-success')

  } catch (error) {
    errors.password = '회원가입에 실패했습니다'
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



