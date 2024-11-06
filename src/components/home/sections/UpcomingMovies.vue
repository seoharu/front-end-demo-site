<template>
  <MovieSection
    title="개봉 예정작"
    :movies="movies"
    :loading="loading"
    @wishlist-updated="emit('refresh')"
    @show-detail="(movie) => emit('show-detail', movie)"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MovieSection from '@/components/movie/MovieSection.vue';
import movieService from '@/services/movieService';

const emit = defineEmits(['refresh', 'show-detail']);

const movies = ref([]);
const loading = ref(true);

const loadMovies = async () => {
  try {
    const { data } = await movieService.getUpcomingMovies();
    movies.value = data.results;
  } catch (error) {
    console.error('Error loading upcoming movies:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadMovies();
});
</script>