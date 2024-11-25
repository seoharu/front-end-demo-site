<template>
  <div class="filter-group">
    <label class="filter-label">
      <i class="fas fa-language"></i>
      <span class="label-text">언어</span>
    </label>
    <select
      v-model="selectedLanguage"
      @change="handleLanguageChange"
      class="filter-select"
    >
      <option value="">전체 언어</option>
      <option
        v-for="lang in languages"
        :key="lang.code"
        :value="lang.code"
      >
        {{ lang.name }} ({{ lang.code.toUpperCase() }})
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface Language {
  code: string;
  name: string;
  nativeName?: string;
}

export default defineComponent({
  name: 'LanguageFilter',

  emits: ['change'],

  data() {
    return {
      selectedLanguage: '',
      languages: [
        { code: 'ko', name: '한국어', nativeName: '한국어' },
        { code: 'en', name: '영어', nativeName: 'English' },
        { code: 'ja', name: '일본어', nativeName: '日本語' },
        { code: 'zh', name: '중국어', nativeName: '中文' },
        { code: 'es', name: '스페인어', nativeName: 'Español' },
        { code: 'fr', name: '프랑스어', nativeName: 'Français' },
        { code: 'de', name: '독일어', nativeName: 'Deutsch' },
        { code: 'it', name: '이탈리아어', nativeName: 'Italiano' }
      ] as Language[]
    }
  },

  methods: {
    handleLanguageChange() {
      const value = this.selectedLanguage === '' ? null : this.selectedLanguage
      this.$emit('change', value)
    },
    reset() {
      // selectedLanguage 초기화하고 이벤트 발생
      this.selectedLanguage = ''
      this.handleLanguageChange()
    }
  }
})
</script>

<style scoped>
@import '@/assets/styles/filter.css';
</style>