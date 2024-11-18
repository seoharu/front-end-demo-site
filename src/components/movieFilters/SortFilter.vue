<template>
  <div class="filter-group">
    <label class="filter-label">정렬</label>
    <select v-model="sortBy" @change="$emit('change', sortBy)" class="filter-select">
      <option value="popularity.desc">인기도 높은순</option>
      <option value="popularity.asc">인기도 낮은순</option>
      <option value="vote_average.desc">평점 높은순</option>
      <option value="vote_average.asc">평점 낮은순</option>
      <option value="release_date.desc">최신순</option>
      <option value="release_date.asc">오래된순</option>
    </select>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'SortFilter',
  emits: ['change'],

  setup() {
    const sortBy = ref('popularity.desc')
    return { sortBy }
  }
}
</script>

<style scoped>

@import '@/assets/styles/filter.css';

</style>