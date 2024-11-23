<template>
  <button
    @click.stop="handleWishlistToggle"
    class="wishlist-btn action-btn"
    :class="{ 'is-wishlisted': isWishlisted }"
  >
    <i
      class="fas fa-heart"
      :class="{ 'text-white': !isWishlisted, 'text-pink-400 animate-pulse': isWishlisted }"
    ></i>
    <span>{{ buttonText }}</span>

    <!-- 토스트 메시지 -->
    <div
      v-if="showToast"
      :class="['toast-message', { 'show': showToast }]"
    >
      {{ toastMessage }}
    </div>
  </button>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useWishlist } from '@/composables/useWishlist';

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['wishlist-updated']);
const { isInWishlist, toggleWishlist } = useWishlist();

const showToast = ref(false);
const toastMessage = ref('');

const buttonText = computed(() => isWishlisted.value ? '찜 완료' : '찜하기');

// 안전하게 id 체크를 추가한 computed 속성
const isWishlisted = computed(() => {
  return props.movie && props.movie.id ? isInWishlist(props.movie.id) : false;
});
// 토스트 메시지 표시
const showToastMessage = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 2000);
};

// 위시리스트 토글 핸들러
const handleWishlistToggle = () => {
  toggleWishlist(props.movie);
  emit('wishlist-updated');
  showToastMessage(isWishlisted.value ? '찜 목록에 추가되었습니다.' : '찜 목록에서 제거되었습니다.');
};
</script>

<style scoped>
.wishlist-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  background: rgba(229, 9, 20, 0.9);
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
}

.wishlist-btn:hover {
  background: rgba(229, 9, 20, 1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(229, 9, 20, 0.3);
}

.wishlist-btn.is-wishlisted {
  background: rgba(229, 9, 20, 0.7);
}

/* 하트 색상 및 애니메이션 */
.wishlist-btn.is-wishlisted i {
  color: #f472b6; /* Tailwind의 pink-400 색상 */
  text-shadow: 0 0 10px rgba(244, 114, 182, 0.5); /* 핑크색 글로우 효과 */
}

@keyframes heartPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.animate-pulse {
  animation: heartPulse 1s ease-in-out;
}

/* 아이콘 애니메이션 */
@keyframes heartPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.animate-pulse {
  animation: heartPulse 1s ease-in-out;
}

/* 토스트 메시지 */
.toast-message {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
  white-space: nowrap;
  z-index: 50;
}

.toast-message.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* 모바일 최적화 */
@media (max-width: 640px) {
  .wishlist-btn {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
}

/* 호버 효과 비활성화 (터치 디바이스) */
@media (hover: none) {
  .wishlist-btn:hover {
    transform: none;
    box-shadow: none;
  }

  .wishlist-btn:active {
    transform: scale(0.98);
  }
}
</style>