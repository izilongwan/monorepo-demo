import { createApp } from 'vue'
import { createAppRouter } from './router';
import App from './views/ViewRouter.vue';
import '@/styles/index.css';
import directives from './directives';

import {
	qiankunWindow,
	renderWithQiankun
} from 'vite-plugin-qiankun/dist/helper';

function renderApp(props: Record<string, any> = {}) {
	const app = createApp(App);
	app.use(createAppRouter(props.base)).use(directives).mount('#app');
}

if (qiankunWindow?.__POWERED_BY_QIANKUN__) {
	console.log('qiankun 微前端模式，等待 mount');
} else {
	console.log('独立运行模式，执行 renderApp');
	renderApp();
}

renderWithQiankun({
	bootstrap() {
		console.log('my-vue-app bootstraped');
	},
	mount(props) {
		console.log('my-vue-app mount', props);
		renderApp(props);
	},
	unmount(props) {
		console.log('my-vue-app unmount', props);
	},
	update(props) {
		console.log('my-vue-app update', props);
	}
});
