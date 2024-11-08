// composables/useFilters.ts
import { ref, computed } from 'vue';

// 영화 타입 정의
interface Movie {
  id: number;
  title: string;
  genre_ids: number[];
  release_date: string;
  vote_average: number;
  popularity: number;
}

// 정렬 옵션 타입
type SortType = 'popularity' | 'rating' | 'release_date' | 'title' | null;
type SortOrder = 'asc' | 'desc';

// 필터 옵션 타입
interface FilterOptions {
  genre: number | null;
  year: number | null;
  rating: number | null;
  sort: SortType;
  sortOrder: SortOrder;
}

// 기본 필터 값
const defaultFilters: FilterOptions = {
  genre: null,
  year: null,
  rating: null,
  sort: null,
  sortOrder: 'desc'
};

export const useFilters = (initialFilters?: Partial<FilterOptions>) => {
  // 필터 상태 초기화
  const filters = ref<FilterOptions>({
    ...defaultFilters,
    ...initialFilters
  });

  // 필터 상태 업데이트
  const updateFilter = <T extends keyof FilterOptions>(key: T, value: FilterOptions[T]) => {
    filters.value[key] = value;
  };

  // 필터 초기화
  const resetFilters = () => {
    filters.value = { ...defaultFilters };
  };

  // 영화 필터링 함수
  const filterMovies = (movies: Movie[]): Movie[] => {
    if (!movies?.length) return [];

    return movies.filter(movie => {
      let isValid = true;

      // 장르 필터
      if (filters.value.genre !== null) {
        isValid = isValid && movie.genre_ids.includes(filters.value.genre);
      }

      // 연도 필터
      if (filters.value.year !== null) {
        const movieYear = movie.release_date
          ? new Date(movie.release_date).getFullYear()
          : null;
        isValid = isValid && movieYear === filters.value.year;
      }

      // 평점 필터
      if (filters.value.rating !== null) {
        isValid = isValid && movie.vote_average >= filters.value.rating;
      }

      return isValid;
    });
  };

  // 정렬 함수
  const sortMovies = (movies: Movie[]): Movie[] => {
    if (!filters.value.sort) return movies;

    return [...movies].sort((a, b) => {
      const orderMultiplier = filters.value.sortOrder === 'asc' ? 1 : -1;

      switch (filters.value.sort) {
        case 'popularity':
          return (a.popularity - b.popularity) * orderMultiplier;

        case 'rating':
          return (a.vote_average - b.vote_average) * orderMultiplier;

        case 'release_date':
          if (!a.release_date || !b.release_date) return 0;
          return (
            new Date(a.release_date).getTime() -
            new Date(b.release_date).getTime()
          ) * orderMultiplier;

        case 'title':
          return a.title.localeCompare(b.title) * orderMultiplier;

        default:
          return 0;
      }
    });
  };

  // 필터와 정렬이 적용된 영화 목록
  const getFilteredAndSortedMovies = (movies: Movie[]): Movie[] => {
    try {
      const filteredMovies = filterMovies(movies);
      return sortMovies(filteredMovies);
    } catch (error) {
      console.error('영화 필터링/정렬 중 에러:', error);
      return movies;
    }
  };

  // 활성화된 필터 개수
  const activeFilterCount = computed(() => {
    return Object.entries(filters.value).reduce((count, [key, value]) => {
      if (key !== 'sortOrder' && value !== null) {
        return count + 1;
      }
      return count;
    }, 0);
  });

  // 현재 필터 상태가 기본값인지 확인
  const isDefaultFilters = computed(() => {
    return activeFilterCount.value === 0;
  });

  return {
    filters,
    updateFilter,
    resetFilters,
    filterMovies,
    sortMovies,
    getFilteredAndSortedMovies,
    activeFilterCount,
    isDefaultFilters
  };
};