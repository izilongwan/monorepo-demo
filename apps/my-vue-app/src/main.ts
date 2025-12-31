import '@/styles/index.css';
import { createApp } from 'vue';
import directives from './directives';
import { createAppRouter } from './router';
import App from './views/ViewRouter.vue';

import { initGlobalState, updateGlobalState } from '@/stores/global';
import {
	QiankunProps,
	qiankunWindow,
	renderWithQiankun
} from 'vite-plugin-qiankun/dist/helper';

function renderApp(
	props: QiankunProps = {
		base: import.meta.env.VITE_APP_BASE_URL || '/'
	} as QiankunProps
) {
	const app = createApp(App);
	initGlobalState(props);
	updateGlobalState({ app: { name: 'my-vue-app' } });
	app.use(createAppRouter(props.base)).use(directives).mount('#subapp');
}

if (qiankunWindow?.__POWERED_BY_QIANKUN__) {
	console.log('qiankun 微前端模式，等待 mount');
} else {
	console.log('独立运行模式，执行 renderApp');
	renderApp();
}

export async function bootstrap() {
	console.log('my-vue-app bootstraped');
}

export async function mount(props: QiankunProps) {
	console.log('my-vue-app mount', props);
	renderApp(props);
}

export async function unmount(props: QiankunProps) {
	console.log('my-vue-app unmount', props);
}

export async function update(props: QiankunProps) {
	console.log('my-vue-app update', props);
}

renderWithQiankun({
	bootstrap,
	mount,
	unmount,
	update
});
