<template>
	<fieldset class="tw-border-2 tw-border-solid tw-p-3 tw-m-3 tw-rounded" :class=" borderClass ">
		<legend class="tw-px-2 tw-font-medium tw-text-gray-700">
			{{ type === 'admin' ? 'Admin Component' : 'User Component' }}
		</legend>
		<div>
			<div v-if="type === 'admin'"
class="tw-text-red-500 tw-font-bold tw-text-2xl">
				🛠️ Admin Content
			</div>
			<div v-else-if="type === 'user'"
class="tw-text-blue-500 tw-font-bold tw-text-2xl">
				🧑 User Content
			</div>
			<div v-else class="tw-text-gray-500">No valid type provided.</div>
		</div>
	</fieldset>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
	type: string;
}>();

const borderClass = computed(() => {
	switch (props.type) {
		case 'admin':
			return 'tw-border-red-500';
		case 'user':
			return 'tw-border-blue-500';
		default:
			return 'tw-border-gray-400';
	}
});
</script>
