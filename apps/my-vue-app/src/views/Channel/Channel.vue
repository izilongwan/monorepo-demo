<template>
  <div>
    <h2 class="tw-text-2xl tw-font-bold tw-mb-4">Channel View</h2>
    <p class="tw-text-gray-700">
      This is the Channel view component. You can add your channel-related content here.
    </p>

    <div class="tw-mt-6">
      <h3 class="tw-text-xl tw-font-semibold tw-mb-2">Global State Info:</h3>
      <pre class="tw-bg-gray-100 tw-p-4 tw-rounded tw-text-sm tw-overflow-x-auto">
      {{ JSON.stringify(globalState, null, 4) }}
      </pre>
    </div>

    <div class="tw-my-6 tw-flex tw-gap-4">
      <button v-for="(action, index) in actions" :key=" index "
        class="tw-mt-4 tw-px-4 tw-py-2 tw-text-white tw-rounded tw-transition-colors" :class=" action.className "
        @click=" action.handler ">
        {{ action.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { globalState, updateGlobalState } from '@/stores/global';

const actions = [
  {
    label: 'Update User',
    className: 'tw-bg-green-500 hover:tw-bg-green-600',
    handler: () =>
      updateGlobalState({ user: { lastVisited: new Date().toLocaleString() } })
  },
  {
    label: 'Update Count',
    className: 'tw-bg-red-500 hover:tw-bg-red-600',
    handler: () => updateGlobalState({ count: (globalState.count || 0) + 1 })
  }
];
</script>
