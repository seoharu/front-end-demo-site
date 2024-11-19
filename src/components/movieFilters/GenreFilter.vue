<template>
  <div class="filter-group">
    <label class="filter-label">장르</label>
    <select v-model="selectedGenre" @change="handleChange" class="filter-select">
      <option value="">전체 장르</option>
      <option v-for="genre in genres" :key="genre.id" :value="genre.id">
        {{ genre.name }}
      </option>
    </select>
  </div>
</template>

<script>
import { movieService } from '@/services/movieService'

export default {
  name: 'GenreFilter',

  emits: ['change'],

  data() {
    return {
      genres: [],
      selectedGenre: ''
    }
  },

  methods: {
    async loadGenres() {
      try {
        const response = await movieService.getMovieGenres()
        this.genres = response.data.genres
        console.log('Loaded genres:', this.genres)
      } catch (error) {
        console.error('장르 로드 실패:', error)
      }
    },

    handleChange() {
      console.log('Selected genre:', this.selectedGenre)
      this.$emit('change', this.selectedGenre)
    }
  },

  async created() {
    await this.loadGenres()
  }
}
</script>

<style scoped>
.filter-group {
  position: relative;
  min-width: 200px;
}

.filter-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #e5e7eb;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.filter-select {
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  cursor: pointer;
  backdrop-filter: blur(8px);
}

.filter-select:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.filter-select:focus {
  outline: none;
  border-color: #e50914;
  box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2);
}

@media (max-width: 768px) {
  .filter-group {
    min-width: 100%;
  }
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.filter-group {
  animation: fadeIn 0.3s ease-out;
}
</style>