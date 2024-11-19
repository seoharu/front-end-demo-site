<template>
  <div class="search-page">
    <!-- 필터 섹션 -->
    <div class="filters-section">
      <div class="filters-container">
        <GenreFilter @change="handleGenreChange" />

        <button class="reset-btn" @click="resetFilters">
          <i class="fas fa-undo"></i>
          필터 초기화
        </button>
      </div>
      <ViewToggle :initialView="viewType" @viewType-changed="changeViewType" />
    </div>

    <!-- 영화 목록 -->
    <TableView
      v-if="viewType === 'table'"
      :movies="filteredMovies"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-changed="handlePageChange"
    />

    <InfiniteScrollView
      v-if="viewType === 'infinite'"
      :movies="filteredMovies"
      @wishlist-updated="handleWishlistUpdate"
      @show-detail="handleShowDetail"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import TableView from '@/components/common/viewType/TableView.vue'
import InfiniteScrollView from '@/components/common/viewType/InfiniteScrollView.vue'
import ViewToggle from '@/components/common/viewType/ViewToggle.vue'
import { movieService } from '@/services/movieService'
import GenreFilter from '@/components/movieFilters/GenreFilter.vue'

export default {
  name: 'SearchPage',

  components: {
    TableView,
    InfiniteScrollView,
    ViewToggle,
    GenreFilter,
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

    applyFilters() {
      console.log('Applying filters with genre:', this.selectedGenre) // 디버깅용
      if (!this.selectedGenre) {
        this.filteredMovies = [...this.movies]
        return
      } else {
        this.filteredMovies = this.movies.filter(movie => {
          console.log('Checking movie:', movie.id, 'genres:', movie.genre_ids)
          return movie.genre_ids && movie.genre_ids.includes(Number(this.selectedGenre))
        })
      }
      console.log('Filtered movies count:', this.filteredMovies.length) // 디버깅용
    },

    resetFilters() {
      this.selectedGenre = null
      this.filteredMovies = [...this.movies]
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
.search-page {
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #1f1f1f 0%, #2c2c2c 100%);
}

.filters-section {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(10px);
  padding: 1rem 0;
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
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(229, 9, 20, 0.4);
}

.reset-btn:active {
  transform: translateY(1px);
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