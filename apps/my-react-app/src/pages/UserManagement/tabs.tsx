import styles from '@/styles/modules/UserManagement.module.css';
import { CommonObjectType } from '@/types/common';
import { USER_MANAGEMENT_TYPE } from '@/types/user-management';
import { FetchCurrentInfo, UserProfile } from '@/types/user-management.d';
import { noAuthTip } from '@/utils/tool';
import {
	LockOutlined,
	PlusOutlined,
	SafetyOutlined,
	UsergroupAddOutlined,
	UserOutlined
} from '@ant-design/icons';
import type { TablePaginationConfig, TabsProps } from 'antd';
import { Button, Table } from 'antd';
import UnauthorizedPage from '../Unauthorized';

export interface TabsConfig {
	onOpenAdd: () => void;
	onTableChange: (
		pagination: TablePaginationConfig,
		filters: CommonObjectType,
		sorter: CommonObjectType
	) => void;
	loading: boolean;
	userStore: UserProfile;
	authInfo: FetchCurrentInfo['authInfo'];
}

export interface TableTabConfig {
	key: string;
	label: string;
	type: USER_MANAGEMENT_TYPE;
	columns: any;
	dataSource: any;
	rowKey: string | ((record: any) => string | number);
	scrollConfig: any;
	pagination: TablePaginationConfig;
	setPagination: any;
}

export const createTabItems = (
	config: TabsConfig,
	tableConfigs: TableTabConfig[],
	filters: CommonObjectType = {},
	sorts: CommonObjectType = {}
): TabsProps['items'] => {
	const hasAddAuth = config.userStore.authorities.includes(
		config.authInfo.create
	);

	// Helper: 给列动态注入 filteredValue 和 sortOrder
	const enhanceColumns = (columns: any[]) => {
		return columns.map((col) => ({
			...col,
			filteredValue: filters[col.key] || filters[col.dataIndex] || [],
			sortOrder: sorts[col.key] || sorts[col.dataIndex] || null
		}));
	};

	return tableConfigs.map((tableConfig) => ({
		key: tableConfig.key,
		label: tableConfig.label,
		icon: getTabIcon(tableConfig.type),
		children: (
			<UnauthorizedPage permission={config.authInfo.access}>
				<div className={styles.tabContent}>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						className={styles.addButton}
						disabled={!hasAddAuth}
						title={hasAddAuth ? '添加' : noAuthTip(config.authInfo.create)}
						onClick={() => config.onOpenAdd()}>
						{getUserTypeText(tableConfig.type, '添加')}
					</Button>
					<div className={styles.tableWrapper}>
						<Table
							key={tableConfig.key}
							columns={enhanceColumns(tableConfig.columns)}
							dataSource={tableConfig.dataSource}
							rowKey={tableConfig.rowKey}
							loading={config.loading}
							scroll={tableConfig.scrollConfig}
							pagination={tableConfig.pagination}
							onChange={config.onTableChange}
						/>
					</div>
				</div>
			</UnauthorizedPage>
		)
	}));
};

export const getUserTypeText = (
	type: USER_MANAGEMENT_TYPE,
	prefix = '',
	suffix = ''
): string => {
	switch (type) {
		case USER_MANAGEMENT_TYPE.USER_ROLE:
			return `${prefix}用户角色${suffix}`;
		case USER_MANAGEMENT_TYPE.ROLE_PERMISSION:
			return `${prefix}角色权限${suffix}`;
		case USER_MANAGEMENT_TYPE.PERMISSION:
			return `${prefix}权限${suffix}`;
		case USER_MANAGEMENT_TYPE.ROLE:
			return `${prefix}角色${suffix}`;
		default:
			return `${prefix}${suffix}`;
	}
};

const getTabIcon = (type: USER_MANAGEMENT_TYPE) => {
	switch (type) {
		case USER_MANAGEMENT_TYPE.USER_ROLE:
			return <UserOutlined />;
		case USER_MANAGEMENT_TYPE.ROLE_PERMISSION:
			return <SafetyOutlined />;
		case USER_MANAGEMENT_TYPE.PERMISSION:
			return <LockOutlined />;
		case USER_MANAGEMENT_TYPE.ROLE:
			return <UsergroupAddOutlined />;
		default:
			return null;
	}
};
