<template>
	<div class="tw-p-5 tw-font-sans tw-max-w-4xl tw-mx-auto">
		<img alt="Vue logo" src="../../assets/logo.png" class="tw-block tw-mx-auto tw-mb-5 tw-max-w-48" />

		<!-- 调试信息 -->
		<div v-my-if=" data.show "
			class="tw-px-4 tw-py-3 tw-mb-4 tw-bg-slate-100 tw-border-l-4 tw-border-brand-primary tw-rounded tw-text-sm">
			Current Type: <strong>{{ data.type }}</strong>
		</div>

		<!-- 目标元素 -->
		<div v-auth=" data " class="tw-min-h-12 tw-relative tw-p-5 tw-bg-brand-light tw-rounded tw-mb-5">
			<!-- 原始内容：由 Vue 控制 -->
			<div class="tw-text-center">
				<HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
				<div class="tw-mt-3 tw-p-3 tw-bg-white tw-rounded tw-text-sm tw-break-words">Original Data: {{ data }}</div>
			</div>
		</div>

		<!-- 按钮组 -->
		<ButtonGroup v-model:data=" data " :buttons=" buttonConfig " />
	</div>
</template>

<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue';
import { ref } from 'vue';
import ButtonGroup from './ButtonGroup.vue';
import { BUTTON_CONFIG } from './constants';

const data = ref({
	name: 'Vue 3',
	version: '3.2.0',
	show: true,
	count: 1,
	type: 'default'
});

const buttonConfig = BUTTON_CONFIG;
</script>
