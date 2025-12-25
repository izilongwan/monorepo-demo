import AuthTagPopover from '@/components/auth-tag-popover';
import { createFilterDropdown, createFilterIcon } from '@/components/filter';
import { FilterItem } from '@/types/common';
import { ROLE_TYPE, USER_AUTHORITITY } from '@/types/user-auth';
import { USER_MANAGEMENT_TYPE } from '@/types/user-management';
import {
	Permission,
	Role,
	RolePermission,
	UserManagementCommonData,
	UserManagementRowRecord,
	UserProfile,
	UserRole
} from '@/types/user-management.d';
import { TABLE_COLUMN_MAP } from '@/utils/table';
import { noAuthTip } from '@/utils/tool';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import type { ColumnType } from 'antd/es/table';

export interface ColumnsConfig {
	onEdit: (record: UserManagementRowRecord) => void;
	onDelete: (id: UserManagementRowRecord) => void;
	userStore: UserProfile;
	authInfo: {
		create: USER_AUTHORITITY;
		delete: USER_AUTHORITITY;
		update: USER_AUTHORITITY;
		query: USER_AUTHORITITY;
	};
	currentTabType: USER_MANAGEMENT_TYPE;
	commonData?: UserManagementCommonData;
	apiCodeMap: Map<string, string>;
	filters: {
		userName?: FilterItem[];
		roles?: FilterItem[];
		permissionIds?: FilterItem[];
		roleTypes?: FilterItem[];
		permissionTypes?: FilterItem[];
		permissionResources?: FilterItem[];
	};
}

const renderActionColumn = (
	record: UserManagementRowRecord,
	config: ColumnsConfig
) => {
	// Avoid using the array `authorities` itself in hook dependency arrays.
	// Compute simple booleans directly here — this keeps render pure and
	// prevents changing-size dependency arrays which React warns about.
	const hasAuth = (auth: USER_AUTHORITITY) =>
		config.userStore.authorities.includes(auth);
	const isRolePermissionType =
		config.currentTabType === USER_MANAGEMENT_TYPE.ROLE_PERMISSION;

	const isSystemRole = isRolePermissionType
		? (record as RolePermission).roleType === ROLE_TYPE.SYSTEM
		: false;

	const isCreator = config.userStore.loginUsername === record.createUser;

	const hasEditAuth: boolean = isSystemRole
		? false
		: isCreator || hasAuth(config.authInfo.update);
	let hasDeleteAuth: boolean = isCreator || hasAuth(config.authInfo.delete);

	if (isSystemRole) {
		hasDeleteAuth = false;
	} else if (hasDeleteAuth) {
		if (config.currentTabType === USER_MANAGEMENT_TYPE.USER_ROLE) {
			hasDeleteAuth = Boolean((record as UserRole).roles?.length);
		} else if (config.currentTabType === USER_MANAGEMENT_TYPE.ROLE_PERMISSION) {
			hasDeleteAuth = Boolean((record as RolePermission).permissions?.length);
		}
	}

	return (
		<Space>
			<Button
				size="small"
				type="text"
				icon={<EditOutlined />}
				title={hasEditAuth ? '编辑' : noAuthTip(config.authInfo.update)}
				disabled={!hasEditAuth}
				onClick={() => config.onEdit(record)}>
				编辑
			</Button>
			<Button
				size="small"
				type="text"
				danger
				icon={<DeleteOutlined />}
				title={hasDeleteAuth ? '删除' : noAuthTip(config.authInfo.delete)}
				disabled={!hasDeleteAuth}
				loading={record.deleteLoading}
				onClick={() => config.onDelete(record)}>
				删除
			</Button>
		</Space>
	);
};

export const getUserRoleColumns = (config: ColumnsConfig): ColumnType<UserRole>[] => [
	{ title: '#', dataIndex: 'index', key: 'index', fixed: 'left', width: 50 },
	{
		title: '用户名称',
		dataIndex: 'userName',
		key: 'userIdEnums',
		fixed: 'left',
		width: 200,
		filters: config.filters.userName
	},
	{
		title: '角色',
		dataIndex: 'roles',
		key: 'role_id',
		ellipsis: true,
		width: 300,
		render: (roles: Role[]) => {
			const auths = roles.map((role) => ({
				id: role.roleId,
				name: role.roleName,
				description: role.roleDescription
			}));
			return <AuthTagPopover auths={auths} />;
		}
	},
	TABLE_COLUMN_MAP.CREATE_USER,
	TABLE_COLUMN_MAP.UPDATE_USER,
	TABLE_COLUMN_MAP.CREATE_TIME,
	TABLE_COLUMN_MAP.UPDATE_TIME,
	{
		title: '操作',
		key: 'action',
		width: 170,
		fixed: 'right',
		render: (_: any, record: UserRole) => renderActionColumn(record, config)
	}
];

export const getRolePermissionColumns = (
	config: ColumnsConfig
): ColumnType<RolePermission>[] => [
	{ title: '#', dataIndex: 'index', key: 'index', width: 50, fixed: 'left' },
	{
		title: '角色名称',
		dataIndex: 'roleName',
		key: 'roleIdEnums',
		ellipsis: true,
		width: 150,
		fixed: 'left',
		filters: config.filters.roles
	},
	{
		title: '权限名称',
		dataIndex: 'permissions',
		key: 'permission_id',
		ellipsis: true,
		width: 200,
		render: (permissions: Permission[]) => {
			const auths = permissions.map((permission) => ({
				id: permission.permissionId,
				name: permission.permissionName,
				description: permission.permissionDescription,
				type: permission.permissionType
			}));
			return <AuthTagPopover auths={auths} />;
		}
	},
	{
		title: '角色类型',
		dataIndex: 'roleType',
		key: 'roleTypeEnums',
		ellipsis: true,
		width: 120,
		filters: config.filters.roleTypes
	},
	TABLE_COLUMN_MAP.CREATE_USER,
	TABLE_COLUMN_MAP.UPDATE_USER,
	TABLE_COLUMN_MAP.CREATE_TIME,
	TABLE_COLUMN_MAP.UPDATE_TIME,
	{
		title: '操作',
		key: 'action',
		width: 170,
		fixed: 'right',
		render: (_: any, record: RolePermission) =>
			renderActionColumn(record, config)
	}
];

export const getPermissionColumns = (
	config: ColumnsConfig
): ColumnType<Permission>[] => [
	{ title: '#', dataIndex: 'index', key: 'index', width: 50, fixed: 'left' },
	{
		title: '权限名称',
		dataIndex: 'permissionName',
		key: 'permissionIdEnums',
		fixed: 'left',
		width: 230,
		filters: config.filters.permissionIds,
		ellipsis: true
	},
	{
		title: '权限类型',
		dataIndex: 'permissionType',
		key: 'permissionTypeEnums',
		ellipsis: true,
		width: 100,
		filters: config.filters.permissionTypes
	},
	{
		title: '权限描述',
		dataIndex: 'permissionDescription',
		key: 'permissionDescription',
		width: 150,
		ellipsis: true
	},
	{
		title: '权限资源',
		dataIndex: 'permissionResource',
		key: 'permissionResource',
		width: 150,
		ellipsis: true,
		filterDropdown: createFilterDropdown({
			placeholder: '搜索权限资源'
		}),
		filterIcon: createFilterIcon()
	},
	{
		title: '权限操作',
		dataIndex: 'permissionAction',
		key: 'permissionAction',
		ellipsis: true,
		width: 130,
		filterDropdown: createFilterDropdown({
			placeholder: '搜索权限资源'
		}),
		filterIcon: createFilterIcon()
	},
	TABLE_COLUMN_MAP.CREATE_USER,
	TABLE_COLUMN_MAP.UPDATE_USER,
	TABLE_COLUMN_MAP.CREATE_TIME,
	TABLE_COLUMN_MAP.UPDATE_TIME,
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		width: 170,
		render: (_: any, record: Permission) => renderActionColumn(record, config)
	}
];
