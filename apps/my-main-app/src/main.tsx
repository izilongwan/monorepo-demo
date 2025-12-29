import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { routes, subAppRoutes } from './router';
import { registerMicroApps } from 'qiankun';

const router = createBrowserRouter(routes, { basename: '/' });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);

registerMicroApps(subAppRoutes);
