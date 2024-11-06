<template>
  <MovieSection
    title="인기 영화"
    :movies="movies"
    :loading="loading"
    @wishlist-updated="$emit('refresh')"
    @show-detail="$emit('show-detail', $event)"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MovieSection from '@/components/movie/MovieSection.vue';
import movieService from '@/services/movieService.js';

const movies = ref([]);
const loading = ref(true);

// 수정된 emit 부분
const emit = defineEmits(['refresh', 'show-detail', 'featured-movie']);

const loadMovies = async () => {
  try {
    const { data } = await movieService.getPopularMovies();
    movies.value = data.results;

    // 첫 번째 영화를 featured movie로 설정
    if (movies.value.length > 0) {
      emit('featured-movie', movies.value[0]);
    }
  } catch (error) {
    console.error('인기 영화 로딩 실패:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadMovies();
});
</script>