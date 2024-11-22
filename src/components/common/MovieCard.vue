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

        <div class="Button-container">
          <WishlistClick
            :movie="movie"
            class="action-btn wishlist-btn"
          />
          <button
            @click.stop="$emit('show-detail', movie)"
            class="action-btn info-btn"
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
import WishlistClick from './WishlistClick.vue';

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


<style scoped>
.movie-card {
  aspect-ratio: 2/3;
  background-color: #141414;
  padding: 20px !important;
}

.button-container {
  display: flex;
  gap: 8px;
  width: 100%;
  margin-top: auto;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.wishlist-btn) {
  background: rgba(229, 9, 20, 0.9);
  color: white;
}

:deep(.wishlist-btn:hover) {
  background: rgba(229, 9, 20, 1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(229, 9, 20, 0.3);
}

:deep(.wishlist-btn.is-wishlisted) {
  background: rgba(229, 9, 20, 0.7);
}

.info-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.info-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}

.action-btn:active {
  transform: translateY(0);
}

/* 반짝이는 테두리 효과 */
:deep(.wishlist-btn)::after,
.info-btn::after {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 6px;
  padding: 1px;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.2)
  );
  mask: linear-gradient(#000, #000) content-box, linear-gradient(#000, #000);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.2s ease;
}

:deep(.wishlist-btn:hover)::after,
.info-btn:hover::after {
  opacity: 1;
}

/* 아이콘 스타일링 */
.action-btn i {
  font-size: 1.1rem;
}

/* 모바일 최적화 */
@media (max-width: 640px) {
  .button-container {
    flex-direction: column;
    gap: 6px;
  }

  .action-btn {
    padding: 6px 12px;
    font-size: 0.85rem;
  }

  .action-btn i {
    font-size: 1rem;
  }
}

/* 호버 효과 비활성화 (터치 디바이스) */
@media (hover: none) {
  :deep(.wishlist-btn:hover),
  .info-btn:hover {
    transform: none;
    box-shadow: none;
  }

  :deep(.wishlist-btn:active),
  .info-btn:active {
    transform: scale(0.98);
  }
}
</style>