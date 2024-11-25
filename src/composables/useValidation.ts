// src/composables/useValidation.ts
interface ValidationResponse {
  isValid: boolean
  error?: string
}

export const useValidation = () => {
  const validateEmail = (email: string): ValidationResponse => {
    if (!email) {
      return {
        isValid: false,
        error: '이메일을 입력해주세요.'
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        error: '유효한 이메일 형식이 아닙니다.'
      }
    }

    return { isValid: true }
  }

  const validatePassword = (password: string): ValidationResponse => {
    if (!password) {
      return {
        isValid: false,
        error: '비밀번호를 입력해주세요.'
      }
    }

    // TMDB API 키는 보통 32자리 문자열입니다
    if (password.length < 20) {
      return {
        isValid: false,
        error: '유효한 TMDB API 키를 입력해주세요.'
      }
    }

    return { isValid: true }
  }

  const validatePasswordConfirm = (password: string, confirmPassword: string): ValidationResponse => {
    if (!confirmPassword) {
      return {
        isValid: false,
        error: '비밀번호 확인을 입력해주세요.'
      }
    }

    if (password !== confirmPassword) {
      return {
        isValid: false,
        error: '비밀번호가 일치하지 않습니다.'
      }
    }

    return { isValid: true }
  }

  const validateAgreement = (agreed: boolean): ValidationResponse => {
    if (!agreed) {
      return {
        isValid: false,
        error: '이용약관에 동의해주세요.'
      }
    }

    return { isValid: true }
  }

  const validateLoginForm = (form: { email: string; password: string }) => {
    const emailValidation = validateEmail(form.email)
    if (!emailValidation.isValid) return emailValidation

    const passwordValidation = validatePassword(form.password)
    if (!passwordValidation.isValid) return passwordValidation

    return { isValid: true }
  }

  const validateRegisterForm = (form: {
    email: string
    password: string
    confirmPassword: string
    agreement: boolean
  }) => {
    const emailValidation = validateEmail(form.email)
    if (!emailValidation.isValid) return emailValidation

    const passwordValidation = validatePassword(form.password)
    if (!passwordValidation.isValid) return passwordValidation

    const confirmValidation = validatePasswordConfirm(form.password, form.confirmPassword)
    if (!confirmValidation.isValid) return confirmValidation

    const agreementValidation = validateAgreement(form.agreement)
    if (!agreementValidation.isValid) return agreementValidation

    return { isValid: true }
  }

  return {
    validateEmail,
    validatePassword,
    validatePasswordConfirm,
    validateAgreement,
    validateLoginForm,
    validateRegisterForm
  }
}