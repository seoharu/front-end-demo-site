<template>
  <div class="filter-group">
    <label class="filter-label">정렬</label>
    <select v-model="selectedSort" @change="handleSortChange" class="filter-select">
      <option value="">기본</option>
      <option v-for="option in sortOptions" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'SortFilter',
  data() {
    return {
      selectedSort: '',
      sortOptions: [
        { value: 'popularity.desc', label: '인기도 높은순' },
        { value: 'popularity.asc', label: '인기도 낮은순' },
        { value: 'vote_average.desc', label: '평점 높은순' },
        { value: 'vote_average.asc', label: '평점 낮은순' },
        { value: 'release_date.desc', label: '최신순' },
        { value: 'release_date.asc', label: '오래된순' }
      ]
    }
  },
  methods: {
    handleSortChange() {
      this.$emit('change', this.selectedSort)
    }
  }
}
</script>

<style scoped>
@import '@/assets/styles/filter.css';
</style>