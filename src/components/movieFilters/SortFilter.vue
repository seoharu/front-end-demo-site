<!-- SortFilter.vue -->
<template>
  <div class="filter-group">
    <label class="filter-label">정렬</label>
    <select
      :value="selectedSort"
      @change="handleSortChange"
      class="filter-select"
    >
      <option value="popularity.desc">기본</option>
      <option
        v-for="option in sortOptions"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

interface SortOption {
  value: string;
  label: string;
}

export default defineComponent({
  name: 'SortFilter',

  props: {
    selectedSort: {
      type: String as PropType<string>,
      default: 'popularity.desc'
    }
  },

  emits: {
    change: (value: string) => true
  },

  setup(props, { emit }) {
    const sortOptions: SortOption[] = [
      { value: 'popularity.desc', label: '인기도 높은순' },
      { value: 'popularity.asc', label: '인기도 낮은순' },
      { value: 'vote_average.desc', label: '평점 높은순' },
      { value: 'vote_average.asc', label: '평점 낮은순' },
      { value: 'release_date.desc', label: '최신순' },
      { value: 'release_date.asc', label: '오래된순' },
    ]

    const handleSortChange = (event: Event) => {
      const target = event.target as HTMLSelectElement
      emit('change', target.value)
    }

    return {
      sortOptions,
      handleSortChange
    }
  }
})
</script>

<style scoped>
@import '@/assets/styles/filter.css';
</style>