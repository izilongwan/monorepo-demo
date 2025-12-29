import { Directive } from 'vue';

export default {
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
} as Directive;
