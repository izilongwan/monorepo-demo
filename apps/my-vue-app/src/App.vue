<template>
	<img alt="Vue logo" src="./assets/logo.png" />

	<!-- 调试信息 -->
	<div v-my-if="data.show">Current Type: {{ data.type }}</div>

	<!-- 目标元素 -->
	<div
		v-auth="data"
		style="min-height: 50px; position: relative; /* 确保定位正常 */">
		<!-- 原始内容：由 Vue 控制 -->
		<div class="original-content">
			<HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
			<div>Original Data: {{ data }}</div>
		</div>
	</div>

	<div style="margin-top: 20px">
		<button @click="data.type = 'admin'">admin</button>
		<button @click="data.type = 'user'">user</button>
		<button @click="data.type = 'none'">none</button>
		<button @click="data.type = 'default'">default</button>
		<button @click="data.show = !data.show">Change Show</button>
		<button @click="data.count++">Increase Count ({{ data.count }})</button>
	</div>
</template>

<script setup lang="ts">
import Auth from '@/components/Auth.vue';
import HelloWorld from '@/components/HelloWorld.vue'; // 确保导入
import { createApp, Directive, DirectiveBinding, ref } from 'vue';

interface ElementWithAuth extends HTMLElement {
	__container: HTMLElement;
	__auth_app?: ReturnType<typeof createApp>;
	__comment: Comment;
	__originalContent: HTMLElement;
}

const data = ref({
	name: 'Vue 3',
	version: '3.2.0',
	show: true,
	count: 1,
	type: 'default'
});

const vAuth: Directive = {
	mounted(el, bind) {
		el.__container = document.createElement('div');
		el.__originalContent = el.firstElementChild!;
		el.__comment = document.createComment('v-auth');
		el.appendChild(el.__container);
		updateAuth(el as ElementWithAuth, bind);
	},
	updated(el, bind) {
		updateAuth(el as ElementWithAuth, bind);
	},
	unmounted(el) {
		el.__auth_app?.unmount();
	}
};

const vMyIf: Directive = {
	mounted(el, bind) {
		el.__comment = document.createComment('v-my-if');
		if (!bind.value) {
			el.replaceWith(el.__comment);
		}
	},
	updated(el, bind) {
		if (bind.value) {
			el.__comment.parentNode && el.__comment.replaceWith(el);
			return;
		}
		el.parentNode && el.replaceWith(el.__comment);
	}
};

function updateAuth(el: ElementWithAuth, bind: DirectiveBinding<any>) {
	const { type } = bind.value;
	const container = el.__container;

	if (type !== 'default') {
		// 隐藏原始内容
		if (el.contains(el.__originalContent)) {
			el.__originalContent.replaceWith(el.__comment);
		}

		// 显示Auth组件容器
		container.style.display = 'block';

		// 创建并挂载 Auth 组件
		el.__auth_app?.unmount();
		el.__auth_app = createApp(Auth, { type });
		el.__auth_app.mount(container);
		return;
	}
	// 隐藏 Auth 组件容器
	container.style.display = 'none';

	// 恢复原始内容显示
	if (el.contains(el.__comment)) {
		el.__comment.replaceWith(el.__originalContent);
	}
}
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
button {
	margin: 0 5px;
	padding: 8px 16px;
	cursor: pointer;
}
</style>
