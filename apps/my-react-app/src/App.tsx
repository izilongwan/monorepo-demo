import { useEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { tokenUtil } from './utils/tokenUtil';

export default () => {
	const [_, setSearchParams] = useSearchParams();

	useEffect(() => {
		if (tokenUtil.parseTokenFromUrl()) {
			setSearchParams({});
			window.opener?.location.reload();
			window.close();
			return;
		}
	}, []);

	return <Outlet />;
};
