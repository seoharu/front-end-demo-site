import { ref, computed } from 'vue';

export const usePagination = (initialPage = 1) => {
  const currentPage = ref(initialPage);
  const totalPages = ref(1);
  const itemsPerPage = ref(20); // TMDB API 기본값

  // 시작 페이지 계산
  const startPage = computed(() => {
    const visiblePages = 5; // 보여질 페이지 수
    const half = Math.floor(visiblePages / 2);
    let start = currentPage.value - half;

    if (start < 1) {
      start = 1;
    }

    if (start + visiblePages - 1 > totalPages.value) {
      start = Math.max(1, totalPages.value - visiblePages + 1);
    }

    return start;
  });

  // 끝 페이지 계산
  const endPage = computed(() => {
    const visiblePages = 5;
    return Math.min(startPage.value + visiblePages - 1, totalPages.value);
  });

  // 페이지 범위 생성
  const pageRange = computed(() => {
    const range = [];
    for (let i = startPage.value; i <= endPage.value; i++) {
      range.push(i);
    }
    return range;
  });

  // 페이지 변경
  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      return true;
    }
    return false;
  };

  // 총 페이지 수 설정
  const setTotalPages = (total: number) => {
    totalPages.value = total;
  };

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    startPage,
    endPage,
    pageRange,
    setPage,
    setTotalPages
  };
};