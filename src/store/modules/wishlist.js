
export default {
  namespaced: true,

  state: {
    wishlist: JSON.parse(localStorage.getItem('wishlist') || '[]')
  },

  mutations: {
    ADD_TO_WISHLIST(state, movie) {
      state.wishlist.push(movie);
      localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
    },
    REMOVE_FROM_WISHLIST(state, movieId) {
      state.wishlist = state.wishlist.filter(movie => movie.id !== movieId);
      localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
    }
  },

  actions: {
    toggleWishlist({ commit, state }, movie) {
      const exists = state.wishlist.some(item => item.id === movie.id);
      if (exists) {
        commit('REMOVE_FROM_WISHLIST', movie.id);
      } else {
        commit('ADD_TO_WISHLIST', movie);
      }
    }
  },

  getters: {
    isInWishlist: (state) => (movieId) => {
      return state.wishlist.some(movie => movie.id === movieId);
    }
  }
};