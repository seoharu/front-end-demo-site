// composables/useSearch.ts
import { ref, watch, computed } from 'vue';
import movieService from '@/services/movieService.js';

// 타입 정의
interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
}

interface SearchHistory {
  query: string;
  timestamp: string;
}

interface SearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const useSearch = (initialQuery: string = '') => {
  // 상태 관리
  const searchQuery = ref<string>(initialQuery);
  const searchResults = ref<Movie[]>([]);
  const searchHistory = ref<SearchHistory[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<Error | null>(null);
  const totalResults = ref<number>(0);
  const currentPage = ref<number>(1);
  const totalPages = ref<number>(0);

  // 로컬 스토리지 키
  const SEARCH_HISTORY_KEY = 'movieSearchHistory';

  // 검색 기록 로드
  const loadSearchHistory = () => {
    try {
      const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (saved) {
        searchHistory.value = JSON.parse(saved);
      }
    } catch (err) {
      console.error('검색 기록 로드 실패:', err);
      searchHistory.value = [];
    }
  };

  // 검색 기록 저장
  const saveSearchHistory = () => {
    try {
      localStorage.setItem(
        SEARCH_HISTORY_KEY,
        JSON.stringify(searchHistory.value)
      );
    } catch (err) {
      console.error('검색 기록 저장 실패:', err);
    }
  };

  // 검색 실행
  const executeSearch = async (page: number = 1) => {
    const query = searchQuery.value.trim();
    if (!query) {
      searchResults.value = [];
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      // movieService의 searchMovies 호출
      const response = await movieService.searchMovies(query, page);

      // API 응답 데이터 처리
      const { results, total_pages, total_results } = response.data;

      // 페이지가 1이면 결과를 새로 설정, 아니면 기존 결과에 추가
      searchResults.value = page === 1
        ? results
        : [...searchResults.value, ...results];

      totalPages.value = total_pages;
      totalResults.value = total_results;
      currentPage.value = page;

      // 첫 페이지 검색일 때만 검색 기록 추가
      if (page === 1) {
        addToHistory(query);
      }

      return response.data;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 검색 기록 추가
  const addToHistory = (query: string) => {
    const newEntry: SearchHistory = {
      query,
      timestamp: new Date().toISOString()
    };

    // 중복 제거 후 최근 10개만 유지
    searchHistory.value = [
      newEntry,
      ...searchHistory.value.filter(item => item.query !== query)
    ].slice(0, 10);

    saveSearchHistory();
  };

  // 검색 기록 삭제
  const removeFromHistory = (query: string) => {
    searchHistory.value = searchHistory.value.filter(
      item => item.query !== query
    );
    saveSearchHistory();
  };

  // 검색 기록 초기화
  const clearHistory = () => {
    searchHistory.value = [];
    saveSearchHistory();
  };

  // 검색어 변경 감지
  watch(searchQuery, (newQuery) => {
    if (!newQuery.trim()) {
      searchResults.value = [];
      currentPage.value = 1;
      totalPages.value = 0;
      totalResults.value = 0;
    }
  });

  // 초기 로드
  loadSearchHistory();

  const hasMore = computed(() => currentPage.value < totalPages.value);
  const isEmpty =  computed(() => searchResults.value.length === 0);

  return {
    // 상태
    searchQuery,
    searchResults,
    searchHistory,
    loading,
    error,
    totalResults,
    currentPage,
    totalPages,


    // 메서드
    executeSearch,
    removeFromHistory,
    clearHistory,

    // 유틸리티
    hasMore,
    isEmpty
  };
};