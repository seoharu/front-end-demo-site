// components/common/SortingOptions.vue
<template>
  <div class="sorting-options">
    <div class="flex items-center space-x-4">
      <!-- 정렬 기준 선택 -->
      <select
        v-model="selectedSort"
        @change="handleSortChange"
        class="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option
          v-for="option in sortOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- 정렬 방향 토글 -->
      <button
        @click="toggleOrder"
        class="px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
        :title="isAscending ? '오름차순' : '내림차순'"
      >
        <i
          class="fas"
          :class="isAscending ? 'fa-sort-up' : 'fa-sort-down'"
        ></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

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

const emit = defineEmits(['sort-change']);

// 정렬 옵션 정의
const sortOptions = [
  { value: 'date', label: '등록일순' },
  { value: 'title', label: '제목순' },
  { value: 'rating', label: '평점순' },
  { value: 'release', label: '개봉일순' }
];

// 현재 정렬 상태
const selectedSort = ref(props.initialSort);
const isAscending = ref(props.initialOrder === 'asc');

// 정렬 변경 처리
const handleSortChange = () => {
  emitSortChange();
};

// 정렬 방향 토글
const toggleOrder = () => {
  isAscending.value = !isAscending.value;
  emitSortChange();
};

// 정렬 변경 이벤트 발생
const emitSortChange = () => {
  emit('sort-change', {
    sortBy: selectedSort.value,
    order: isAscending.value ? 'asc' : 'desc'
  });
};
</script>