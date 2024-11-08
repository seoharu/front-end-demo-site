<script>
export default {
  name: 'ScrollToTop',
  data() {
    return {
      isVisible: false,
      scrollThreshold: 500 // 버튼이 나타나는 스크롤 위치
    }
  },
  mounted() {
    window.addEventListener('scroll', this.toggleVisibility)
  },
  unmounted() {
    window.removeEventListener('scroll', this.toggleVisibility)
  },
  methods: {
    toggleVisibility() {
      this.isVisible = window.scrollY > this.scrollThreshold
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<template>
  <Transition name="fade">
    <button
      v-show="isVisible"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-lg transition-all duration-300 hover:scale-110"
      aria-label="Scroll to top"
    >
      <i class="fas fa-arrow-up"></i>
    </button>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

button {
  /* Optional: Add hover animation */
  &:hover {
    transform: translateY(-2px);
  }
}

</style>