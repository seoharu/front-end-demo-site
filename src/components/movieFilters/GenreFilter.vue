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
  color: white;
  font-size: 0.875rem;
}

.filter-select {
  width: 100%;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.filter-select:hover {
  border-color: rgba(255, 255, 255, 0.4);
}

.filter-select:focus {
  outline: none;
  border-color: #e50914;
}
</style>