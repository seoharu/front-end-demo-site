```vue
<template>
  <div class="modal-container" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="poster-section">
        <img
          :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
          :alt="movie.title"
        />
      </div>
      <div class="info-section">
        <h2>{{ movie.title }}</h2>
        <div class="movie-info">
          <p><strong>개봉일:</strong> {{ movie.release_date }}</p>
          <p><strong>평점:</strong> {{ formatRating(movie.vote_average) }}</p>
          <p class="overview">{{ movie.overview }}</p>
        </div>
      </div>
      <button class="close-button" @click="$emit('close')">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
});

// 평점 포맷팅 함수
const formatRating = (rating) => {
  if (rating === undefined || rating === null) return 'N/A';
  return Number(rating).toFixed(1);
};
</script>

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 90%;
  display: flex;
  position: relative;
  max-height: 90vh;
  overflow: hidden;
}

.poster-section {
  flex: 0 0 40%;
  background: #f0f0f0;
}

.poster-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-section {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

h2 {
  font-size: 24px;
  margin-bottom: 16px;
  color: #333;
}

.movie-info p {
  margin-bottom: 12px;
  line-height: 1.6;
}

.overview {
  margin-top: 16px;
  color: #666;
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .modal-content {
    flex-direction: column;
  }

  .poster-section {
    height: 300px;
  }

  .info-section {
    padding: 16px;
  }
}
</style>
```