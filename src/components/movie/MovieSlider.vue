<template>
  <div class="movie-section" v-if="section && section.movies.length > 0">
    <h2 class="text-white text-xl font-bold mb-2 px-4">{{ section.title }}</h2>

    <Swiper
      :modules="modules"
      :slides-per-view="'auto'"
      :space-between="8"
      :navigation="{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }"
      class="movie-swiper"
    >
      <SwiperSlide
        v-for="movie in section.movies"
        :key="movie.id"
        class="movie-slide"
      >
        <div
          class="movie-card"
          @click="$emit('show-detail', movie)"
        >
          <div class="relative group">
            <img
              :src="movie.posterUrl"
              :alt="movie.title"
              class="rounded-md w-[100px] h-[150px] object-cover"
              @error="handleImageError"
            >
            <!-- 호버 오버레이 -->
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60
                        transition-all duration-300 rounded-md">
              <div class="absolute bottom-0 w-full p-2 opacity-0 group-hover:opacity-100
                          transition-opacity duration-300">
                <h3 class="text-white font-bold text-xs line-clamp-1">{{ movie.title }}</h3>
                <div class="flex items-center gap-1 mt-0.5">
                  <span class="text-white/80 text-[10px]">
                    {{ formatYear(movie.release_date) }}
                  </span>
                  <span v-if="movie.vote_average" class="text-white/80 text-[10px]">
                    • ⭐ {{ movie.vote_average.toFixed(1) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>

      <!-- 커스텀 네비게이션 버튼 -->
      <div class="swiper-button-prev !w-8 !h-8"></div>
      <div class="swiper-button-next !w-8 !h-8"></div>
    </Swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const modules = [Navigation];

const props = defineProps({
  section: {
    type: Object,
    required: true,
    default: () => ({ title: '', movies: [] })
  }
});

const formatYear = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).getFullYear();
};

const handleImageError = (e) => {
  e.target.src = '/placeholder-poster.jpg';
};
</script>

<style>
.movie-section {
  width: 100%;
  margin: 1rem 0;
  position: relative;
}

.movie-swiper {
  padding: 0.5rem 2rem;
}

.movie-slide {
  width: auto !important;
}

.movie-card {
  transition: transform 0.2s ease;
  cursor: pointer;
}

.movie-card:hover {
  transform: scale(1.1);
  z-index: 1;
}

/* Swiper 네비게이션 버튼 커스텀 스타일 */
.swiper-button-prev,
.swiper-button-next {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  color: white !important;
  opacity: 0;
  transition: all 0.3s ease;
}

.swiper-button-prev::after,
.swiper-button-next::after {
  font-size: 14px !important;
}

.movie-section:hover .swiper-button-prev,
.movie-section:hover .swiper-button-next {
  opacity: 1;
}

.swiper-button-prev:hover,
.swiper-button-next:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.swiper-button-disabled {
  display: none !important;
}

/* 반응형 디자인 */
@media (max-width: 640px) {
  .movie-card img {
    width: 80px;
    height: 120px;
  }

  .swiper-button-prev,
  .swiper-button-next {
    width: 24px !important;
    height: 24px !important;
  }

  .swiper-button-prev::after,
  .swiper-button-next::after {
    font-size: 12px !important;
  }
}
</style>