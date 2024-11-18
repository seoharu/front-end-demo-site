<template>
  <div class="flex items-center justify-center gap-2 my-4">
    <!-- 이전 페이지 그룹 -->
    <button
      v-if="showPrevGroup"
      @click="goToPage(startPage - 1)"
      class="pagination-button"
      aria-label="이전 페이지 그룹"
    >
      <i class="fas fa-chevron-left"></i>
    </button>

    <!-- 첫 페이지 -->
    <button
      v-if="startPage > 1"
      @click="goToPage(1)"
      class="pagination-button"
    >
      1
    </button>

     <!-- 첫 페이지 이후 줄임표 -->
    <span v-if="startPage > 2" class="px-2">...</span>

    <!-- 페이지 번호들 -->
    <button
      v-for="page in visiblePages"
      :key="page"
      @click="goToPage(page)"
      class="pagination-button"
      :class="{ 'bg-blue-500 text-white': page === currentPage }"
    >
      {{ page }}
    </button>

    <!-- 마지막 페이지 이전 줄임표 -->
    <span v-if="endPage < totalPages - 1" class="px-2">...</span>

    <!-- 마지막 페이지 -->
    <button
      v-if="endPage < totalPages"
      @click="goToPage(totalPages)"
      class="pagination-button"
    >
      {{ totalPages }}
    </button>

    <!-- 다음 페이지 그룹 -->
    <button
      v-if="showNextGroup"
      @click="goToPage(endPage + 1)"
      class="pagination-button"
      aria-label="다음 페이지 그룹"
    >
      <i class="fas fa-chevron-right"></i>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  visiblePages: {
    type: Number,
    default: 5
  }
});

const emit = defineEmits(['page-change']);

// 시작 페이지 계산
const startPage = computed(() => {
  const half = Math.floor(props.visiblePages / 2);
  let start = props.currentPage - half;

  if (start < 1) {
    start = 1;
  }

  if (start + props.visiblePages - 1 > props.totalPages) {
    start = Math.max(1, props.totalPages - props.visiblePages + 1);
  }

  return start;
});

// 끝 페이지 계산
const endPage = computed(() => {
  return Math.min(startPage.value + props.visiblePages - 1, props.totalPages);
});

// 보여질 페이지 번호들
const visiblePages = computed(() => {
  const pages = [];
  for (let i = startPage.value; i <= endPage.value; i++) {
    pages.push(i);
  }
  return pages;
});

// 이전/다음 그룹 버튼 표시 여부
const showPrevGroup = computed(() => startPage.value > 1);
const showNextGroup = computed(() => endPage.value < props.totalPages);

// 페이지 이동 함수
const goToPage = (page) => {
  if (page !== props.currentPage && page >= 1 && page <= props.totalPages) {
    emit('page-change', page);
  }
};
</script>

<style scoped>
.pagination-button {
  @apply px-3 py-1 rounded-md transition-colors duration-200
         hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.pagination-button.active {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}
</style>
