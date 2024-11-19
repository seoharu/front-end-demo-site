<template>
  <div class="filter-group">
    <label class="filter-label">최소 평점</label>
    <select v-model="selectedRating" @change="handleChange" class="filter-select">
      <option value="">전체</option>
      <option v-for="rating in ratings"  :key="rating" :value="rating">{{ rating }}+</option>
    </select>
  </div>
</template>

<script>
import { movieService } from '@/services/movieService'
export default {
  name: 'RatingFilter',

  emits: ['change'],

  data() {
    return {
      selectedRating: null,
      ratings: [9, 8, 7, 6, 5, 4],
    };
  },
  methods: {
    async loadRatings() {
      try {
        const response = await movieService.getMovieRatings()
        this.ratings = response.data.ratings
        console.log('Loaded ratings:', this.ratings)
      } catch (error) {
        console.error('별점 로드 실패:', error)
      }
    },

    handleChange() {
      console.log('Selected rating:', this.selectedRating)
      this.$emit('change', this.selectedRating)
    }
  },

  async created() {
    await this.loadRatings()
  }

};
</script>


<style scoped>
@import '@/assets/styles/filter.css';
</style>