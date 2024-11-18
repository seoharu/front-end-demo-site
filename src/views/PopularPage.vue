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
      :message="'영화 정보를 불러오는 중입니다.'"
    />
    <!-- 영화 상세정보 모달 추가 -->
    <MovieDetail
      v-if="selectedMovie"
      :movie="selectedMovie"
      @close="selectedMovie = null"
      @wishlist-updated="handleWishlistUpdate"
    />
  </div>

</template>

<script setup>
import {ref, onMounted, watch } from 'vue';
import PageHeader from '@/components/layout/PageHeader.vue';
import Loading from '@/components/common/Loading.vue';
import ViewToggle from '@/components/common/viewType/ViewToggle.vue';
import TableView from '@/components/common/viewType/TableView.vue';
import InfiniteScrollView from "@/components/common/viewType/InfiniteScrollView.vue";
import MovieDetail from '@/components/movie/MovieDetailModal.vue';
import {useMovies} from '@/composables/useMovies';
import {useWishlist} from '@/composables/useWishlist';
import {useAuth} from '@/composables/useAuth';

// 인증 상태 확인
const { checkAuth } = useAuth();
checkAuth();

// 상태 관리
const viewType = ref('table');
const selectedMovie = ref(null);
const allMovies = ref([]); // 무한 스크롤용 전체 영화 목록

const {
  movies,
  loading,
  currentPage,
  totalPages,
  hasMore,
  fetchPopularMovies,
} = useMovies();


const { updateWishlist } = useWishlist();
// 페이지 변경 감지
watch(currentPage, async (newPage) => {
  console.log('Page changed to:', newPage)
})

// 뷰 타입 변경 핸들러
const handleViewTypeChange = async (newType) => {
  viewType.value = newType;
  if (newType === 'table') {
    await fetchPopularMovies(1);
  } else {
    allMovies.value = [];
    await handleLoadMore();
  }
};

// 페이지 변경 핸들러
const handlePageChange = async (page) => {
 console.log('Changing to page:', page)
  if (page === currentPage.value) return

  try {
    loading.value = true
    await fetchPopularMovies(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    console.error('Failed to change page:', err)
  } finally {
    loading.value = false
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
    console.log('API Response:', response);
    if (response?.results) {
      // 무한 스크롤일 때는 데이터 누적
      allMovies.value = [...allMovies.value, ...response.results];
      currentPage.value += 1;

      // 다음 페이지가 있는지 판단하여 hasMore 업데이트
      hasMore.value = currentPage.value < response.total_pages;
      console.log('Updated hasMore state:', hasMore.value);
    } else {
      hasMore.value = false;
      console.log('No more movies available');
    }
  } catch (err) {
    console.error('Error loading more movies:', err);
  } finally {
    loading.value = false;
    console.log('Loading finished');
  }
};



// 위시리스트 업데이트 핸들러
const handleWishlistUpdate = (movie) => {
  updateWishlist(movie);
};

// 영화 상세 정보 표시 핸들러
const handleShowDetail = async (movieId) => {
  try {
    // TMDB API에서 영화 상세 정보 가져오기
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${localStorage.getItem('TMDb-Key')}&language=ko-KR`
    );
    selectedMovie.value = await response.json();
  } catch (error) {
    console.error('영화 상세 정보 로드 실패:', error);
  }
};

// 초기 데이터 로드
onMounted(async () => {
  try {
    await fetchPopularMovies(1)
  } catch (err) {
    console.error('Failed to load initial movies:', err)
  }
})

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
