import { Skeleton } from 'antd';

export default () => (
	<div className="tw-p-5">
		<Skeleton active />
		<Skeleton active />
		<Skeleton.Button size="large" className="tw-mt-2" active />
	</div>
);
