<template>
  <div class="infinite-scroll-view" ref="scrollContainer">
    <!-- 영화 카드 그리드 -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        @wishlist-updated="$emit('wishlist-updated', $event)"
        @show-detail="$emit('show-detail', $event)"
      />
    </div>

    <!-- 로딩 상태 디버깅 -->
    <div class="text-center py-2">
      <p>Loading: {{ loading }}</p>
      <p>Has More: {{ hasMore }}</p>
      <p>Movies Length: {{ movies.length }}</p>
    </div>


    <!-- 로딩 스피너 -->
    <div
      v-if="loading && hasMore"
      class="flex flex-col justify-center items-center py-4"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <p class="mt-2 text-gray-600">더 많은 영화를 불러오는 중...</p>
    </div>

    <!-- 관찰 대상 요소 -->
    <div
      v-if="hasMore"
      ref="observerTarget"
      class="h-4 w-full"
    ></div>

    <!-- ScrollToTop 컴포넌트 -->
    <ScrollToTop />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import MovieCard from "@/components/common/MovieCard.vue";
import ScrollToTop from "@/components/layout/ScrollToTop.vue";

const props = defineProps({
  movies: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  hasMore: {
    type: Boolean,
    default: true
  }
});

// Props 변경 감지를 위한 watch 추가
watch(() => props.loading, (newValue) => {
  console.log('Loading state changed:', newValue);
});

watch(() => props.hasMore, (newValue) => {
  console.log('HasMore state changed:', newValue);
});

watch(() => props.movies, (newValue) => {
  console.log('Movies updated, length:', newValue.length);
});

const emit = defineEmits(['load-more', 'wishlist-updated', 'show-detail']);

const scrollContainer = ref(null);
const observerTarget = ref(null);
let observer = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting && !props.loading && props.hasMore) {
        emit('load-more');
      }
    },
    {
      root: null,
      rootMargin: '100px',
      threshold: 0
    }
  );

  if (observerTarget.value) {
    observer.observe(observerTarget.value);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
.infinite-scroll-view {
  min-height: 100vh;
  position: relative;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>