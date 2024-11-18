<script>
export default {
  name: 'ScrollToTop',
  methods: {
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
  },
};
</script>

<template>
  <button
    @click="scrollToTop"
    class="scroll-to-top fixed bottom-8 right-8 z-50 p-4 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg transition-all duration-300 hover:scale-110"
    aria-label="Scroll to top"
  >
    Top
  </button>
</template>

<style scoped>
.scroll-to-top {
  bottom: 2rem;
  right: 2rem;
  position: fixed;
  z-index: 50;
  padding: 16px;
  border-radius: 50%;
  background-color: #e74c3c;
  color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  font-weight: bold;
  transition: all 0.3s ease;
}

.scroll-to-top:hover {
  background-color: #c0392b;
  transform: scale(1.1);
}
</style>
