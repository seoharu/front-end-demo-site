<template>
  <div class="filter-group">
    <label class="filter-label">언어</label>
    <select v-model="selectedLanguage" @change="handleLanguageChange" class="filter-select">
      <option value="">전체</option>
      <option v-for="lang in languages" :key="lang.code" :value="lang.code">
        {{ lang.name }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'LanguageFilter',
  data() {
    return {
      selectedLanguage: '',
      languages: [
        {code: 'ko', name: '한국어'},
        {code: 'en', name: '영어'},
        {code: 'ja', name: '일본어'},
        {code: 'zh', name: '중국어'},
        {code: 'es', name: '스페인어'},
        {code: 'fr', name: '프랑스어'}
      ]
    }
  },
  methods: {
    handleLanguageChange() {
      this.$emit('change', this.selectedLanguage)
    }
  }
}
</script>

<style scoped>
@import '@/assets/styles/filter.css';
</style>