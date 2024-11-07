<template>
  <header
    class="fixed top-0 w-full h-12 z-50 transition-all duration-300"
    :class="{
      'bg-black/80 shadow-lg': isScrolled,
      'bg-gradient-to-b from-black/80 to-transparent': !isScrolled
    }"
  >
    <nav class="container mx-auto px-4 h-full">
      <div class="flex items-center h-full">
        <!-- Logo -->
        <router-link to="/" class="flex items-center">
          <img src="@/assets/logo.png" alt="Logo" class="h-5 w-auto" />
        </router-link>

        <!-- Main Navigation -->
        <div class="flex items-center space-x-6 ml-6">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="text-white hover:text-red-500 transition-colors duration-200 text-sm"
            :class="{ 'text-red-500': $route.path === item.path }"
          >
            {{ item.name }}
          </router-link>
        </div>

        <!-- Right Side User Section -->
        <div class="ml-auto flex items-center relative">
          <button
            @click="handleUserClick"
            class="text-white p-1.5 hover:text-red-500 transition-colors duration-200"
          >
            <i class="fas fa-user text-lg"></i>
          </button>

          <!-- User Dropdown Menu -->
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 top-full mt-1 w-48 bg-black/95 rounded-md shadow-lg py-1"
            >
              <template v-if="isLoggedIn">
                <div class="px-4 py-1.5 text-white border-b border-gray-700 text-sm">
                  {{ currentUser }}
                </div>
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-1.5 text-white hover:bg-gray-800 transition-colors duration-200 text-sm"
                >
                  <i class="fas fa-sign-out-alt mr-2"></i>
                  로그아웃
                </button>
              </template>
              <template v-else>
                <router-link
                  to="/signin"
                  class="block px-4 py-1.5 text-white hover:bg-gray-800 transition-colors duration-200 text-sm"
                >
                  <i class="fas fa-sign-in-alt mr-2"></i>
                  로그인
                </router-link>
              </template>
            </div>
          </Transition>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

defineComponent({
  name: 'PageHeader'
})

const router = useRouter()
const {
  currentUser,
  isLoggedIn,
  logout,
  isScrolled,
  handleScroll,
  menuItems,
  checkAuth
} = useAuth()

const isUserMenuOpen = ref(false)

// 전역 클릭 이벤트 핸들러
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.ml-auto')) {
    isUserMenuOpen.value = false
  }
}

const handleUserClick = () => {
  if (isLoggedIn.value) {
    isUserMenuOpen.value = !isUserMenuOpen.value
  } else {
    router.push('/signin')
  }
}

const handleLogout = () => {
  logout()
  isUserMenuOpen.value = false
  router.push('/signin')
}

// 라우트 변경 감지
watch(() => router.currentRoute.value.path, () => {
  isUserMenuOpen.value = false
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('click', handleClickOutside)
  checkAuth()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}

@media (max-width: 640px) {
  .container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .flex.items-center.space-x-6 {
    gap: 0.75rem;
  }
}
</style>