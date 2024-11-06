import axios from 'axios';

const getApiKey = () => {
  const apiKey = localStorage.getItem('TMDb-Key');
  if (!apiKey) {
    throw new Error('API 키가 없습니다. 로그인이 필요합니다.');
  }
  return apiKey;
};

const apiClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    language: 'ko-KR'
  }
});

// 요청 인터셉터 추가
apiClient.interceptors.request.use(
  (config) => {
    // 매 요청마다 최신 API 키 사용
    config.params = {
      ...config.params,
      api_key: getApiKey()
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const handleApiError = (error) => {
  if (error.response) {
    // API 에러 응답
    console.error('API 에러:', error.response.data);
    if (error.response.status === 401) {
      // API 키 관련 에러
      localStorage.removeItem('TMDb-Key');
    }
  }
  throw error;
};

export default {
  async getPopularMovies(page = 1) {
    try {
      return await apiClient.get(`/movie/popular`, { params: { page } });
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getNowPlayingMovies(page = 1) {
    try {
      return await apiClient.get(`/movie/now_playing`, { params: { page } });
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getTopRatedMovies(page = 1) {
    try {
      return await apiClient.get(`/movie/top_rated`, { params: { page } });
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getUpcomingMovies(page = 1) {
    try {
      return await apiClient.get(`/movie/upcoming`, { params: { page } });
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getMovieDetails(movieId) {
    try {
      return await apiClient.get(`/movie/${movieId}`);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async searchMovies(query, page = 1) {
    try {
      return await apiClient.get(`/search/movie`, {
        params: {
          query,
          page
        }
      });
    } catch (error) {
      return handleApiError(error);
    }
  }
};