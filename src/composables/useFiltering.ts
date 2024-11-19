// useFiltering.ts
import { ref, computed } from 'vue';

export interface Movie {
  id: number;
  title: string;
  genre_ids: number[];
  release_date: string;
  vote_average: number;
  popularity: number;
}

export interface FilterState {
  genre: number | null;
  rating: number | null;
  language: string | null;
  year: number | null;
  sort: string | null;
}

export function useFiltering() {
  const filters = ref<FilterState>({
    genre: null,
    rating: null,
    language: null,
    year: null,
    sort: 'popularity.desc'
  });

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    filters.value[key] = value;
  };

  const resetFilters = () => {
    console.log('Resetting filters...');
    console.log('Before reset:', { ...filters.value });

    // 필터 상태 초기화
    filters.value = {
      genre: null,
      rating: null,
      language: null,
      year: null,
      sort: 'popularity.desc'
    };

    console.log('After reset:', { ...filters.value });
    console.log('Filter params:', getFilterParams.value);
  };

  const filterMovies = (movies: Movie[]): Movie[] => {
    return movies.filter(movie => {
      let passes = true;

      // Genre filter
      if (filters.value.genre !== null) {
        passes = passes && movie.genre_ids.includes(filters.value.genre);
      }

      // Rating filter
      if (filters.value.rating !== null) {
        passes = passes && movie.vote_average >= filters.value.rating;
      }

      // Year filter
      if (filters.value.year !== null) {
        const movieYear = new Date(movie.release_date).getFullYear();
        passes = passes && movieYear === filters.value.year;
      }

      // Language filter is handled by API call

      return passes;
    });
  };

  const sortMovies = (movies: Movie[]): Movie[] => {
    const [sortField, sortOrder] = (filters.value.sort || 'popularity.desc').split('.');
    const multiplier = sortOrder === 'desc' ? -1 : 1;

    return [...movies].sort((a, b) => {
      switch (sortField) {
        case 'popularity':
          return (a.popularity - b.popularity) * multiplier;
        case 'vote_average':
          return (a.vote_average - b.vote_average) * multiplier;
        case 'release_date':
          return (new Date(a.release_date).getTime() - new Date(b.release_date).getTime()) * multiplier;
        default:
          return 0;
      }
    });
  };

  const getFilterParams = computed(() => {
    const params: Record<string, any> = {
      language: 'ko-KR',
      sort_by: 'popularity.desc'
    };

    // null 체크 후 값이 있을 때만 파라미터 추가
    if (filters.value.genre !== null) {
      params.with_genres = filters.value.genre;
    }

    if (filters.value.rating !== null) {
      params['vote_average.gte'] = filters.value.rating;
    }

    if (filters.value.language !== null) {
      params.language = filters.value.language;
    }

    if (filters.value.year !== null) {
      params.year = filters.value.year;
    }

    if (filters.value.sort !== null && filters.value.sort !== 'popularity.desc') {
      params.sort_by = filters.value.sort;
    }

    return params;
});

  return {
    filters,
    updateFilter,
    resetFilters,
    filterMovies,
    sortMovies,
    getFilterParams
  };
}