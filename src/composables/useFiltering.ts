import { ref, computed } from 'vue';

// 타입 정의 개선
export interface Movie {
  id: number;
  title: string;
  genre_ids: number[];
  release_date: string;
  vote_average: number;
  popularity: number;
}

export type SortType = 'popularity' | 'rating' | 'release_date' | 'title' | null;
export type SortOrder = 'asc' | 'desc';

export interface FilterOptions {
  genre: number | null;
  year: number | null;
  rating: number | null;
  sort: SortType;
  sortOrder: SortOrder;
}

const defaultFilters: FilterOptions = {
  genre: null,
  year: null,
  rating: null,
  sort: null,
  sortOrder: 'desc'
};

export const useFilters = (initialFilters?: Partial<FilterOptions>) => {
  const filters = ref<FilterOptions>({
    ...defaultFilters,
    ...initialFilters
  });

  // 필터 업데이트 함수 개선
  const updateFilter = <T extends keyof FilterOptions>(
    key: T,
    value: FilterOptions[T]
  ): void => {
    try {
      filters.value[key] = value;
    } catch (error) {
      console.error(`필터 업데이트 중 오류 발생: ${key}`, error);
    }
  };

  const resetFilters = (): void => {
    filters.value = { ...defaultFilters };
  };

  // 필터링 로직 개선
  const filterMovies = (movies: Movie[]): Movie[] => {
    if (!Array.isArray(movies) || !movies.length) return [];

    return movies.filter(movie => {
      try {
        const { genre, year, rating } = filters.value;

        // 장르 필터
        if (genre !== null && !movie.genre_ids.includes(genre)) {
          return false;
        }

        // 연도 필터
        if (year !== null) {
          const movieYear = movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : null;
          if (movieYear !== year) return false;
        }

        // 평점 필터
        if (rating !== null && movie.vote_average < rating) {
          return false;
        }

        return true;
      } catch (error) {
        console.error('영화 필터링 중 오류 발생:', error);
        return false;
      }
    });
  };

  // 정렬 로직 개선
  const sortMovies = (movies: Movie[]): Movie[] => {
    if (!filters.value.sort) return movies;

    try {
      const orderMultiplier = filters.value.sortOrder === 'asc' ? 1 : -1;

      return [...movies].sort((a, b) => {
        switch (filters.value.sort) {
          case 'popularity':
            return (a.popularity - b.popularity) * orderMultiplier;

          case 'rating':
            return (a.vote_average - b.vote_average) * orderMultiplier;

          case 'release_date':
            if (!a.release_date || !b.release_date) return 0;
            return (
              (new Date(a.release_date).getTime() - new Date(b.release_date).getTime()) *
              orderMultiplier
            );

          case 'title':
            return a.title.localeCompare(b.title) * orderMultiplier;

          default:
            return 0;
        }
      });
    } catch (error) {
      console.error('영화 정렬 중 오류 발생:', error);
      return movies;
    }
  };

  // 필터링 및 정렬 통합 함수
  const getFilteredAndSortedMovies = (movies: Movie[]): Movie[] => {
    try {
      const filteredMovies = filterMovies(movies);
      return sortMovies(filteredMovies);
    } catch (error) {
      console.error('영화 필터링/정렬 중 오류:', error);
      return movies;
    }
  };

  // Computed 속성들
  const activeFilterCount = computed(() => {
    return Object.entries(filters.value).reduce((count, [key, value]) => {
      if (key !== 'sortOrder' && value !== null) {
        return count + 1;
      }
      return count;
    }, 0);
  });

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