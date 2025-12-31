import { GlobalQiankunProps } from '@/stores/qiankun';
import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

const viewModules = import.meta.glob('../pages/**/*.tsx');

export const LazyLoadedView = (viewName: string, props = {}) => {
	const modulePath = `../pages/${viewName}.tsx`;
	const loader = viewModules[modulePath];

	if (!loader) {
		throw new Error(`Page not found: ${modulePath}`);
	}

	const Comp = lazy(() =>
		loader().then((mod: any) => ({ default: mod.default || mod }))
	);

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

const env = import.meta.env;
const BASE_URL = env.VITE_BASE_URL || '';

export const menuRoutes = routesChildren
	.filter((route) => route.path)
	.map((route) => ({ path: route.path?.replace(/\/\*$/, '') }));

export const buildSubAppRoutes = (
	props: GlobalQiankunProps = { mainBase: BASE_URL } as GlobalQiankunProps
) => [
	{
		name: 'my-vue-app',
		entry: env.VITE_SUBAPP_VUE_ENTRY,
		container: '#subapp-container',
		activeRule: `${props.mainBase}/vue`,
		props: { some: 'data', base: `${props.mainBase}/vue`, ...props }
	},
	{
		name: 'my-react-app',
		entry: env.VITE_SUBAPP_REACT_ENTRY,
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
