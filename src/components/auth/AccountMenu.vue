<template>
  <div class="relative" ref="accountMenu">
    <template v-if="isLoggedIn">
      <button
        class="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-200"
        @click="toggleMenu"
      >
        <img
          src="/api/placeholder/32/32"
          alt="Profile"
          class="w-8 h-8 rounded"
        />
        <i :class="['fas fa-caret-down transition-transform duration-200',
          { 'rotate-180': isOpen }]">
        </i>
      </button>

      <!-- Dropdown Menu -->
      <div
        v-show="isOpen"
        class="absolute right-0 mt-2 w-48 bg-black/90 border border-gray-700 rounded-md shadow-lg py-1
               transform transition-all duration-200 origin-top-right"
        :class="{ 'scale-95 opacity-0': !isOpen, 'scale-100 opacity-100': isOpen }"
      >
        <button
          @click="handleLogout"
          class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white
                 transition-colors duration-200"
        >
          <i class="fas fa-sign-out-alt mr-2"></i>
          로그아웃
        </button>
      </div>
    </template>

    <!-- Login Button when not logged in -->
    <router-link
      v-else
      to="/signin"
      class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
    >
      로그인
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'AccountMenu',
  props: {
    isLoggedIn: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isOpen: false
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen
    },
    handleClickOutside(event) {
      if (!this.$refs.accountMenu.contains(event.target)) {
        this.isOpen = false
      }
    },
    handleLogout() {
      this.isOpen = false
      this.$emit('logout')
    }
  }
}
</script>