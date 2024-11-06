<template>
  <div class="skeleton-form-container">
    <SkeletonElement
      type="title"
      :width="120"
      centered
      class="mb-6"
    />

    <div class="space-y-4">
      <!-- 이메일 입력 필드 -->
      <SkeletonElement type="input" />

      <!-- 비밀번호 입력 필드 -->
      <SkeletonElement type="input" />

      <!-- 추가 입력 필드 (회원가입 폼일 경우) -->
      <template v-if="isRegister">
        <SkeletonElement type="input" />
      </template>

      <!-- 체크박스 -->
      <SkeletonElement
        type="checkbox"
        class="mt-2"
      />

      <!-- 제출 버튼 -->
      <SkeletonElement
        type="button"
        class="mt-4"
      />

      <!-- 토글 버튼 -->
      <SkeletonElement
        type="text"
        :width="180"
        centered
        class="mt-4"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SkeletonElement from './SkeletonElement.vue'

// eslint-disable-next-line no-undef
defineProps({
  isRegister: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped lang="scss">
.skeleton-form-container {
  padding: 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}


.mb-6 {
  margin-bottom: 1.5rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-4 {
  margin-top: 1rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.skeleton-title {
  margin: 0 auto;
}

.skeleton-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

</style>
