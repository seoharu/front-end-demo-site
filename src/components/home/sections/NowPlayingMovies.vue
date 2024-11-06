<template>
  <MovieSection
    title="현재 상영작"
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
    const { data } = await movieService.getNowPlayingMovies();
    movies.value = data.results;
  } catch (error) {
    console.error('Error loading now playing movies:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadMovies();
});
</script>