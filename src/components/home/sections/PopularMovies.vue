<template>
  <MovieSlider
    :section="{
      title: '인기 영화',
      movies: movies.map(formatMovieData)
    }"
    @show-detail="$emit('show-detail', $event)"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MovieSlider from '@/components/movie/MovieSlider.vue';
import movieService from '@/services/movieService';

const movies = ref([]);
const emit = defineEmits(['show-detail', 'refresh', 'featured-movie']);

const formatMovieData = (movie) => ({
  id: movie.id,
  title: movie.title,
  posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
  release_date: movie.release_date,
  vote_average: movie.vote_average,
  overview: movie.overview,
  ...movie
});

const loadMovies = async () => {
  try {
    const { data } = await movieService.getPopularMovies();
    movies.value = data.results;

    if (movies.value.length > 0) {
      emit('featured-movie', movies.value[0]);
    }
  } catch (error) {
    console.error('인기 영화 로딩 실패:', error);
  }
};

onMounted(() => {
  loadMovies();
});
</script>