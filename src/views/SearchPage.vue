```vue
<!-- src/views/SearchPage.vue -->
<template>
  <div class="search-page">
    <div class="filters-section">
      <div class="filters-container">
        <GenreFilter @change="handleGenreChange" />
        <RatingFilter @change="handleRatingChange" />
        <SortFilter @change="handleSortChange" />
        <YearFilter @change="handleYearChange" />
        <button class="reset-btn" @click="resetFilters">
          <i class="fas fa-undo"></i>
          필터 초기화
        </button>
      </div>
    </div>

    <ViewToggle
      :current-view="viewType"
      @switch-view="handleViewChange"
    />

    <div class="movies-container">
      <TableView
        v-if="viewType === 'table'"
        :movies="filteredMovies || []"
        :loading="loading"
      />
      <InfiniteScrollView
        v-else
        :movies="filteredMovies"
        :loading="loading"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import GenreFilter from '@/components/movieFilters/GenreFilter.vue'
import RatingFilter from '@/components/movieFilters/RatingFilter.vue'
import SortFilter from '@/components/movieFilters/SortFilter.vue'
import YearFilter from '@/components/movieFilters/YearFilter.vue'
import ViewToggle from '@/components/common/viewType/ViewToggle.vue'
import TableView from '@/components/common/viewType/TableView.vue'
import InfiniteScrollView from '@/components/common/viewType/InfiniteScrollView.vue'
import { movieService } from '@/services/movieService'

export default {
  components: {
    GenreFilter,
    RatingFilter,
    SortFilter,
    YearFilter,
    ViewToggle,
    TableView,
    InfiniteScrollView
  },

  setup() {
    const viewType = ref('table')
    const movies = ref([])
    const loading = ref(false)
    const filters = ref({
      genre: '',
      rating: 0,
      sort: 'popularity.desc',
      year: ''
    })

    const handleGenreChange = (value) => {
      filters.value.genre = value
      applyFilters()
    }

    const handleRatingChange = (value) => {
      filters.value.rating = value
      applyFilters()
    }

    const handleSortChange = (value) => {
      filters.value.sort = value
      applyFilters()
    }

    const handleYearChange = (value) => {
      filters.value.year = value
      applyFilters()
    }

    const handleViewChange = (view) => {
      viewType.value = view
    }

    const resetFilters = () => {
      filters.value = {
        genre: '',
        rating: 0,
        sort: 'popularity.desc',
        year: ''
      }
      applyFilters()
    }

    const applyFilters = () => {
      // 필터링 로직 구현
    }

    onMounted(() => {
      // 초기 데이터 로드
    })

    return {
      viewType,
      movies,
      loading,
      handleGenreChange,
      handleRatingChange,
      handleSortChange,
      handleYearChange,
      handleViewChange,
      resetFilters
    }
  },
   async created() {
    try {
      this.loading = true
      const { data } = await movieService.getPopularMovies(1)
      this.movies = data.results
      this.filteredMovies = [...this.movies]
    } catch (error) {
      console.error('영화 로딩 실패:', error)
    } finally {
      this.loading = false
    }
  },

  methods: {
    async applyFilters() {
      try {
        this.loading = true
        let { data } = await movieService.getPopularMovies(this.currentPage)

        // 로컬 필터링 적용
        let filtered = data.results
        if (this.filters.genre) {
          filtered = filtered.filter(movie =>
            movie.genre_ids.includes(Number(this.filters.genre))
          )
        }
        if (this.filters.rating > 0) {
          filtered = filtered.filter(movie =>
            movie.vote_average >= this.filters.rating
          )
        }

        this.filteredMovies = filtered
      } catch (error) {
        console.error('필터링 실패:', error)
      } finally {
        this.loading = false
      }
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

.movies-container {
  margin-top: 2rem;
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
```