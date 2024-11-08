<template>
  <div class="table-view">
    <!-- 그리드 레이아웃으로 영화 카드 배치 -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        @wishlist-updated="$emit('wishlist-updated')"
        @show-detail="$emit('show-detail', $event)"
      />
    </div>

    <!-- 페이지네이션 -->
    <div class="pagination flex justify-center items-center space-x-4 my-6">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        :class="[
          currentPage === 1
            ? 'bg-gray-300'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        ]"
      >
        <i class="fas fa-chevron-left"></i>
      </button>

      <div class="flex space-x-2">
        <template v-for="page in displayedPages" :key="page">
          <button
            v-if="page !== '...'"
            @click="changePage(page)"
            class="px-4 py-2 rounded transition-colors"
            :class="[
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            ]"
          >
            {{ page }}
          </button>
          <span v-else class="px-2 py-2">{{ page }}</span>
        </template>
      </div>

      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        :class="[
          currentPage === totalPages
            ? 'bg-gray-300'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        ]"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import MovieCard from './MovieCard.vue';

const props = defineProps({
  movies: {
    type: Array,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['page-changed', 'wishlist-updated', 'show-detail']);

// 페이지네이션에 표시할 페이지 번호 계산
const displayedPages = computed(() => {
  const delta = 2;
  const range = [];
  let left = props.currentPage - delta;
  let right = props.currentPage + delta + 1;

  // 처음과 마지막 페이지는 항상 표시
  for (let i = 1; i <= props.totalPages; i++) {
    if (i === 1 || i === props.totalPages || (i >= left && i < right)) {
      range.push(i);
    }
  }

  // 페이지 번호 사이에 ... 추가
  const rangeWithDots = [];
  let l;
  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
});

// 페이지 변경 핸들러
const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-changed', page);
  }
};
</script>


