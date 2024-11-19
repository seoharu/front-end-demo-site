<template>
  <div class="filter-group">
    <label class="filter-label">개봉년도</label>
    <select
      v-model="selectedYear"
      @change="handleYearChange"
      class="filter-select"
    >
      <option value="">전체</option>
      <optgroup label="최근">
        <option
          v-for="year in recentYears"
          :key="year"
          :value="year"
        >
          {{ year }}년
        </option>
      </optgroup>
      <optgroup label="과거">
        <option
          v-for="year in pastYears"
          :key="year"
          :value="year"
        >
          {{ year }}년
        </option>
      </optgroup>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'YearFilter',

  data() {
    const currentYear = new Date().getFullYear()
    const recentYearCount = 10  // 최근 10년
    const pastYearCount = 10    // 과거 10년

    // 최근 연도 (현재 년도부터 내림차순)
    const recentYears = Array.from(
      { length: recentYearCount },
      (_, i) => currentYear - i
    )

    // 과거 연도 (10년 단위로)
    const pastYears = Array.from(
      { length: pastYearCount },
      (_, i) => currentYear - recentYearCount - (i * 10)
    )

    return {
      selectedYear: '',
      recentYears,
      pastYears
    }
  },

  emits: ['change'],

  methods: {
    handleYearChange() {
      const value = this.selectedYear === '' ? null : Number(this.selectedYear)
      this.$emit('change', value)
    }
  }
})
</script>

<style scoped>
@import '@/assets/styles/filter.css';
</style>