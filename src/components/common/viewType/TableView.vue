<template>
  <div ref="gridContainer" class="table-view">
    <!-- 그리드 레이아웃으로 영화 카드 배치 -->
    <div class="movie-grid">
      <MovieCard
        v-for="movie in displayedMovies"
        :key="movie.id"
        :movie="movie"
        @wishlist-updated="$emit('wishlist-updated')"
        @show-detail="$emit('show-detail', movie.id)"
      />
    </div>

    <!-- 하단 페이지네이션 영역 -->
    <div class="pagination-container">
      <div class="navigation-buttons">
        <button
          @click="$emit('page-changed', 1)"
          :disabled="currentPage === 1"
          class="nav-btn"
        >
          <i class="fas fa-angle-double-left"></i>
        </button>
      </div>
      <!-- 페이지네이션 컴포넌트 추가 -->
      <PaginationNav
        :current-page="currentPage"
        :total-pages="totalPages"
        :visible-pages="10"
        @page-change="handlePageChange"
      />
      <div class="navigation-buttons">
        <button
          @click="$emit('page-changed', totalPages)"
          :disabled="currentPage === totalPages"
          class="nav-btn"
        >
          <i class="fas fa-angle-double-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import MovieCard from "@/components/common/MovieCard.vue"
import PaginationNav from "@/components/common/PaginationNav.vue"
// import { fetchMovies } from "@/utils/fetchMovies";

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
  // fetchUrl: {
  //   type: String,
  //   required: true
  // },
});

const emit = defineEmits(['page-changed', 'wishlist-updated', 'show-detail']);

const moviesPerPage = ref(20);
const isMobile = ref(window.innerWidth <= 768);

// 현재 페이지에 표시할 영화들
const displayedMovies = computed(() => {
  const itemsPerPage = 10;
  const startIndex = (props.currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return props.movies.slice(startIndex, endIndex);
});




</script>

<style scoped>
.table-view {
  padding: 2rem;
  min-height: calc(100vh - 64px);
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr); /* 8열 그리드 */
  gap: 1rem;
  margin-bottom: 2rem;
}

/* 반응형 그리드 */
@media (max-width: 1536px) {
  .movie-grid {
    grid-template-columns: repeat(6, 1fr); /* 6열 */
  }
}

@media (max-width: 1280px) {
  .movie-grid {
    grid-template-columns: repeat(5, 1fr); /* 5열 */
  }
}

@media (max-width: 1024px) {
  .movie-grid {
    grid-template-columns: repeat(4, 1fr); /* 4열 */
  }
}
@media (max-width: 768px) {
  .movie-grid {
    grid-template-columns: repeat(3, 1fr); /* 3열 */
  }
}

@media (max-width: 640px) {
  .movie-grid {
    grid-template-columns: repeat(2, 1fr); /* 2열 */
  }
}

/* 페이지네이션 스타일 */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
  background: grey;
  border-radius: 8px;
}

.navigation-buttons {
  display: flex;
  gap: 0.5rem;
}

.nav-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.nav-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* MovieCard 스타일 */
:deep(.movie-card) {
  aspect-ratio: 2/3;
  width: 100%;
  height: auto;
  transition: transform 0.2s;
}

:deep(.movie-card:hover) {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

/* 페이지네이션 컴포넌트 스타일 오버라이드 */
:deep(.pagination-button) {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

:deep(.pagination-button:hover) {
  background: rgba(255, 255, 255, 0.2);
}

:deep(.pagination-button.active) {
  background: #3b82f6;
}

:deep(.pagination-button:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}

</style>
