// src/composables/useAuth.ts
import { ref, computed } from 'vue'
import { useValidation } from './useValidation'

interface User {
  id: string
  password: string // TMDB API Key
}

interface AuthResponse {
  success: boolean
  error?: string
}

export const useAuth = () => {
  const { validateLoginForm, validateRegisterForm } = useValidation()
  const currentUser = ref<string | null>(null)

  // 헤더를 위한 추가 상태
  const isScrolled = ref(false)
  const isMobileMenuOpen = ref(false)

  // 로그인 상태를 computed로 제공
  const isLoggedIn = computed(() => {
    return currentUser.value !== null && localStorage.getItem('TMDb-Key') !== null
  })

  const validateTMDbKey = async (apiKey: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=1`
      )
      return response.ok
    } catch {
      return false
    }
  }

  const login = async (form: {
    email: string
    password: string
    rememberMe: boolean
  }): Promise<AuthResponse> => {
    try {
      // 폼 유효성 검사
      const validation = validateLoginForm(form)
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        }
      }

      // 사용자 확인
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find(u => u.id === form.email && u.password === form.password)

      if (!user) {
        return {
          success: false,
          error: '이메일 또는 비밀번호가 일치하지 않습니다.'
        }
      }

      // TMDB API 키 검증
      const isValidKey = await validateTMDbKey(form.password)
      if (!isValidKey) {
        return {
          success: false,
          error: '유효하지 않은 TMDB API 키입니다.'
        }
      }

      // 로그인 정보 저장
      localStorage.setItem('TMDb-Key', form.password)
      localStorage.setItem('currentUser', form.email)
      if (form.rememberMe) {
        localStorage.setItem('keepLoggedIn', 'true')
      }

      currentUser.value = form.email
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: '로그인 중 오류가 발생했습니다.'
      }
    }
  }

  const register = async (form: {
    email: string
    password: string
    confirmPassword: string
    agreement: boolean
  }): Promise<AuthResponse> => {
    try {
      // 폼 유효성 검사
      const validation = validateRegisterForm(form)
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        }
      }

      // TMDB API 키 검증
      const isValidKey = await validateTMDbKey(form.password)
      if (!isValidKey) {
        return {
          success: false,
          error: '유효하지 않은 TMDB API 키입니다.'
        }
      }

      // 중복 사용자 확인
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]')
      if (users.some(user => user.id === form.email)) {
        return {
          success: false,
          error: '이미 등록된 이메일입니다.'
        }
      }

      // 새 사용자 등록
      users.push({
        id: form.email,
        password: form.password
      })
      localStorage.setItem('users', JSON.stringify(users))

      return { success: true }
    } catch (error) {
      console.error('Register error:', error)
      return {
        success: false,
        error: '회원가입 중 오류가 발생했습니다.'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('TMDb-Key')
    localStorage.removeItem('currentUser')
    localStorage.removeItem('keepLoggedIn')
    currentUser.value = null
    isMobileMenuOpen.value = false // 로그아웃 시 모바일 메뉴 닫기
  }

  const checkAuth = () => {
    const user = localStorage.getItem('currentUser')
    const keepLoggedIn = localStorage.getItem('keepLoggedIn')

    if (user && keepLoggedIn === 'true') {
      currentUser.value = user
      return true
    }
    return false
  }

  // 헤더를 위한 추가 메서드들
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 50
  }

  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
  }

  // 네비게이션 메뉴 아이템
  const menuItems = [
    { name: '홈', path: '/' },
    { name: '대세 콘텐츠', path: '/popular' },
    { name: '찾아보기', path: '/search' },
    { name: '내가 찜한 콘텐츠', path: '/wishlist' }
  ]

  // 인증이 필요한 라우트 체크
  const requireAuth = () => {
    if (!isLoggedIn.value) {
      return false
    }
    return true
  }

  return {
    currentUser,
    isLoggedIn,
    login,
    register,
    logout,
    checkAuth,
    requireAuth,
    // 헤더 관련 상태와 메서드들
    isScrolled,
    isMobileMenuOpen,
    handleScroll,
    toggleMobileMenu,
    closeMobileMenu,
    menuItems
  }
}