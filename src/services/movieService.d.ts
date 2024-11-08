// services/movieService.d.ts
import { AxiosResponse } from 'axios';

interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
  popularity: number;
}

export interface MovieService {
  getPopularMovies(page?: number): Promise<AxiosResponse<MovieResponse>>;
  getNowPlayingMovies(page?: number): Promise<AxiosResponse<MovieResponse>>;
  getTopRatedMovies(page?: number): Promise<AxiosResponse<MovieResponse>>;
  getUpcomingMovies(page?: number): Promise<AxiosResponse<MovieResponse>>;
  getMovieDetails(movieId: number): Promise<AxiosResponse<Movie>>;
  searchMovies(query: string, page?: number): Promise<AxiosResponse<MovieResponse>>;
}

export const movieService: MovieService;
export default movieService;