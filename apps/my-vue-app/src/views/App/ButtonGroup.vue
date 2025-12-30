<template>
  <div class="tw-flex tw-flex-wrap tw-gap-2 tw-mt-5">
    <button v-for="btn in buttons" :key=" `${ btn.type }-${ btn.value }` " :class=" getButtonClass(btn) "
      @click="handleButtonClick(btn)">
      {{ btn.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { AuthType } from './constants';

interface ButtonConfig {
  label: string;
  type: AuthType | 'toggle' | 'increment';
  value?: AuthType;
}

interface DataModel {
  type: AuthType;
  show: boolean;
  count: number;
}

interface Props {
  buttons: ButtonConfig[];
  data: DataModel;
}

const props = defineProps<Props>();
const data = defineModel<DataModel>('data');

const getButtonClass = (btn: ButtonConfig): string => {
  const baseClass = 'tw-px-2 tw-py-1 tw-rounded tw-cursor-pointer tw-transition-all tw-duration-300';

  if (['admin', 'user', 'none', 'default'].includes(btn.type)) {
    // 类型按钮：检查是否被选中
    const isActive = btn.value && data.value?.type && btn.value === data.value.type;
    if (isActive) {
      return `${ baseClass } tw-bg-blue-500 tw-text-white tw-border tw-border-blue-500 tw-font-semibold`;
    }
    return `${ baseClass } tw-bg-brand-bg tw-border tw-border-brand-border tw-text-gray-700 hover:tw-bg-gray-200`;
  }

  // 动作按钮：toggle 和 increment
  return `${ baseClass } tw-bg-brand-primary tw-text-white tw-border tw-border-brand-primary hover:tw-bg-blue-400`;
};

const handleButtonClick = (btn: ButtonConfig) => {
  if (!data.value) return;

  let newData = { ...data.value };

  if (btn.type === 'toggle') {
    newData.show = !newData.show;
  } else if (btn.type === 'increment') {
    newData.count++;
  } else if (btn.value) {
    newData.type = btn.value;
  }

  data.value = newData;
};
</script>
