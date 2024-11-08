<template>
  <button
    @click.stop="toggleWishlist"
    class="wishlist-button transition-all duration-300"
    :class="[
      isWishlisted
        ? 'text-red-500 hover:text-red-600'
        : 'text-gray-300 hover:text-red-500'
    ]"
    :title="isWishlisted ? '찜하기 취소' : '찜하기'"
  >
    <i
      class="fas fa-heart"
      :class="[
        isWishlisted
          ? 'animate-bounce'
          : ''
      ]"
    ></i>
  </button>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
});

  const emit = defineEmits(['wishlist-updated']);

// 로컬 스토리지 키
const WISHLIST_KEY = 'movieWishlist';

// 찜하기 상태 확인
const isWishlisted = computed(() => {
  const wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
  return wishlist.some(item => item.id === props.movie.id);
});

// 찜하기 토글
const toggleWishlist = () => {
  const wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
  const index = wishlist.findIndex(item => item.id === props.movie.id);

  if (index === -1) {
    // 찜하기 추가
    wishlist.push({
      id: props.movie.id,
      title: props.movie.title,
      poster_path: props.movie.poster_path,
      vote_average: props.movie.vote_average,
      release_date: props.movie.release_date,
      addedAt: new Date().toISOString()
    });
  } else {
    // 찜하기 제거
    wishlist.splice(index, 1);
  }
  // 로컬 스토리지 업데이트
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));

  // 부모 컴포넌트에 변경 알림
  emit('wishlist-updated', {
    movie: props.movie,
    isWishlisted: !isWishlisted.value
  });
};
</script>

<style scoped>
.wishlist-button {
  padding: 0.5rem;
  border-radius: 9999px;
  backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.5);
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.animate-bounce {
  animation: bounce 0.3s;
}
</style>