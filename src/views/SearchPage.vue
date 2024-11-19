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
    </div>

    <!-- 영화 목록 -->
    <TableView
      v-if="viewType === 'table'"
      :movies="filteredMovies"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-changed="handlePageChange"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import TableView from '@/components/common/viewType/TableView.vue'
import { movieService } from '@/services/movieService'
import GenreFilter from '@/components/movieFilters/GenreFilter.vue'

export default {
  name: 'SearchPage',

  components: {
    TableView,
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
    }

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
}

.filters-section {
  margin-bottom: 2rem;
}

.filters-container {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.reset-btn {
  padding: 0.5rem 1rem;
  background: #e50914;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>