import { useEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { tokenUtil } from './utils/tokenUtil';

export default () => {
	const [params, setSearchParams] = useSearchParams();

	useEffect(() => {
		if (tokenUtil.parseTokenFromUrl()) {
			params.delete('access_token');
			params.delete('refresh_token');
			setSearchParams({ ...params });
		}
	}, []);

	return <Outlet />;
};
