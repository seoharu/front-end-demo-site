<template>
  <div ref="gridContainer" class="table-view">
    <!-- 그리드 레이아웃으로 영화 카드 배치 -->
    <div :class="['grid', 'gap-4', 'p-4']" :style="{ gridTemplateColumns: `repeat(${rowSize}, 1fr)` }">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        @wishlist-updated="$emit('wishlist-updated')"
        @show-detail="handleShowDetail"
      />
    </div>

    <!-- 페이지네이션 컴포넌트 추가 -->
    <PaginationNav
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="changePage"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import MovieCard from "@/components/common/MovieCard.vue"
import PaginationNav from "@/components/common/PaginationNav.vue"
import { fetchMovies } from "@/utils/fetchMovies";

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
  },
  fetchUrl: {
    type: String,
    required: true
  },
});

const emit = defineEmits(['page-changed', 'wishlist-updated', 'show-detail']);

const gridContainer = ref(null);
const rowSize = ref(4);
const moviesPerPage = ref(20);
const isMobile = ref(window.innerWidth <= 768);

// 영화 데이터를 불러오는 함수 호출
const loadMovies = async () => {
  movies.value = await fetchMovies(props.fetchUrl, moviesPerPage.value);
};

// 페이지네이션 계산
const movies = computed(() => {
  const startIndex = (props.currentPage - 1) * moviesPerPage.value;
  const endIndex = startIndex + moviesPerPage.value;
  return props.movies.slice(startIndex, endIndex);
});

// 페이지 변경 핸들러
const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-changed', page);
  }
};

// 창 크기 변경에 따른 레이아웃 계산
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;
  calculateLayout();
};

const calculateLayout = () => {
  if (gridContainer.value) {
    const containerWidth = gridContainer.value.offsetWidth;
    const movieCardWidth = isMobile.value ? 90 : 200; // 모바일과 데스크탑에 따른 카드 크기
    const horizontalGap = isMobile.value ? 10 : 15;

    rowSize.value = Math.floor(containerWidth / (movieCardWidth + horizontalGap));
    moviesPerPage.value = rowSize.value * 3; // 예시로 3개의 행을 기준
  }
};

// 상세정보 표시 핸들러 추가
const handleShowDetail = (movie) => {
  emit('show-detail', movie.id);
};

// 컴포넌트가 마운트되었을 때와 언마운트될 때 처리
onMounted(() => {
  loadMovies();
  calculateLayout();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

</script>

<style scoped>
.table-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.grid {
  display: grid;
  width: 100%;
  gap: 20px;
}

.movie-card {
  transition: transform 0.3s ease-in-out;
}

.movie-card:hover {
  transform: scale(1.05);
}
</style>
