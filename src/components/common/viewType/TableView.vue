<template>
  <div ref="gridContainer" class="table-view">
    <!-- 그리드 레이아웃으로 영화 카드 배치 -->
    <div class="movie-grid">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        @wishlist-updated="$emit('wishlist-updated', $event)"
        @show-detail="$emit('show-detail', $event)"
      />
    </div>

    <!-- 페이지네이션 -->
    <div v-if="movies.length > 0" class="pagination-container">
      <button
        @click="$emit('page-changed', 1)"
        :disabled="currentPage === 1"
        class="nav-btn"
      >
        <i class="fas fa-angle-double-left"></i>
      </button>

      <PaginationNav
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="page => $emit('page-changed', page)"
      />

      <button
        @click="$emit('page-changed', totalPages)"
        :disabled="currentPage === totalPages"
        class="nav-btn"
      >
        <i class="fas fa-angle-double-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
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

defineEmits(['page-changed', 'wishlist-updated', 'show-detail']);

const moviesPerPage = ref(20);
const isMobile = ref(window.innerWidth <= 768);



</script>

<style scoped>
.table-view {
  padding: 1rem;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5열 그리드 */
  gap: 1rem;
  margin-bottom: 2rem;
}

/* 반응형 그리드 */
@media (max-width: 1200px) {
  .movie-grid {
    grid-template-columns: repeat(4, 1fr); /* 4열 */
  }
  :deep(.movie-card) {
    max-width: 200px;
  }
}

@media (max-width: 960px) {
  .movie-grid {
    grid-template-columns: repeat(3, 1fr); /* 3열 */
  }
  :deep(.movie-card) {
    max-width: 180px;
  }
}

@media (max-width: 720px) {
  .movie-grid {
    grid-template-columns: repeat(2, 1fr); /* 2열 */
  }
  :deep(.movie-card) {
    max-width: 160px;
  }
}

@media (max-width: 480px) {
  .movie-grid {
    grid-template-columns: repeat(1, 1fr); /* 1열 */
  }
  :deep(.movie-card) {
    max-width: 200px;
  }
}

/* 페이지네이션 스타일 */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 7rem;
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
  width: 100%;
  aspect-ratio: 2/3; /* 포스터 비율 유지 */
  max-width: 240px; /* 최대 너비 제한 */
  margin: 0 auto; /* 카드 중앙 정렬 */
}

:deep(.movie-card img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.2s;
}

:deep(.movie-card:hover img) {
  transform: scale(1.05);
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
