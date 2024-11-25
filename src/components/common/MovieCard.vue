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
  flex-direction: row; /* 가로 정렬 */
  gap: 16px; /* 버튼 사이 간격 증가 */
  width: 100%;
  padding: 8px;
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 20;
}

.action-btn {
  flex: none; /* flex-grow 제거하여 내용 크기만큼만 차지 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 16px; /* 좌우 패딩 증가 */
  border-radius: 8px; /* 모서리 더 둥글게 */
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
  min-width: 100px; /* 최소 너비 설정 */
  margin-top: 10px;
  margin-right: 10px;
}
/* 모바일 대응 수정 */
@media (max-width: 640px) {
  .button-container {
    gap: 12px; /* 작은 화면에서도 적절한 간격 유지 */
  }

}

@media (max-width: 480px) {
  .button-container {
    gap: 8px; /* 매우 작은 화면에서 간격 축소 */
  }

}


/* 호버 효과 비활성화 (터치 디바이스) */
@media (hover: none) {
  .wishlist-btn:hover,
  .info-btn:hover {
    transform: none;
    box-shadow: none;
  }

  .wishlist-btn:active,
  .info-btn:active {
    transform: scale(0.98);
  }
}
</style>