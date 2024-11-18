<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import MovieCard from "@/components/common/MovieCard.vue";
import { useMovies } from "@/composables/useMovies";

const emit = defineEmits(['wishlist-updated', 'show-detail']);
const showScrollTop = ref(false);

// Props 정의
const props = defineProps({
  movies: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  hasMore: {
    type: Boolean,
    default: true
  }
});

// 스크롤 핸들러
const handleScroll = () => {
  showScrollTop.value = window.scrollY > 500;

  // 무한 스크롤 로직
  const scrollPosition = window.scrollY + window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  if (scrollPosition >= documentHeight - 200 && props.hasMore && !props.loading) {
    emit('load-more');
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

// 이벤트 리스너 설정/해제
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

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
        class="movie-card-animation"
      />
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

<style scoped>
.infinite-scroll-view {
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
  padding: 20px;
  margin-bottom: 32px;
}

/* 반응형 그리드 */
@media (min-width: 1400px) {
  .movie-grid {
    grid-template-columns: repeat(6, 1fr);
    max-width: 1800px;
    margin: 0 auto;
    gap: 30px;
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

@media (max-width: 480px) {
  .movie-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 8px;
  }

  .infinite-scroll-view {
    padding: 12px;
  }
}

/* MovieCard 스타일 개선 */
:deep(.movie-card) {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

:deep(.movie-card img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 2/3;
  transition: transform 0.3s ease;
}

.movie-card-animation {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
}

.movie-card-animation:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
}

:deep(.movie-card:hover img) {
  transform: scale(1.05);
}

/* 컨테이너 최대 너비 설정 */
.infinite-scroll-view {
  max-width: 2000px;
  margin: 0 auto;
}

/* 나머지 스타일은 동일하게 유지 */
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
</style>