<script>
export default {
  name: 'MobileNavigation',
  data() {
    return {
      navigationItems: [
        { name: '홈', path: '/' },
        { name: '대세 콘텐츠', path: '/popular' },
        { name: '찾아보기', path: '/search' },
        { name: '내가 찜한 콘텐츠', path: '/wishlist' }
      ]
    }
  },
  methods: {
    isCurrentRoute(path) {
      return this.$route.path === path
    }
  }
}
</script>

<template>
  <div class="md:hidden">
    <div class="px-2 pt-2 pb-3 space-y-1">
      <router-link
        v-for="item in navigationItems"
        :key="item.path"
        :to="item.path"
        class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
        :class="{ 'bg-gray-700 text-white': isCurrentRoute(item.path) }"
        @click="$emit('close')"
      >
        {{ item.name }}
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

</style>