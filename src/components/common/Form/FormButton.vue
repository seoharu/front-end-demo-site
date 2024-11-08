<script setup lang="ts">
// eslint-disable-next-line no-undef
defineProps<{
  loading?: boolean
}>()
</script>

<template>
  <button
    class="form-button"
    :class="{ loading }"
    :disabled="loading"
  >
    <span v-if="!loading">
      <slot />
    </span>
    <span v-else class="loading-spinner" />
  </button>
</template>

<style scoped>
.form-button {
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }

  &.loading {
    background: #94a3b8;
  }
}
</style>