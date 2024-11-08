<template>
  <div class="movie-sections">
    <!-- Featured Movie Banner가 있다면 그 아래에 자연스럽게 이어지도록 -->
    <div class="sections-container">
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
  </div>
</template>

<script setup>
import PopularMovies from "@/components/home/sections/PopularMovies.vue";
import NowPlayingMovies from "@/components/home/sections/NowPlayingMovies.vue";
import TopRatedMovies from "@/components/home/sections/TopRatedMovies.vue"
import UpcomingMovies from "@/components/home/sections/UpcomingMovies.vue";

// eslint-disable-next-line no-undef
const emit = defineEmits(['refresh', 'show-detail', 'featured-movie']);
</script>

<style scoped>
.movie-sections {
  @apply relative w-full;
  /* Featured Movie Banner 아래에 자연스럽게 이어지도록 음수 마진 적용 */
  margin-top: -100px;
  z-index: 1;
}

.sections-container {
  @apply container mx-auto px-4 space-y-16;
  /* 섹션 간격 및 패딩 조정 */
  padding-top: 50px;
}

/* 반응형 조정 */
@media (max-width: 768px) {
  .movie-sections {
    margin-top: -50px;
  }

  .sections-container {
    @apply space-y-12;
    padding-top: 50px;
  }
}
</style>