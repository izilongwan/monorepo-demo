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
	{ index: true, element: LazyLoadedView('Home/Home') },
	{ path: 'home', element: LazyLoadedView('Home/Home') },
	{ path: 'test', element: LazyLoadedView('Test/Test') },
	{ path: 'channel', element: LazyLoadedView('Channel/Channel') },
	// Micro-frontend sub-app routes
	{ path: 'vue/*', element: null },
	{ path: 'react/*', element: null }
];

export const menuRoutes = routesChildren
	.filter((route) => route.path)
	.map((route) => ({ path: route.path?.replace(/\/\*$/, '') }));

export const buildSubAppRoutes = (props = {}) => [
	{
		name: 'my-vue-app',
		entry: '//v.nima.cc.cd',
		container: '#subapp-container',
		activeRule: '/vue',
		props: { some: 'data', base: '/vue', ...props }
	},
	{
		name: 'my-react-app',
		entry: '//website.nima.cc.cd',
		container: '#subapp-container',
		activeRule: '/react',
		props: { some: 'data2', base: '/react', ...props }
	}
];

export const subAppRoutes = buildSubAppRoutes();

export const subAppPaths = subAppRoutes.map((app) => app.activeRule.slice(1));

export const routes: RouteObject[] = [
	{
		path: '/',
		element: LazyLoadedView('App', { needWrapper: true }),
		children: routesChildren
	}
];
