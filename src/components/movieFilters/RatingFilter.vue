<template>
  <div class="filter-group">
    <label class="filter-label">최소 평점: {{ rating }}</label>
    <div class="rating-slider">
      <input
        type="range"
        v-model="rating"
        min="0"
        max="10"
        step="0.5"
        @input="$emit('change', rating)"
        class="slider"
      />
      <div class="rating-value">{{ rating }}</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'RatingFilter',
  emits: ['change'],

  setup() {
    const rating = ref(0)
    return { rating }
  }
}
</script>

<style scoped>

@import '@/assets/styles/filter.css';

</style>