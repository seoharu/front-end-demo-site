<template>
  <div class="movie-sections">
    <div class="sections-container">
      <PopularMovies
        @refresh="emit('refresh')"
        @show-detail="(movie) => emit('show-detail', movie)"
        @featured-movie="(movie) => emit('featured-movie', movie)"
        @wishlist-updated="handleWishlistUpdate"
      />

      <NowPlayingMovies
        @refresh="emit('refresh')"
        @show-detail="(movie) => emit('show-detail', movie)"
        @wishlist-updated="handleWishlistUpdate"
      />

      <TopRatedMovies
        @refresh="emit('refresh')"
        @show-detail="(movie) => emit('show-detail', movie)"
        @wishlist-updated="handleWishlistUpdate"
      />

      <UpcomingMovies
        @refresh="emit('refresh')"
        @show-detail="(movie) => emit('show-detail', movie)"
        @wishlist-updated="handleWishlistUpdate"
      />

      <WishlistMovies
        @show-detail="(movie) => $emit('show-detail', movie)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import PopularMovies from "@/components/home/sections/PopularMovies.vue"
import NowPlayingMovies from "@/components/home/sections/NowPlayingMovies.vue"
import TopRatedMovies from "@/components/home/sections/TopRatedMovies.vue"
import UpcomingMovies from "@/components/home/sections/UpcomingMovies.vue"
import WishlistMovies from "@/components/home/sections/WishlistMovies.vue"
import MovieSection from "@/components/movie/MovieSection.vue"
import { useWishlist } from '@/composables/useWishlist'



// 위시리스트 컴포저블 사용
const { wishlist } = useWishlist()

const emit = defineEmits(['refresh', 'show-detail', 'featured-movie', 'wishlist-updated'])

const handleWishlistUpdate = () => {
  emit('wishlist-updated');
};

</script>

<style scoped>
.movie-sections {
  @apply relative w-full;
  margin-top: -100px;
  z-index: 1;
}

.sections-container {
  @apply container mx-auto px-4 space-y-16;
  padding-top: 50px;
}

/* 찜한 영화 섹션 새로운 스타일 */
.wishlisted-section {
  z-index: 10;
  position: relative;
}

.section-header {
  @apply flex justify-between items-center px-6 pt-8 pb-2;
}

.header-content {
  @apply flex items-center;
}

.section-title {
  @apply text-2xl font-bold text-white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.wishlist-count {
  @apply text-sm text-gray-400 font-medium;
}

.section-description {
  @apply px-6 pb-6 text-sm text-gray-400;
}

.wishlist-movies {
  @apply mt-4;
}

/* hover 효과 */
.wishlisted-section:hover {
  background: linear-gradient(
    180deg,
    rgba(229, 9, 20, 0.08) 0%,
    rgba(229, 9, 20, 0.04) 50%,
    transparent 100%
  );
  transition: background 0.3s ease;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .movie-sections {
    margin-top: -50px;
  }

  .sections-container {
    @apply space-y-12;
    padding-top: 50px;
  }

  .wishlisted-section {
    @apply mt-16;
  }

  .section-header {
    @apply flex-col items-start space-y-2;
  }

  .wishlist-count {
    @apply text-xs;
  }

  .section-description {
    @apply text-xs;
  }
}

/* 섹션 진입/퇴장 애니메이션 */
.section-enter-active,
.section-leave-active {
  @apply transition-all duration-500 ease-in-out;
}

.section-enter-from,
.section-leave-to {
  @apply opacity-0 transform translate-y-4;
}

.section-enter-to,
.section-leave-from {
  @apply opacity-100 transform translate-y-0;
}
</style>
