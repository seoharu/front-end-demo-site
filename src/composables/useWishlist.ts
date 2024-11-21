import { computed } from 'vue';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

export function useWishlist() {
  const STORAGE_KEY = 'movieWishlist';

  const getWishlist = (): Movie[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  };

  const isWishlisted = (movieId: number): boolean => {
    const wishlist = getWishlist();
    return wishlist.some((item: Movie) => item.id === movieId);
  };

  const toggleWishlist = (movie: Movie): void => {
    const wishlist = getWishlist();
    const index = wishlist.findIndex((item: Movie) => item.id === movie.id);

    if (index === -1) {
      wishlist.push(movie);
    } else {
      wishlist.splice(index, 1);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  };

  const getWishlistedMovies = (): Movie[] => {
    return getWishlist();
  };

  return {
    isWishlisted,
    toggleWishlist,
    getWishlistedMovies
  };
}