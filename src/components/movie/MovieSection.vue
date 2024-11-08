<!--영화 목록 표시 -->
<template>
  <section class="movie-section py-8">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">{{ title }}</h2>
        <div v-if="showViewToggle" class="flex items-center space-x-4">
          <button
            class="p-2 text-gray-400 hover:text-white"
            :class="{ 'text-white': viewMode === 'grid' }"
            @click="viewMode = 'grid'"
          >
            <i class="fas fa-th"></i>
          </button>
          <button
            class="p-2 text-gray-400 hover:text-white"
            :class="{ 'text-white': viewMode === 'list' }"
            @click="viewMode = 'list'"
          >
            <i class="fas fa-list"></i>
          </button>
        </div>
      </div>

      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <MovieCard
          v-for="movie in movies"
          :key="movie.id"
          :movie="movie"
          @wishlist-updated="$emit('wishlist-updated')"
          @show-detail="$emit('show-detail', $event)"
        />
      </div>

      <!-- List View -->
      <div v-else class="space-y-4">
        <div
          v-for="movie in movies"
          :key="movie.id"
          class="flex items-center space-x-4 bg-gray-800 rounded-lg p-4"
        >
          <img
            :src="`https://image.tmdb.org/t/p/w92${movie.poster_path}`"
            :alt="movie.title"
            class="w-8 h-10 object-cover rounded"
          />
          <div class="flex-grow">
            <h3 class="font-bold">{{ movie.title }}</h3>
            <p class="text-sm text-gray-400">{{ new Date(movie.release_date).toLocaleDateString('ko-KR') }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="$emit('wishlist-updated', movie)"
              class="text-gray-400 hover:text-red-500"
            >
              <i class="fas fa-heart"></i>
            </button>
            <button
              @click="$emit('show-detail', movie)"
              class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              상세정보
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
      </div>

      <!-- Pagination or Load More -->
      <div v-if="!loading && totalPages > 1" class="mt-8">
        <div v-if="infiniteScroll" class="text-center">
          <button
            v-if="currentPage < totalPages"
            @click="$emit('load-more')"
            class="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded"
          >
            더보기
          </button>
        </div>
        <div v-else class="flex justify-center space-x-2">
          <button
            v-for="page in displayedPages"
            :key="page"
            @click="$emit('page-change', page)"
            class="px-4 py-2 rounded"
            :class="page === currentPage ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import MovieCard from '@/components/common/MovieCard.vue';

const props = defineProps({
  title: String,
  movies: Array,
  loading: Boolean,
  showViewToggle: Boolean,
  infiniteScroll: Boolean,
  totalPages: Number,
  currentPage: Number
});

const viewMode = ref('grid');

const displayedPages = computed(() => {
  if (!props.totalPages) return [];

  const pages = [];
  const maxPages = 5;
  let start = Math.max(1, props.currentPage - Math.floor(maxPages / 2));
  let end = Math.min(props.totalPages, start + maxPages - 1);

  if (end - start + 1 < maxPages) {
    start = Math.max(1, end - maxPages + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});
</script>