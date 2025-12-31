import '@/styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter, useRoutes } from 'react-router-dom';
import type { QiankunProps } from 'vite-plugin-qiankun/dist/helper';
import {
	qiankunWindow,
	renderWithQiankun
} from 'vite-plugin-qiankun/dist/helper';

import { routes } from './router';
import { initGlobalState, useGlobalStore } from './stores/global';

let ReactRoot: ReactDOM.Root | null = null;

const renderApp = (
	props: QiankunProps = { base: import.meta.env.VITE_BASE_URL } as QiankunProps
) => {
	const Router = () => useRoutes(routes);

	ReactRoot = ReactDOM.createRoot(document.getElementById('subapp')!);

	ReactRoot.render(
		<React.StrictMode>
			<BrowserRouter basename={props.base || '/'}>
				<Router />
			</BrowserRouter>
		</React.StrictMode>
	);
};

// 独立运行时
if (!qiankunWindow?.__POWERED_BY_QIANKUN__) {
	console.log('独立运行模式，执行 renderApp');
	renderApp();
} else {
	console.log('qiankun 微前端模式，等待 mount');
}

const bootstrap = async () => {
	console.log('my-react-app bootstraped');
};

const mount = async (props: QiankunProps = {} as QiankunProps) => {
	const globalProps = props;
	initGlobalState(globalProps);
	const { updateGlobalState } = useGlobalStore.getState();
	updateGlobalState({ app: 'my-react-app' }, false);
	renderApp(globalProps);
};

const unmount = async (props: QiankunProps) => {
	console.log('my-react-app unmount', props);
	ReactRoot?.unmount();
	ReactRoot = null;
};

const update = async (props: QiankunProps) => {
	console.log('my-react-app update', props);
};

renderWithQiankun({
	bootstrap,
	mount,
	unmount,
	update
});

export { bootstrap, mount, unmount, update };
