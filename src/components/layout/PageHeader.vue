<template>
  <header
    class="fixed top-0 w-full h-16 z-50 bg-gray-700 shadow-lg transition-all duration-300"
    :class="{
      'bg-black/80 shadow-lg': isScrolled,
      'bg-gradient-to-b from-black/80 to-transparent': !isScrolled
    }"
  >
    <nav class="container mx-auto px-8 h-full flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center">
        <font-awesome-icon icon="fas fa-film" class="logo" />
      </router-link>

      <!-- Main Navigation -->
      <div class="movie-pages">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="movie-page"
          :class="{ 'text-red-500': $route.path === item.path }"
        >
          {{ item.name }}
        </router-link>
      </div>

      <!-- Right Side User Section -->
      <div class="right-side">
        <button
          @click="handleUserClick"
          v-if="isLoggedIn"
          class="text-white hover:text-red-500 transition-colors duration-200"
        >
          <font-awesome-icon icon="fas fa-user" class="text-lg" />
        </button>
        <router-link
          v-else
          to="/signin"
          class="text-white hover:text-red-500 transition-colors duration-200 text-sm flex items-center"
        >
          <font-awesome-icon icon="fas fa-sign-in-alt" class="mr-2" />
          로그인
        </router-link>

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
            <div class="px-4 py-1.5 text-white border-b border-gray-700 text-sm whitespace-nowrap">
              {{ currentUser }}
            </div>
            <button
              @click="handleLogout"
              class="w-full text-left px-4 py-1.5 text-white hover:bg-gray-800 transition-colors duration-200 text-sm"
            >
              <font-awesome-icon icon="fas fa-sign-out-alt" class="mr-2" />
              로그아웃
            </button>
          </div>
        </Transition>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFilm, faUser, faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons'

library.add(faFilm, faUser, faSignOutAlt, faSignInAlt)

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
  if (!target.closest('.relative')) {
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

  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 20px 4%;
  background-color: grey;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  transition: background-color 0.3s ease;
}

.logo {
  color: deepskyblue;
  cursor: pointer;
}
.logo:hover {
  color: #3b82f6;
}

.movie-pages {
  display: flex;
  flex-direction: row;
  text-align: left;
  align-items: flex-start;
  justify-content: left;
  gap: 50px;

}
.movie-page {
  text-decoration: none;
  white-space: nowrap;
  color: deepskyblue;
  cursor: pointer;
}
.movie-page:hover {
  color: #3b82f6;
}

.right-side {
  margin: auto 0;
  cursor: pointer;
}
.right-side:hover {
  color:#4b5563;
}
.flex.items-center {
  align-items: center;
}

.flex.items-center.space-x-8 {
  gap: 2rem;
}

.flex.items-center.space-x-4 {
  gap: 1.5rem;
}

button {
  outline: none;
  border: none;
  background: none;
  cursor: pointer;
}

@media (max-width: 640px) {
  .container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .flex.items-center.space-x-8 {
    gap: 1rem;
  }

  .flex.items-center.space-x-4 {
    gap: 0.75rem;
  }
}
</style>
