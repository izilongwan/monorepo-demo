import '@/styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter, useRoutes } from 'react-router-dom';

import { routes } from './router';

const Router = () => useRoutes(routes);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Router />
		</BrowserRouter>
	</React.StrictMode>
);
