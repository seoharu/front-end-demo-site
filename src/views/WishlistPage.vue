<template>
  <div class="page-wrapper">
    <!-- 공통 헤더 컴포넌트 -->
    <PageHeader />

    <!-- 메인 콘텐츠 -->
    <div class="wishlist-container min-h-screen bg-gray-900 text-white p-4 md:p-8 pt-24">
      <!-- 페이지 헤더 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">내가 찜한 콘텐츠</h1>
        <p class="text-gray-400">
          찜한 콘텐츠 {{ wishlistCount }}개
        </p>
      </div>

      <!-- 빈 위시리스트 상태 -->
      <div v-if="wishlist.length === 0" class="text-center py-16">
        <i class="fas fa-heart text-4xl text-gray-600 mb-4"></i>
        <h2 class="text-xl text-gray-400">아직 찜한 콘텐츠가 없습니다.</h2>
        <router-link
          to="/"
          class="inline-block mt-4 px-6 py-2 bg-red-600 rounded-md hover:bg-red-700 transition-colors"
        >
          콘텐츠 둘러보기
        </router-link>
      </div>

      <!-- TableView 컴포넌트로 위시리스트 표시 -->
      <TableView
        v-else
        :movies="paginatedWishlist"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-changed="handlePageChange"
        @wishlist-updated="handleWishlistUpdate"
        @show-detail="handleShowDetail"
      />
    </div>

    <!-- 영화 상세 모달 -->
    <MovieDetailModal
      v-if="selectedMovie"
      :movie="selectedMovie"
      @close="closeModal"
    />

    <!-- 스크롤 탑 컴포넌트 -->
    <ScrollToTop v-show="showScrollTop" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useWishlist } from '@/composables/useWishlist';
import PageHeader from '@/components/layout/PageHeader.vue';
import ScrollToTop from '@/components/layout/ScrollToTop.vue';
import TableView from '@/components/common/viewType/TableView.vue';
import MovieDetailModal from '@/components/movie/MovieDetailModal.vue';
import MovieCard from '@/components/common/MovieCard.vue';
import PaginationNav from '@/components/common/PaginationNav.vue';

const { wishlist, wishlistCount } = useWishlist();
const showScrollTop = ref(false);
const currentPage = ref(1);
const moviesPerPage = 20;
const selectedMovie = ref(null);

// 페이지네이션 계산
const totalPages = computed(() => Math.ceil(wishlist.value.length / moviesPerPage));

// 현재 페이지의 영화 목록
const paginatedWishlist = computed(() => {
  const start = (currentPage.value - 1) * moviesPerPage;
  const end = start + moviesPerPage;
  return wishlist.value.slice(start, end);
});

// 스크롤 이벤트 핸들러
const handleScroll = () => {
  showScrollTop.value = window.scrollY > 500;
};

// 페이지 변경 핸들러
const handlePageChange = (page) => {
  currentPage.value = page;
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// 위시리스트 업데이트 핸들러
const handleWishlistUpdate = () => {
  // 위시리스트가 업데이트되면 페이지 재계산
  const maxPage = Math.ceil(wishlist.value.length / moviesPerPage);
  if (currentPage.value > maxPage) {
    currentPage.value = maxPage || 1;
  }
};

// 영화 상세 정보 모달 핸들러
const handleShowDetail = (movie) => {
  selectedMovie.value = movie;
  document.body.style.overflow = 'hidden';
};

// 모달 닫기 핸들러
const closeModal = () => {
  selectedMovie.value = null;
  document.body.style.overflow = '';
};

// 라이프사이클 훅
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.wishlist-container {
  max-width: 1440px;
  margin: 0 auto;
}

/* 반응형 디자인을 위한 미디어 쿼리 */
@media (max-width: 640px) {
  .wishlist-container {
    padding-top: 5rem;
  }
}

/* 모달이 열려있을 때 배경 스크롤 방지 */
:global(body.modal-open) {
  overflow: hidden;
}
</style>