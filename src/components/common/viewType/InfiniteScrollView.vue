<template>
  <div class="infinite-scroll-view">
    <!-- 영화 그리드 -->
    <div class="movie-grid">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        @wishlist-updated="$emit('wishlist-updated', $event)"
        @show-detail="handleShowDetail"
        @click="showPosterOverlay(movie)"
        class="movie-card-animation"
      >

      <div class="action-buttons-container">
          <WishlistClick
            :movie="movie"
            class="action-button wishlist-button"
            @wishlist-updated="handleWishlistUpdate"
          />
          <button
            @click.stop="handleShowDetail(movie)"
            class="action-button info-button"
          >
            <i class="fas fa-info-circle"></i>
            <span>상세정보</span>
          </button>
      </div>
      </MovieCard>
    </div>

    <!-- 포스터 오버레이 -->
    <div
      v-if="selectedMovie"
      class="poster-overlay"
      :class="{ show: showOverlay }"
      @click="closePosterOverlay"
    >
      <div class="poster-content" @click.stop>
        <img
          :src="`https://image.tmdb.org/t/p/original${selectedMovie.poster_path}`"
          :alt="selectedMovie.title"
        />
        <div class="poster-info">
          <h2>{{ selectedMovie.title }}</h2>
          <p class="release-date">개봉일: {{ selectedMovie.release_date }}</p>
          <p class="overview">{{ selectedMovie.overview }}</p>
        </div>
        <button class="close-button" @click="closePosterOverlay">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- 로딩 스피너 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">새로운 영화를 탐색하는 중...</p>
    </div>

    <!-- 끝 메시지 -->
    <div
      v-if="!loading && !hasMore && movies.length > 0"
      class="end-message"
    >
      <i class="fas fa-check-circle"></i>
      <span>모든 영화를 불러왔습니다</span>
    </div>

    <!-- 맨 위로 버튼 -->
    <button
      v-show="showScrollTop"
      class="scroll-top-button"
      @click="scrollToTop"
      aria-label="맨 위로 스크롤"
    >
      <i class="fas fa-arrow-up"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import MovieCard from "@/components/common/MovieCard.vue";
import { useMovies } from "@/composables/useMovies";
import WishlistClick from "@/components/common/WishlistClick.vue";

const emit = defineEmits(['wishlist-updated', 'show-detail']);
const showScrollTop = ref(false);

// useMovies composable 사용
const {
  movies,
  loading,
  hasMore,
  fetchPopularMovies,
  loadMoreMovies
} = useMovies();

// 스크롤 핸들러
const handleScroll = () => {
  showScrollTop.value = window.scrollY > 500;

  // 무한 스크롤 로직
  const scrollPosition = window.scrollY + window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  if (scrollPosition >= documentHeight - 200 && hasMore.value && !loading.value) {
    loadMoreMovies();
  }
};

// 맨 위로 스크롤
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const handleShowDetail = (movie) => {
  emit('show-detail', movie.id);
};

// 포스터 오버레이 관련 상태
const selectedMovie = ref(null);
const showOverlay = ref(false);

// 포스터 오버레이 표시/숨김
const showPosterOverlay = (movie) => {
  selectedMovie.value = movie;
  showOverlay.value = true;
  document.body.style.overflow = 'hidden';
};

const closePosterOverlay = () => {
  showOverlay.value = false;
  document.body.style.overflow = '';
  setTimeout(() => {
    selectedMovie.value = null;
  }, 300);
};

// ESC 키로 오버레이 닫기
const handleKeyDown = (e) => {
  if (e.key === 'Escape' && showOverlay.value) {
    closePosterOverlay();
  }
};

// 초기 데이터 로드 및 이벤트 리스너 설정
onMounted(() => {
  fetchPopularMovies();
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('keydown', handleKeyDown);
  document.body.style.overflow = '';
});


</script>

<style scoped>
.infinite-scroll-view {
  min-height: 100vh;
  padding: 16px;
  margin-top: 50px;
  background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
  max-width: 2000px;
}

:deep(.movie-card) {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.movie-card {
  padding: 10px !important;
}
:deep(.movie-card img) {
  width: 100%;
  height: 60%;
  display: block;
  aspect-ratio: 2/3;
  object-fit: cover;
}

.movie-card-animation:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  padding: 8px;
  margin-bottom: 32px;
}

/* 반응형 그리드 */
@media (min-width: 1400px) {
  .movie-grid {
    grid-template-columns: repeat(5, 1fr);
    max-width: 1800px;
    margin: 0 auto;
    gap: 10px;
  }
}

@media (max-width: 1399px) {
  .movie-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 25px;
  }
}

@media (max-width: 1200px) {
  .movie-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
}

@media (max-width: 992px) {
  .movie-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .movie-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 10px;
  }
}

@media (max-width: 640px) {
  .movie-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }

  .content-wrapper {
    padding-left: 0.3rem;
    padding-right: 0.3rem;
  }

  h3 {
    font-size: 0.85rem;
    margin: 0.2rem 0;
    line-height: 1.1;
  }

  .action-buttons-container {
    padding: 4px;
    height: auto;
    min-height: 32px;
    bottom: 0;
  }

  .action-button {
    padding: 3px 5px;
    font-size: 0.65rem;
  }

  .movie-card-container {
    margin-bottom: 0.4rem;
  }

  .infinite-scroll-view {
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .movie-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }

  h3 {
    font-size: 0.8rem;
    margin: 0.20rem 0;
    line-height: 0.7;
  }

  .action-buttons-container {
    padding: 4px;
    min-height: 24px;
  }

  .action-button {
    padding: 3px 4px;
    font-size: 0.6rem;
  }

  .movie-card-container {
    margin-bottom: 0.3rem;
  }
}

/* 이미지 컨테이너에 대한 hover 효과 */
:deep(.movie-card:hover img) {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

/* 포스터 오버레이 스타일 */
.poster-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 80vh;
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
  max-height: 50vh;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
}

.poster-content img {
  max-height: 50vh;
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

.release-date {
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

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 16px;
  color: #666;
  font-size: 0.9rem;
}

.end-message {
  text-align: center;
  padding: 32px;
  color: #666;
  font-size: 0.9rem;
}

.scroll-top-button {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 50;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.scroll-top-button:hover {
  background-color: #2980b9;
  transform: scale(1.1);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

.movie-card-container {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background-color: #141414;
  transition: transform 0.3s ease;
  aspect-ratio: 2/3;
  height: 1000px;
}

.action-btn {
  display: none !important;
}
/* 액션 버튼 컨테이너 스타일 */
.action-buttons-container {
  display: flex;
  flex-direction: row;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: space-between;
  gap: 4px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  height: 600px;
  z-index: 10;
}

.movie-card-container .action-buttons-container {
  opacity: 1;
  transform: translateY(0);
}

/* 액션 버튼 공통 스타일 */
.action-button {
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
  color: white;
}

/* 찜하기 버튼 스타일 */
:deep(.wishlist-button) {
  background: rgba(229, 9, 20, 0.9);
}

:deep(.wishlist-button:hover) {
  background: rgba(229, 9, 20, 1);
  transform: translateY(-2px);
}

:deep(.wishlist-button.is-wishlisted) {
  background: rgba(229, 9, 20, 0.7);
}

/* 상세정보 버튼 스타일 */
.info-button {
  background: rgba(255, 255, 255, 0.1);
}

.info-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* 버튼 아이콘 스타일 */
.action-button i {
  font-size: 1rem;
}

/* 모바일 최적화 */
@media (max-width: 640px) {
  .action-buttons-container {
    padding: 12px;
  }

  .action-button {
    padding: 6px;
    font-size: 0.8rem;
  }

  .action-button i {
    font-size: 0.9rem;
  }
}

/* 아주 작은 화면에서는 아이콘만 표시 */
@media (max-width: 480px) {
  .action-button span {
    display: none;
  }

  .action-button i {
    margin: 0;
  }

  .action-button {
    padding: 8px;
  }
}

</style>