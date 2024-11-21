<template>
  <div v-if="movie" class="banner-container">
    <!-- 배경 이미지 섹션 -->
    <div class="banner-wrapper">
      <!-- 배경 포스터 -->
      <div class="banner-background">
        <img
          :src="`https://image.tmdb.org/t/p/original${movie.backdrop_path}`"
          :alt="movie.title"
          class="banner-image"
        />
        <!-- 그라데이션 오버레이 -->
        <div class="gradient-overlay" />
      </div>

      <!-- 콘텐츠 섹션 -->
      <div class="banner-content">
        <div class="content-wrapper">
          <!-- 제목 -->
          <h1 class="movie-title">
            {{ movie.title }}
          </h1>

          <!-- 개요 -->
          <p class="movie-overview">
            {{ movie.overview }}
          </p>

          <!-- 액션 버튼들 -->
          <div class="button-group">
            <button
              @click="$emit('play')"
              class="action-button play-button"
            >
              <i class="fas fa-play"></i>
              재생
            </button>
            <button
              @click="$emit('show-detail', movie)"
              class="action-button info-button"
            >
              <i class="fas fa-info-circle"></i>
              상세정보
            </button>

            <WishlistClick
              :movie="movie"
              class="banner-wishlist-btn"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import WishlistClick from '@/components/common/WishlistClick.vue'

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

defineEmits(['play', 'show-detail']);

</script>

<style scoped>

.banner-container {
  position: relative;
  width: 100%;
  height: 100vh;
  max-height: 80vh;
  overflow: hidden;
  margin-top: -64px; /* 헤더 높이만큼 올리기 */
}

.banner-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.banner-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    0deg,
    rgb(20, 20, 20) 0%,
    rgba(20, 20, 20, 0.7) 40%,
    rgba(20, 20, 20, 0.4) 60%,
    rgba(20, 20, 20, 0.1) 80%
  );
}

.banner-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 4rem;
  margin-bottom: 5rem;
}

.content-wrapper {
  max-width: 40rem;
}

.movie-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.movie-overview {
  font-size: 1.25rem;
  color: #e5e5e5;
  margin-bottom: 1.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.button-group {
  display: flex;
  gap: 1rem;
}

.action-button {
  display: flex;
  align-items: center;
  padding: 0.8rem 2rem;
  border-radius: 4px;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button i {
  margin-right: 0.8rem;
}

.play-button {
  background-color: white;
  color: black;
}

.play-button:hover {
  background-color: rgba(255, 255, 255, 0.75);
}

.info-button {
  background-color: rgba(109, 109, 110, 0.7);
  color: white;
}

.info-button:hover {
  background-color: rgba(109, 109, 110, 0.5);
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .banner-container {
    height: 60vh;
  }

  .banner-content {
    padding: 0 2rem;
    margin-bottom: 3rem;
  }

  .movie-title {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .movie-overview {
    font-size: 1rem;
    -webkit-line-clamp: 2;
    margin-bottom: 1rem;
  }

  .action-button {
    padding: 0.6rem 1.5rem;
    font-size: 1rem;
  }
}

/* 더 작은 화면 */
@media (max-width: 480px) {
  .banner-content {
    padding: 0 1rem;
    margin-bottom: 2rem;
  }

  .movie-title {
    font-size: 1.75rem;
  }

  .movie-overview {
    -webkit-line-clamp: 2;
    font-size: 0.9rem;
  }

  .action-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .action-button i {
    margin-right: 0.5rem;
  }
}

.banner-wishlist-btn :deep(.wishlist-btn) {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
}

.banner-wishlist-btn :deep(.wishlist-btn:hover) {
  background-color: rgba(255, 255, 255, 0.2);
}

.banner-wishlist-btn :deep(.wishlist-btn.is-wishlisted) {
  background-color: rgba(229, 9, 20, 0.8);
}

.banner-wishlist-btn :deep(.toast-message) {
  z-index: 60;
}

/* 애니메이션 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.banner-wishlist-btn {
  animation: fadeIn 0.3s ease-in-out;
}
</style>