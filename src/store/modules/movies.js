import movieService from '@/services/movieService';

export default {
  namespaced: true,

  state: {
    movies: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    viewMode: 'table' // 'table' or 'infinite'
  },

  mutations: {
    SET_MOVIES(state, movies) {
      state.movies = movies;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_CURRENT_PAGE(state, page) {
      state.currentPage = page;
    },
    SET_TOTAL_PAGES(state, total) {
      state.totalPages = total;
    },
    SET_VIEW_MODE(state, mode) {
      state.viewMode = mode;
    }
  },
  actions: {
    async fetchPopularMovies({ commit }, page) {
      try {
        commit('SET_LOADING', true);
        const response = await movieService.getPopularMovies(page);
        commit('SET_MOVIES', response.data.results);
        commit('SET_TOTAL_PAGES', response.data.total_pages);
        commit('SET_CURRENT_PAGE', page);
      } catch (error) {
        commit('SET_ERROR', error.message);
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },

  getters: {
    getMovieById: (state) => (id) => {
      return state.movies.find(movie => movie.id === id);
    }
  }
};