<template>
  <div class="view-toggle-container flex space-x-2">
    <button
      @click="changeView('table')"
      class="p-2 rounded transition-colors"
      :class="[
        currentView === 'table'
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 hover:bg-gray-300'
      ]"
    >
      <i class="fas fa-table"></i>
    </button>
    <button
      @click="changeView('infinite')"
      class="p-2 rounded transition-colors"
      :class="[
        currentView === 'infinite'
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 hover:bg-gray-300'
      ]"
    >
      <i class="fas fa-list"></i>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  initialView: {
    type: String,
    default: 'table'
  }
});

const emit = defineEmits(['viewType-changed']);

const currentView = ref(props.initialView);

const changeView = (view) => {
  currentView.value = view;
  emit('viewType-changed', view);
};
</script>
