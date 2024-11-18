// src/utils/fetchMovies.js
import axios from 'axios';

export const fetchMovies = async (fetchUrl, moviesPerPage, totalMoviesNeeded = 600) => {
  try {
    const numberOfPages = Math.ceil(totalMoviesNeeded / moviesPerPage); // 페이지 수 계산
    let allMovies = [];

    for (let page = 1; page <= numberOfPages; page++) {
      const response = await axios.get(fetchUrl, {
        params: {
          page: page, // 페이지 번호
          per_page: moviesPerPage // 페이지당 영화 수
        }
      });
      allMovies = [...allMovies, ...response.data.results];
    }

    return allMovies.slice(0, totalMoviesNeeded);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};
