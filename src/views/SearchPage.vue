<template>
  <div class="filter-movies-container min-h-screen bg-gray-900">
    <PageHeader />

    <!-- LoadingSpinner 컴포넌트 -->
    <LoadingSpinner
      :loading="loading"
      :message="loadingMessage"
      type="full"
    />

    <div class="search-page" :class="{ 'opacity-50': loading }">
      <div
        class="filters-section"
        :class="{ 'filters-scrolled': isScrolled }"
        :style="{
          opacity: filterOpacity,
          backgroundColor: `rgba(17, 17, 17, ${backgroundOpacity})`
        }"
      >
        <div class="filters-container">
          <GenreFilter
            ref="genreFilterRef"
            :selected-genre="filters.genre"
            @change="value => updateFilter('genre', value)"
          />
          <RatingFilter
            ref="ratingFilterRef"
            :selected-rating="filters.rating"
            @change="value => updateFilter('rating', value)"
          />
          <LanguageFilter
            ref="languageFilterRef"
            :selected-language="filters.language"
            @change="value => updateFilter('language', value)"
          />
          <YearFilter
            ref="yearFilterRef"
            :selected-year="filters.year"
            @change="value => updateFilter('year', value)"
          />
          <SortFilter
            ref="sortFilterRef"
            :selected-sort="filters.sort"
            @change="value => updateFilter('sort', value)"
          />

          <button class="reset-btn" @click="handleReset">
            <i class="fas fa-undo"></i>
            필터 초기화
          </button>
        </div>

        <!-- 뷰 토글 섹션을 별도의 div로 분리 -->
        <div class="view-toggle-section">
          <ViewToggle :initial-view="viewType" @viewType-changed="changeViewType" />
        </div>
      </div>

      <!-- 컨텐츠 영역 -->
      <div v-if="!loading && processedMovies.length > 0">
        <div class="table-view" v-if="viewType === 'table'">
          <TableView
            :movies="processedMovies"
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-changed="handlePageChange"
            @wishlist-updated="handleWishlistUpdate"
            @show-detail="handleShowDetail"
          />
        </div>

        <InfiniteScrollView
          v-else
          :movies="processedMovies"
          :loading="loadingMore"
          :has-more="hasMoreMovies"
          @load-more="loadMoreMovies"
          @wishlist-updated="handleWishlistUpdate"
          @show-detail="handleShowDetail"
        />
      </div>

      <!-- 검색 결과 없음 표시 -->
      <div v-if="!loading && processedMovies.length === 0" class="no-results">
        <div class="empty-state">
          <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
          <p class="text-white text-lg">원하는 영화를 찾아보세요</p>
          <p class="text-gray-400 text-sm mt-2">장르, 평점, 언어 등으로 필터링할 수 있습니다</p>
        </div>
        <!-- Add some movie suggestions or categories here -->
        <div class="suggestions mt-8">
          <h3 class="text-white text-xl mb-4">추천 장르</h3>
          <div class="genre-chips">
            <button
              v-for="genre in ['액션', '코미디', '로맨스', 'SF']"
              :key="genre"
              class="genre-chip"
              @click="() => updateFilter('genre', genre)"
            >
              {{ genre }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useFiltering } from '@/composables/useFiltering'
import TableView from '@/components/common/viewType/TableView.vue'
import InfiniteScrollView from '@/components/common/viewType/InfiniteScrollView.vue'
import ViewToggle from '@/components/common/viewType/ViewToggle.vue'
import movieService from '@/services/movieService'
import GenreFilter from '@/components/movieFilters/GenreFilter.vue'
import RatingFilter from '@/components/movieFilters/RatingFilter.vue'
import LanguageFilter from '@/components/movieFilters/LanguageFilter.vue'
import YearFilter from '@/components/movieFilters/YearFilter.vue'
import SortFilter from '@/components/movieFilters/SortFilter.vue'
import PageHeader from "@/components/layout/PageHeader.vue"
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

// useFiltering 설정
const {
  filters,
  updateFilter,
  resetFilters,
  filterMovies,
  sortMovies,
  getFilterParams
} = useFiltering()

// 상태 관리
const viewType = ref(localStorage.getItem('preferredViewType') || 'table')
const movies = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const loading = ref(false)
const loadingMore = ref(false)
const loadingMessage = ref('영화를 검색하는 중...')

// 개별 ref 선언
const genreFilterRef = ref(null)
const ratingFilterRef = ref(null)
const languageFilterRef = ref(null)
const yearFilterRef = ref(null)
const sortFilterRef = ref(null)

// Add new refs for scroll handling
const isScrolled = ref(false)
const scrollY = ref(0)

// Compute opacity based on scroll position
const filterOpacity = computed(() => {
  return Math.max(0.7, 1 - (scrollY.value / 500))
})

const backgroundOpacity = computed(() => {
  return Math.min(0.95, 0.7 + (scrollY.value / 500))
})

// Scroll handler with debounce
let scrollTimeout
const handleScroll = () => {
  if (scrollTimeout) {
    window.cancelAnimationFrame(scrollTimeout)
  }

  scrollTimeout = window.requestAnimationFrame(() => {
    scrollY.value = window.scrollY
    isScrolled.value = window.scrollY > 50
  })
}

// Lifecycle hooks for scroll listener
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// computed 속성들
const processedMovies = computed(() => {
  const filtered = filterMovies(movies.value)
  return sortMovies(filtered)
})

const hasMoreMovies = computed(() => {
  return currentPage.value < totalPages.value
})

// 영화 데이터 로드 함수
const loadMovies = async (page = 1, isLoadMore = false) => {
  try {
    if (!isLoadMore) {
      loading.value = true
      loadingMessage.value = '영화 정보를 불러오는 중...'
    }
    loadingMore.value = isLoadMore

    const response = await movieService.getMovies(page, getFilterParams.value)

    if (response?.data) {
      if (page === 1) {
        movies.value = response.data.results
      } else {
        movies.value = [...movies.value, ...response.data.results]
      }
      totalPages.value = response.data.total_pages
    }
  } catch (error) {
    console.error('영화 로딩 실패:', error)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// 페이지 변경 처리
const handlePageChange = async (page) => {
  if (page === currentPage.value) return

  currentPage.value = page
  loadingMessage.value = `${page}페이지로 이동 중...`
  await loadMovies(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 무한 스크롤 처리
const loadMoreMovies = async () => {
  if (!hasMoreMovies.value || loadingMore.value) return

  loadingMessage.value = '추가 영화를 불러오는 중...'
  currentPage.value++
  await loadMovies(currentPage.value, true)
}

// 필터 초기화
const handleReset = async () => {
  loading.value = true
  loadingMessage.value = '필터를 초기화하는 중...'

  // 각 필터 컴포넌트 초기화
  genreFilterRef.value?.reset()
  ratingFilterRef.value?.reset()
  languageFilterRef.value?.reset()
  yearFilterRef.value?.reset()
  sortFilterRef.value?.reset()

  resetFilters()
  currentPage.value = 1
  await loadMovies(1)
}

// 뷰 타입 변경
const changeViewType = (view) => {
  viewType.value = view
  localStorage.setItem('preferredViewType', view)
}

// 위시리스트 업데이트
const handleWishlistUpdate = (movie) => {
  // 위시리스트 업데이트 로직 구현
}

// 영화 상세 정보 표시
const handleShowDetail = async (movieId) => {
  try {
    loading.value = true
    loadingMessage.value = '영화 상세 정보를 불러오는 중...'

    const movieDetails = await movieService.getMovieDetails(movieId)
    // 상세 정보 처리 로직 구현

  } catch (error) {
    console.error('영화 상세 정보 로드 실패:', error)
  } finally {
    loading.value = false
  }
}

// 필터 변경 감시
watch(filters, () => {
  loadMovies(1)
}, { deep: true })

</script>

<style scoped>
.filter-movies-container {
  min-height: 100vh;
  background-color: rgb(17, 17, 17);
}

.search-page {
  padding: 2rem;
  padding-top: 6rem; /* 필터 섹션의 고정 높이만큼 상단 패딩 추가 */
  background: linear-gradient(135deg, #1f1f1f 0%, #2c2c2c 100%);
  min-height: calc(100vh - 64px); /* 헤더 높이를 뺀 높이 */
}

.filters-section {
  position: sticky;
  top: 64px;
  z-index: 10;
  transition: all 0.3s ease-in-out;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.filters-scrolled {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  padding: 1rem 2rem;
}

.filters-container {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 필터 컨테이너 내부의 모든 직계 자식 요소들에 대한 스타일 */
.filters-container > * {
  flex: 1;
  min-width: 200px; /* 최소 너비 설정 */
  margin: 0; /* 마진 제거 */
}

.reset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, #e50914 0%, #b71c1c 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
  height: 50px; /* 다른 필터들과 동일한 높이 */
  flex: 0 0 auto; /* 크기 고정 */
  min-width: 150px; /* 최소 너비 설정 */
  margin-top: 25px;

}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(229, 9, 20, 0.4);
}

.reset-btn:active {
  transform: translateY(1px);
}

.table-view {
  margin-top: 2rem;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 0;
  margin-top: 2rem; /* filters-section 아래에 위치하도록 마진 추가 */
  min-height: 50vh; /* 충분한 높이 확보 */
}

.no-results i {
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.3);
}

.no-results p {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
}

/* 뷰 토글 섹션 스타일 추가 */
.view-toggle-section {
  margin-top: 1.5rem; /* 상단 여백 추가 */
  display: flex;
  justify-content: flex-end;
  padding: 0 1.5rem; /* 좌우 패딩 추가 */
}

@media (max-width: 768px) {
  .filters-section {
    padding: 1rem;
    top: 56px;
  }

  .filters-scrolled {
    padding: 0.75rem 1rem;
  }
}

@media (max-width: 640px) {
  .filters-section {
    padding: 0.75rem;
    top: 48px;
  }

  .search-page {
    padding-top: 4rem;
  }

  .filters-container {
    gap: 0.3rem;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .view-toggle-section {
    margin-top: 0.5rem;
    padding: 0 0.5rem;
  }
}

@media (max-width: 480px) {
  .filters-section {
    padding: 0.5rem;
    top: 44px;
  }

  .search-page {
    padding-top: 3.5rem;
  }

  .filters-container {
    padding: 0.3rem;
    gap: 0.2rem;
  }
}

/* 필터 아이템 간격 조정 */
@media (max-width: 640px) {
  .filters-container > * {
    margin-bottom: 0.3rem;
  }

  .filters-container > *:last-child {
    margin-bottom: 0;
  }

  /* 필터 내부 간격 조정 */
  .filter-group {
    margin: 0.2rem 0;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.genre-chips {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.genre-chip {
  padding: 0.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: white;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.genre-chip:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}
</style>