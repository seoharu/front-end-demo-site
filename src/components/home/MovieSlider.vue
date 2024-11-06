<template>
  <div class="movie-slider relative group">
    <div class="overflow-hidden" ref="sliderContainer">
      <div
        class="flex transition-transform duration-500 ease-out"
        :style="{ transform: `translateX(-${translateX}px)` }"
      >
        <div
          v-for="movie in movies"
          :key="movie.id"
          class="flex-shrink-0 px-1 w-[220px]"
        >
          <div
            class="relative aspect-[2/3] group/item transition-transform duration-300 hover:scale-110 hover:z-10"
            @mouseenter="handleMouseEnter(movie)"
            @mouseleave="handleMouseLeave"
          >
            <!-- Movie Poster -->
            <img
              :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
              :alt="movie.title"
              class="w-full h-full object-cover rounded-md"
              loading="lazy"
            />

            <!-- Hover Overlay -->
            <div
              v-show="hoveredMovie === movie"
              class="absolute inset-0 bg-black/70 rounded-md p-4 flex flex-col justify-between
                     opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
            >
              <div>
                <h3 class="text-white font-bold text-sm mb-2">{{ movie.title }}</h3>
                <p class="text-gray-300 text-xs line-clamp-3">{{ movie.overview }}</p>
              </div>

              <div class="flex items-center justify-between mt-4">
                <div class="flex items-center space-x-2">
                  <button
                    class="p-2 bg-white rounded-full hover:bg-white/90 transition-colors"
                    @click.stop="$emit('play', movie)"
                  >
                    <i class="fas fa-play text-black text-sm"></i>
                  </button>
                  <button
                    class="p-2 border-2 border-white/50 rounded-full hover:border-white transition-colors"
                    @click.stop="toggleWishlist(movie)"
                  >
                    <i class="fas" :class="isInWishlist(movie) ? 'fa-check text-white' : 'fa-plus text-white'"></i>
                  </button>
                </div>
                <button
                  class="text-white hover:text-gray-300"
                  @click.stop="$emit('show-detail', movie)"
                >
                  <i class="fas fa-info-circle"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Arrows -->
    <button
      @click="slide('prev')"
      class="absolute left-0 top-0 bottom-0 w-12 bg-black/30 opacity-0 group-hover:opacity-100
             transition-opacity duration-300 hover:bg-black/60 flex items-center justify-center"
      v-show="canSlidePrev"
    >
      <i class="fas fa-chevron-left text-white"></i>
    </button>

    <button
      @click="slide('next')"
      class="absolute right-0 top-0 bottom-0 w-12 bg-black/30 opacity-0 group-hover:opacity-100
             transition-opacity duration-300 hover:bg-black/60 flex items-center justify-center"
      v-show="canSlideNext"
    >
      <i class="fas fa-chevron-right text-white"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

// Props
const props = defineProps({
  movies: {
    type: Array,
    required: true
  }
});

// Emits
const emit = defineEmits(['play', 'show-detail', 'wishlist-updated']);

// State
const translateX = ref(0);
const hoveredMovie = ref(null);
const sliderContainer = ref(null);
const slideWidth = ref(220); // 포스터 너비 + 패딩
const slidesPerView = ref(6);

// Computed
const canSlidePrev = computed(() => translateX.value > 0);
const canSlideNext = computed(() => {
  const maxTranslate = (props.movies.length - slidesPerView.value) * slideWidth.value;
  return translateX.value < maxTranslate;
});

// Methods
const handleMouseEnter = (movie) => {
  hoveredMovie.value = movie;
};

const handleMouseLeave = () => {
  hoveredMovie.value = null;
};

const slide = (direction) => {
  const step = slideWidth.value * Math.floor(slidesPerView.value / 2);
  if (direction === 'prev') {
    translateX.value = Math.max(0, translateX.value - step);
  } else {
    const maxTranslate = (props.movies.length - slidesPerView.value) * slideWidth.value;
    translateX.value = Math.min(maxTranslate, translateX.value + step);
  }
};

const isInWishlist = (movie) => {
  const wishlist = JSON.parse(localStorage.getItem('movieWishlist') || '[]');
  return wishlist.some(item => item.id === movie.id);
};

const toggleWishlist = (movie) => {
  let wishlist = JSON.parse(localStorage.getItem('movieWishlist') || '[]');
  const index = wishlist.findIndex(item => item.id === movie.id);

  if (index === -1) {
    wishlist.push(movie);
  } else {
    wishlist.splice(index, 1);
  }

  localStorage.setItem('movieWishlist', JSON.stringify(wishlist));
  emit('wishlist-updated');
};

const updateDimensions = () => {
  if (sliderContainer.value) {
    const containerWidth = sliderContainer.value.offsetWidth;
    slidesPerView.value = Math.floor(containerWidth / slideWidth.value);
  }
};

// Lifecycle hooks
onMounted(() => {
  updateDimensions();
  window.addEventListener('resize', updateDimensions);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateDimensions);
});
</script>

<style scoped>
.movie-slider {
  overflow: visible;
}

/* 슬라이드 애니메이션 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>