import { menuRoutes } from '@/router';
import { NavLink } from 'react-router-dom'; // ✅ 改用 NavLink

export default () => {
	return (
		<div className="tw-border-r tw-border-gray-300 tw-p-4">
			{menuRoutes?.map((route, index) => (
				<div key={index} className="tw-my-4">
					<NavLink
						to={route.path!}
						className={({ isActive }) =>
							`tw-block tw-px-4 tw-py-2 tw-rounded tw-transition-colors ${
								isActive
									? 'tw-bg-blue-500 tw-text-white' // ✅ 激活样式
									: 'tw-text-blue-500 hover:tw-bg-blue-50' // ✅ 默认及悬停样式
							}`
						}>
						Go to {route.path}
					</NavLink>
				</div>
			))}
		</div>
	);
};
