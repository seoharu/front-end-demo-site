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
    error.value = null

    try {
      const response = await api.get<MovieResponse>('/movie/popular', {
        params: { page }
      })

      if (response.data) {
        // 데이터 업데이트
        movies.value = response.data.results
        totalPages.value = response.data.total_pages
        totalResults.value = response.data.total_results
        currentPage.value = page

        console.log('Fetched page:', page, {
          currentPage: currentPage.value,
          totalPages: totalPages.value,
          hasMore: hasMore.value,
          moviesCount: movies.value.length
        })

        return response.data
      }
    } catch (e) {
      console.error('Error fetching movies:', e)
      error.value = e instanceof Error ? e.message : '영화 정보를 불러오는데 실패했습니다.'
      throw e
    } finally {
      loading.value = false
    }
  }

  // 테이블 뷰용 여러 페이지 데이터 한번에 가져오기
  const fetchMoviesForTableView = async (pageCount = 5) => {
    loading.value = true
    try {
      const requests = Array.from(
        { length: pageCount },
        (_, i) => api.get<MovieResponse>('/movie/popular', {
          params: { page: i + 1 }
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

  // 현재 페이지의 영화 목록 가져오기
  const getMoviesForPage = (page: number) => {
    const itemsPerPage = 20;
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

  // 나머지 함수들은 그대로 유지...
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
        currentPage.value = page
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '장르별 영화를 불러오는데 실패했습니다.'
      console.error('Error filtering movies by genre:', e)
    } finally {
      loading.value = false
    }
  }

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
        currentPage.value = page
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '영화 검색에 실패했습니다.'
      console.error('Error searching movies:', e)
    } finally {
      loading.value = false
    }
  }

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
    movies,
    loading,
    error,
    currentPage,
    totalPages,
    totalResults,
    fetchPopularMovies,
    loadMoreMovies,
    filterMoviesByGenre,
    searchMovies,
    getMovieDetails,
    resetMovies,
    fetchMoviesForTableView,
    getMoviesForPage,
    hasMore,
    isEmpty
  }
}