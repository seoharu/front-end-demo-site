<template>
  <MovieSlider
    v-if="movies.length > 0"
    :section="{
      title: '현재 상영작',
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
    const { data } = await movieService.getNowPlayingMovies();
    movies.value = data.results;
  } catch (error) {
    console.error('현재 상영작 로딩 실패:', error);
  }
};

onMounted(() => {
  loadMovies();
});
</script>
