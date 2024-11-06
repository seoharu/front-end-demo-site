<!--영화 상세 정보 표시 -->
<template>
  <Transition name="modal">
    <div v-if="movie" class="modal-overlay" @click="emit('close')">
      <div class="modal-content" @click.stop>
        <!-- Modal Header -->
        <div class="modal-header">
          <h2 class="text-2xl font-bold">{{ movie.title }}</h2>
          <button @click="emit('close')" class="text-gray-500 hover:text-white">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <div class="flex flex-col md:flex-row gap-6">
            <!-- Poster Image -->
            <div class="w-full md:w-1/3">
              <img
                :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
                :alt="movie.title"
                class="w-full rounded-lg"
                @error="handleImageError"
              />
            </div>

            <!-- Movie Info -->
            <div class="w-full md:w-2/3">
              <!-- Basic Info -->
              <div class="flex items-center gap-4 mb-4">
                <span class="flex items-center">
                  <i class="fas fa-star text-yellow-400 mr-1"></i>
                  {{ movie.vote_average.toFixed(1) }}
                </span>
                <span>{{ formatDate(movie.release_date) }}</span>
                <span v-if="movie.runtime">
                  <i class="fas fa-clock mr-1"></i>
                  {{ formatRuntime(movie.runtime) }}
                </span>
              </div>

              <!-- Genres -->
              <div class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="genre in movie.genres"
                  :key="genre.id"
                  class="px-3 py-1 bg-gray-700 rounded-full text-sm"
                >
                  {{ genre.name }}
                </span>
              </div>

              <!-- Overview -->
              <div class="mb-6">
                <h3 class="text-lg font-semibold mb-2">줄거리</h3>
                <p class="text-gray-300">{{ movie.overview || '줄거리 정보가 없습니다.' }}</p>
              </div>

              <!-- Additional Info -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h3 class="text-lg font-semibold mb-2">개봉일</h3>
                  <p class="text-gray-300">{{ formatDate(movie.release_date) }}</p>
                </div>
                <div>
                  <h3 class="text-lg font-semibold mb-2">원제</h3>
                  <p class="text-gray-300">{{ movie.original_title }}</p>
                </div>
                <div>
                  <h3 class="text-lg font-semibold mb-2">평점</h3>
                  <p class="text-gray-300">{{ movie.vote_average.toFixed(1) }} / 10</p>
                </div>
                <div>
                  <h3 class="text-lg font-semibold mb-2">투표수</h3>
                  <p class="text-gray-300">{{ movie.vote_count.toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button
            @click="toggleWishlist"
            class="flex items-center px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <i :class="['fas', isWishlisted ? 'fa-heart text-red-500' : 'fa-heart text-white']"></i>
            <span class="ml-2">{{ isWishlisted ? '찜 해제' : '찜하기' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'wishlist-updated']);

// 이미지 에러 핸들링
const handleImageError = (e) => {
  e.target.src = '/fallback-image.jpg'; // 대체 이미지로 교체
};

// localStorage 에러 핸들링
const getWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem('movieWishlist') || '[]');
  } catch (error) {
    console.error('위시리스트 로드 실패:', error);
    return [];
  }
};

// 날짜 포맷팅
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 러닝타임 포맷팅
const formatRuntime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}시간 ${mins}분`;
};

// 찜하기 관련 로직
const isWishlisted = computed(() => {
  const wishlist = JSON.parse(localStorage.getItem('movieWishlist') || '[]');
  return wishlist.some(item => item.id === props.movie.id);
});

const toggleWishlist = () => {
  try {
    const wishlist = getWishlist();
    const index = wishlist.findIndex(item => item.id === props.movie.id);

    if (index === -1) {
      wishlist.push(props.movie);
    } else {
      wishlist.splice(index, 1);
    }

    localStorage.setItem('movieWishlist', JSON.stringify(wishlist));
    emit('wishlist-updated');
  } catch (error) {
    console.error('위시리스트 업데이트 실패:', error);
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  padding: 1rem;
}

.modal-content {
  background-color: #1f2937;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #374151;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #374151;
  display: flex;
  justify-content: flex-end;
}

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>