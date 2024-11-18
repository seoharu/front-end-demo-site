<template>
  <div class="filter-group">
    <label class="filter-label">장르</label>
    <select v-model="selectedGenre" @change="handleChange" class="filter-select">
      <option value="">전체</option>
      <option v-for="genre in genres" :key="genre.id" :value="genre.id">
        {{ genre.name }}
      </option>
    </select>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getGenres } from './filterApi'


export default {
  name: 'GenreFilter',
  emits: ['change'],

  setup(props, { emit }) {
    const genres = ref([])
    const selectedGenre = ref('')

    const loadGenres = async () => {
      try {
        const response = await getGenres()
        genres.value = response.data.genres
      } catch (error) {
        console.error('Failed to load genres:', error)
      }
    }

    const handleChange = () => {
      emit('change', selectedGenre.value)
    }

    onMounted(loadGenres)

    return { genres, selectedGenre, handleChange }
  }
}
</script>

<style scoped>

@import '@/assets/styles/filter.css';

</style>