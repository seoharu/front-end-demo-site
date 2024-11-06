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
      :error="errors.agreement"
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
import { useAuth } from '@/composables/useAuth'

const { register } = useAuth()
// eslint-disable-next-line no-undef
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
  confirmPassword: '',
  agreement: ''
})

const handleSubmit = async () => {
  try {
    isLoading.value = true
    // 에러 초기화
    Object.keys(errors).forEach(key => {
      errors[key as keyof typeof errors] = ''
    })

    const result = await register(form)
    if (result.success) {
      emit('register-success')
    } else {
      // 에러 메시지에 따라 적절한 필드에 에러 표시
      if (result.error?.includes('이메일')) {
        errors.email = result.error
      } else if (result.error?.includes('비밀번호 확인')) {
        errors.confirmPassword = result.error
      } else if (result.error?.includes('비밀번호')) {
        errors.password = result.error
      } else if (result.error?.includes('약관')) {
        errors.agreement = result.error
      } else {
        // 기타 에러
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



