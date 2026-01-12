import { getMainApiTrend, getMainTrend } from '@/apis/main';
import { MainTrend, MainTrendItem } from '@/types/main';
import { jsonParseSafe } from '@/utils/tool';
import { Line, LineConfig } from '@ant-design/charts';
import { useFetchData, useObserveDom } from '@monorepo-demo/react-util';
import { Empty, Skeleton } from 'antd';
import { useCallback, useMemo, useState } from 'react';

interface TrendsProps {}

export default function Trends(props: TrendsProps) {
	const [trendData, setTrendData] = useState<MainTrend[]>([]);

	const fetchTrendData = useCallback(async () => {
		const rs = await getMainTrend().promise;
		setTrendData(rs || []);
		const list = rs
			.flatMap((item) =>
				jsonParseSafe(item.info, [] as MainTrendItem[])?.map((o) => ({
					...o,
					type: item.title
				}))
			)
			.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

		return list;
	}, []);

	const { data: trends = [], isLoading: loading } =
		useFetchData(fetchTrendData);

	const config: LineConfig = useMemo(
		() => ({
			data: trends,
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
				color: null
			},
			scale: {
				y: {
					type: 'log' // 对数刻度，适合数据差值大的情况
				},
				color: {
					domain: trendData.map((trend) => trend.title),
					range: trendData.map((trend) => trend.color)
				}
			}
		}),
		[trends, trendData]
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
			scale: {
				y: {
					type: 'log' // 对数刻度
				}
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
				className="tw-mt-2"
				paragraph={{ rows: 4 }}
				loading={loading && !trends?.length}>
				{trends?.length ? (
					<Line {...config} height={300} key={key} />
				) : (
					<Empty className="tw-min-h-[300px] tw-flex tw-flex-col tw-justify-center" />
				)}
			</Skeleton>

			<Skeleton
				paragraph={{ rows: 4 }}
				loading={apiLoading && !apiTrendData?.length}>
				{apiTrendData?.length ? (
					<Line {...apiConfig} height={300} key={key} />
				) : (
					<Empty className="tw-min-h-[300px] tw-flex tw-flex-col tw-justify-center" />
				)}
			</Skeleton>
		</div>
	);
}
