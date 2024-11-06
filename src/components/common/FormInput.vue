<script setup lang="ts">
// eslint-disable-next-line no-undef
defineProps<{
  modelValue: string
  type: string
  placeholder: string
  error?: string
}>()

// eslint-disable-next-line no-undef
defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="form-group">
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      class="form-input"
      :class="{ 'error': error }"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<style scoped lang="scss">

.form-group {
  margin-bottom: 16px;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }

  &.error {
    border-color: #ef4444;
  }
}

.error-message {
  display: block;
  margin-top: 4px;
  color: #ef4444;
  font-size: 12px;
}
</style>