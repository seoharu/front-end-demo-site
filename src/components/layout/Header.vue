<script>
import NavigationLinks from './navigation/NavigationLinks.vue'
import MobileNavigation from './navigation/MobileNavigation.vue'

export default {
  name: 'PageHeader',
  components: {
    NavigationLinks,
    MobileNavigation
  },
  data() {
    return {
      isScrolled: false,
      isMobileMenuOpen: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false
    }
  },
  watch: {
    '$route'() {
      this.closeMobileMenu()
    }
  }
}
</script>

<template>
  <header
    class="fixed top-0 w-full z-50 transition-all duration-300"
    :class="{'bg-black/80': isScrolled, 'bg-gradient-to-b from-black/80 to-transparent': !isScrolled}"
  >
    <nav class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <router-link to="/" class="flex items-center">
          <img src="@/assets/logo.png" alt="Logo" class="h-8" />
        </router-link>

      <!-- Desktop Navigation -->
        <NavigationLinks />

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden text-white"
          @click="toggleMobileMenu"
        >
          <i class="fas" :class="isMobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <MobileNavigation
        v-if="isMobileMenuOpen"
        @close="closeMobileMenu"
      />
    </nav>
  </header>
</template>

<style scoped>

</style>