<template>
  <div ref="gridContainer" class="table-view">
    <!-- 그리드 레이아웃으로 영화 카드 배치 -->
    <div class="movie-grid">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        @wishlist-updated="$emit('wishlist-updated', $event)"
        @show-detail="handleShowDetail"
        class="movie-card-animation"
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

  <!-- 포스터 상세 오버레이 -->
    <div
      v-if="selectedMovie"
      class="poster-overlay"
      :class="{ show: showOverlay }"
      @click="closeOverlay"
    >
      <div class="poster-content" @click.stop>
        <img
          :src="`https://image.tmdb.org/t/p/original${selectedMovie.poster_path}`"
          :alt="selectedMovie.title"
        />
        <div class="poster-info">
          <h2>{{ selectedMovie.title }}</h2>
          <p class="release-date">개봉일: {{ selectedMovie.release_date }}</p>
          <p class="rating" v-if="selectedMovie.vote_average">
            평점: {{ Number(selectedMovie.vote_average).toFixed(1) }}
          </p>
          <p class="overview">{{ selectedMovie.overview }}</p>
        </div>
        <button class="close-button" @click="closeOverlay">
          <i class="fas fa-times"></i>
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
    required: true,
    default: () => []  // 기본값 설정
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

// 포스터 오버레이 관련 상태 추가
const selectedMovie = ref(null);
const showOverlay = ref(false);

// 상세 정보 표시 핸들러
const handleShowDetail = (movie) => {
  selectedMovie.value = movie;
  showOverlay.value = true;
  document.body.style.overflow = 'hidden';
};

// 오버레이 닫기
const closeOverlay = () => {
  showOverlay.value = false;
  document.body.style.overflow = '';
  setTimeout(() => {
    selectedMovie.value = null;
  }, 300);
};

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

/* 포스터 오버레이 스타일 추가 */
.poster-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.poster-overlay.show {
  opacity: 1;
  visibility: visible;
}

.poster-content {
  position: relative;
  display: flex;
  max-width: 90vw;
  max-height: 90vh;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
}

.poster-content img {
  max-height: 90vh;
  object-fit: contain;
}

.poster-info {
  padding: 30px;
  min-width: 300px;
  max-width: 400px;
  overflow-y: auto;
}

.poster-info h2 {
  font-size: 24px;
  margin-bottom: 16px;
  color: #333;
}

.release-date, .rating {
  color: #666;
  margin-bottom: 16px;
}

.overview {
  line-height: 1.6;
  color: #444;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: rgba(0,0,0,0.7);
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .poster-content {
    flex-direction: column;
  }

  .poster-info {
    min-width: unset;
    max-width: unset;
    width: 100%;
  }
}
</style>
