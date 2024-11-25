<template>
  <div class="page-wrapper">
    <PageHeader />

    <!-- LoadingSpinner 추가 -->
    <LoadingSpinner
      :loading="loading"
      :message="loadingMessage"
      type="full"
    />

    <div class="wishlist-container" :class="{ 'opacity-50': loading }">
      <!-- 페이지 헤더 섹션 -->
      <div class="header-section">
        <h1 class="header-title">내가 찜한 콘텐츠</h1>
        <div class="header-subtitle">
          <i class="fas fa-heart heart-icon"></i>
          <span>찜한 콘텐츠 {{ wishlistCount }}개</span>
        </div>
      </div>

      <!-- 빈 위시리스트 상태 -->
      <div v-if="wishlist.length === 0" class="empty-state">
        <i class="fas fa-heart empty-icon"></i>
        <h2 class="empty-text">아직 찜한 콘텐츠가 없습니다.</h2>
        <router-link to="/" class="browse-button">
          <i class="fas fa-film"></i>
          <span>콘텐츠 둘러보기</span>
        </router-link>
      </div>

      <!-- TableView 컴포넌트로 위시리스트 표시 -->
      <div v-if="!loading && wishlist.length > 0" class="content-section">
        <TableView
          :movies="paginatedWishlist"
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-changed="handlePageChange"
          @wishlist-updated="handleWishlistUpdate"
          @show-detail="handleShowDetail"
        />
      </div>
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
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

// 로딩 상태 관리 추가
const loading = ref(false);
const loadingMessage = ref('위시리스트를 불러오는 중...');

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
  loading.value = true;
  loadingMessage.value = `${page}페이지로 이동 중...`;

  try {
    currentPage.value = page;
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  } finally {
    loading.value = false;
  }

};

// 위시리스트 업데이트 핸들러
const handleWishlistUpdate = () => {
  loading.value = true;
  loadingMessage.value = '위시리스트 업데이트 중...';

  try { // 위시리스트가 업데이트되면 페이지 재계산
    const maxPage = Math.ceil(wishlist.value.length / moviesPerPage);
    if (currentPage.value > maxPage) {
      currentPage.value = maxPage || 1;
    }
  } finally {
    loading.value = false;
  }

};

// 영화 상세 정보 모달 핸들러
const handleShowDetail = (movie) => {
  loading.value = true;
  loadingMessage.value = '영화 상세 정보를 불러오는 중...';

  try {
    selectedMovie.value = movie;
    document.body.style.overflow = 'hidden';
  } finally {
    loading.value = false;
  }

};

// 모달 닫기 핸들러
const closeModal = () => {
  selectedMovie.value = null;
  document.body.style.overflow = '';
};

// 초기 데이터 로드
onMounted(async () => {
  loading.value = true;
  loadingMessage.value = '위시리스트를 불러오는 중...';

  try {
    window.addEventListener('scroll', handleScroll);
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: linear-gradient(to bottom, #1a1a1a, #0a0a0a);
  color: #ffffff;
}

.wishlist-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  padding-top: 6rem;
  transition: opacity 0.3s ease;
}

/* 헤더 섹션 스타일링 */
.header-section {
  position: relative;
  margin-bottom: 3rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-title {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(to right, #ff4d4d, #f9cb28);
  -webkit-background-clip: text;
  color: transparent;
  margin-bottom: 0.5rem;
}

.header-subtitle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
  font-size: 1.1rem;
}

.heart-icon {
  color: #ff4d4d;
  animation: pulse 2s infinite;
}

/* 빈 상태 스타일링 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
}

.empty-icon {
  font-size: 3rem;
  color: #ff4d4d;
  margin-bottom: 1.5rem;
  opacity: 0.6;
}

.empty-text {
  font-size: 1.25rem;
  color: #9ca3af;
  margin-bottom: 2rem;
}

.table-view {
  padding: 0 !important;
}
.movie-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5열 그리드 */
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding: 1rem;
}
.browse-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(to right, #ff4d4d, #f9cb28);
  border-radius: 2rem;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 77, 77, 0.3);
}

.browse-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 77, 77, 0.4);
}

.browse-button i {
  font-size: 1.1rem;
}

/* 콘텐츠 섹션 스타일링 */
.content-section {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* 애니메이션 */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .wishlist-container {
    padding: 1rem;
    padding-top: 5rem;
  }

  .header-title {
    font-size: 2rem;
  }

  .header-subtitle {
    font-size: 1rem;
  }

  .content-section {
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .header-title {
    font-size: 1.75rem;
  }

  .empty-state {
    padding: 3rem 1rem;
  }

  .browse-button {
    padding: 0.5rem 1.25rem;
    font-size: 0.9rem;
  }
}

/* 모달 스크롤 방지 */
:global(body.modal-open) {
  overflow: hidden;
}

/* opacity 클래스 추가 */
.opacity-50 {
  opacity: 0.5;
}

@media screen and (max-width: 430px) {
  .wishlist-container {
    padding: 1rem; /* 컨테이너 내부 여백 조정 */
    overflow: hidden; /* 컨테이너 내부 콘텐츠가 넘치지 않도록 설정 */
  }

  .movie-card {
    height: auto; /* 높이를 콘텐츠에 맞게 자동 조정 */
    margin: 0 auto; /* 카드가 컨테이너 중앙에 위치하도록 설정 */
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 0.5rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    overflow: hidden; /* 카드 내 요소가 밖으로 나오는 것을 방지 */
    max-width: 90%; /* 카드가 부모 컨테이너 너비를 넘지 않도록 제한 */
  }

  :deep(.movie-card img) {
    width: 40%; /* 이미지 너비를 줄임 */
    max-width: 90px; /* 너무 커지지 않도록 최대 크기 제한 */
    height: auto; /* 이미지 비율 유지 */
    border-radius: 0.5rem;
    object-fit: cover; /* 비율을 유지하며 잘림 방지 */
  }

  .movie-title {
    font-size: 0.9rem;
    text-align: center; /* 텍스트 중앙 정렬 */
    margin-top: 0.5rem;
  }

  .release-date {
    font-size: 0.8rem;
    color: #9ca3af;
    margin-top: 0.3rem;
  }

  .action-buttons-container {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .action-button {
    width: 36px; /* 버튼 크기 조정 */
    height: 36px;
    font-size: 0.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

</style>