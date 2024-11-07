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
        <div class="container mx-auto px-4 py-8">
          <TotalMovieSections
            @refresh="loadMovies"
            @show-detail="showMovieDetail"
            @featured-movie="setFeaturedMovie"
          />
        </div>
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
import { ref, onMounted } from 'vue';
import movieService from '@/services/movieService';
import MovieDetailModal from "@/components/movie/MovieDetailModal.vue";
import ScrollToTop from "@/components/layout/ScrollToTop.vue";
import FeaturedMovieBanner from "@/components/home/FeaturedMovieBanner.vue";
import TotalMovieSections from "@/components/home/TotalMovieSections.vue";
import PageHeader from "@/components/layout/PageHeader.vue";

const loading = ref(true);
const featuredMovie = ref(null);
const selectedMovie = ref(null);

const setFeaturedMovie = (movie) => {
  featuredMovie.value = movie;
};

const showMovieDetail = async (movie) => {
  try {
    const { data } = await movieService.getMovieDetails(movie.id);
    selectedMovie.value = data;
  } catch (error) {
    console.error('영화 상세 정보 로딩 실패:', error);
  }
};

const loadMovies = async () => {
  try {
    loading.value = true;
    // 초기 인기 영화 데이터를 로드하여 featured movie 설정
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
</script>

<style scoped>

.container {
  width: 100%;

}

.home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}

/* 스크롤바 스타일링 (선택사항) */
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
</style>