import { ref, computed } from 'vue';

export interface Movie {
  id: number;
  title: string;
  genre_ids: number[];
  release_date: string;
  vote_average: number;
  popularity: number;
  original_language: string;
  revenue?: number;  // Optional revenue property
}

export interface FilterState {
  genre: number | null;
  rating: { min: number; max: number; } | null;
  language: string | null;
  year: number | null;
  sort: 'popularity.desc' | 'popularity.asc' | 'vote_average.desc' | 'vote_average.asc' | 'release_date.desc' | 'release_date.asc' | 'revenue.desc' | 'revenue.asc';
}

const DEFAULT_FILTERS: FilterState = {
  genre: null,
  rating: null,
  language: null,
  year: null,
  sort: 'popularity.desc'
};

export function useFiltering() {
  const filters = ref<FilterState>({ ...DEFAULT_FILTERS });

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    filters.value[key] = value;
  };

  const resetFilters = () => {
    filters.value = { ...DEFAULT_FILTERS };
  };

  const filterMovies = (movies: Movie[]): Movie[] => {
    return movies.filter(movie => {
      // Genre filter
      if (filters.value.genre !== null && !movie.genre_ids.includes(filters.value.genre)) {
        return false;
      }

      // Rating filter
      if (filters.value.rating !== null) {
        const rating = movie.vote_average;
        if (rating < filters.value.rating.min || rating > filters.value.rating.max) {
          return false;
        }
      }

      // Year filter
      if (filters.value.year !== null) {
        const movieYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
        if (movieYear !== filters.value.year) {
          return false;
        }
      }

      // Language filter
      if (filters.value.language !== null && filters.value.language !== '') {
        if (movie.original_language !== filters.value.language) {
          return false;
        }
      }

      return true;
    });
  };

  const sortMovies = (movies: Movie[]): Movie[] => {
    const [field, order] = filters.value.sort.split('.') as [keyof Movie, 'asc' | 'desc'];
    const multiplier = order === 'desc' ? -1 : 1;

    return [...movies].sort((a, b) => {
      let valueA: number;
      let valueB: number;

      switch (field) {
        case 'popularity':
          valueA = a.popularity ?? 0;
          valueB = b.popularity ?? 0;
          break;
        case 'vote_average':
          valueA = a.vote_average ?? 0;
          valueB = b.vote_average ?? 0;
          break;
        case 'release_date':
          valueA = a.release_date ? new Date(a.release_date).getTime() : 0;
          valueB = b.release_date ? new Date(b.release_date).getTime() : 0;
          break;
        case 'revenue':
          valueA = a.revenue ?? 0;
          valueB = b.revenue ?? 0;
          break;
        default:
          return 0;
      }

      return (valueA - valueB) * multiplier;
    });
  };

  const getFilterParams = computed(() => {
    const params: Record<string, string | number> = {
      language: 'ko-KR',
      sort_by: filters.value.sort
    };

    if (filters.value.genre !== null) {
      params.with_genres = filters.value.genre;
    }

    if (filters.value.rating !== null) {
      params['vote_average.gte'] = filters.value.rating.min;
      params['vote_average.lte'] = filters.value.rating.max;
    }

    if (filters.value.language !== null && filters.value.language !== '') {
      params.with_original_language = filters.value.language;
    }

    if (filters.value.year !== null) {
      params.year = filters.value.year;
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