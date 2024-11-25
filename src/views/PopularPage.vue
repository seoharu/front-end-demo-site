<template>
  <div class="popular-movies-container">
    <!-- 헤더 컴포넌트 -->
    <PageHeader />

    <!-- 로딩 컴포넌트 -->
    <LoadingSpinner
      :loading="loading"
      :message="'영화 정보를 불러오는 중입니다.'"
    />

    <!-- 메인 컨텐츠 (헤더 높이만큼 여백) -->
    <div class="content-wrapper mt-16 px-4 py-6" :class="{ 'opacity-50': loading }">
      <!-- 뷰 토글 섹션 -->
      <div
        class="view-toggle-header"
        :class="{ 'header-scrolled': isScrolled }"
        :style="{
          opacity: headerOpacity,
          backgroundColor: `rgba(17, 17, 17, ${backgroundOpacity})`
        }"
      >

      <div class="contents">
<!--        <h1 class="text-2xl font-bold text-deepskyblue">대세 콘텐츠</h1>-->
        <ViewToggle
          :initial-view="viewType"
          @viewType-changed="handleViewTypeChange"
        />
      </div>
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
import {ref, onMounted, watch, computed, onUnmounted } from 'vue';
import PageHeader from '@/components/layout/PageHeader.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
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
  currentPage,
  totalPages,
  hasMore,
  fetchPopularMovies,
} = useMovies();

// loading 상태 관리를 더 명확하게 정의
const loading = ref(false);
const loadingMessage = ref('영화 정보를 불러오는 중...');

const { updateWishlist } = useWishlist();

// Add new refs for scroll handling
const isScrolled = ref(false)
const scrollY = ref(0)

const headerOpacity = computed(() => {
  return Math.max(0.8, 1 - (scrollY.value / 400))
})

const backgroundOpacity = computed(() => {
  return Math.min(0.95, 0.7 + (scrollY.value / 400))
})

let scrollTimeout
const handleScroll = () => {
  if (scrollTimeout) {
    window.cancelAnimationFrame(scrollTimeout)
  }

  scrollTimeout = window.requestAnimationFrame(() => {
    scrollY.value = window.scrollY
    isScrolled.value = window.scrollY > 30
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  // ... your existing onMounted logic
})



// 페이지 변경 감지
watch(currentPage, async (newPage) => {
  console.log('Page changed to:', newPage)
})

// 뷰 타입 변경 핸들러
const handleViewTypeChange = async (newType) => {
  try {
    loading.value = true;
    loadingMessage.value = '보기 방식 변경 중...';

    viewType.value = newType;
    if (newType === 'table') {
      await fetchPopularMovies(1);
    } else {
      allMovies.value = [];
      await handleLoadMore();
    }
  } catch (err) {
      console.error('Failed to change view type:', err);
  } finally {
    loading.value = false;
  }
};

// 페이지 변경 핸들러
const handlePageChange = async (page) => {
 console.log('Changing to page:', page)
  if (page === currentPage.value) return

  try {
    loading.value = true
    loadingMessage.value = `${page}페이지로 이동 중...`;

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
    loadingMessage.value = '추가 영화를 불러오는 중...';

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
    loading.value = true;
    loadingMessage.value = '영화 상세 정보를 불러오는 중...';

    // TMDB API에서 영화 상세 정보 가져오기
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${localStorage.getItem('TMDb-Key')}&language=ko-KR`
    );
    selectedMovie.value = await response.json();
  } catch (error) {
    console.error('영화 상세 정보 로드 실패:', error);
  } finally {
    loading.value = false;
  }
};

// 초기 데이터 로드
onMounted(async () => {
  try {
    loading.value = true;
    loadingMessage.value = '대세 콘텐츠를 불러오는 중...';

    await fetchPopularMovies(1)
  } catch (err) {
    console.error('Failed to load initial movies:', err)
  } finally {
    loading.value = false;
  }
  window.removeEventListener('scroll', handleScroll)
})

</script>

<style scoped>
.contents {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  margin-top: 60px;
}
.popular-movies-container {
  min-height: 100vh;
  background-color: rgb(17, 17, 17);
}

.content-wrapper {
  max-width: 1440px;
  margin: 0 auto;
}

.view-toggle-header {
  position: sticky;
  top: 64px;
  z-index: 10;
  transition: all 0.3s ease;
  padding: 1rem;
  backdrop-filter: blur(8px);
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.header-scrolled {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.contents {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  margin-top: 60px;
}

@media (max-width: 640px) {
 .content-wrapper {
   padding-left: 0.75rem;
   padding-right: 0.75rem;
 }

 .view-toggle-header {
   top: 56px;
   padding: 0.75rem;
   margin-bottom: 1rem;
 }

 .header-scrolled {
   padding: 0.5rem 0.75rem;
 }

 .contents {
   margin-top: 40px;
   margin-bottom: 4px;
   flex-direction: column;
   gap: 0.5rem;
 }
}

@media (max-width: 480px) {
 .content-wrapper {
   padding: 0.5rem;
   margin-top: 3.5rem;
 }

 .view-toggle-header {
   top: 48px;
   padding: 0.5rem;
   border-radius: 8px;
 }

 .contents {
   margin-top: 30px;
 }
}

@media (max-width: 430px) {
 .content-wrapper {
   padding: 0.25rem;
 }

 .view-toggle-header {
   top: 44px;
   border-radius: 6px;
 }

 .contents {
   margin-top: 25px;
   gap: 0.25rem;
 }
}

</style>