import { Skeleton } from 'antd';

interface SkeletonCommonProps {
	paragraphRows?: number;
}

export default ({ paragraphRows = 12 }: SkeletonCommonProps) => (
	<div className="tw-p-5">
		<Skeleton paragraph={{ rows: paragraphRows }} active />
		<Skeleton.Button size="large" className="tw-mt-2" active />
	</div>
);
