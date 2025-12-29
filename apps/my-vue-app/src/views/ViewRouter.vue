<template>
	<div v-if="needMenu" class="tw-flex tw-h-full tw-overflow-hidden">
		<JumpButtons />
		<RouterView class="tw-h-full tw-w-full tw-overflow-y-auto" />
	</div>

	<RouterView v-else class="tw-h-full tw-w-full tw-overflow-y-auto" />
</template>

<script setup lang="ts">
import JumpButtons from '@/components/JumpButtons.vue';

const { needMenu } = defineProps<{
	needMenu: boolean;
}>();
</script>
