import {
	offGlobalStateChange,
	onGlobalStateChange,
	setGlobalState
} from '@/stores/qiankun';
import { registerMicroApps } from 'qiankun';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { buildSubAppRoutes, routes } from './router';

const router = createBrowserRouter(routes, {
	basename: import.meta.env.VITE_BASE_URL || '/'
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);

registerMicroApps(
	buildSubAppRoutes({
		mainBase: import.meta.env.VITE_BASE_URL || '',
		setGlobalState,
		onGlobalStateChange,
		offGlobalStateChange
	})
);
