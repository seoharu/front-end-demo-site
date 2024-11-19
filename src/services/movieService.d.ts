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

interface GenreResponse {
  genres: Genre[];
}

interface Genre {
  id: number;
  name: string;
}

interface FilterParams {
  language?: string;
  year?: number;
  sort_by?: string;
  genre?: number;
  vote_average?: number;
}

export interface MovieService {
  getMovies(page?: number, filters?: FilterParams): Promise<{
    data: MovieResponse;
    status: number;
  }>;

  getPopularMovies(page?: number): Promise<{
    data: MovieResponse;
    status: number;
  }>;

  getNowPlayingMovies(page?: number): Promise<{
    data: MovieResponse;
    status: number;
  }>;

  getTopRatedMovies(page?: number): Promise<{
    data: MovieResponse;
    status: number;
  }>;

  getUpcomingMovies(page?: number): Promise<{
    data: MovieResponse;
    status: number;
  }>;

  getMovieDetails(movieId: number): Promise<{
    data: Movie;
    status: number;
  }>;

  searchMovies(query: string, page?: number): Promise<{
    data: MovieResponse;
    status: number;
  }>;

  getGenres(): Promise<Genre[]>;

  getMovieRatings(): Promise<number[]>;
}

declare const movieService: MovieService;
export default movieService;