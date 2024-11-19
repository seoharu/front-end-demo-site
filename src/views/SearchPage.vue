<template>
  <div class="filter-movies-container">
    <!-- 헤더 컴포넌트 -->
    <PageHeader />

    <div class="search-page">
      <!-- 필터 섹션 -->
      <div class="filters-section">
        <div class="filters-container">
          <GenreFilter @change="handleGenreChange" />
          <RatingFilter @change="handleRatingChange" />
          <LanguageFilter @change="handleLanguageChange" />
          <YearFilter @change="handleYearChange" />
          <SortFilter @change="handleSortChange" />

          <button class="reset-btn" @click="resetFilters">
            <i class="fas fa-undo"></i>
            필터 초기화
          </button>
        </div>

        <ViewToggle :initialView="viewType" @viewType-changed="changeViewType" />


      </div>
      <!-- 로딩 인디케이터 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
      </div>

      <!-- 영화 목록 뷰 -->
      <div v-else>
        <div class="table-view" v-if="viewType === 'table'">
          <TableView
            :movies="filteredMovies"
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-changed="handlePageChange"
            @wishlist-updated="handleWishlistUpdate"
            @show-detail="handleShowDetail"
          />
        </div>

        <InfiniteScrollView
          v-else
          :movies="filteredMovies"
          :loading="loadingMore"
          @load-more="loadMoreMovies"
          @wishlist-updated="handleWishlistUpdate"
          @show-detail="handleShowDetail"
        />
      </div>

      <!-- 결과 없음 메시지 -->
      <div v-if="!loading && filteredMovies.length === 0" class="no-results">
        <i class="fas fa-film"></i>
        <p>검색 결과가 없습니다</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import TableView from '@/components/common/viewType/TableView.vue'
import InfiniteScrollView from '@/components/common/viewType/InfiniteScrollView.vue'
import ViewToggle from '@/components/common/viewType/ViewToggle.vue'
import movieService from '@/services/movieService'
import GenreFilter from '@/components/movieFilters/GenreFilter.vue'
import RatingFilter from '@/components/movieFilters/RatingFilter.vue';
import LanguageFilter from '@/components/movieFilters/LanguageFilter.vue'
import YearFilter from '@/components/movieFilters/YearFilter.vue'
import SortFilter from '@/components/movieFilters/SortFilter.vue'
import PageHeader from "@/components/layout/PageHeader.vue";

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

  data() {
    return {
      viewType: localStorage.getItem('preferredViewType') || 'table',
      movies: [],
      filteredMovies: [],
      currentPage: 1,
      totalPages: 1,
      loading: false,
      selectedGenre: null,
      selectedRating: null,
      selectedLanguage: '',
      selectedYear: '',
      selectedSort: 'popularity.desc',
    }
  },
  computed: {
    filterParams() {
      return {
        language: this.selectedLanguage,
        year: this.selectedYear,
        sort_by: this.selectedSort,
        genre: this.selectedGenre,
        vote_average: this.selectedRating
      }
    }
  },

  methods: {
    async loadMovies(page = 1) {
      try {
        this.loading = true
        const response = await movieService.getMovies(page, this.filterParams)

        if (response?.data) {
          if (page === 1) {
            this.movies = response.data.results
          } else {
            this.movies = [...this.movies, ...response.data.results]
          }
          this.filteredMovies = [...this.movies]
          this.totalPages = response.data.total_pages
        }
      } catch (error) {
        console.error('영화 로딩 실패:', error)
      } finally {
        this.loading = false
        this.loadingMore = false
      }
    },
    async loadMoreMovies() {
      if (this.currentPage < this.totalPages && !this.loadingMore) {
        this.loadingMore = true
        this.currentPage++
        await this.loadMovies(this.currentPage)
      }
    },

    handlePageChange(page) {
      this.currentPage = page
      this.loadMovies(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    handleGenreChange(value) {
      console.log('Selected genre:', value) // 디버깅용
      this.selectedGenre = value === '' ? null : Number(value)
      this.applyFilters()
    },
    handleRatingChange(value) {
      this.selectedRating = value;
      this.applyFilters();
    },
    handleLanguageChange(value) {
      this.selectedLanguage = value
      this.resetPagination()
    },

    handleYearChange(value) {
      this.selectedYear = value
      this.resetPagination()
    },

    handleSortChange(value) {
      this.selectedSort = value
      this.resetPagination()
    },

    applyFilters() {
      console.log('Applying filters with genre:', this.selectedGenre, 'and rating:', this.selectedRating);

      if (!this.selectedGenre && !this.selectedRating) {
        this.filteredMovies = [...this.movies];
        return;
      }

      this.filteredMovies = this.movies.filter(movie => {
        const genreMatch = !this.selectedGenre || (movie.genre_ids && movie.genre_ids.includes(Number(this.selectedGenre)));
        const ratingMatch = !this.selectedRating || (movie.vote_average && movie.vote_average >= Number(this.selectedRating));

        console.log('Movie:', movie.title, 'Vote Average:', movie.vote_average, 'Selected Rating:', this.selectedRating, 'Rating Match:', ratingMatch);
        console.log('Checking movie:', movie.id, 'genres:', movie.genre_ids, 'rating:', movie.vote_average);
        console.log('Movie:', movie.title, 'Vote Average:', movie.vote_average, 'Selected Rating:', this.selectedRating);
        return genreMatch && ratingMatch;
      });

      console.log('Filtered movies count:', this.filteredMovies.length);
    },
    resetPagination() {
      this.currentPage = 1
      this.loadMovies()
    },
    resetFilters() {
      this.selectedGenre = null
      this.selectedRating = null;
      this.selectedLanguage = ''
      this.selectedYear = ''
      this.selectedSort = 'popularity.desc'
      this.resetPagination()
      this.filteredMovies = [...this.movies];
    },

    changeViewType(view) {
      this.viewType = view;
      localStorage.setItem('preferredViewType', view)
    },

    handleWishlistUpdate(movie) {
      // 위시리스트 업데이트 처리
      console.log('Wishlist updated:', movie);
    },

    handleShowDetail(movieId) {
      // 영화 상세 정보 표시 처리
      console.log('Show detail for movie:', movieId);
    },
  },


  async created() {
    await this.loadMovies()
  },
  watch: {
    filterParams: {
      handler() {
        this.resetPagination()
      },
      deep: true
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
  top:95px;
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
  animation: fadeIn 0.3s ease-out;
  margin-top: 30px;
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(229, 9, 20, 0.4);
}

.reset-btn:active {
  transform: translateY(1px);
}

.view-toggle-container {
  display: flex;
  width: 100px !important;
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