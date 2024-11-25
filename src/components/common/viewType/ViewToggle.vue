<template>
  <div class="view-toggle-container flex space-x-2">
    <button
      @click="changeView('table')"
      class="toggle-btn"
      :class="{ 'active': currentView === 'table' }"
    >
      <div class="btn-background" :class="{ 'show': currentView === 'table' }"></div>
      <i class="fas fa-table"></i>
    </button>
    <button
      @click="changeView('infinite')"
      class="toggle-btn"
      :class="{ 'active': currentView === 'infinite' }"
    >
      <div class="btn-background" :class="{ 'show': currentView === 'infinite' }"></div>
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

<style scoped>
.view-toggle-container {
  display: flex;
  gap: 10px;
  background: rgba(255, 255, 255, 0.05);
  padding: 5px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.toggle-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  color: #64748b;
}
.toggle-btn:hover {
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.1);
}

.toggle-btn.active {
  color: white;
}

.toggle-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px #3b82f6;
}

.btn-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-background.show {
  opacity: 1;
}

.toggle-btn i {
  position: relative;
  z-index: 1;
  font-size: 1.125rem;
  transition: transform 0.3s ease;
}
.toggle-btn:hover i {
  transform: translateY(-1px);
}

.toggle-btn:active {
  transform: translateY(1px);
}

@media (max-width: 640px) {
  .toggle-btn {
    width: 36px;
    height: 36px;
  }

  .toggle-btn i {
    font-size: 1rem;
  }
}
</style>