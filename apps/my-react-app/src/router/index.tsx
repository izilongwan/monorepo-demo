import SkeletonCommon from '@/components/SkeletonCommon';
import { USER_AUTHORITITY } from '@/types/user-auth';
import { lazy, memo, Suspense } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

// 未登录守卫组件
const UnauthenticatedGuard = memo((props: Partial<AuthProps>) => {
	return LazyLoadComponent('Unauthenticated', props);
});

interface AuthProps {
	permission: USER_AUTHORITITY;
	children: JSX.Element;
}

// 带权限检查的路由守卫
const UnauthorizedGuard = memo((props: AuthProps) => {
	return LazyLoadComponent('Unauthorized', props);
});

function LazyLoadComponent(
	fileName: string,
	props = {},
	auth: USER_AUTHORITITY = USER_AUTHORITITY.GUEST
) {
	// 添加 .tsx 扩展名以确保正确的文件导入
	const pathName = `../pages/${fileName}`;

	const Component = lazy(() => import(pathName));

	const AuthComponent = () => {
		if (auth === USER_AUTHORITITY.GUEST) {
			return <Component {...props} />;
		}

		return (
			<UnauthenticatedGuard>
				<UnauthorizedGuard permission={auth} {...props}>
					<Component {...props} />
				</UnauthorizedGuard>
			</UnauthenticatedGuard>
		);
	};

	return (
		<Suspense fallback={<SkeletonCommon />}>
			<AuthComponent />
		</Suspense>
	);
}

export const routes: RouteObject[] = [
	{
		path: '/',
		element: LazyLoadComponent('App'),
		children: [
			{ index: true, element: <Navigate to="/tsparticles" replace /> },
			{
				path: '/tsparticles',
				element: LazyLoadComponent('Tsparticles')
			},
			{
				path: '/home',
				element: LazyLoadComponent('Home'),
				children: [
					{
						index: true,
						element: <Navigate to="main" replace />
					},
					{
						path: 'main',
						element: LazyLoadComponent('Main/Main', {}, USER_AUTHORITITY.USER)
					},
					{
						path: 'api-code',
						element: LazyLoadComponent(
							'ApiCode',
							{ needTip: false },
							USER_AUTHORITITY.USER
						)
					},
					{
						path: 'user-management',
						element: LazyLoadComponent(
							'UserManagement/UserManagement',
							{},
							USER_AUTHORITITY.USER
						)
					},
					{ path: 'about', element: LazyLoadComponent('About') },
					{ path: 'channel', element: LazyLoadComponent('Channel') },
					{ path: '*', element: LazyLoadComponent('NotFound') }
				]
			},
			{
				path: '/unauthenticated',
				element: LazyLoadComponent('Unauthenticated')
			},
			{
				path: '/unauthorized',
				element: LazyLoadComponent('Unauthorized')
			},
			{ path: '*', element: LazyLoadComponent('NotFound') }
		]
	}
];
