import { ref, computed } from 'vue'

export interface Movie {
  id: number
  title: string
  poster_path: string
  overview?: string
  vote_average?: number
  release_date?: string
}

export function useWishlist() {
  const wishlist = ref<Movie[]>([])

  // 초기화: localStorage에서 위시리스트 불러오기
  const initWishlist = () => {
    const savedWishlist = localStorage.getItem('movieWishlist')
    if (savedWishlist) {
      wishlist.value = JSON.parse(savedWishlist)
    }
  }

  // 위시리스트 저장
  const saveWishlist = () => {
    localStorage.setItem('movieWishlist', JSON.stringify(wishlist.value))
  }

  // 영화가 위시리스트에 있는지 확인
  const isInWishlist = (movieId: number) => {
    return wishlist.value.some(movie => movie.id === movieId)
  }

  // 위시리스트에 영화 추가/제거
  const toggleWishlist = (movie: Movie) => {
    const index = wishlist.value.findIndex(item => item.id === movie.id)

    if (index === -1) {
      wishlist.value.push(movie)
    } else {
      wishlist.value.splice(index, 1)
    }

    saveWishlist()
  }

  // 위시리스트 개수
  const wishlistCount = computed(() => wishlist.value.length)

  // 컴포저블 초기화
  initWishlist()

  return {
    wishlist,
    isInWishlist,
    toggleWishlist,
    wishlistCount
  }
}