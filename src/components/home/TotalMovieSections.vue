```vue
<template>
  <div class="movie-sections space-y-12 py-12">
    <PopularMovies
      @refresh="emit('refresh')"
      @show-detail="(movie) => emit('show-detail', movie)"
      @featured-movie="(movie) => emit('featured-movie', movie)"
    />

    <NowPlayingMovies
      @refresh="emit('refresh')"
      @show-detail="(movie) => emit('show-detail', movie)"
    />

    <TopRatedMovies
      @refresh="emit('refresh')"
      @show-detail="(movie) => emit('show-detail', movie)"
    />

    <UpcomingMovies
      @refresh="emit('refresh')"
      @show-detail="(movie) => emit('show-detail', movie)"
    />
  </div>
</template>

<script setup>
import PopularMovies from "@/components/home/sections/PopularMovies.vue";
import NowPlayingMovies from "@/components/home/sections/NowPlayingMovies.vue";
import TopRatedMovies from "@/components/home/sections/TopRatedMovies.vue";
import UpcomingMovies from "@/components/home/sections/UpcomingMovies.vue";

const emit = defineEmits(['refresh', 'show-detail', 'featured-movie']);
</script>

<style scoped>
.movie-sections {
  @apply container mx-auto px-4;
}
</style>
```