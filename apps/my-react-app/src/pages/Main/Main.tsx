import { getHomeCommonAmount } from '@/apis/home';
import style from '@/styles/modules/Main.module.css';
import { CommonObjectType } from '@/types/common';
import { USER_MANAGEMENT_TYPE } from '@/types/user-management';
import { USER_MANAGEMENT_TAB_TYPE_KEY } from '@/utils/const';
import {
	ArrowUpOutlined,
	CodeOutlined,
	FileTextOutlined,
	TeamOutlined,
	UserOutlined
} from '@ant-design/icons';
import { Card, Col, Row, Statistic, Tag, Timeline } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Trends from './Trend';

export default function Main() {
	const [stats, setStats] = useState<typeof statsData>([]);

	// 使用 useMemo 缓存静态数据，避免每次渲染重新创建
	const statsData = useMemo(
		() => [
			{
				type: 'apiCode',
				title: 'API 接口',
				value: 0,
				icon: <CodeOutlined />,
				color: '#1890ff',
				url: '/home/api-code'
			},
			{
				type: 'user',
				title: '用户数',
				value: 0,
				icon: <UserOutlined />,
				color: '#52c41a',
				suffix: <ArrowUpOutlined className="tw-text-green-500" />,
				url: '/home/user-management'
			},
			{
				type: 'role',
				title: '角色数',
				value: 0,
				icon: <FileTextOutlined />,
				color: '#faad14',
				url: `/home/user-management?${USER_MANAGEMENT_TAB_TYPE_KEY}=${USER_MANAGEMENT_TYPE.ROLE_PERMISSION}`
			},
			{
				type: 'permission',
				title: '权限数',
				value: 0,
				icon: <TeamOutlined />,
				color: '#f5222d',
				url: `/home/user-management?${USER_MANAGEMENT_TAB_TYPE_KEY}=${USER_MANAGEMENT_TYPE.PERMISSION}`
			}
		],
		[]
	);

	// 初始化状态时使用 useMemo 的 statsData
	useEffect(() => {
		setStats(statsData);
	}, [statsData]);

	const getHomeCommonAmountData = useCallback(async () => {
		const rs = await getHomeCommonAmount().promise;
		const map = rs.reduce((acc, item) => {
			acc[item.type] = item.amount;
			return acc;
		}, {} as CommonObjectType);
		setStats((prevStats) =>
			prevStats.map((stat) => ({
				...stat,
				value: map[stat.type] || 0
			}))
		);
	}, []);

	useEffect(() => {
		getHomeCommonAmountData();
	}, [getHomeCommonAmountData]);

	// 使用 useMemo 缓存 features 数据
	const features = useMemo(
		() => [
			{
				title: 'API Code 管理',
				description: '完整的 API 接口管理系统，支持增删改查操作',
				tags: ['管理', '数据库', 'CRUD']
			},
			{
				title: '用户信息管理',
				description: '用户身份信息管理，支持多角色权限控制',
				tags: ['用户', '权限', '角色']
			},
			{
				title: '内容发布系统',
				description: '富文本编辑器，支持发布、编辑、删除内容',
				tags: ['发布', '编辑', '富文本']
			},
			{
				title: '数据统计分析',
				description: '实时数据统计，生成专业的分析报表',
				tags: ['统计', '分析', '报表']
			}
		],
		[]
	);

	// 使用 useMemo 缓存 timeline 数据
	const timeline = useMemo(
		() => [
			{ content: '项目初始化，搭建基础框架' },
			{ content: '完成 API 接口设计和实现' },
			{ content: '开发前端界面和交互功能' },
			{ content: '进行系统测试和性能优化' },
			{ content: '项目上线发布' }
		],
		[]
	);

	const navigate = useNavigate();
	function handleNavigate(url?: string): void {
		if (url) {
			navigate(url);
		}
	}

	return (
		<div className={style.mainPage}>
			{/* 欢迎区域 */}
			<Card className={style.welcomeCard}>
				<h1 className={style.title}>欢迎来到 App Dashboard</h1>
				<p className={style.subtitle}>这是一个现代化的前端应用管理系统</p>
			</Card>

			{/* 统计数据 */}
			<Row gutter={[16, 16]} className="tw-mt-6">
				{stats.map((stat, index) => (
					<Col xs={24} sm={12} lg={6} key={index}>
						<Card
							className={style.statCard}
							hoverable
							onClick={() => handleNavigate(stat.url)}>
							<div className="tw-flex tw-items-center tw-justify-between">
								<div>
									<Statistic
										title={stat.title}
										value={stat.value}
										suffix={stat.suffix}
										valueStyle={{ color: stat.color }}
									/>
								</div>
								<div
									className="tw-text-[32px] tw-opacity-20"
									style={{ color: stat.color }}>
									{stat.icon}
								</div>
							</div>
						</Card>
					</Col>
				))}
			</Row>

			<Trends statsData={statsData} />

			{/* 功能特性 */}
			<div className="tw-mt-10">
				<h2 className={style.sectionTitle}>主要功能</h2>
				<Row gutter={[16, 16]}>
					{features.map((feature, index) => (
						<Col xs={24} sm={12} lg={6} key={index}>
							<Card className={style.featureCard} hoverable>
								<h3>{feature.title}</h3>
								<p className={style.description}>{feature.description}</p>
								<div>
									{feature.tags.map((tag) => (
										<Tag key={tag} color="blue" className="tw-mr-1 tw-mb-2">
											{tag}
										</Tag>
									))}
								</div>
							</Card>
						</Col>
					))}
				</Row>
			</div>

			{/* 项目进度 */}
			<div className="tw-mt-10">
				<h2 className={style.sectionTitle}>项目进度</h2>
				<Card>
					<Timeline
						items={timeline.map((item) => ({
							children: item.content
						}))}
					/>
				</Card>
			</div>
		</div>
	);
}
