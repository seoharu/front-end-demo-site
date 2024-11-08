<template>
  <div class="filter-bar bg-white p-4 rounded-lg shadow">
    <div class="flex flex-wrap gap-4">
      <!-- 장르 필터 -->
      <div class="filter-group">
        <label class="block text-sm font-medium text-gray-700">장르</label>
        <select
          v-model="filters.genre"
          class="mt-1 block w-40 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          @change="handleFilterChange('genre')"
        >
          <option value="">전체</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }}
          </option>
        </select>
      </div>

      <!-- 연도 필터 -->
      <div class="filter-group">
        <label class="block text-sm font-medium text-gray-700">연도</label>
        <select
          v-model="filters.year"
          class="mt-1 block w-32 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          @change="handleFilterChange('year')"
        >
          <option value="">전체</option>
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <!-- 평점 필터 -->
      <div class="filter-group">
        <label class="block text-sm font-medium text-gray-700">최소 평점</label>
        <div class="flex items-center gap-2">
          <select
            v-model="filters.rating"
            class="mt-1 block w-32 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            @change="handleFilterChange('rating')"
          >
            <option value="">전체</option>
            <option v-for="rating in ratings" :key="rating" :value="rating">
              {{ rating }}점 이상
            </option>
          </select>
          <div v-if="filters.rating" class="text-sm text-gray-500">
            <i class="fas fa-star text-yellow-400"></i>
            {{ filters.rating }}
          </div>
        </div>
      </div>

      <!-- 정렬 옵션 -->
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
        @click="handleResetFilters"
        class="self-end px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200 ease-in-out rounded-md hover:bg-gray-100"
      >
        <i class="fas fa-undo-alt mr-2"></i>
        필터 초기화 ({{ activeFilterCount }})
      </button>
    </div>

    <!-- 활성 필터 표시 -->
    <div v-if="hasActiveFilters" class="mt-4 flex flex-wrap gap-2">
      <div
        v-for="(value, key) in activeFilters"
        :key="key"
        class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
      >
        {{ getFilterLabel(key, value) }}
        <button
          class="ml-2 text-blue-600 hover:text-blue-800"
          @click="() => updateFilter(key, null)"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useFilters } from "@/composables/useFiltering";
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

const {
  filters,
  updateFilter,
  resetFilters,
  activeFilterCount
} = useFilters({ sort: props.initialSort });

// 장르 데이터
const genres = ref([
  { id: 28, name: '액션' },
  { id: 12, name: '모험' },
  { id: 16, name: '애니메이션' },
  { id: 35, name: '코미디' },
  { id: 80, name: '범죄' },
  // ... 추가 장르
]);

// 연도 옵션 생성
const years = computed(() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 20 }, (_, i) => currentYear - i);
});

const ratings = [5, 6, 7, 8, 9];

// 활성화된 필터 표시를 위한 computed 속성
const activeFilters = computed(() => {
  return Object.entries(filters.value).reduce((acc, [key, value]) => {
    if (value !== null && key !== 'sortOrder') {
      acc[key] = value;
    }
    return acc;
  }, {});
});

const hasActiveFilters = computed(() => activeFilterCount.value > 0);

// 필터 라벨 생성 함수
const getFilterLabel = (key, value) => {
  switch (key) {
    case 'genre':
      return `장르: ${genres.value.find(g => g.id === value)?.name}`;
    case 'year':
      return `연도: ${value}`;
    case 'rating':
      return `평점: ${value}점 이상`;
    case 'sort':
      return `정렬: ${getSortLabel(value)}`;
    default:
      return '';
  }
};

const getSortLabel = (sort) => {
  const labels = {
    popularity: '인기순',
    rating: '평점순',
    release_date: '개봉일순',
    title: '제목순'
  };
  return labels[sort] || '';
};

// 이벤트 핸들러
const handleFilterChange = (filterType) => {
  emit('filter-change', filters.value);
};

const handleSortChange = ({ sortBy, order }) => {
  updateFilter('sort', sortBy);
  updateFilter('sortOrder', order);
  emit('filter-change', filters.value);
};

const handleResetFilters = () => {
  resetFilters();
  emit('filter-change', filters.value);
};
</script>

<style scoped>
.filter-group {
  @apply flex-1 min-w-[200px];
}

select {
  @apply cursor-pointer;
}

button {
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}
</style>