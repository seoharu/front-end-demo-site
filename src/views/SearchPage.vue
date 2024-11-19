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

          <button class="reset-btn" @click="resetFilters">
            <i class="fas fa-undo"></i>
            필터 초기화
          </button>
        </div>

          <ViewToggle :initialView="viewType" @viewType-changed="changeViewType" />


      </div>

      <div class="table-view">
              <!-- 영화 목록 -->
      <TableView
        v-if="viewType === 'table'"
        :movies="filteredMovies"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-changed="handlePageChange"
      />

      </div>

      <InfiniteScrollView
        v-if="viewType === 'infinite'"
        :movies="filteredMovies"
        @wishlist-updated="handleWishlistUpdate"
        @show-detail="handleShowDetail"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import TableView from '@/components/common/viewType/TableView.vue'
import InfiniteScrollView from '@/components/common/viewType/InfiniteScrollView.vue'
import ViewToggle from '@/components/common/viewType/ViewToggle.vue'
import { movieService } from '@/services/movieService'
import GenreFilter from '@/components/movieFilters/GenreFilter.vue'
import RatingFilter from '@/components/movieFilters/RatingFilter.vue';
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
  },

  data() {
    return {
      viewType: 'table',
      movies: [],
      filteredMovies: [],
      currentPage: 1,
      totalPages: 1,
      loading: false,
      selectedGenre: null,
      selectedRating: null,
    }
  },

  methods: {
    async loadMovies() {
      try {
        this.loading = true
        const response = await movieService.getPopularMovies(this.currentPage)
        if (response?.data) {
          this.movies = response.data.results
          this.applyFilters()  // 데이터 로드 후 필터 적용
          this.totalPages = response.data.total_pages
        }
      } catch (error) {
        console.error('영화 로딩 실패:', error)
      }
      finally {
        this.loading = false
      }
    },

    handlePageChange(page) {
      this.currentPage = page
      this.loadMovies()
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

    resetFilters() {
      this.selectedGenre = null
      this.selectedRating = null;
      this.filteredMovies = [...this.movies];
    },

    changeViewType(view) {
      this.viewType = view;
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
    // movies 배열이 변경될 때마다 필터 다시 적용
    movies: {
      handler() {
        this.applyFilters()
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