import { fetchGithubUser } from '@/apis/user-auth';
import AuthTagPopover from '@/components/AuthTagPopover';
import { useUserStore } from '@/stores';
import style from '@/styles/modules/Home.module.css';
import { StorageKeys } from '@/utils/storage';
import { tokenUtil } from '@/utils/tokenUtil';
import {
	BgColorsOutlined,
	CodeOutlined,
	HomeOutlined,
	InfoCircleOutlined,
	LogoutOutlined,
	UserOutlined
} from '@ant-design/icons';
import { useLocalStorage } from '@monorepo-demo/react-util';
import { Avatar, Button, Dropdown, Layout, Menu, message, Space } from 'antd';
import { useMemo } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

function Home() {
	const menuItems = useMemo(
		() => [
			{
				key: 'main',
				icon: <HomeOutlined />,
				label: (
					<Link to="main" className={style.menuLink}>
						主页
					</Link>
				)
			},
			{
				key: 'api-code',
				icon: <CodeOutlined />,
				label: (
					<Link to="api-code" className={style.menuLink}>
						API 列表
					</Link>
				)
			},
			{
				key: 'user-management',
				icon: <UserOutlined />,
				label: (
					<Link to="user-management" className={style.menuLink}>
						用户管理
					</Link>
				)
			},
			{
				key: 'notfound',
				icon: <BgColorsOutlined />,
				label: (
					<Link to="xxx?show-return-btn=0" className={style.menuLink}>
						404 测试
					</Link>
				)
			},
			{
				key: 'about',
				icon: <InfoCircleOutlined />,
				label: (
					<Link to="about" className={style.menuLink}>
						关于
					</Link>
				)
			},
			{
				key: 'channel',
				icon: <BgColorsOutlined />,
				label: (
					<Link to="channel" className={style.menuLink}>
						通信
					</Link>
				)
			}
		],
		[]
	);

	const location = useLocation();

	const user = useUserStore((state) => state.user);
	const setUser = useUserStore((state) => state.setUser);
	const loginLoading = useUserStore((state) => state.loginLoading);

	const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage(
		StorageKeys.SIDEBAR_COLLAPSED,
		false
	);

	const handleLogin = async () => {
		await fetchGithubUser({
			globalLoading: true,
			reties: 1
		}).promise;
	};

	// 登出
	const handleLogout = () => {
		setUser(null);
		tokenUtil.clearTokens();
		message.success('已登出');
	};

	// 根据路径获取当前菜单 key
	const getCurrentMenuKey = useMemo(() => {
		const path = location.pathname;
		const item = menuItems.find((menu) => path.endsWith(`/${menu.key}`));
		if (item) {
			return item.key;
		}
		if (path.endsWith('/home')) {
			return 'main';
		}
		return 'notfound';
	}, [location.pathname]);

	const authorities = useMemo(() => {
		return (user?.authorities || []).map((auth, index) => ({
			id: index,
			name: auth,
			description: `权限标识: ${auth}`,
			color: 'blue'
		}));
	}, [user?.authorities]);

	return (
		<Layout className={style.homeLayout}>
			<Header className={style.homeHeader}>
				<div className={style.logo}>
					<Link to="/" className={style.logoLink}>
						📱 Dashboard
					</Link>
				</div>
				<div style={{ flex: 1 }} />
				{user ? (
					<Dropdown
						menu={{
							items: [
								{
									key: 'profile',
									icon: <UserOutlined />,
									label: (
										<div className={style.userProfile}>
											<div className={style.userProfileUsername}>
												{user.loginUsername}
											</div>
											<div className={style.userProfileItem}>
												<span className={style.userProfileLabel}>ID:</span>
												<span className={style.userProfileValue}>
													{user.id}
												</span>
											</div>
											<div className={style.userProfileItem}>
												<span className={style.userProfileLabel}>
													注册时间:
												</span>
												<span className={style.userProfileValue}>
													{user.createTime}
												</span>
											</div>
											<div className={style.userProfileItem}>
												<span className={style.userProfileLabel}>
													最后更新:
												</span>
												<span className={style.userProfileValue}>
													{user.updateTime}
												</span>
											</div>
											<div className={style.userProfilePermissions}>
												<span className={style.userProfilePermissionsLabel}>
													权限:
												</span>
												<div className={style.userProfilePermissionsTags}>
													<AuthTagPopover auths={authorities} />
												</div>
											</div>
										</div>
									),
									disabled: true
								},
								{
									type: 'divider'
								},
								{
									key: 'logout',
									icon: <LogoutOutlined />,
									label: '登出',
									onClick: handleLogout
								}
							]
						}}
						placement="bottomRight">
						<Space style={{ cursor: 'pointer' }}>
							<span style={{ color: '#fff' }}>{user.loginUsername}</span>
							<Avatar src={user.avatarUrl} />
						</Space>
					</Dropdown>
				) : (
					<Button type="primary" loading={loginLoading} onClick={handleLogin}>
						登录
					</Button>
				)}
			</Header>

			<Layout>
				<Sider
					width={200}
					className={style.sider}
					collapsible
					theme="light"
					defaultCollapsed={sidebarCollapsed}
					onCollapse={setSidebarCollapsed}>
					<Menu
						mode="inline"
						selectedKeys={[getCurrentMenuKey]}
						className={style.menu}
						items={menuItems}
					/>
				</Sider>

				<Content className={style.content}>
					<div className={style.contentInner}>
						<Outlet />
					</div>
				</Content>
			</Layout>
		</Layout>
	);
}

export default Home;
