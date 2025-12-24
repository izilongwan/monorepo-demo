import { Skeleton } from 'antd';

export default () => (
	<div style={{ padding: '20px' }}>
		<Skeleton active />
		<Skeleton active />
		<Skeleton.Button active style={{ width: 200, marginTop: 16 }} />
	</div>
);
