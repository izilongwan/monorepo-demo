import GlobalSpin from '@/components/GlobalSpin';
import { useEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { tokenUtil } from '../utils/tokenUtil';

export default () => {
	const [params, setSearchParams] = useSearchParams();

	useEffect(() => {
		if (tokenUtil.parseTokenFromUrl()) {
			params.delete(tokenUtil.access_token);
			params.delete(tokenUtil.refresh_token);
			setSearchParams(Object.fromEntries(params.entries()));
		}
	}, []);

	return (
		<>
			<GlobalSpin />
			<Outlet />
		</>
	);
};
