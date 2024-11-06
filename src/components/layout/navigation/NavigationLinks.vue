<script>
export default {
  name: 'NavigationLinks',
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
  <div class="hidden md:flex items-center space-x-8">
    <router-link
      v-for="item in navigationItems"
      :key="item.path"
      :to="item.path"
      class="text-gray-300 hover:text-white transition-colors"
      :class="{ 'text-white': isCurrentRoute(item.path) }"
    >
      {{ item.name }}
    </router-link>
  </div>
</template>

<style scoped lang="scss">
.router-link-active {
  @apply text-white font-medium;
}
</style>