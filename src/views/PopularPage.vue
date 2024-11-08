<template>
  <div class="popular-movies-container">
    <!-- 헤더 컴포넌트 -->
    <PageHeader />

    <!-- 메인 컨텐츠 (헤더 높이만큼 여백) -->
    <div class="content-wrapper mt-16 px-4 py-6">
      <!-- 뷰 토글 섹션 -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-deepskyblue">대세 콘텐츠</h1>
        <ViewToggle
          :initial-view="viewType"
          @viewType-changed="handleViewTypeChange"
        />
      </div>

      <!-- 뷰 타입에 따른 컨텐츠 표시 -->
      <TableView
        v-if="viewType === 'table'"
        :movies="movies"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-changed="handlePageChange"
        @wishlist-updated="handleWishlistUpdate"
        @show-detail="handleShowDetail"
      />

      <InfiniteScrollView
        v-else
        :movies="allMovies"
        :loading="loading"
        :has-more="hasMore"
        @load-more="handleLoadMore"
        @wishlist-updated="handleWishlistUpdate"
        @show-detail="handleShowDetail"
      />
    </div>

    <!-- 로딩 컴포넌트 -->
    <Loading
      :loading="loading"
      :message="loadingMessage"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import PageHeader from '@/components/layout/PageHeader.vue';
import Loading from '@/components/common/Loading.vue';
import ViewToggle from '@/components/common/viewType/ViewToggle.vue';
import TableView from '@/components/common/viewType/TableView.vue';
import InfiniteScrollView from "@/components/common/viewType/InfiniteScrollView.vue";
import { useMovies } from '@/composables/useMovies';
import { usePagination } from '@/composables/usePagination';
import { useWishlist } from '@/composables/useWishlist';
import { useAuth } from '@/composables/useAuth';

// 인증 상태 확인
const { checkAuth } = useAuth();
checkAuth();

// 상태 관리
const viewType = ref('table');
const loadingMessage = ref('영화 정보를 불러오는 중...');
const allMovies = ref([]); // 무한 스크롤용 전체 영화 목록

const {
  movies,
  loading,
  fetchPopularMovies,
  error
} = useMovies();

const {
  currentPage,
  totalPages,
  handlePageChange
} = usePagination();

const { updateWishlist } = useWishlist();

// 무한 스크롤 관련 상태
const hasMore = computed(() => {
  return currentPage.value < totalPages.value;
});

// 뷰 타입 변경 핸들러
const handleViewTypeChange = async (newType) => {
  viewType.value = newType;
  if (newType === 'table') {
    // 테이블 뷰로 전환 시 초기화
    currentPage.value = 1;
    allMovies.value = [];
    await fetchPopularMovies(currentPage.value);
  } else {
    // 무한 스크롤 뷰로 전환 시 초기화
    currentPage.value = 1;
    allMovies.value = [];
    await handleLoadMore();
  }
};

// 무한 스크롤 로드 더 보기 핸들러
const handleLoadMore = async () => {
  console.log('LoadMore triggered');
  console.log('Current loading state:', loading.value);
  console.log('Current hasMore state:', hasMore.value);

  if (loading.value || !hasMore.value) {
    console.log('Loading blocked - loading:', loading.value, 'hasMore:', hasMore.value);
    return;
  }

  try {
    loading.value = true;
    console.log('Loading started');
    const response = await fetchPopularMovies(currentPage.value + 1);
    if (response?.results) {
      allMovies.value = [...allMovies.value, ...response.results];
      currentPage.value += 1;
      console.log('New page:', currentPage.value);
      console.log('Total movies:', allMovies.value.length);
    }
  } catch (err) {
    console.error('Error loading more movies:', err);
  } finally {
    loading.value = false;
    console.log('Loading finished');
  }
};

// 페이지 변경 감지 및 데이터 로드 (테이블 뷰용)
watch(currentPage, async (newPage) => {
  if (viewType.value === 'table') {
    await fetchPopularMovies(newPage);
  }
});

// 에러 감지
watch(error, (newError) => {
  if (newError) {
    console.error('Error:', newError);
  }
});

// movies 변경 감지
watch(movies, (newMovies) => {
  if (viewType.value === 'table') {
    // 테이블 뷰일 때는 movies를 직접 사용
    allMovies.value = newMovies;
  }
}, { immediate: true });

// 위시리스트 업데이트 핸들러
const handleWishlistUpdate = (movie) => {
  updateWishlist(movie);
};

// 영화 상세 정보 표시 핸들러
const handleShowDetail = (movieId) => {
  console.log('Show detail for movie:', movieId);
};

// 초기 데이터 로드
fetchPopularMovies(currentPage.value);
</script>

<style scoped>
.popular-movies-container {
  min-height: 100vh;
}

.content-wrapper {
  max-width: 1440px;
  margin: 0 auto;
}

@media (max-width: 640px) {
  .content-wrapper {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>