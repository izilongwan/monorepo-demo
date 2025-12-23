import { getHomeCommonAmount } from '@/apis/home';
import style from '@/styles/modules/Main.module.css';
import { CommonObjectType } from '@/types/common';
import {
	ArrowUpOutlined,
	CodeOutlined,
	FileTextOutlined,
	TeamOutlined,
	UserOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Statistic, Tag, Timeline } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Main() {
	const [stats, setStats] = useState<typeof statsData>([]);

	// 使用 useMemo 缓存静态数据，避免每次渲染重新创建
	const statsData = useMemo(
		() => [
			{
				type: 'api_code',
				title: 'API 接口',
				value: 0,
				icon: <CodeOutlined />,
				color: '#1890ff'
			},
			{
				type: 'user',
				title: '用户数',
				value: 0,
				icon: <UserOutlined />,
				color: '#52c41a',
				suffix: <ArrowUpOutlined style={{ color: '#52c41a' }} />
			},
			{
				type: 'role',
				title: '角色数',
				value: 0,
				icon: <FileTextOutlined />,
				color: '#faad14'
			},
			{
				type: 'permission',
				title: '权限数',
				value: 0,
				icon: <TeamOutlined />,
				color: '#f5222d'
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

	// 快速导航数据
	const quickLinks = useMemo(
		() => [
			{
				icon: (
					<FileTextOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
				),
				title: 'API Code',
				description: '管理所有 API 接口',
				url: '/home/api-code'
			},
			{
				icon: <UserOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
				title: '用户管理',
				description: '用户信息维护',
				url: '/home/user-management'
			},
			{
				icon: <CodeOutlined style={{ fontSize: '32px', color: '#faad14' }} />,
				title: '内容管理',
				description: '发布和编辑内容'
			},
			{
				icon: <TeamOutlined style={{ fontSize: '32px', color: '#f5222d' }} />,
				title: '团队协作',
				description: '团队成员管理'
			}
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
				<Space>
					<Button type="primary" size="large">
						开始使用
					</Button>
					<Button size="large">了解更多</Button>
				</Space>
			</Card>

			{/* 统计数据 */}
			<Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
				{stats.map((stat, index) => (
					<Col xs={24} sm={12} lg={6} key={index}>
						<Card className={style.statCard}>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between'
								}}>
								<div>
									<Statistic
										title={stat.title}
										value={stat.value}
										suffix={stat.suffix}
										valueStyle={{ color: stat.color }}
									/>
								</div>
								<div
									style={{ fontSize: '32px', color: stat.color, opacity: 0.2 }}>
									{stat.icon}
								</div>
							</div>
						</Card>
					</Col>
				))}
			</Row>

			{/* 功能特性 */}
			<div style={{ marginTop: '40px' }}>
				<h2 className={style.sectionTitle}>主要功能</h2>
				<Row gutter={[16, 16]}>
					{features.map((feature, index) => (
						<Col xs={24} sm={12} lg={6} key={index}>
							<Card className={style.featureCard} hoverable>
								<h3>{feature.title}</h3>
								<p className={style.description}>{feature.description}</p>
								<div>
									{feature.tags.map((tag) => (
										<Tag
											key={tag}
											color="blue"
											style={{ marginRight: '4px', marginBottom: '8px' }}>
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
			<div style={{ marginTop: '40px' }}>
				<h2 className={style.sectionTitle}>项目进度</h2>
				<Card>
					<Timeline
						items={timeline.map((item) => ({
							children: item.content
						}))}
					/>
				</Card>
			</div>

			{/* 快速链接 */}
			<div style={{ marginTop: '40px', marginBottom: '40px' }}>
				<h2 className={style.sectionTitle}>快速导航</h2>
				<Row gutter={[16, 16]}>
					{quickLinks.map((link) => (
						<Col
							xs={24}
							sm={12}
							lg={6}
							key={link.title}
							onClick={() => handleNavigate(link.url)}>
							<Card className={style.quickLink} hoverable>
								{link.icon}
								<h3>{link.title}</h3>
								<p>{link.description}</p>
							</Card>
						</Col>
					))}
				</Row>
			</div>
		</div>
	);
}
