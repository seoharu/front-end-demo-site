<template>
  <div class="movie-slider my-8 relative" v-if="section && section.movies.length > 0">
    <h2 class="text-white text-xl font-bold mb-4">{{ section.title }}</h2>
    <div class="slider-container flex items-center overflow-hidden relative">
      <button @click="scrollLeft" class="absolute left-0 z-10 p-2 bg-gray-800 bg-opacity-50 rounded-full">
        <font-awesome-icon icon="fas fa-chevron-left" class="text-white text-xl" />
      </button>
      <div ref="sliderTrack" class="slider-track flex transition-transform duration-300 ease-in-out">
        <div v-for="movie in section.movies" :key="movie.id" class="movie-card mr-4">
          <div @click="$emit('show-detail', movie)" class="movie-poster cursor-pointer">
            <img :src="movie.posterUrl" alt="영화 포스터" class="w-40 h-60 rounded-lg">
          </div>
          <div class="text-white text-center mt-2">{{ movie.title }}</div>
        </div>
      </div>
      <button @click="scrollRight" class="absolute right-0 z-10 p-2 bg-gray-800 bg-opacity-50 rounded-full">
        <font-awesome-icon icon="fas fa-chevron-right" class="text-white text-xl" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue';

const props = defineProps({
  section: {
    type: Object,
    required: true,
    default: () => ({ title: '', movies: [] })
  }
});

const sliderTrack = ref(null);

const scrollLeft = () => {
  if (sliderTrack.value) {
    sliderTrack.value.scrollBy({ left: -300, behavior: 'smooth' });
  }
};

const scrollRight = () => {
  if (sliderTrack.value) {
    sliderTrack.value.scrollBy({ left: 300, behavior: 'smooth' });
  }
};
</script>

<style scoped>
.movie-slider {
  position: relative;
}

.slider-container {
  overflow: hidden;
  position: relative;
}

.slider-track {
  display: flex;
  transition: transform 0.3s ease-in-out;
}

.movie-card {
  min-width: 160px;
}

.movie-poster img {
  transition: transform 0.3s ease;
}

.movie-poster img:hover {
  transform: scale(1.05);
}
</style>
