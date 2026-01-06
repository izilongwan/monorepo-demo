import { getMainTrend } from '@/apis/main';
import SkeletonCommon from '@/components/SkeletonCommon';
import { CommonObjectType } from '@/types/common';
import { MainTrendItem } from '@/types/main';
import { jsonParseSafe } from '@/utils/tool';
import { Line, LineConfig } from '@ant-design/charts';
import { useFetchData, useObserveDom } from '@monorepo-demo/react-util';
import { Empty } from 'antd';
import { Suspense, useCallback, useMemo } from 'react';

interface TrendsProps {
	statsData: CommonObjectType[];
}

export default function Trends(props: TrendsProps) {
	const dataMap = useMemo(
		() =>
			props.statsData.reduce((prev, curr) => {
				Object.assign(prev, { [curr.type]: curr });
				Object.assign(prev, { [curr.title]: curr });
				return prev;
			}, {}),
		[props.statsData]
	);

	const fetchTrendData = useCallback(async () => {
		const rs = await getMainTrend().promise;
		const list = rs
			.flatMap((item) =>
				jsonParseSafe(item.info, [] as MainTrendItem[])?.map((o) => ({
					...o,
					value: o.amount,
					type: dataMap[item.type]?.title
				}))
			)
			.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

		return list;
	}, [dataMap]);

	const { data: trendData = [], isLoading: loading } =
		useFetchData(fetchTrendData);

	const config: LineConfig = useMemo(
		() => ({
			data: trendData,
			xField: 'date',
			yField: 'value',
			colorField: 'type',
			autoFit: true,
			legend: { size: true },
			style: {
				lineWidth: 2
			},
			shapeField: 'smooth',
			scale: {
				color: {
					domain: props.statsData?.map((o) => o.title) ?? [],
					range: props.statsData?.map((o) => o.color) ?? []
				}
			}
		}),
		[trendData, props.statsData]
	);

	const { containerRef, key } = useObserveDom();

	return (
		<div ref={containerRef} className="tw-min-h-[300px]">
			{loading && <SkeletonCommon />}

			{trendData?.length ? (
				<Suspense fallback={<SkeletonCommon />}>
					<Line {...config} height={300} key={key} />
				</Suspense>
			) : (
				<Empty className="tw-my-3" />
			)}
		</div>
	);
}
