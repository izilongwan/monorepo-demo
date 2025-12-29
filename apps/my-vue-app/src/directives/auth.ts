import { createApp, Directive, DirectiveBinding } from 'vue';
import Auth from '@/components/Auth.vue';

interface ElementWithAuth extends HTMLElement {
	__container: HTMLElement;
	__auth_app?: ReturnType<typeof createApp>;
	__comment: Comment;
	__originalContent: Element;
}

export default {
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
} as Directive<ElementWithAuth>;

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
