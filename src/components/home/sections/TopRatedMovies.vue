<template>
  <MovieSection
    title="평점이 높은 영화"
    :movies="movies"
    :loading="loading"
    @wishlist-updated="emit('refresh')"
    @show-detail="(movie) => emit('show-detail', movie)"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MovieSection from '@/components/movie/MovieSection.vue';
import movieService from '@/services/movieService.js';

const emit = defineEmits(['refresh', 'show-detail']);

const movies = ref([]);
const loading = ref(true);

const loadMovies = async () => {
  try {
    const { data } = await movieService.getTopRatedMovies();
    movies.value = data.results;
  } catch (error) {
    console.error('Error loading top rated movies:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadMovies();
});
</script>