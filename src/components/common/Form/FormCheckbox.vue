<script setup lang="ts">
// eslint-disable-next-line no-undef
defineProps<{
  modelValue: boolean
  label: string
}>()

// eslint-disable-next-line no-undef
defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <div class="form-checkbox">
    <label class="checkbox-label">
      <input
        type="checkbox"
        :checked="modelValue"
        class="checkbox-input"
        @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      />
      <span class="label-text">{{ label }}</span>
    </label>
  </div>
</template>

<style scoped lang="scss">

.form-checkbox {
  margin-bottom: 16px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-input {
  margin-right: 8px;
}

.label-text {
  font-size: 14px;
  color: #4b5563;
}

</style>