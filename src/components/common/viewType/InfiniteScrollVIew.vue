// components/common/InfiniteScrollView.vue
<template>
  <div
    class="infinite-scroll-view"
    ref="scrollContainer"
  >
    <!-- 영화 카드 그리드 -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        @wishlist-updated="$emit('wishlist-updated')"
        @show-detail="$emit('show-detail', $event)"
      />
    </div>

    <!-- 로딩 스피너 -->
    <div
      v-if="loading"
      class="flex justify-center items-center py-4"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>

    <!-- ScrollToTop 컴포넌트 사용 -->
    <ScrollToTop />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import MovieCard from './MovieCard.vue';
import ScrollToTop from './ScrollToTop.vue';

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

const emit = defineEmits(['load-more', 'wishlist-updated', 'show-detail']);
const scrollContainer = ref(null);

// 스크롤 이벤트 핸들러
const handleScroll = () => {
  const container = scrollContainer.value;
  if (!container) return;

  // 무한 스크롤 로직
  if (props.loading || !props.hasMore) return;

  const scrollBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 100;

  if (scrollBottom) {
    emit('load-more');
  }
};

// 컴포넌트 라이프사이클 훅
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>