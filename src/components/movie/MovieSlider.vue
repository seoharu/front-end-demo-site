<!-- MovieSlider.vue -->
<template>
  <div class="movie-slider" v-if="section && section.movies.length > 0">
    <h2 class="text-white text-2xl font-bold mb-4">{{ section.title }}</h2>

    <div class="relative group">
      <!-- 슬라이더 컨테이너 -->
      <div class="slider-viewport overflow-hidden">
        <!-- 실제 슬라이딩되는 컨테이너 -->
        <div
          ref="sliderTrack"
          class="slider-track flex transition-transform duration-500"
          :style="{ transform: `translateX(${-currentSlide * 100}%)` }"
        >
          <!-- 각 슬라이드 페이지 -->
          <div
            v-for="(chunk, index) in movieChunks"
            :key="index"
            class="flex-none w-full flex gap-4 px-4"
          >
            <!-- 각 영화 카드 -->
            <div
              v-for="movie in chunk"
              :key="movie.id"
              class="movie-card"
              @click="$emit('show-detail', movie)"
            >
              <div class="relative group/card">
                <img
                  :src="movie.posterUrl"
                  :alt="movie.title"
                  class="rounded-md w-full h-auto object-cover"
                >
                <!-- 호버 오버레이 -->
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100
                            transition-opacity duration-300 flex flex-col justify-end p-4 rounded-md">
                  <h3 class="text-white font-bold">{{ movie.title }}</h3>
                  <p class="text-white/80 text-sm mt-1">
                    {{ new Date(movie.release_date).getFullYear() }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 네비게이션 버튼 -->
      <button
        v-if="currentSlide > 0"
        @click="prevSlide"
        class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80
               w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100
               transition-opacity duration-300"
      >
        <i class="fas fa-chevron-left text-white"></i>
      </button>

      <button
        v-if="currentSlide < movieChunks.length - 1"
        @click="nextSlide"
        class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80
               w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100
               transition-opacity duration-300"
      >
        <i class="fas fa-chevron-right text-white"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  section: {
    type: Object,
    required: true,
    default: () => ({ title: '', movies: [] })
  }
});

const currentSlide = ref(0);
const MOVIES_PER_SLIDE = 6; // 한 슬라이드당 보여줄 영화 수

// 영화 목록을 슬라이드별로 분할
const movieChunks = computed(() => {
  const chunks = [];
  for (let i = 0; i < props.section.movies.length; i += MOVIES_PER_SLIDE) {
    chunks.push(props.section.movies.slice(i, i + MOVIES_PER_SLIDE));
  }
  return chunks;
});

const nextSlide = () => {
  if (currentSlide.value < movieChunks.value.length - 1) {
    currentSlide.value++;
  }
};

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  }
};
</script>

<style scoped>
.slider-viewport {
  width: 100%;
  overflow: hidden;
}

.slider-track {
  display: flex;
  width: 100%;
}

.movie-card {
  flex: 0 0 calc(100% / 6 - 1rem); /* 6개의 영화를 한 줄에 표시 */
  position: relative;
  transition: transform 0.3s ease;
}

.movie-card:hover {
  transform: scale(1.05);
  z-index: 1;
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .movie-card {
    flex: 0 0 calc(100% / 5 - 1rem); /* 5개 표시 */
  }
}

@media (max-width: 1024px) {
  .movie-card {
    flex: 0 0 calc(100% / 4 - 1rem); /* 4개 표시 */
  }
}

@media (max-width: 768px) {
  .movie-card {
    flex: 0 0 calc(100% / 3 - 1rem); /* 3개 표시 */
  }
}

@media (max-width: 640px) {
  .movie-card {
    flex: 0 0 calc(100% / 2 - 1rem); /* 2개 표시 */
  }
}
</style>