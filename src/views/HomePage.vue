<template>
  <div class="home min-h-screen bg-gray-900 w-full">
    <!-- 헤더 추가 -->
    <PageHeader />

    <!-- 로딩 상태 -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
    </div>

    <div v-else class="flex flex-col min-h-screen">
      <!-- 메인 배너 -->
      <FeaturedMovieBanner
        v-if="featuredMovie"
        :movie="featuredMovie"
        @show-detail="showMovieDetail"
        class="w-full"
      />

      <!-- 영화 섹션들 -->
      <div class="flex-grow">
        <TotalMovieSections
          @refresh="loadMovies"
          @show-detail="showMovieDetail"
          @featured-movie="setFeaturedMovie"
        />

      </div>

      <!-- 영화 상세 모달 -->
      <MovieDetailModal
        v-if="selectedMovie"
        :movie="selectedMovie"
        @close="selectedMovie = null"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      />
    </div>

    <!-- 스크롤 탑 버튼 -->
    <ScrollToTop class="fixed bottom-8 right-8 z-40"/>
  </div>
</template>

<script setup>
// 스크립트 부분은 그대로 유지
import { ref, onMounted, computed } from 'vue';
import movieService from '@/services/movieService';
import MovieDetailModal from "@/components/movie/MovieDetailModal.vue";
import ScrollToTop from "@/components/layout/ScrollToTop.vue";
import FeaturedMovieBanner from "@/components/home/FeaturedMovieBanner.vue";
import TotalMovieSections from "@/components/home/TotalMovieSections.vue";
import PageHeader from "@/components/layout/PageHeader.vue";
import { useWishlist } from '@/composables/useWishlist';

const loading = ref(true);
const featuredMovie = ref(null);
const selectedMovie = ref(null);

const { wishlist } = useWishlist();
const wishlistMovies = computed(() => wishlist.value);


const setFeaturedMovie = (movie) => {
  featuredMovie.value = movie;
};

const showMovieDetail = async (movie) => {
  console.log('showMovieDetail 호출됨', movie); // 디버깅 로그
  if (!movie?.id) {
    console.error('영화 ID가 없습니다');
    return;
  }

  try {
    console.log('API 호출 시작, movieId:', movie.id); // 디버깅 로그 2
    const movieDetails = await movieService.getMovieDetails(movie.id);
    console.log('API 응답:', movieDetails); // 디버깅 로그 3

    if (movieDetails) {
      selectedMovie.value = movieDetails;
      console.log('selectedMovie 설정됨:', selectedMovie.value); // 디버깅 로그 4
    } else {
      console.error('영화 상세 정보가 없습니다');
    }
  } catch (error) {
    console.error('영화 상세 정보 로딩 중 에러 발생:', error);
  }
};

const loadMovies = async () => {
  try {
    loading.value = true;
    const { data } = await movieService.getPopularMovies();
    if (data.results && data.results.length > 0) {
      featuredMovie.value = data.results[0];
    }
  } catch (error) {
    console.error('영화 데이터 로딩 실패:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadMovies();
});

const handleImageError = (e) => {
  e.target.src = '/placeholder-poster.jpg';
};

// movieService 확인
console.log('movieService:', movieService); // 디버깅 로그
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  background-color: rgb(17, 17, 17);  /* Netflix 스타일의 어두운 배경 */
}

/* 스크롤바 스타일링 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1f2937;
}

::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* 모바일 최적화 */
@media (max-width: 768px) {
  .home {
    padding-bottom: 4rem;
  }

  .movie-sections-container {
    margin-top: -50px;
  }

  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.5rem;
  }
}

/* 전환 효과 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.movie-card {
  position: relative;
  transform-origin: center center;
  transition: all 0.3s ease;
  cursor: pointer;
  z-index: 1; /* 기본 z-index 설정 */
}

.movie-card:hover {
  z-index: 200; /* 호버 시 높은 z-index 설정으로 다른 카드 위에 표시 */
  transform: scale(1.2);
}

.movie-card:hover .poster-overlay {
  z-index: 150; /* 포스터 오버레이도 다른 요소보다 위에 표시 */
}
</style>