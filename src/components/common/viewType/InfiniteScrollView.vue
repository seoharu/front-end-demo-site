<template>
  <div class="infinite-scroll-view" ref="scrollContainer">
    <!-- 영화 카드 그리드 -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6 bg-gray-100 rounded-lg shadow-md">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        @wishlist-updated="$emit('wishlist-updated', $event)"
        @show-detail="handleShowDetail"
        class="transition-transform transform hover:scale-105"
      />
    </div>

    <!-- 로딩 스피너 -->
    <Loading :loading="loading" message="더 많은 영화를 불러오는 중..." />

    <!-- 데이터 상태 메시지 -->
    <div
      v-if="!loading && !hasMore && movies.length > 0"
      class="text-center py-4 text-gray-600 font-semibold"
    >
      모든 영화를 불러왔습니다.
    </div>

    <!-- 관찰 대상 요소 -->
    <div v-if="hasMore" ref="observerTarget" class="h-20 w-full"></div>

    <!-- ScrollToTop 컴포넌트 (항상 고정된 위치) -->
    <ScrollToTop class="fixed bottom-8 right-8" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import MovieCard from "@/components/common/MovieCard.vue";
import Loading from "@/components/common/Loading.vue";
import ScrollToTop from "@/components/layout/ScrollToTop.vue";
import { useMovies } from "@/composables/useMovies";

// useMovies composable 사용
const {
  movies,
  loading,
  hasMore,
  fetchPopularMovies,
  loadMoreMovies
} = useMovies();

// 상세정보 표시 핸들러 추가
const handleShowDetail = (movie) => {
  // eslint-disable-next-line no-undef
  emit('show-detail', movie.id);
};


const handleScroll = () => {
  // 무한 스크롤 로직
  const scrollPosition = window.scrollY + window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  if (scrollPosition >= documentHeight - 100 && hasMore.value && !loading.value) {
    loadMoreMovies();
  }
};

// 영화 데이터를 초기 로드
onMounted(() => {
  fetchPopularMovies();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.infinite-scroll-view {
  overflow-y: auto;
  position: relative;
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.movie-item {
  margin-bottom: 10px;
}
button.fixed {
  bottom: 8px;
  right: 8px;
  z-index: 50;
  padding: 12px;
  border-radius: 50%;
  background-color: #e74c3c;
  color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  font-weight: bold;
  transition: all 0.3s ease;
}
button.fixed:hover {
  background-color: #c0392b;
  transform: scale(1.1);
}
</style>


