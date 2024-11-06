
<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
    <transition-group
      name="ToastComponent"
      tag="div"
      class="space-y-2"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'px-4 py-3 rounded-lg shadow-lg max-w-sm flex items-center space-x-3 transform transition-all',
          getToastClasses(toast.type)
        ]"
        role="alert"
      >
        <!-- Toast Icon -->
        <span class="flex-shrink-0">
          <i :class="getToastIcon(toast.type)"></i>
        </span>

        <!-- Toast Message -->
        <p class="text-sm font-medium flex-grow">
          {{ toast.message }}
        </p>

        <!-- Close Button -->
        <button
          @click="removeToast(toast.id)"
          class="flex-shrink-0 ml-2 focus:outline-none hover:opacity-75 transition-opacity"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, defineExpose } from 'vue';

// Toast configurations
const TOAST_DURATION = 3000; // 3 seconds
const MAX_TOASTS = 3;

// Toast state
const toasts = ref([]);
let toastId = 0;

// Toast type configurations
const TOAST_TYPES = {
  success: {
    classes: 'bg-green-500 text-white',
    icon: 'fas fa-check-circle'
  },
  error: {
    classes: 'bg-red-500 text-white',
    icon: 'fas fa-exclamation-circle'
  },
  warning: {
    classes: 'bg-yellow-500 text-white',
    icon: 'fas fa-exclamation-triangle'
  },
  info: {
    classes: 'bg-blue-500 text-white',
    icon: 'fas fa-info-circle'
  }
};

// Methods
const getToastClasses = (type) => {
  return TOAST_TYPES[type]?.classes || TOAST_TYPES.info.classes;
};

const getToastIcon = (type) => {
  return TOAST_TYPES[type]?.icon || TOAST_TYPES.info.icon;
};

const addToast = (toast) => {
  const id = toastId++;
  toasts.value.push({
    id,
    ...toast
  });

  // Remove excess toasts
  if (toasts.value.length > MAX_TOASTS) {
    toasts.value.shift();
  }

  // Auto remove after duration
  setTimeout(() => {
    removeToast(id);
  }, TOAST_DURATION);
};

const removeToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
};

// Public method to show toast
const show = (message, type = 'info') => {
  addToast({ message, type });
};

// Expose show method to parent components
defineExpose({ show });
</script>

<style scoped>
/* Toast animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Ensure toasts stack properly */
.toast-move {
  transition: transform 0.3s ease;
}
</style>
