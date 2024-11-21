<template>
  <div class="wishlist-button">
    <button
      @click="handleToggleWishlist"
      :class="{ 'is-wishlisted': isWishlisted }"
      class="wishlist-btn"
    >
      <i :class="buttonIcon"></i>
      {{ buttonText }}
    </button>

    <!-- 토스트 메시지 -->
    <div
      v-if="showToast"
      :class="['toast-message', { 'show': showToast }]"
    >
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWishlist, type Movie } from '@/composables/useWishlist'

const props = defineProps<{
  movie: Movie
}>()

const { isInWishlist, toggleWishlist } = useWishlist()

const showToast = ref(false)
const toastMessage = ref('')

// 위시리스트 상태에 따른 계산된 속성들
const isWishlisted = computed(() => isInWishlist(props.movie.id))
const buttonIcon = computed(() => isWishlisted.value ? 'fas fa-heart' : 'far fa-heart')
const buttonText = computed(() => isWishlisted.value ? '찜 완료' : '찜하기')

// 토스트 메시지 표시 함수
const showToastMessage = (message: string) => {
  toastMessage.value = message
  showToast.value = true

  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

// 위시리스트 토글 핸들러
const handleToggleWishlist = () => {
  toggleWishlist(props.movie)
  showToastMessage(isWishlisted.value ? '찜 목록에 추가되었습니다.' : '찜 목록에서 제거되었습니다.')
}
</script>

<style scoped>
.wishlist-button {
  position: relative;
}

.wishlist-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.wishlist-btn:hover {
  background-color: rgba(0, 0, 0, 0.9);
}

.wishlist-btn.is-wishlisted {
  background-color: #e50914;
}

.wishlist-btn i {
  font-size: 1.1em;
}

/* 토스트 메시지 스타일 */
.toast-message {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.9em;
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
  white-space: nowrap;
  margin-bottom: 8px;
}

.toast-message.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
</style>