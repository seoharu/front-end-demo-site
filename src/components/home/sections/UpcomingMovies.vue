<template>
  <MovieSlider
    v-if="movies.length > 0"
    :section="{
      title: '개봉 예정',
      movies: formatMovies(movies)
    }"
    @show-detail="handleShowDetail"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MovieSlider from '@/components/movie/MovieSlider.vue';
import movieService from '@/services/movieService';

const movies = ref([]);
const emit = defineEmits(['show-detail', 'refresh']);

const formatMovies = (movieList) => {
  return movieList.map(movie => ({
    id: movie.id,
    title: movie.title,
    posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    ...movie
  }));
};

const handleShowDetail = (movie) => {
  emit('show-detail', movie);
};

const loadMovies = async () => {
  try {
    const { data } = await movieService.getUpcomingMovies();
    movies.value = data.results;
  } catch (error) {
    console.error('개봉 예정 영화 로딩 실패:', error);
  }
};

onMounted(() => {
  loadMovies();
});
</script>