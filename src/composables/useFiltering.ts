// useFiltering.ts
import { ref, computed } from 'vue';

export interface Movie {
  id: number;
  title: string;
  genre_ids: number[];
  release_date: string;
  vote_average: number;
  popularity: number;
  original_language: string;  // 언어 필드 추가
}

export interface FilterState {
  genre: number | null;
  rating: { min: number; max: number; } | null;
  language: string | null;
  year: number | null;
  sort: string;
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

      // 평점 필터링 로직 수정
      if (filters.value.rating !== null) {
        const movieRating = movie.vote_average || 0;
        passes = passes &&
          movieRating >= filters.value.rating.min &&
          movieRating < filters.value.rating.max;
      }

      // Year filter
      if (filters.value.year !== null) {
        const movieYear = new Date(movie.release_date).getFullYear();
        passes = passes && movieYear === filters.value.year;
      }

      // 언어 필터
      if (filters.value.language !== null && filters.value.language !== '') {
        passes = passes && movie.original_language === filters.value.language;
      }

      return passes;
    });
  };

  const sortMovies = (movies: Movie[]): Movie[] => {
    if (!filters.value.sort) return movies;

    const [sortField, sortOrder] = filters.value.sort.split('.');
    const multiplier = sortOrder === 'desc' ? -1 : 1;

    return [...movies].sort((a, b) => {
      if (sortField === 'popularity') {
        return ((a.popularity || 0) - (b.popularity || 0)) * multiplier;
      } else if (sortField === 'vote_average') {
        return ((a.vote_average || 0) - (b.vote_average || 0)) * multiplier;
      } else if (sortField === 'release_date') {
        if (!a.release_date || !b.release_date) return 0;
        return (new Date(a.release_date).getTime() - new Date(b.release_date).getTime()) * multiplier;
      } else if (sortField === 'revenue') {// revenue property에 대한 타입 안전성 확보
        const revenueA = (a as any).revenue ?? 0;  // 타입 단언 사용
        const revenueB = (b as any).revenue ?? 0;
        return (revenueA - revenueB) * multiplier;
      } else {
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

    // 평점 파라미터 수정
    if (filters.value.rating !== null) {
      params['vote_average.gte'] = filters.value.rating.min;
      if (filters.value.rating.max < 10) {
        params['vote_average.lte'] = filters.value.rating.max;
      }
    }

    // 언어 필터 파라미터
    if (filters.value.language !== null && filters.value.language !== '') {
      params.with_original_language = filters.value.language;
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