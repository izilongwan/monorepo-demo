import { fetchGithubUser } from '@/apis/user-auth';
import SkeletonCommon from '@/components/skeleton-common';
import { useUserStore } from '@/stores';
import { USER_AUTHORITITY } from '@/types/user-auth';
import { Button, message, Result } from 'antd';
import { useEffect } from 'react';

interface UnauthenticatedPageProps {
	needTip?: boolean;
	children: React.ReactNode;
}

export default function UnauthenticatedPage(props: UnauthenticatedPageProps) {
	const userStore = useUserStore((state) => state.user);
	const loginLoading = useUserStore((state) => state.loginLoading);

	useEffect(() => {
		if (props.needTip) {
			message.info('请先登录以访问该页面');
		}
	}, [props.needTip]);

	if (loginLoading) {
		return <SkeletonCommon />;
	}

	return userStore?.authorities.includes(USER_AUTHORITITY.USER) ? (
		props.children
	) : (
		<Result
			status="403"
			title="未登录"
			subTitle="您需要先登录才能访问此页面"
			extra={
				<Button type="primary" onClick={fetchGithubUser}>
					去登录
				</Button>
			}
		/>
	);
}
