<template>
  <div class="filter-group">
    <label class="filter-label">개봉년도</label>
    <select v-model="selectedYear" @change="handleYearChange" class="filter-select">
      <option value="">전체</option>
      <option v-for="year in years" :key="year" :value="year">
        {{ year }}년
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'YearFilter',
  data() {
    return {
      selectedYear: '',
      years: []
    }
  },
  created() {
    const currentYear = new Date().getFullYear();
    this.years = Array.from(
      { length: currentYear - 1900 + 1 },
      (_, i) => currentYear - i
    );
  },
  methods: {
    handleYearChange() {
      this.$emit('change', this.selectedYear)
    }
  }
}
</script>

<style scoped>
@import '@/assets/styles/filter.css';
</style>