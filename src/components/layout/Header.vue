<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      { 'bg-black': isScrolled, 'bg-gradient-to-b from-black/70 to-transparent': !isScrolled }
    ]"
  >
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between py-4">
        <!-- Left: Logo & Navigation -->
        <div class="flex items-center space-x-8">
          <!-- Logo -->
          <router-link to="/" class="flex items-center">
            <i class="fas fa-tv text-red-600 text-3xl"></i>
          </router-link>

          <!-- Main Navigation -->
          <nav class="hidden md:flex items-center space-x-6">
            <router-link
              v-for="item in navigationItems"
              :key="item.path"
              :to="item.path"
              class="text-sm text-gray-300 hover:text-white transition-colors duration-200"
              :class="{ 'text-white font-medium': $route.path === item.path }"
            >
              {{ item.name }}
            </router-link>
          </nav>
        </div>

        <!-- Right: Account or Login -->
        <div class="flex items-center space-x-4">
          <!-- Search Button -->
          <button
            @click="$router.push('/search')"
            class="text-gray-300 hover:text-white transition-colors duration-200"
          >
            <i class="fas fa-search"></i>
          </button>

          <!-- Account Menu or Login Button -->
          <template v-if="isLoggedIn">
            <AccountMenu
              :user-email="userEmail"
              @logout="handleLogout"
            />
          </template>
          <template v-else>
            <router-link
              to="/signin"
              class="text-gray-300 hover:text-white transition-colors duration-200"
            >
              로그인
            </router-link>
          </template>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Button -->
    <button
      @click="isMobileMenuOpen = !isMobileMenuOpen"
      class="md:hidden fixed right-4 top-4 text-white"
    >
      <i :class="['fas', isMobileMenuOpen ? 'fa-times' : 'fa-bars']"></i>
    </button>

    <!-- Mobile Navigation -->
    <div
      v-show="isMobileMenuOpen"
      class="md:hidden fixed inset-0 top-16 bg-black/95 z-40"
    >
      <nav class="flex flex-col p-4">
        <router-link
          v-for="item in navigationItems"
          :key="item.path"
          :to="item.path"
          class="py-2 text-gray-300 hover:text-white transition-colors duration-200"
          @click="isMobileMenuOpen = false"
        >
          {{ item.name }}
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import AccountMenu from '@/components/auth/AccountMenu.vue';

const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false
  },
  userEmail: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['logout']);

const router = useRouter();
const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);

const navigationItems = [
  { name: '홈', path: '/' },
  { name: '대세 콘텐츠', path: '/popular' },
  { name: '찾아보기', path: '/search' },
  { name: '내가 찜한 리스트', path: '/wishlist' }
];

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0;
};

const handleLogout = () => {
  emit('logout');
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>