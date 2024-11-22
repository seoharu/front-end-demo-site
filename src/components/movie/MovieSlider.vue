<template>
 <div class="movie-section" v-if="section && section.movies.length > 0">
   <h2 class="text-white text-lg font-bold mb-1 px-4">{{ section.title }}</h2>

   <Swiper
     :modules="modules"
     :slides-per-view="'auto'"
     :space-between="108"
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
       class="movie-slide"
     >
       <div
         class="movie-card"
         @click="$emit('show-detail', movie)"
       >
         <div class="relative">
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

             <div class="flex gap-1 mt-1">
                  <div @click.stop> <!-- 찜하기 버튼만 이벤트 전파 중단 -->
                    <WishlistClick
                      :movie="movie"
                      class="compact-mode"
                    />
                  </div>
                  <button
                    class="flex-1 py-1 px-2 rounded bg-white/20 hover:bg-white/30 transition-colors
                           text-[8px] flex items-center justify-center gap-1"
                  >
                    <i class="fas fa-info-circle"></i>
                    상세정보
                  </button>
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
import WishlistClick from "@/components/common/WishlistClick.vue";

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
 padding: 0.5rem 1rem;
 overflow: visible;
}

.movie-swiper {
 position: relative;
 overflow: visible !important;
 padding: 0.5rem 0;
}

.movie-slide {
 position: relative !important;
 width: auto !important;
 min-width: 100px;
 overflow: visible !important;
}

.movie-card {
 position: relative;
 transform-origin: center center;
 transition: all 0.3s ease;
 cursor: pointer;
 width: 100px;
}

/* relative div의 스타일 수정 */
.relative {
 position: relative;
 z-index: 1;
 transition: all 0.3s ease;
}

/* hover 효과 수정 */
.movie-card:hover .relative {
 transform: scale(1.2);
 z-index: 100 !important;
 position: relative;
}

/* 비활성 카드 */
.movie-swiper:hover .movie-card:not(:hover) .relative {
 transform: scale(0.95);
 filter: brightness(0.7);
 z-index: 1;
 transition-delay: 0.1s; /* 약간의 지연 시간 추가 */
}

/* 이미지 컨테이너 */
.movie-card img {
 position: relative;
 z-index: 1;
}

/* 호버 시 이미지와 오버레이도 z-index 상승 */
.movie-card:hover img,
.movie-card:hover .absolute {
 z-index: 1000;
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