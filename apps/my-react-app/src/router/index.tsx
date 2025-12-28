import SkeletonCommon from '@/components/SkeletonCommon';
import { USER_AUTHORITITY } from '@/types/user-auth';
import { lazy, memo, Suspense } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

// 未登录守卫组件
const UnauthenticatedGuard = memo((props: Partial<AuthProps>) => {
	return LazyLoadComponent('../pages/Unauthenticated', props);
});

interface AuthProps {
	permission: USER_AUTHORITITY;
	children: JSX.Element;
}

// 带权限检查的路由守卫
const UnauthorizedGuard = memo((props: AuthProps) => {
	return LazyLoadComponent('../pages/Unauthorized', props);
});

function LazyLoadComponent(
	path: string,
	props = {},
	auth: USER_AUTHORITITY = USER_AUTHORITITY.GUEST
) {
	const Component = lazy(() => import(path));

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
		element: LazyLoadComponent('../App'),
		children: [
			{ index: true, element: <Navigate to="/tsparticles" replace /> },
			{
				path: '/tsparticles',
				element: LazyLoadComponent('../pages/Tsparticles')
			},
			{
				path: '/home',
				element: LazyLoadComponent('../pages/Home'),
				children: [
					{
						index: true,
						element: (
							<UnauthenticatedGuard>
								<Navigate to="main" replace />
							</UnauthenticatedGuard>
						)
					},
					{
						path: 'main',
						element: LazyLoadComponent(
							'../pages/Main/Main',
							{},
							USER_AUTHORITITY.USER
						)
					},
					{
						path: 'api-code',
						element: LazyLoadComponent(
							'../pages/ApiCode',
							{ needTip: false },
							USER_AUTHORITITY.USER
						)
					},
					{
						path: 'user-management',
						element: LazyLoadComponent(
							'../pages/UserManagement/UserManagement',
							{},
							USER_AUTHORITITY.USER
						)
					},
					{ path: 'about', element: LazyLoadComponent('../pages/About') },
					{ path: '*', element: LazyLoadComponent('../pages/NotFound') }
				]
			},
			{
				path: '/unauthenticated',
				element: LazyLoadComponent('../pages/Unauthenticated')
			},
			{
				path: '/unauthorized',
				element: LazyLoadComponent('../pages/Unauthorized')
			},
			{ path: '*', element: LazyLoadComponent('../pages/NotFound') }
		]
	}
];
