// composables/useMovies.ts
import { ref, computed } from 'vue'
import axios from 'axios'

interface Movie {
  id: number
  title: string
  poster_path: string
  release_date: string
  vote_average: number
  overview: string
  genre_ids: number[]
}

interface MovieResponse {
  results: Movie[]
  page: number
  total_pages: number
  total_results: number
}

export function useMovies() {
  const movies = ref<Movie[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalPages = ref(0)
  const totalResults = ref(0)
  const currentPage = ref(1)
  const apiKey = localStorage.getItem('TMDb-Key')

  // API 기본 설정
  const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
      api_key: apiKey,
      language: 'ko-KR'
    }
  })

  // 영화 데이터 가져오기 - Popular
  const fetchPopularMovies = async (page = 1) => {
    loading.value = true
    try {
      const response = await api.get<MovieResponse>('/movie/popular', {
        params: { page }
      })
      if (response.data) {
        movies.value = response.data.results
        totalPages.value = response.data.total_pages
        totalResults.value = response.data.total_results
        currentPage.value = response.data.page
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '영화 정보를 불러오는데 실패했습니다.'
      console.error('Error fetching popular movies:', e)
    } finally {
      loading.value = false
    }
  }

  // 테이블 뷰용 여러 페이지 데이터 한번에 가져오기
 const fetchMoviesForTableView = async (startPage = 1, pageCount = 5) => {
   loading.value = true
   try {
     const requests = Array.from(
       { length: pageCount },
       (_, i) => api.get<MovieResponse>('/movie/popular', {
         params: { page: startPage + i }
       })
     )

     const responses = await Promise.all(requests)
     const allResults = responses.flatMap(response => response.data.results)

     movies.value = allResults
     totalPages.value = Math.ceil(allResults.length / 20)
     totalResults.value = allResults.length
     currentPage.value = 1

     return allResults
   } catch (e) {
     error.value = e instanceof Error ? e.message : '영화 정보를 불러오는데 실패했습니다.'
     console.error('Error fetching movies for table view:', e)
     return []
   } finally {
     loading.value = false
   }
 }
  // 현재 페이지의 영화 목록 가져오기 (클라이언트 사이드 페이지네이션)
 const getMoviesForPage = (page: number, itemsPerPage = 20) => {
   const start = (page - 1) * itemsPerPage
   const end = start + itemsPerPage
   return movies.value.slice(start, end)
 }



  // 무한 스크롤용 영화 추가 로드
  const loadMoreMovies = async (page: number = currentPage.value + 1) => {
    if (loading.value || page > totalPages.value) return

    loading.value = true
    try {
      const response = await api.get<MovieResponse>('/movie/popular', {
        params: { page }
      })
      if (response.data) {
        movies.value = [...movies.value, ...response.data.results]
        totalPages.value = response.data.total_pages
        totalResults.value = response.data.total_results
        currentPage.value = response.data.page
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '추가 영화 정보를 불러오는데 실패했습니다.'
      console.error('Error loading more movies:', e)
    } finally {
      loading.value = false
    }
  }

  // 장르별 영화 필터링
  const filterMoviesByGenre = async (genreId: number, page = 1) => {
    loading.value = true
    try {
      const response = await api.get<MovieResponse>('/discover/movie', {
        params: {
          with_genres: genreId,
          page,
          sort_by: 'popularity.desc'
        }
      })
      if (response.data) {
        movies.value = response.data.results
        totalPages.value = response.data.total_pages
        totalResults.value = response.data.total_results
        currentPage.value = response.data.page
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '장르별 영화를 불러오는데 실패했습니다.'
      console.error('Error filtering movies by genre:', e)
    } finally {
      loading.value = false
    }
  }

  // 영화 검색
  const searchMovies = async (query: string, page = 1) => {
    if (!query.trim()) return

    loading.value = true
    try {
      const response = await api.get<MovieResponse>('/search/movie', {
        params: {
          query,
          page
        }
      })
      if (response.data) {
        movies.value = response.data.results
        totalPages.value = response.data.total_pages
        totalResults.value = response.data.total_results
        currentPage.value = response.data.page
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '영화 검색에 실패했습니다.'
      console.error('Error searching movies:', e)
    } finally {
      loading.value = false
    }
  }

  // 영화 상세 정보 가져오기
  const getMovieDetails = async (movieId: number) => {
    loading.value = true
    try {
      const response = await api.get(`/movie/${movieId}`)
      return response.data
    } catch (e) {
      error.value = e instanceof Error ? e.message : '영화 상세 정보를 불러오는데 실패했습니다.'
      console.error('Error fetching movie details:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  // 데이터 초기화
  const resetMovies = () => {
    movies.value = []
    currentPage.value = 1
    totalPages.value = 0
    totalResults.value = 0
    error.value = null
  }

  // Computed Properties
  const hasMore = computed(() => currentPage.value < totalPages.value)
  const isEmpty = computed(() => movies.value.length === 0)

  return {
    // State
    movies,
    loading,
    error,
    currentPage,
    totalPages,
    totalResults,

    // Methods
    fetchPopularMovies,
    loadMoreMovies,
    filterMoviesByGenre,
    searchMovies,
    getMovieDetails,
    resetMovies,
    fetchMoviesForTableView,
    getMoviesForPage,

    // Computed
    hasMore,
    isEmpty
  }
}