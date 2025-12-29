import '@/styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter, useRoutes } from 'react-router-dom';
import {
	qiankunWindow,
	renderWithQiankun
} from 'vite-plugin-qiankun/dist/helper';

import { routes } from './router';
import { CommonObjectType } from './types/common';

let ReactRoot: ReactDOM.Root | null = null;

function renderApp(props: CommonObjectType = {}) {
	const Router = () => useRoutes(routes);

	ReactRoot = ReactDOM.createRoot(document.getElementById('subapp')!);

	ReactRoot.render(
		<React.StrictMode>
			<BrowserRouter basename={props.base || '/'}>
				<Router />
			</BrowserRouter>
		</React.StrictMode>
	);
}

console.log('__POWERED_BY_QIANKUN__', qiankunWindow?.__POWERED_BY_QIANKUN__);
// 独立运行时
if (!qiankunWindow?.__POWERED_BY_QIANKUN__) {
	console.log('独立运行模式，执行 renderApp');
	renderApp();
} else {
	console.log('qiankun 微前端模式，等待 mount');
}

export const bootstrap = async () => {
	console.log('my-react-app bootstraped');
};

export const mount = async (props: CommonObjectType) => {
	console.log('my-react-app mount', props);
	renderApp(props);
};

export const unmount = async (props: CommonObjectType) => {
	console.log('my-react-app unmount', props);
	ReactRoot?.unmount();
	ReactRoot = null;
};

export const update = async (props: CommonObjectType) => {
	console.log('my-react-app update', props);
};

renderWithQiankun({
	bootstrap,
	mount,
	unmount,
	update
});
