import { createRouter, createWebHistory } from 'vue-router';

export const routes = [
	{
		name: 'App',
		path: 'app',
		component: () => import('@/views/App/App.vue')
	},
	{
		name: 'Hello',
		path: 'hello',
		component: () => import('@/components/HelloWorld.vue')
	},
	{
		name: 'Auth',
		path: 'auth',
		component: () => import('@/components/Auth.vue')
	},
	{
		name: 'Channel',
		path: 'channel',
		component: () => import('@/views/Channel/Channel.vue')
	}
];

export const createAppRouter = (base: string = '/') =>
	createRouter({
		history: createWebHistory(base),
		routes: [
			{
				name: 'Page',
				path: '/',
				component: () => import('@/views/ViewRouter.vue'),
				props: { needMenu: true },
				redirect: '/app',
				children: routes
			}
		]
	});
