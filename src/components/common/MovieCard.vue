<template>
  <div
    class="movie-card relative group cursor-pointer overflow-hidden rounded-lg"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Poster Image -->
    <img
      :src="posterUrl"
      :alt="movie.title"
      class="w-full h-full object-cover transition-transform duration-300"
      :class="{ 'scale-110': isHovered }"
      @error="handleImageError"
    />

    <!-- Hover Overlay -->
    <div
      class="absolute inset-0 bg-black/70 transition-opacity duration-300"
      :class="{ 'opacity-0': !isHovered, 'opacity-100': isHovered }"
    >
      <div class="absolute bottom-0 left-0 w-full p-4">
        <h3 class="text-lg font-bold mb-2">{{ movie.title }}</h3>

        <div class="flex items-center justify-between mb-2">
          <span class="text-sm">{{ formattedDate }}</span>
          <div class="flex items-center">
            <i class="fas fa-star text-yellow-400 mr-1"></i>
            {{ movie.vote_average.toFixed(1) }}
          </div>
        </div>

        <div class="flex justify-between items-center">
          <WishlistClick
            :movie="movie"
            @wishlist-updated="$emit('wishlist-updated')"
            class="wishlist-btn-custom"
          />

          <button
            class="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded"
            @click.stop="$emit('show-detail', movie)"
          >
            상세정보
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import WishlistClick from "@/components/common/WishlistClick.vue"; // useWishlist import 추가

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['wishlist-updated', 'show-detail']);

const isHovered = ref(false);
const fallbackImage = '/placeholder.jpg';


const posterUrl = computed(() => {
  return props.movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${props.movie.poster_path}`
    : fallbackImage;
});

const formattedDate = computed(() => {
  return props.movie.release_date
    ? new Date(props.movie.release_date).toLocaleDateString('ko-KR')
    : '미정';
});

const handleImageError = (e) => {
  e.target.src = fallbackImage;
};
</script>