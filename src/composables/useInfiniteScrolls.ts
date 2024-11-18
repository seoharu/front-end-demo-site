import { ref, onMounted, onUnmounted } from 'vue';

interface InfiniteScrollOptions {
  threshold?: number;
  immediate?: boolean;
  disabled?: boolean;
}

export const useInfiniteScroll = (
  loadMore: () => Promise<void>,
  options: InfiniteScrollOptions = {}
) => {
  // 상태 관리
  const loading = ref(false);
  const hasMore = ref(true);
  const error = ref<Error | null>(null);

  // 옵션 설정
  const {
    threshold = 100,
    immediate = false,
    disabled = false
  } = options;

  // 초기 로딩
  if (immediate && !disabled) {
    loading.value = true;
    loadMore()
      .catch(err => {
        error.value = err;
      })
      .finally(() => {
        loading.value = false;
      });
  }

  // 스크롤 핸들러
  const handleScroll = async () => {
    if (loading.value || !hasMore.value || disabled || error.value) return;

    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 스크롤이 하단에 도달했는지 체크
    const scrollBottom = scrollPosition + windowHeight >= documentHeight - threshold;

    if (scrollBottom) {
      try {
        loading.value = true;
        await loadMore();
        // 데이터가 더 있는지 확인하고 `hasMore` 갱신
        hasMore.value = scrollPosition + windowHeight < documentHeight;
      } catch (err) {
        error.value = err as Error;
        console.error('Infinite scroll error:', err);
      } finally {
        loading.value = false;
      }
    }
  };

  // 디바운스된 스크롤 핸들러
  let timeoutId: number | null = null;
  const debouncedHandleScroll = () => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(handleScroll, 100);
  };

  // 상태 설정 함수들
  const setLoading = (state: boolean) => {
    loading.value = state;
  };

  const setHasMore = (state: boolean) => {
    hasMore.value = state;
  };

  // 에러 리셋
  const resetError = () => {
    error.value = null;
  };

  // 수동으로 다음 페이지 로드
  const loadNextPage = async () => {
    if (loading.value || !hasMore.value || disabled) return;

    try {
      loading.value = true;
      await loadMore();
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  // 이벤트 리스너 설정
  onMounted(() => {
    if (!disabled) {
      window.addEventListener('scroll', debouncedHandleScroll);
    }
  });

  onUnmounted(() => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    window.removeEventListener('scroll', debouncedHandleScroll);
  });

  return {
    loading,
    hasMore,
    error,
    setLoading,
    setHasMore,
    resetError,
    loadNextPage
  };
};