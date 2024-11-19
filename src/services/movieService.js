import axios from 'axios'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = localStorage.getItem('TMDb-Key')

class MovieService {
  async getMovies(page = 1, filters = {}) {
    try {
      const { language = 'ko-KR', year, sort_by = 'popularity.desc', genre, vote_average } = filters

      let url = `${TMDB_BASE_URL}/discover/movie?api_key=${API_KEY}&language=${language}&page=${page}`

      if (sort_by) url += `&sort_by=${sort_by}`
      if (year) url += `&primary_release_year=${year}`
      if (genre) url += `&with_genres=${genre}`
      if (vote_average) url += `&vote_average.gte=${vote_average}`

      const response = await axios.get(url)
      return {
        data: response.data,
        status: response.status
      }
    } catch (error) {
      console.error('Error fetching movies:', error)
      throw error
    }
  }

  async getPopularMovies(page = 1) {
    return this.getMovies(page, { sort_by: 'popularity.desc' })
  }

  async getMovieRatings() {
    try {
      const response = await this.getMovies(1, { sort_by: 'vote_average.desc' })
      return response.data.results.map(movie => movie.vote_average)
    } catch (error) {
      console.error('Error fetching movie ratings:', error)
      throw error
    }
  }

  async getGenres() {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=ko-KR`
      )
      console.log('Genres response:', response.data) // 디버깅용
      return response.data.genres
    } catch (error) {
      console.error('장르 목록 가져오기 실패:', error)
      return []
    }
  }
}

// 장르 목록 미리 정의 (API 호출 실패 시 폴백용)
export const DEFAULT_GENRES = [
  { id: 28, name: '액션' },
  { id: 12, name: '모험' },
  { id: 16, name: '애니메이션' },
  { id: 35, name: '코미디' },
  { id: 80, name: '범죄' },
  { id: 99, name: '다큐멘터리' },
  { id: 18, name: '드라마' },
  { id: 10751, name: '가족' },
  { id: 14, name: '판타지' },
  { id: 36, name: '역사' },
  { id: 27, name: '공포' },
  { id: 10402, name: '음악' },
  { id: 9648, name: '미스터리' },
  { id: 10749, name: '로맨스' },
  { id: 878, name: 'SF' },
  { id: 10770, name: 'TV 영화' },
  { id: 53, name: '스릴러' },
  { id: 10752, name: '전쟁' },
  { id: 37, name: '서부' }
]

const movieService = new MovieService()
export default new MovieService()