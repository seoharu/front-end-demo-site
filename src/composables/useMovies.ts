// composables/useMovies.ts
import { ref, computed } from 'vue';
import movieService from '@/services/movieService';

interface MovieState {
  movies: any[];
  loading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
}

type MovieCategory = 'popular' | 'nowPlaying' | 'topRated' | 'upcoming';

export const useMovies = () => {
  const state = ref<MovieState>({
    movies: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1
  });

  // 카테고리별 API 매핑
  const categoryApiMap = {
    popular: movieService.getPopularMovies,
    nowPlaying: movieService.getNowPlayingMovies,
    topRated: movieService.getTopRatedMovies,
    upcoming: movieService.getUpcomingMovies
  };

  // 영화 데이터 가져오기
  const fetchMovies = async (
    category: MovieCategory,
    page: number = 1,
    append: boolean = false
  ) => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const apiCall = categoryApiMap[category];
      const response = await apiCall(page);
      const { results, total_pages } = response.data;

      if (append) {
        state.value.movies = [...state.value.movies, ...results];
      } else {
        state.value.movies = results;
      }

      state.value.currentPage = page;
      state.value.totalPages = total_pages;
    } catch (err) {
      state.value.error = err as Error;
      console.error(`영화 데이터 로드 실패 (${category}):`, err);
    } finally {
      state.value.loading = false;
    }
  };

  // 영화 상세 정보 가져오기
  const fetchMovieDetails = async (movieId: number) => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const response = await movieService.getMovieDetails(movieId);
      return response.data;
    } catch (err) {
      state.value.error = err as Error;
      console.error('영화 상세 정보 로드 실패:', err);
    } finally {
      state.value.loading = false;
    }
  };

  // 컴퓨티드 속성들
  const hasMore = computed(() =>
    state.value.currentPage < state.value.totalPages
  );

  const isEmpty = computed(() =>
    !state.value.loading && state.value.movies.length === 0
  );

  return {
    ...state.value,
    hasMore,
    isEmpty,
    fetchMovies,
    fetchMovieDetails
  };
};