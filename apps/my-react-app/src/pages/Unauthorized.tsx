import { useUserStore } from '@/stores';
import { USER_AUTHORITITY } from '@/types/user-auth';
import { Button, message, Result } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UnauthorizedPageProps {
	needTip?: boolean;
	permission: USER_AUTHORITITY;
	children: JSX.Element;
}

export default function UnauthorizedPage(
	props: UnauthorizedPageProps
): JSX.Element {
	const navigate = useNavigate();
	const userStore = useUserStore((state) => state.user);

	useEffect(() => {
		if (props.needTip) {
			message.info('您没有访问该页面的权限');
		}
	}, [props.needTip, props.permission]);

	return userStore?.authorities.includes(props.permission) ? (
		props.children
	) : (
		<Result
			status="403"
			title="无权限访问"
			subTitle="您没有权限访问此页面"
			extra={
				<Button type="primary" onClick={() => navigate(-1)}>
					返回
				</Button>
			}
		/>
	);
}
