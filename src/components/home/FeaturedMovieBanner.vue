<template>
  <div v-if="movie" class="featured-movie">
    <!-- 배경 이미지 섹션 -->
    <div class="relative h-[70vh] min-h-[500px]">
      <!-- 배경 포스터 -->
      <div class="absolute inset-0 overflow-hidden">
        <img
          :src="`https://image.tmdb.org/t/p/original${movie.backdrop_path}`"
          :alt="movie.title"
          class="w-full h-full object-cover"
        />
        <!-- 그라데이션 오버레이 -->
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
      </div>

      <!-- 콘텐츠 섹션 -->
      <div class="absolute bottom-0 left-0 w-full p-8 md:p-16">
        <div class="max-w-4xl mx-auto">
          <!-- 제목 -->
          <h1 class="text-4xl md:text-6xl font-bold mb-4 text-white">
            {{ movie.title }}
          </h1>

          <!-- 영화 정보 -->
          <div class="flex flex-wrap items-center gap-4 mb-4 text-white/90">
            <div class="flex items-center">
              <i class="fas fa-star text-yellow-400 mr-1"></i>
              <span>{{ movie.vote_average.toFixed(1) }}</span>
            </div>
            <span>{{ formatDate(movie.release_date) }}</span>
            <span v-if="movie.runtime">
              <i class="fas fa-clock mr-1"></i>
              {{ formatRuntime(movie.runtime) }}
            </span>
          </div>

          <!-- 개요 -->
          <p class="text-lg mb-6 text-white/80 line-clamp-3 md:line-clamp-none">
            {{ movie.overview }}
          </p>

          <!-- 액션 버튼들 -->
          <div class="flex flex-wrap gap-4">
            <button
              @click="$emit('play')"
              class="button-common bg-white text-black hover:bg-gray-200"
              role="button"
              tabindex="0"
            >
              <i class="fas fa-play mr-2"></i>
              재생
            </button>
            <button
              @click="$emit('show-detail', movie)"
              class="button-common bg-gray-600/50 text-white hover:bg-gray-600"
              role="button"
              tabindex="0"
            >
              <i class="fas fa-info-circle mr-2"></i>
              상세정보
            </button>
            <button
              @click="toggleWishlist"
              class="button-common bg-gray-600/50 text-white hover:bg-gray-600"
              role="button"
              tabindex="0"
            >
              <i :class="['fas', isWishlisted ? 'fa-heart text-red-500' : 'fa-heart text-white']"></i>
              <span class="ml-2">{{ isWishlisted ? '찜 해제' : '찜하기' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';


// 소문자로 작성된 defineProps 사용
const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

// 소문자로 작성된 defineEmits 사용
const emitEvent = defineEmits(['play', 'show-detail', 'wishlist-updated']);

// 날짜 포맷팅 함수
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// 러닝타임 포맷팅 함수
const formatRuntime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}시간 ${mins}분`;
};

// 찜하기 관련 로직
const getWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem('movieWishlist') || '[]');
  } catch (e) {
    console.error('localStorage에서 찜 목록을 불러오는 중 오류 발생', e);
    return [];
  }
};

const isWishlisted = computed(() => {
  const wishlist = getWishlist();
  return wishlist.some((item) => item.id === props.movie.id);
});

const toggleWishlist = () => {
  let wishlist = getWishlist();
  const index = wishlist.findIndex((item) => item.id === props.movie.id);

  if (index === -1) {
    wishlist.push(props.movie);
  } else {
    wishlist.splice(index, 1);
  }

  try {
    localStorage.setItem('movieWishlist', JSON.stringify(wishlist));
  } catch (e) {
    console.error('localStorage에 찜 목록을 저장하는 중 오류 발생', e);
  }

  emitEvent('wishlist-updated');
};
</script>

<style scoped>
.featured-movie {
  position: relative;
  z-index: 1;
}

.featured-movie::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(to bottom, transparent, rgb(17 24 39));
  pointer-events: none;
}

/* 트랜지션 효과 */
.featured-movie {
  opacity: 0;
  animation: fadeIn 1s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 공통 버튼 스타일 */
.button-common {
  display: flex;
  align-items: center;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s;
}
</style>
