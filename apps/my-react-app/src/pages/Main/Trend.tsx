import { getMainTrend } from '@/apis/main';
import SkeletonCommon from '@/components/skeleton-common';
import { CommonObjectType } from '@/types/common';
import { MainTrendItem } from '@/types/main';
import { jsonParseSafe } from '@/utils/tool';
import { Line, LineConfig } from '@ant-design/charts';
import { Empty } from 'antd';
import { useEffect, useMemo, useState } from 'react';

interface TrendsProps {
	statsData: CommonObjectType[];
}

export default function Trends(props: TrendsProps) {
	useEffect(() => {
		fetchTrendData();
	}, []);

	const [trendData, setTrendData] = useState<MainTrendItem[]>();
	const [loading, setLoading] = useState(false);

	async function fetchTrendData() {
		setLoading(true);
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

		setTrendData(list);
		setLoading(false);
	}

	const dataMap = useMemo(
		() =>
			props.statsData.reduce((prev, curr) => {
				Object.assign(prev, { [curr.type]: curr });
				Object.assign(prev, { [curr.title]: curr });
				return prev;
			}, {}),
		[props.statsData]
	);

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

	if (loading) {
		return <SkeletonCommon />;
	}

	return trendData?.length ? (
		<Line {...config} height={300} />
	) : (
		<Empty style={{ margin: '10px 0' }} />
	);
}
