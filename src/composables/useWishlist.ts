import { ref, watch } from 'vue';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview?: string;
}

interface WishlistItem extends Movie {
  addedAt: string;
}

export type SortOption = 'date' | 'title' | 'rating' | 'release';
export type SortOrder = 'asc' | 'desc';

const WISHLIST_KEY = 'movieWishlist';

export const useWishlist = () => {
  // 초기 상태 설정
  const wishlist = ref<WishlistItem[]>([]);

  // 로컬 스토리지에서 데이터 로드
  const loadWishlist = () => {
    try {
      const savedWishlist = localStorage.getItem(WISHLIST_KEY);
      if (savedWishlist) {
        wishlist.value = JSON.parse(savedWishlist);
      }
    } catch (error) {
      console.error('위시리스트 로드 중 에러:', error);
      wishlist.value = [];
    }
  };

  // 초기 로드
  loadWishlist();

  // 위시리스트 변경 시 자동 저장
  watch(wishlist, (newWishlist) => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(newWishlist));
    } catch (error) {
      console.error('위시리스트 저장 중 에러:', error);
    }
  }, { deep: true });

  // 찜하기 목록 가져오기
  const getWishlist = () => wishlist.value;

  // 찜하기 상태 확인
  const isWishlisted = (movieId: number): boolean => {
    return wishlist.value.some(item => item.id === movieId);
  };

  // 찜하기 토글
  const toggleWishlist = (movie: Movie): boolean => {
    try {
      const index = wishlist.value.findIndex(item => item.id === movie.id);

      if (index === -1) {
        // 새로운 항목 추가
        const newItem: WishlistItem = {
          ...movie,
          addedAt: new Date().toISOString()
        };
        wishlist.value.push(newItem);
      } else {
        // 기존 항목 제거
        wishlist.value.splice(index, 1);
      }

      return index === -1; // 추가되었으면 true, 제거되었으면 false
    } catch (error) {
      console.error('위시리스트 토글 중 에러:', error);
      return false;
    }
  };

  // 특정 영화 정보 가져오기
  const getWishlistItem = (movieId: number): WishlistItem | undefined => {
    return wishlist.value.find(item => item.id === movieId);
  };

  // 위시리스트 정렬
  const sortWishlist = (sortBy: 'date' | 'title' | 'rating' = 'date') => {
    wishlist.value.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return b.vote_average - a.vote_average;
        default:
          return 0;
      }
    });
  };

  // 위시리스트 초기화
  const clearWishlist = () => {
    wishlist.value = [];
  };

  // 여러 영화 한번에 추가
  const addMultipleToWishlist = (movies: Movie[]) => {
    const newItems = movies
      .filter(movie => !isWishlisted(movie.id))
      .map(movie => ({
        ...movie,
        addedAt: new Date().toISOString()
      }));

    wishlist.value.push(...newItems);
  };
  // 정렬 로직만 제공
  const getSortedWishlist = (sortBy: SortOption, order: SortOrder) => {
    return [...wishlist.value].sort((a, b) => {
      let compareResult = 0;

      switch (sortBy) {
        case 'date':
          compareResult = new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
          break;
        case 'title':
          compareResult = a.title.localeCompare(b.title);
          break;
        case 'rating':
          compareResult = b.vote_average - a.vote_average;
          break;
        case 'release':
          compareResult = new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
          break;
      }

      return order === 'asc' ? compareResult : -compareResult;
    });
  };


  return {
    wishlist,
    getWishlist,
    isWishlisted,
    toggleWishlist,
    getWishlistItem,
    sortWishlist,
    clearWishlist,
    addMultipleToWishlist,
    getSortedWishlist,
  };
};