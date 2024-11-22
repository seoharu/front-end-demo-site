<template>
  <div v-if="wishlistMovies.length > 0">
    <MovieSlider
      :section="{
        title: '찜한 콘텐츠',
        movies: formatMovies(wishlistMovies),
        titleIcon: {
          name: 'heart',
          color: 'text-red-600'
        }
      }"
      @show-detail="$emit('show-detail', $event)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useWishlist } from '@/composables/useWishlist'
import MovieSlider from '@/components/movie/MovieSlider.vue'

const { wishlist } = useWishlist()
const wishlistMovies = computed(() => wishlist.value)

defineEmits(['show-detail'])

const formatMovies = (movies) => {
  return movies.map(movie => ({
    ...movie,
    posterUrl: movie.poster_path
      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
      : '/placeholder-poster.jpg'
  }))
}
</script>

<style scoped>
.wishlist-section {
  margin: 2rem 0;
  padding: 1rem 0;
  background: linear-gradient(
    to right,
    rgba(229, 9, 20, 0.1),
    transparent 50%
  );
  border-radius: 0.5rem;
}

.wishlist-swiper {
  position: relative;
  overflow: visible !important;
  padding: 0.5rem 0;
}

.wishlist-slide {
  width: auto !important;
  height: auto !important;
}

.movie-card {
  position: relative;
  transform-origin: center center;
  transition: all 0.3s ease;
  cursor: pointer;
  z-index: 1; /* 기본 z-index 설정 */
}

.movie-card:hover {
  z-index: 10; /* 호버 시 높은 z-index 설정 */
  transform: scale(1.2); /* 확대 효과 */
}

/* Navigation Buttons */
.wishlist-prev,
.wishlist-next {
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.wishlist-prev::after {
  content: '\f104';
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  font-size: 12px;
}

.wishlist-next::after {
  content: '\f105';
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  font-size: 12px;
}

.wishlist-section:hover .wishlist-prev,
.wishlist-section:hover .wishlist-next {
  opacity: 1;
}
</style>

