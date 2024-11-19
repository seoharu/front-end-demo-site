<template>
  <div class="filter-movies-container">
    <PageHeader />

    <div class="search-page">
      <div class="filters-section">
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

        <ViewToggle :initial-view="viewType" @viewType-changed="changeViewType" />
      </div>

      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
      </div>

      <div v-else>
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
          @load-more="loadMoreMovies"
          @wishlist-updated="handleWishlistUpdate"
          @show-detail="handleShowDetail"
        />
      </div>

      <div v-if="!loading && processedMovies.length === 0" class="no-results">
        <i class="fas fa-film"></i>
        <p>검색 결과가 없습니다</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue'
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

export default {
  name: 'SearchPage',

  components: {
    PageHeader,
    TableView,
    InfiniteScrollView,
    ViewToggle,
    GenreFilter,
    RatingFilter,
    LanguageFilter,
    YearFilter,
    SortFilter,
  },

  setup() {
    const {
      filters,
      updateFilter,
      resetFilters,
      filterMovies,
      sortMovies,
      getFilterParams
    } = useFiltering()

    const viewType = ref(localStorage.getItem('preferredViewType') || 'table')
    const movies = ref([])
    const currentPage = ref(1)
    const totalPages = ref(1)
    const loading = ref(false)
    const loadingMore = ref(false)

    const genreFilterRef = ref(null)
    const ratingFilterRef = ref(null)
    const languageFilterRef = ref(null)
    const yearFilterRef = ref(null)
    const sortFilterRef = ref(null)

    // 필터링과 정렬이 적용된 영화 목록
    const processedMovies = computed(() => {
      const filtered = filterMovies(movies.value)
      return sortMovies(filtered)
    })

    const loadMovies = async (page = 1, isLoadMore = false) => {
      try {
        if (!isLoadMore) {
          loading.value = true
        }
        loadingMore.value = isLoadMore

        // getFilterParams 값 확인
        console.log('Filter params:', getFilterParams.value)

        const response = await movieService.getMovies(page, getFilterParams.value)
        console.log('API response:', response)

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

    const handlePageChange = (page) => {
      currentPage.value = page
      loadMovies(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const loadMoreMovies = async () => {
      if (currentPage.value < totalPages.value && !loadingMore.value) {
        currentPage.value++
        await loadMovies(currentPage.value, true)
      }
    }

    const handleReset = async () => {
      // 각 컴포넌트의 내부 상태 직접 초기화
      if (genreFilterRef.value) {
        genreFilterRef.value.selectedGenre = ''
      }
      if (ratingFilterRef.value) {
        ratingFilterRef.value.selectedRating = ''
      }
      if (languageFilterRef.value) {
        languageFilterRef.value.selectedLanguage = ''
      }
      if (yearFilterRef.value) {
        yearFilterRef.value.selectedYear = ''
      }
      if (sortFilterRef.value) {
        sortFilterRef.value.selectedSort = 'popularity.desc'
      }

      // filters 상태 초기화
      resetFilters()

      // 데이터 리로드
      currentPage.value = 1
      loadMovies(1)
    };

    const changeViewType = (view) => {
      viewType.value = view
      localStorage.setItem('preferredViewType', view)
    }

    const handleWishlistUpdate = (movie) => {
      console.log('Wishlist updated:', movie)
    }

    const handleShowDetail = (movieId) => {
      console.log('Show detail for movie:', movieId)
    }

    // 초기 데이터 로드
    onMounted(() => {
      loadMovies()
    })

    return {
      // 상태
      viewType,
      currentPage,
      totalPages,
      loading,
      loadingMore,
      processedMovies,

      // useFiltering에서 가져온 것들
      filters,
      updateFilter,

      // 메서드
      loadMovies,
      loadMoreMovies,
      handlePageChange,
      genreFilterRef,
      ratingFilterRef,
      languageFilterRef,
      yearFilterRef,
      sortFilterRef,
      handleReset,
      changeViewType,
      handleWishlistUpdate,
      handleShowDetail
    }
  }
}
</script>

<style scoped>
.filter-movies-container {
  min-height: 100vh;
}

.search-page {
  padding: 2rem;
  background: linear-gradient(135deg, #1f1f1f 0%, #2c2c2c 100%);
}

.filters-section {
  position: sticky;
  top: 95px;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.filters-container {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #e50914 0%, #b71c1c 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
  margin-top: 30px;
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(229, 9, 20, 0.4);
}

.reset-btn:active {
  transform: translateY(1px);
}

.table-view {
  margin-top: 50px !important;
}

@media (max-width: 768px) {
  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }

  .reset-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>