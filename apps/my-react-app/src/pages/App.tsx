import GlobalSpin from '@/components/GlobalSpin';
import { useEffect } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { tokenUtil } from '../utils/tokenUtil';
import { useUserStore } from '@/stores';

export default () => {
	const [params, setSearchParams] = useSearchParams();

	const hasAccessToken = tokenUtil.getAccessToken();
	const navigate = useNavigate();
	const fetchUserProfile = useUserStore((state) => state.fetchUserProfile);

	useEffect(() => {
		if (!hasAccessToken) {
			return;
		}

		fetchUserProfile().then();
		if (location.pathname.endsWith('/tsparticles')) {
			navigate('/home', { replace: true });
		}
	}, [hasAccessToken]);

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
