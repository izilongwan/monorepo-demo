import { getMainApiTrend, getMainTrend } from '@/apis/main';
import { CommonObjectType } from '@/types/common';
import { MainTrendItem } from '@/types/main';
import { jsonParseSafe } from '@/utils/tool';
import { Line, LineConfig } from '@ant-design/charts';
import { useFetchData, useObserveDom } from '@monorepo-demo/react-util';
import { Empty, Skeleton } from 'antd';
import { useCallback, useMemo } from 'react';

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
			yField: 'amount',
			colorField: 'type',
			autoFit: true,
			slider: {
				x: {}
			},
			style: {
				lineWidth: 2
			},
			shapeField: 'smooth',
			point: {
				size: 5,
				shape: 'circle',
				color: null // 自动使用 colorField 的颜色
			},
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

	const { data: apiTrendData = [], isLoading: apiLoading } =
		useFetchData(getMainApiTrend);
	const apiConfig: LineConfig = useMemo(
		() => ({
			data: apiTrendData,
			xField: 'date',
			yField: 'amount',
			sizeField: 'amount',
			colorField: 'uri',
			autoFit: true,
			slider: {
				x: {}
			},
			style: {
				lineWidth: 2
			},
			point: {
				size: 5,
				shape: 'circle',
				color: null // 自动使用 colorField 的颜色
			},
			shapeField: 'smooth'
		}),
		[apiTrendData]
	);

	return (
		<div ref={containerRef} className="tw-min-h-[600px] tw-mt-4">
			<Skeleton
				paragraph={{ rows: 4 }}
				loading={apiLoading && !apiTrendData?.length}>
				{apiTrendData?.length ? (
					<Line {...apiConfig} height={300} key={key} />
				) : (
					<Empty className="tw-my-3" />
				)}
			</Skeleton>

			<Skeleton
				className="tw-mt-2"
				paragraph={{ rows: 4 }}
				loading={loading && !trendData?.length}>
				{trendData?.length ? (
					<Line {...config} height={300} key={key} />
				) : (
					<Empty className="tw-my-3" />
				)}
			</Skeleton>
		</div>
	);
}
