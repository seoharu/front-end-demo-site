<template>
  <div class="movie-section" v-if="section && section.movies.length > 0">
    <h2 class="text-white text-lg font-bold mb-1 px-4">{{ section.title }}</h2>

    <Swiper
      :modules="modules"
      :slides-per-view="'auto'"
      :space-between="112"
      :navigation="{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }"
      :mousewheel="{ forceToAxis: true, releaseOnEdges: true }"
      class="movie-swiper"
    >
      <SwiperSlide
        v-for="movie in section.movies"
        :key="movie.id"
        class="movie-slide !w-[180px]"
      >
        <div
          class="movie-card"
          @click="$emit('show-detail', movie)"
        >
          <div class="relative group">
            <img
              :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`"
              :alt="movie.title"
              class="rounded-md w-[100px] h-[150px] object-cover"
              @error="handleImageError"
            >
            <!-- 호버 오버레이 -->
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60
                        transition-all duration-300 rounded-md">
              <div class="absolute bottom-0 w-full p-1 opacity-0 group-hover:opacity-100
                          transition-opacity duration-300">
                <h3 class="text-white font-bold text-[10px] line-clamp-1">{{ movie.title }}</h3>
                <div class="flex items-center gap-0.5 mt-0.5">
                  <span class="text-white/80 text-[8px]">
                    {{ formatYear(movie.release_date) }}
                  </span>
                  <span v-if="movie.vote_average" class="text-white/80 text-[8px]">
                    • ⭐ {{ movie.vote_average.toFixed(1) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>

      <div class="swiper-button-prev !w-6 !h-6 !-left-3"></div>
      <div class="swiper-button-next !w-6 !h-6 !-right-3"></div>
    </Swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/mousewheel';

const modules = [Navigation, Mousewheel];

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

<style scoped>
.movie-section {
  width: 100%;
  margin: 0.5rem 0;
  position: relative;
  overflow: visible; /* 추가 */
  padding: 0.5rem 1rem; /* 좌우 여백 추가 */
}

.movie-swiper {
  overflow: visible !important; /* 추가 */
  padding: 0.5rem 0; /* 상하 여백만 유지 */
}

.movie-slide {
  width: auto !important;
  min-width: 100px;
  overflow: visible !important; /* 추가 */
}

.movie-card {
  transition: transform 0.2s ease;
  cursor: pointer;
  width: 100px;
  transform-origin: center center; /* 추가 */
}

.movie-card:hover {
  transform: scale(1.05);
  z-index: 1;
}

/* 네비게이션 버튼 스타일 */
.swiper-button-prev,
.swiper-button-next {
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  color: white !important;
  opacity: 0;
  transition: all 0.3s ease;
  height: 30px !important;
  width: 30px !important;
}

.swiper-button-prev::after,
.swiper-button-next::after {
  font-size: 12px !important;
}

.movie-section:hover .swiper-button-prev,
.movie-section:hover .swiper-button-next {
  opacity: 1;
}

/* 모바일 대응 */
@media (max-width: 640px) {
  .movie-slide {
    min-width: 80px;
  }

  .movie-card {
    width: 80px;
  }

  .movie-card img {
    width: 80px !important;
    height: 120px !important;
  }
  .swiper-button-prev {
    left: -2px !important;
  }

  .swiper-button-next {
    right: -2px !important;
  }
}
</style>