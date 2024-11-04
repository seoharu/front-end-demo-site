import { ref } from 'vue'

interface User {
  email: string;
  apiKey: string;  // TMDB API Key를 비밀번호로 사용
}

interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  agreement: boolean;
}

export function useAuth() {
  const isAuthenticated = ref(false)
  const currentUser = ref<User | null>(null)

  // 초기 인증 상태 체크
  const initAuth = () => {
    const savedUser = localStorage.getItem('currentUser')
    const savedToken = localStorage.getItem('TMDb-Key')

    if (savedUser && savedToken) {
      currentUser.value = JSON.parse(savedUser)
      isAuthenticated.value = true
    }
  }

  // 로그인
  const login = async (form: LoginForm): Promise<{ success: boolean; error?: string }> => {
    try {
      // 사용자 확인
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find((u: User) => u.email === form.email)

      if (!user) {
        throw new Error('사용자를 찾을 수 없습니다')
      }

      if (user.apiKey !== form.password) {
        throw new Error('비밀번호(API Key)가 일치하지 않습니다')
      }

      // 로그인 성공 처리
      currentUser.value = user
      isAuthenticated.value = true

      // 로컬 스토리지에 저장
      localStorage.setItem('currentUser', JSON.stringify(user))
      localStorage.setItem('TMDb-Key', user.apiKey)

      if (form.rememberMe) {
        localStorage.setItem('rememberMe', 'true')
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '로그인에 실패했습니다'
      }
    }
  }

  // 회원가입
  const register = async (form: RegisterForm): Promise<{ success: boolean; error?: string }> => {
    try {
      // 이메일 중복 체크
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      if (users.some((u: User) => u.email === form.email)) {
        throw new Error('이미 등록된 이메일입니다')
      }

      // 비밀번호 확인
      if (form.password !== form.confirmPassword) {
        throw new Error('비밀번호가 일치하지 않습니다')
      }

      // 약관 동의 확인
      if (!form.agreement) {
        throw new Error('이용약관에 동의해주세요')
      }

       // 새 사용자 추가
      const newUser: User = {
        email: form.email,
        apiKey: form.password
      }

      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '회원가입에 실패했습니다'
      }
    }
  }

  // 로그아웃
  const logout = () => {
    currentUser.value = null
    isAuthenticated.value = false
    localStorage.removeItem('currentUser')
    localStorage.removeItem('TMDb-Key')
    localStorage.removeItem('rememberMe')
  }

  // 사용자 정보 가져오기
  const getUserInfo = () => {
    return currentUser.value
  }

  // API 키 가져오기
  const getApiKey = () => {
    return localStorage.getItem('TMDb-Key')
  }

  // 앱 시작 시 인증 상태 초기화
  initAuth()

  return {
    isAuthenticated,
    currentUser,
    login,
    register,
    logout,
    getUserInfo,
    getApiKey
  }
}


