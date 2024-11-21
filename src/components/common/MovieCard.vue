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

        <!-- 하단 버튼 영역 -->
        <div class="action-buttons flex gap-2">
          <button
            @click.stop="handleWishlistToggle"
            class="flex-1 py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <i :class="['fas fa-heart', { 'text-white': !movieIsWishlisted, 'animate-pulse': movieIsWishlisted }]"></i>
            <span>{{ movieIsWishlisted ? '찜 완료' : '찜하기' }}</span>
          </button>
          <button
            @click.stop="$emit('show-detail', movie)"
            class="flex-1 py-2 px-4 rounded-md bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
          >
            <i class="fas fa-info-circle"></i>
            <span>상세정보</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useWishlist } from '@/composables/useWishlist';

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['wishlist-updated', 'show-detail']);
const { isInWishlist, toggleWishlist } = useWishlist();

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

const movieIsWishlisted = computed(() => isInWishlist(props.movie.id));

const handleWishlistToggle = () => {
  toggleWishlist(props.movie);
  emit('wishlist-updated');
};


const handleImageError = (e) => {
  e.target.src = fallbackImage;
};
</script>


<style scoped>
.movie-card {
  aspect-ratio: 2/3;
  background-color: #141414;
}

.action-buttons button {
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.action-buttons button:hover {
  transform: scale(1.02);
}

.action-buttons button:active {
  transform: scale(0.98);
}

@keyframes heartPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.animate-pulse {
  animation: heartPulse 1s ease-in-out;
}

/* 모바일 최적화 */
@media (max-width: 640px) {
  .action-buttons {
    flex-direction: column;
  }

  .movie-info h3 {
    font-size: 1rem;
  }

  .movie-info .text-sm {
    font-size: 0.75rem;
  }
}
</style>