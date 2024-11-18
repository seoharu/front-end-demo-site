<template>
  <div class="filter-group">
    <label class="filter-label">개봉년도</label>
    <select v-model="selectedYear" @change="$emit('change', selectedYear)" class="filter-select">
      <option value="">전체</option>
      <option v-for="year in years" :key="year" :value="year">
        {{ year }}
      </option>
    </select>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'YearFilter',
  emits: ['change'],

  setup() {
    const currentYear = new Date().getFullYear()
    const years = Array.from({length: 30}, (_, i) => currentYear - i)
    const selectedYear = ref('')

    return { years, selectedYear }
  }
}
</script>

<style scoped>

@import '@/assets/styles/filter.css';

</style>