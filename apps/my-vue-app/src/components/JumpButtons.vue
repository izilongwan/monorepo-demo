<template>
  <div class="tw-flex tw-flex-col tw-items-center tw-p-4">
    <div v-for="btn in routes" :key=" btn.name " class="tw-m-3">
      <RouterLink :to=" btn.path "
        class="tw-px-4 tw-py-2 tw-text-blue-500 hover:tw-text-blue-700 tw-border tw-border-blue-300 tw-rounded tw-transition-all tw-duration-300"
        active-class="tw-bg-blue-500 tw-text-white tw-border-blue-500"
        exact-active-class="tw-bg-blue-600 tw-text-white tw-border-blue-600 tw-font-semibold">
        {{ btn.name }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { routes } from '@/router';
</script>

<style scoped></style>
