<template>
  <div class="filter-group">
    <label class="filter-label">
      <i class="fas fa-film"></i>
      <span class="label-text">장르</span>
    </label>
    <select v-model="selectedGenre" @change="handleChange" class="filter-select">
      <option value="">전체 장르</option>
      <option v-for="genre in genres" :key="genre.id" :value="genre.id">
        {{ genre.name }}
      </option>
    </select>
  </div>
</template>

<script>
import movieService  from '@/services/movieService'

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
        const genres = await movieService.getGenres()
        this.genres = genres
      } catch (error) {
        console.error('장르 목록 로딩 실패:', error)
      }
    },

    handleChange() {
      console.log('Selected genre:', this.selectedGenre)
      this.$emit('change', this.selectedGenre)
    },
    reset() {
      // selectedGenre 초기화하고 이벤트 발생
      this.selectedGenre = ''
      this.handleChange()
    }
  },

  async created() {
    await this.loadGenres()
  }
}
</script>

<style scoped>
@import '@/assets/styles/filter.css';
</style>