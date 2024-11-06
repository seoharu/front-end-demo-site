import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'ko-KR',
  },
});

export const getMovies = {
  popular: (page = 1) => tmdbApi.get(`/movie/popular?page=${page}`),
  nowPlaying: (page = 1) => tmdbApi.get(`/movie/now_playing?page=${page}`),
  topRated: (page = 1) => tmdbApi.get(`/movie/top_rated?page=${page}`),
  trending: () => tmdbApi.get('/trending/movie/week'),
};

export const getMovieDetails = (movieId) =>
  tmdbApi.get(`/movie/${movieId}`);

export default tmdbApi;