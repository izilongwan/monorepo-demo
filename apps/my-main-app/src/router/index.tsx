import { QiankunProps } from '@/stores/qiankun';
import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

export const LazyLoadedView = (viewName: string, props = {}) => {
	const pathName = `../pages/${viewName}`;
	const Comp = lazy(() => import(pathName));

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Comp {...props} />
		</Suspense>
	);
};

export const routesChildren: RouteObject[] = [
	{ index: true, element: LazyLoadedView('Channel/Channel') },
	{ path: 'channel', element: LazyLoadedView('Channel/Channel') },
	// Micro-frontend sub-app routes
	{ path: 'vue/*', element: null },
	{ path: 'react/*', element: null },

	{ path: 'home', element: LazyLoadedView('Home/Home') },
	{ path: 'test', element: LazyLoadedView('Test/Test') }
];

const BASE_URL = import.meta.env.VITE_BASE_URL || '';

export const menuRoutes = routesChildren
	.filter((route) => route.path)
	.map((route) => ({ path: route.path?.replace(/\/\*$/, '') }));

export const buildSubAppRoutes = (
	props: QiankunProps = { mainBase: BASE_URL } as QiankunProps
) => [
	{
		name: 'my-vue-app',
		entry: '//v.nima.cc.cd',
		container: '#subapp-container',
		activeRule: `${props.mainBase}/my-vue-app`,
		props: { some: 'data', base: `${props.mainBase}/my-vue-app`, ...props }
	},
	{
		name: 'my-react-app',
		entry: '//website.nima.cc.cd',
		container: '#subapp-container',
		activeRule: `${props.mainBase}/react`,
		props: { some: 'data2', base: `${props.mainBase}/react`, ...props }
	}
];

export const subAppRoutes = buildSubAppRoutes();

export const subAppPaths = subAppRoutes.map((app) =>
	app.activeRule.replace(BASE_URL, '')
);

export const routes: RouteObject[] = [
	{
		path: '/',
		element: LazyLoadedView('App/App', { needWrapper: true }),
		children: routesChildren
	}
];
