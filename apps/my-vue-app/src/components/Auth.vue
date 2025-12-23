<template>
	<div
		:style="{
			border: '2px solid',
			padding: '10px',
			margin: '10px',
			borderColor: type === 'admin' ? 'red' : type === 'user' ? 'blue' : 'gray'
		}">
		<field>
			<legend>
				{{ type === 'admin' ? 'Admin Component' : 'User Component' }}
			</legend>
			<div>
				<div
					v-if="type === 'admin'"
					style="color: red; font-weight: bold; font-size: 24px">
					🛠️ Admin Content
				</div>
				<div
					v-else-if="type === 'user'"
					style="color: blue; font-weight: bold; font-size: 24px">
					🧑 User Content
				</div>
				<div v-else>No valid type provided.</div>
			</div>
		</field>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	type: string;
}>();
</script>

<style scoped></style>
