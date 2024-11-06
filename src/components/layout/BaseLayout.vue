<script>
import PageHeader from './Header.vue'
import ScrollToTop from './ScrollToTop.vue'

export default {
  name: 'BaseLayout',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    PageHeader,
    ScrollToTop
  },
}
</script>

<template>
  <div class="app-layout min-h-screen bg-gray-900 text-white">
    <PageHeader />
    <main class="pt-16"> <!-- Header 높이만큼 padding-top -->
      <slot></slot>
    </main>
    <ScrollToTop />
  </div>
</template>

<style scoped lang="scss">
.app-layout {
  background-color: #141414;
}
</style>