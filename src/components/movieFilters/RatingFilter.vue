<template>
  <div class="filter-group">
    <label class="filter-label">최소 평점</label>
    <select
      v-model="selectedRating"
      @change="handleChange"
      class="filter-select"
    >
      <option value="">전체</option>
      <option
        v-for="option in ratingOptions"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
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
      selectedRating: '',
      ratingOptions: [
        {value: 9, label: '9점 이상'},
        {value: 8, label: '8점 이상'},
        {value: 7, label: '7점 이상'},
        {value: 6, label: '6점 이상'},
        {value: 5, label: '5점 이상'},
        {value: 0, label: '5점 미만'}
      ],
      loading: false,
      error: null
    }
  },
  methods: {
    async loadRatings() {
      this.loading = true
      try {
        const response = await movieService.getMovieRatings()
        console.log('Loaded ratings:', response)
      } catch (error) {
        console.error('별점 로드 실패:', error)
        this.error = error
      } finally {
        this.loading = false
      }
    },

    handleChange() {
      console.log('Selected rating:', this.selectedRating)
      // 5점 미만 선택시 특별 처리
      if (this.selectedRating === 0) {
        this.$emit('change', { min: 0, max: 5 })
      } else {
        this.$emit('change', { min: this.selectedRating, max: 10 })
      }
    },
    reset() {
      // selectedRating 초기화하고 이벤트 발생
      this.selectedRating = ''
      this.handleChange()
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