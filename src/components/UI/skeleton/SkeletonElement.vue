<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'text' | 'title' | 'button' | 'input' | 'checkbox'
  width?: string | number
  height?: string | number
  centered?: boolean
}

// eslint-disable-next-line no-undef
const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  width: 'auto',
  height: 'auto',
  centered: false
})

const computedWidth = computed(() => {
  if (typeof props.width === 'number') return `${props.width}px`
  return props.width
})

const computedHeight = computed(() => {
  if (typeof props.height === 'number') return `${props.height}px`
  return props.height
})

const borderRadius = computed(() => {
  switch (props.type) {
    case 'button':
      return '8px'
    case 'input':
      return '8px'
    default:
      return '4px'
  }
})

</script>

<template>
  <div
    class="skeleton-element"
    :style="{
      width: computedWidth,
      height: computedHeight,
      borderRadius: borderRadius
    }"
    :class="[type, { 'centered': centered }]"
  ></div>
</template>

<style scoped lang="scss">
.skeleton-element {
  background: linear-gradient(
    90deg,
    #f3f4f6 0%,
    #e5e7eb 50%,
    #f3f4f6 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;

  &.centered {
    margin: 0 auto;
  }

  &.title {
    height: 32px;
  }

  &.text {
    height: 20px;
  }

  &.button {
    height: 48px;
  }
  &.input {
    height: 48px;
  }

  &.checkbox {
    height: 24px;
    width: 120px;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@media (prefers-color-scheme: dark) {
  .skeleton-element {
    background: linear-gradient(
      90deg,
      #374151 0%,
      #4b5563 50%,
      #374151 100%
    );
  }
}
</style>
