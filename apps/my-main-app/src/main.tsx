import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { routes, buildSubAppRoutes } from './router';
import { registerMicroApps } from 'qiankun';
import {
	setGlobalState,
	onGlobalStateChange,
	offGlobalStateChange
} from '@/stores/qiankun';

const router = createBrowserRouter(routes, { basename: '/' });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);

registerMicroApps(
	buildSubAppRoutes({
		setGlobalState,
		onGlobalStateChange,
		offGlobalStateChange
	})
);
