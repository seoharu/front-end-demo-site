// components/common/FilterBar.vue
<template>
  <div class="filter-bar bg-white p-4 rounded-lg shadow">
    <div class="flex flex-wrap gap-4">
      <!-- 필터링 옵션들 -->
      <div class="filter-group">
        <label class="block text-sm font-medium text-gray-700">장르</label>
        <select
          v-model="filters.genre"
          class="mt-1 block rounded-md border-gray-300"
          @change="handleFilterChange('genre')"
        >
          <option value="">전체</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label class="block text-sm font-medium text-gray-700">연도</label>
        <select
          v-model="filters.year"
          class="mt-1 block rounded-md border-gray-300"
          @change="handleFilterChange('year')"
        >
          <option value="">전체</option>
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label class="block text-sm font-medium text-gray-700">최소 평점</label>
        <select
          v-model="filters.rating"
          class="mt-1 block rounded-md border-gray-300"
          @change="handleFilterChange('rating')"
        >
          <option value="">전체</option>
          <option v-for="rating in ratings" :key="rating" :value="rating">
            {{ rating }}점 이상
          </option>
        </select>
      </div>

      <!-- SortingOptions 컴포넌트 사용 -->
      <div class="filter-group">
        <label class="block text-sm font-medium text-gray-700">정렬</label>
        <SortingOptions
          :initial-sort="initialSort"
          :initial-order="initialOrder"
          @sort-change="handleSortChange"
        />
      </div>

      <!-- 필터 초기화 버튼 -->
      <button
        v-if="hasActiveFilters"
        @click="resetFilters"
        class="self-end px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
      >
        <i class="fas fa-undo-alt mr-2"></i>
        필터 초기화
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useFilters } from "@/composables/useFiltering.ts";
import SortingOptions from '@/components/common/SortingOptions.vue';

const props = defineProps({
  initialSort: {
    type: String,
    default: 'date'
  },
  initialOrder: {
    type: String,
    default: 'desc'
  }
});

const emit = defineEmits(['filter-change']);

// useFilters composable 사용
const {
  filters,
  updateFilter,
  resetFilters,
  activeFilterCount
} = useFilters({ sort: props.initialSort });

// 필터 옵션들
const genres = ref([
  { id: 28, name: '액션' },
  { id: 12, name: '모험' },
  // ... 더 많은 장르들
]);

const years = computed(() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 20 }, (_, i) => currentYear - i);
});

const ratings = [5, 6, 7, 8, 9];

// 활성화된 필터 있는지 확인
const hasActiveFilters = computed(() => activeFilterCount.value > 0);

// 필터 변경 핸들러
const handleFilterChange = (filterType) => {
  emit('filter-change', filters.value);
};

// 정렬 변경 핸들러
const handleSortChange = ({ sortBy, order }) => {
  updateFilter('sort', sortBy);
  updateFilter('sortOrder', order);
  emit('filter-change', filters.value);
};

// 필터 초기화 핸들러
const handleResetFilters = () => {
  resetFilters();
  emit('filter-change', filters.value);
};
</script>