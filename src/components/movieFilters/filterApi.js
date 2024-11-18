// src/api/filtersApi.js
import axios from 'axios'

const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = process.env.VUE_APP_TMDB_API_KEY

const filterApi = axios.create({
 baseURL: BASE_URL,
 params: {
   api_key: API_KEY,
   language: 'ko-KR',
 },
})

export const getGenres = () => filterApi.get('/genre/movie/list')

export const getMoviesByGenre = (genreId, page = 1) =>
 filterApi.get(`/discover/movie?with_genres=${genreId}&page=${page}`)

export default filterApi