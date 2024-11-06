<template>
  <header
    :class="['fixed w-full z-50 transition-all duration-500',
      isScrolled ? 'bg-black' : 'bg-gradient-to-b from-black/70 to-transparent']"
    :style="`opacity: ${headerOpacity}`"
  >
    <div class="flex items-center justify-between px-12 py-4">
      <!-- Left Side: Logo and Navigation -->
      <div class="flex items-center">
        <!-- Logo -->
        <router-link
          to="/"
          class="mr-8 transition-transform duration-300 hover:scale-105"
        >
          <i class="fas fa-tv text-red-600 text-3xl"></i>
        </router-link>

        <!-- Main Navigation -->
        <nav class="flex items-center space-x-6">
          <router-link
            v-for="route in routes"
            :key="route.path"
            :to="route.path"
            class="text-sm transition-all duration-200 relative group"
            :class="[$route.path === route.path ? 'text-white font-medium' : 'text-gray-300 hover:text-white']"
          >
            {{ route.name }}
            <!-- Underline animation -->
            <span
              class="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"
              :class="{ 'w-full': $route.path === route.path }"
            ></span>
          </router-link>
        </nav>
      </div>

      <!-- Right Side: Account Info & Menu -->
      <div class="flex items-center space-x-4">
        <!-- User ID display when logged in -->
        <span v-if="isLoggedIn" class="text-gray-300 text-sm">
          {{ userId }}
        </span>

        <!-- Account Menu -->
        <AccountMenu
          :is-logged-in="isLoggedIn"
          @logout="handleLogout"
        />
      </div>
    </div>
  </header>
</template>

<script>
import AccountMenu from '@/auth/AccountMenu.vue'

export default {
  name: 'PageHeader',
  components: {
    AccountMenu
  },
  data() {
    return {
      isScrolled: false,
      scrollPosition: 0,
      routes: [
        { name: '홈', path: '/' },
        { name: '대세 콘텐츠', path: '/popular' },
        { name: '찾아보기', path: '/search' },
        { name: '내가 찜한 리스트', path: '/wishlist' }
      ],
      userId: '',
      isLoggedIn: false
    }
  },
  computed: {
    headerOpacity() {
      // 스크롤 위치에 따라 투명도 계산 (0.6 ~ 1)
      return Math.min(1, Math.max(0.6, this.scrollPosition / 300))
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.checkLoginStatus()
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.scrollPosition = window.scrollY
      this.isScrolled = this.scrollPosition > 0
    },
    checkLoginStatus() {
      const user = localStorage.getItem('user')
      if (user) {
        const userData = JSON.parse(user)
        this.userId = userData.email
        this.isLoggedIn = true
      }
    },
    handleLogout() {
      localStorage.removeItem('TMDb-Key')
      localStorage.removeItem('user')
      this.isLoggedIn = false
      this.userId = ''
      this.$router.push('/signin')
    }
  }
}
</script>

<style scoped>
.router-link-enter-active,
.router-link-leave-active {
  transition: all 0.3s ease;
}

.router-link-enter-from,
.router-link-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

header {
  animation: fadeIn 0.5s ease-out;
}
</style>