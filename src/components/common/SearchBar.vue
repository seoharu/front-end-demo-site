<template>
  <div class="relative">
    <div class="flex items-center bg-gray-900 rounded-lg overflow-hidden">
      <input
        type="text"
        v-model="searchQuery"
        @input="handleInput"
        @focus="showRecent = true"
        @blur="handleBlur"
        placeholder="영화 제목을 입력하세요"
        class="w-full px-4 py-2 bg-transparent text-white focus:outline-none"
      />
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="px-2 text-gray-400 hover:text-white"
      >
        <i class="fas fa-times"></i>
      </button>
      <button
        @click="handleSearch"
        class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors"
      >
        <i class="fas fa-search"></i>
      </button>
    </div>

    <!-- Recent Searches Dropdown -->
    <div
      v-if="showRecent && recentSearches.length > 0"
      class="absolute z-10 w-full mt-2 bg-gray-900 rounded-lg shadow-lg"
    >
      <div class="p-2">
        <div class="flex justify-between items-center px-3 py-2 text-gray-400">
          <span>최근 검색어</span>
          <button
            @click="clearRecentSearches"
            class="text-sm hover:text-white"
          >
            전체 삭제
          </button>
        </div>
        <div
          v-for="query in recentSearches"
          :key="query"
          class="px-3 py-2 hover:bg-gray-800 cursor-pointer rounded flex justify-between items-center"
          @mousedown.prevent="selectRecentSearch(query)"
        >
          <span class="text-white">{{ query }}</span>
          <button
            @click.stop="removeRecentSearch(query)"
            class="text-gray-400 hover:text-white"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  initialQuery: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['search']);
const router = useRouter();

const searchQuery = ref(props.initialQuery);
const showRecent = ref(false);
const recentSearches = ref([]);

// Load recent searches from localStorage
const loadRecentSearches = () => {
  const saved = localStorage.getItem('recentSearches');
  recentSearches.value = saved ? JSON.parse(saved) : [];
};

// Save recent searches to localStorage
const saveRecentSearches = () => {
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value));
};

// Handle search
const handleSearch = () => {
  if (!searchQuery.value.trim()) return;

  // Add to recent searches
  const searches = new Set([searchQuery.value, ...recentSearches.value]);
  recentSearches.value = Array.from(searches).slice(0, 5);
  saveRecentSearches();

  // Emit search event
  emit('search', searchQuery.value);
  router.push({ path: '/search', query: { q: searchQuery.value }});
};

// Handle input changes with debounce
let debounceTimer;
const handleInput = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    emit('search', searchQuery.value);
  }, 300);
};

const handleBlur = () => {
  // Delay hiding recent searches to allow click events
  setTimeout(() => {
    showRecent.value = false;
  }, 200);
};

const clearSearch = () => {
  searchQuery.value = '';
  emit('search', '');
};

const selectRecentSearch = (query) => {
  searchQuery.value = query;
  handleSearch();
};

const removeRecentSearch = (query) => {
  recentSearches.value = recentSearches.value.filter(q => q !== query);
  saveRecentSearches();
};

const clearRecentSearches = () => {
  recentSearches.value = [];
  saveRecentSearches();
};

// Watch for external query changes
watch(() => props.initialQuery, (newQuery) => {
  searchQuery.value = newQuery;
});

// Initialize
loadRecentSearches();
</script>