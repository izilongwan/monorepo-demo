import {
	addPermission,
	addRole,
	addRolePermission,
	addUserRole,
	deletePermission,
	deleteRole,
	deleteRolePermission,
	deleteUserRole,
	getPermissionPage,
	getRolePage,
	getRolePermissionPage,
	getUserManagementCommonData,
	getUserRolePage,
	updatePermission,
	updateRole,
	updateRolePermission,
	updateUserRole
} from '@/apis/user-management';
import AuthTagPopover from '@/components/auth-tag-popover';
import { useUserStore } from '@/stores';
import styles from '@/styles/modules/UserManagement.module.css';
import { CommonObjectType } from '@/types/common';
import { ROLE_TYPE, USER_AUTHORITITY } from '@/types/user-auth';
import { PERMISSION_TYPE, USER_MANAGEMENT_TYPE } from '@/types/user-management';
import type {
	FetchCurrentInfo,
	Permission,
	Role,
	RolePermission,
	UserManagementCommonData,
	UserManagementRowRecord,
	UserRole
} from '@/types/user-management.d';
import { INITIAL_PAGINATION } from '@/utils/const';
import {
	formatListWithIndex,
	formatMapToUnderline,
	jsonParseSafe
} from '@/utils/tool';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Form, message, Modal, Tabs, Tag } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
	getPermissionColumns,
	getRoleColumns,
	getRolePermissionColumns,
	getUserRoleColumns
} from './columns';
import { createTabItems, getUserTypeText } from './tabs';
import { UserManagementModal } from './UserManagementModal';

const TABLE_SCROLL_CONFIG = { y: 'calc(100vh - 386px)' };

function UserManagement() {
	const [userRoles, setUserRoles] = useState<UserRole[]>([]);
	const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
	const [permissions, setPermissions] = useState<Permission[]>([]);
	const [roles, setRoles] = useState<Role[]>([]);
	const [tableLoading, setTableLoading] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingItem, setEditingItem] =
		useState<UserManagementRowRecord | null>(null);
	const [currentTabType, setCurrentTabType] = useState<USER_MANAGEMENT_TYPE>(
		USER_MANAGEMENT_TYPE.USER_ROLE
	);
	const [modalOkBtnLoading, setModalOkBtnLoading] = useState(false);
	const [form] = Form.useForm();

	const [tablePagination, setTablePagination] =
		useState<TablePaginationConfig>(INITIAL_PAGINATION);
	const [filterObj, setFilterObj] = useState<CommonObjectType>({});
	const [sortObj, setSortObj] = useState<CommonObjectType>({});

	const userStore = useUserStore((state) => state.user);

	// Helper: create common setData handler to reduce duplication
	const createSetDataHandler = <T extends any>(
		setter: React.Dispatch<React.SetStateAction<T[]>>,
		parserFn?: (item: T) => void
	) => {
		return (result: React.SetStateAction<T[]>) => {
			if (typeof result === 'function') {
				return setter(result);
			}
			const arr = result as T[];
			arr.forEach((item) => parserFn?.(item));
			setter([...arr]);
			return [...arr];
		};
	};

	// Helper: create authInfo object to avoid repetition
	const createAuthInfo = (baseKey: string, access: USER_AUTHORITITY) => ({
		create:
			USER_AUTHORITITY[`${baseKey}:CREATE` as keyof typeof USER_AUTHORITITY],
		delete:
			USER_AUTHORITITY[`${baseKey}:DELETE` as keyof typeof USER_AUTHORITITY],
		update:
			USER_AUTHORITITY[`${baseKey}:UPDATE` as keyof typeof USER_AUTHORITITY],
		query:
			USER_AUTHORITITY[`${baseKey}:QUERY` as keyof typeof USER_AUTHORITITY],
		access
	});

	// Helper: create tip JSX for delete confirm modal
	const createTip = (label: string, tagValue: string, auths: any[]) => (
		<>
			{label}
			<div>
				<Tag>{tagValue}</Tag>
			</div>
			<div className={styles.authTagRow}>
				<div>关联项:</div>
				<AuthTagPopover auths={auths} showMaxCount={10} />
			</div>
		</>
	);

	// Helper: simplify role/permission list mapping
	const mapToAuthTag = (
		items: any[],
		keyMap: { id: string; name: string; description: string; type?: string }
	) => {
		return items.map((item) => ({
			id: item[keyMap.id],
			name: item[keyMap.name],
			description: item[keyMap.description],
			color: 'red',
			type: keyMap.type ? item[keyMap.type] : undefined
		}));
	};

	useEffect(() => {
		getCommonData();
		setTablePagination((prev) => ({
			...prev,
			current: INITIAL_PAGINATION.current
		}));
	}, [currentTabType]);

	useEffect(() => {
		fetchData();
	}, [tablePagination.current, currentTabType, filterObj, sortObj]);

	const [commonData, setCommonData] = useState<UserManagementCommonData | null>(
		null
	);

	async function getCommonData() {
		const result = await getUserManagementCommonData().promise;

		const data = result.reduce((p, c) => {
			Object.assign(p, { [c.type]: jsonParseSafe(c.info, []) });
			return p;
		}, {} as UserManagementCommonData);

		setCommonData(data);
	}

	const freshData = () => {
		if (tablePagination.current !== INITIAL_PAGINATION.current) {
			setTablePagination((prev) => ({
				...prev,
				current: INITIAL_PAGINATION.current
			}));
			return;
		}
		fetchData();
	};

	useEffect(freshData, [tablePagination.pageSize, currentTabType]);

	const handleUserRoleOperation = (record: UserRole) => {
		const map = {} as FetchCurrentInfo;
		const userRoleItem = record as UserRole;

		if (userRoleItem?.userId) {
			map.id = userRoleItem.userId;
			const roles = mapToAuthTag(userRoleItem?.roles ?? [], {
				id: 'roleId',
				name: 'roleName',
				description: 'roleDescription',
				type: 'roleType'
			});
			map.tip = createTip(
				'用户关联的角色吗？',
				userRoleItem.userName || '',
				roles
			);
		}

		const buildParam = (row: UserRole) => {
			const { roleIds, userId, roles } = row;
			const roleList = roleIds || roles.map((role) => role.roleId);
			return JSON.stringify(
				roleList.map((roleId) =>
					formatMapToUnderline({
						userId,
						roleId
					})
				)
			);
		};
		map.createAllowZeroCode = true;
		map.create = (record: UserRole) => addUserRole(buildParam(record));
		map.update = (record: UserRole) => updateUserRole(buildParam(record));
		map.remove = (record: UserRole) => deleteUserRole(buildParam(record));
		map.openEditBefore = (record: UserManagementRowRecord) => {
			const newRecord = { ...record } as UserRole;
			newRecord.userId = newRecord.userId;
			newRecord.roleIds = newRecord.roles.map((role) => role.roleId);
			return newRecord;
		};
		map.page = getUserRolePage;
		map.setData = createSetDataHandler(setUserRoles, (item) => {
			item.roles = jsonParseSafe(item.roleInfo, []);
		});
		map.data = permissions;
		map.authInfo = createAuthInfo(
			'USER_MANAGEMENT.USER_ROLE',
			USER_AUTHORITITY['USER_MANAGEMENT.USER_ROLE:QUERY']
		);
		return map;
	};

	const handleRolePermissionOperation = (record: RolePermission) => {
		const map = {} as FetchCurrentInfo;
		const rolePermissionItem = record as RolePermission;

		if (rolePermissionItem?.roleId) {
			map.id = rolePermissionItem.roleId;
			const permissions = mapToAuthTag(rolePermissionItem?.permissions || [], {
				id: 'permissionId',
				name: 'permissionName',
				description: 'permissionDescription',
				type: 'permissionType'
			});
			map.tip = createTip(
				'角色关联的权限吗？',
				rolePermissionItem.roleName || '',
				permissions
			);
		}
		const buildParam = (row: RolePermission) => {
			const { permissionIds, roleId, permissions } = row;
			const permissionIdList =
				permissionIds || permissions.map((perm) => perm.permissionId);
			return JSON.stringify(
				permissionIdList.map((permissionId) => {
					return formatMapToUnderline({
						permissionId,
						roleId
					});
				})
			);
		};
		map.create = (record: RolePermission) =>
			addRolePermission(buildParam(record));
		map.remove = (record: RolePermission) =>
			deleteRolePermission(buildParam(record));
		map.update = (record: RolePermission) =>
			updateRolePermission(buildParam(record));
		map.page = getRolePermissionPage;
		map.setData = createSetDataHandler(setRolePermissions, (item) => {
			item.permissions = jsonParseSafe(item.permissionInfo, []);
		});
		map.openEditBefore = (record: UserManagementRowRecord) => {
			const newRecord = { ...record } as RolePermission;
			newRecord.roleId = newRecord.roleId;
			newRecord.permissionIds = newRecord.permissions.map(
				(permission) => permission.permissionId
			);
			return newRecord;
		};
		map.authInfo = createAuthInfo(
			'USER_MANAGEMENT.ROLE_PERMISSION',
			USER_AUTHORITITY['USER_MANAGEMENT.ROLE_PERMISSION:QUERY']
		);
		return map;
	};

	const handlePermissionOperation = (record: Permission) => {
		const map = {} as FetchCurrentInfo;
		const permissionItem = record as Permission;
		if (permissionItem?.permissionId) {
			map.id = permissionItem.permissionId;
			const resources = [
				{
					id: permissionItem.permissionId,
					description: permissionItem.permissionDescription,
					type: permissionItem.permissionType,
					name: permissionItem.permissionResource,
					color: 'red'
				}
			];
			map.tip = createTip(
				'权限关联的资源吗？',
				permissionItem.permissionName,
				resources
			);
		}
		const buildParam = (record: Permission) => {
			return {
				apiId: record.apiId ?? '',
				permissionType: record.permissionType,
				permissionAction: record.permissionAction,
				permissionResource: record.permissionResource ?? '',
				permissionDescription: record.permissionDescription ?? '',
				permissionId: record.permissionId ?? undefined
			} as Permission;
		};
		map.create = (record: Permission) => addPermission(buildParam(record));
		map.update = (record: Permission) => updatePermission(buildParam(record));
		map.remove = (record: Permission) =>
			deletePermission([record.permissionId]);
		map.page = getPermissionPage;
		map.setData = createSetDataHandler(setPermissions);
		map.openAddAfter = () => {
			form.setFieldsValue({ permissionType: PERMISSION_TYPE.API });
		};
		map.authInfo = createAuthInfo(
			'USER_MANAGEMENT.PERMISSION',
			USER_AUTHORITITY.USER
		);
		return map;
	};

	const handleRoleOperation = (record: Role) => {
		const map = {} as FetchCurrentInfo;
		const roleItem = record as Role;
		if (roleItem?.roleId) {
			map.id = roleItem.roleId;
			const resources = [
				{
					id: roleItem.roleId,
					description: roleItem.roleDescription,
					type: roleItem.roleType,
					name: roleItem.roleName,
					color: 'red'
				}
			];
			map.tip = createTip('角色？', roleItem.roleName, resources);
		}

		map.create = addRole;
		map.update = updateRole;
		map.remove = (record: Role) => deleteRole([record.roleId]);
		map.page = getRolePage;
		map.openAddAfter = () => {
			form.setFieldsValue({ roleType: ROLE_TYPE.CUSTOM, ...editingItem });
		};
		map.setData = createSetDataHandler(setRoles);
		map.authInfo = createAuthInfo(
			'USER_MANAGEMENT.ROLE',
			USER_AUTHORITITY.USER
		);
		return map;
	};

	const getCurrentFetchInfo = useCallback(
		(record: UserManagementRowRecord | null = editingItem) => {
			switch (currentTabType) {
				case USER_MANAGEMENT_TYPE.USER_ROLE:
					return handleUserRoleOperation(record as UserRole);
				case USER_MANAGEMENT_TYPE.ROLE_PERMISSION:
					return handleRolePermissionOperation(record as RolePermission);
				case USER_MANAGEMENT_TYPE.PERMISSION:
					return handlePermissionOperation(record as Permission);
				case USER_MANAGEMENT_TYPE.ROLE:
					return handleRoleOperation(record as Role);
			}
		},
		[currentTabType, editingItem]
	);

	const fetchData = useCallback(
		async (param = {}) => {
			if (
				!userStore?.authorities.includes(getCurrentFetchInfo().authInfo.access)
			) {
				return;
			}

			setTableLoading(true);
			try {
				const { page, setData } = getCurrentFetchInfo();
				const type = currentTabType;

				const result = await page(
					tablePagination.current!,
					tablePagination.pageSize!,
					{
						__filter: filterObj,
						__sort: sortObj,
						...param
					}
				).promise;
				if (type !== currentTabType) {
					return;
				}

				setData(
					formatListWithIndex(
						result.records as any[],
						tablePagination.current,
						tablePagination.pageSize
					)
				);
				setTablePagination((prev) => ({
					...prev,
					total: result.total
				}));
			} finally {
				setTableLoading(false);
			}
		},
		[currentTabType, tablePagination.current, filterObj, sortObj]
	);

	const handleOpenAdd = useCallback(() => {
		const { openAddAfter } = getCurrentFetchInfo();
		setEditingItem(null);
		form.resetFields();
		openAddAfter?.();
		setIsModalVisible(true);
	}, [form, currentTabType, commonData]);

	const handleOpenEdit = useCallback(
		(record: UserManagementRowRecord) => {
			const { openEditBefore } = getCurrentFetchInfo(record);
			const newRecord = openEditBefore
				? openEditBefore({ ...record })
				: { ...record };

			form.setFieldsValue(newRecord);
			setEditingItem(newRecord);
			setIsModalVisible(true);
		},
		[form, currentTabType, commonData]
	);

	const handleDelete = useCallback(
		(record: UserManagementRowRecord) => {
			const { remove, setData, tip } = getCurrentFetchInfo(record);

			Modal.confirm({
				title: '删除确认',
				icon: <ExclamationCircleOutlined />,
				content: (
					<div>
						确定要删除{tip}
						<div>此操作不可撤销。</div>
					</div>
				),
				okText: '确定',
				cancelText: '取消',
				okButtonProps: { danger: true },
				onOk() {
					record.deleteLoading = true;
					setData((prev: any[]) => [...prev]);
					remove(record)
						.promise.then((effectNum) => {
							if (effectNum) {
								message.success(`删除成功`);
								fetchData({ now: Date.now() });
							}
						})
						.finally(() => {
							record.deleteLoading = false;
							setData((prev: any[]) => [...prev]);
						});
				}
			});
		},
		[fetchData]
	);

	const handleModalOk = useCallback(() => {
		form.validateFields().then((values) => {
			const {
				create: add,
				update,
				id,
				createAllowZeroCode
			} = getCurrentFetchInfo();
			const fn = id ? update : add;
			setModalOkBtnLoading(true);
			fn(editingItem ? { ...editingItem, ...values } : values)
				.promise.then((effectNum) => {
					if (effectNum > 0 || (createAllowZeroCode && effectNum === 0)) {
						fetchData({ now: Date.now() });
						setIsModalVisible(false);
						message.success('操作成功');
					}
				})
				.finally(() => {
					setModalOkBtnLoading(false);
				});
		});
	}, [form, fetchData, currentTabType, editingItem]);

	const handleTableChange = (
		pagination: TablePaginationConfig,
		filters: CommonObjectType,
		sorter: CommonObjectType
	) => {
		setFilterObj(filters);
		setSortObj(sorter);
		setTablePagination((prev) => ({
			...prev,
			current: pagination.current,
			pageSize: pagination.pageSize
		}));
	};

	const apiCodeMap = useMemo(() => {
		const map = new Map<string, string>();
		commonData?.apiCodes.forEach((apiCode) => {
			map.set(String(apiCode.apiId), apiCode.apiCode);
		});
		return map;
	}, [commonData]);

	const columnsConfig = useMemo(
		() => ({
			onEdit: handleOpenEdit,
			onDelete: handleDelete,
			userStore: userStore!,
			authInfo: getCurrentFetchInfo().authInfo,
			currentTabType,
			commonData: commonData!,
			apiCodeMap: apiCodeMap!,
			filters: {
				userName: commonData?.users.map((user) => ({
					text: user.userName,
					value: user.userId
				})),
				roles: commonData?.roles.map((role) => ({
					text: role.roleName,
					value: role.roleId
				})),
				permissionIds: commonData?.permissions.map((permission) => ({
					text: permission.permissionName,
					value: permission.permissionId
				})),
				roleTypes: commonData?.roleTypes,
				permissionTypes: commonData?.permissionTypes
			}
		}),
		[userStore, currentTabType, editingItem, commonData, apiCodeMap]
	);

	const userColumns = useMemo(
		() => getUserRoleColumns(columnsConfig),
		[columnsConfig]
	);

	const rolePermissionColumns = useMemo(
		() => getRolePermissionColumns(columnsConfig),
		[columnsConfig]
	);

	const permissionColumns = useMemo(
		() => getPermissionColumns(columnsConfig),
		[columnsConfig]
	);

	const roleColumns = useMemo(
		() => getRoleColumns(columnsConfig),
		[columnsConfig]
	);

	function handleModalClose() {
		setIsModalVisible(false);
		setEditingItem(null);
	}

	const tabItems = useMemo(
		() =>
			createTabItems(
				{
					onOpenAdd: handleOpenAdd,
					onTableChange: handleTableChange,
					loading: tableLoading,
					userStore: userStore!,
					authInfo: getCurrentFetchInfo().authInfo
				},
				[
					{
						key: USER_MANAGEMENT_TYPE.USER_ROLE,
						label: getUserTypeText(USER_MANAGEMENT_TYPE.USER_ROLE, '', '管理'),
						type: USER_MANAGEMENT_TYPE.USER_ROLE,
						columns: userColumns,
						dataSource: userRoles,
						rowKey: 'userId',
						scrollConfig: TABLE_SCROLL_CONFIG,
						pagination: tablePagination,
						setPagination: setTablePagination
					},
					{
						key: USER_MANAGEMENT_TYPE.ROLE_PERMISSION,
						label: getUserTypeText(
							USER_MANAGEMENT_TYPE.ROLE_PERMISSION,
							'',
							'管理'
						),
						type: USER_MANAGEMENT_TYPE.ROLE_PERMISSION,
						columns: rolePermissionColumns,
						dataSource: rolePermissions,
						rowKey: 'roleId',
						scrollConfig: TABLE_SCROLL_CONFIG,
						pagination: tablePagination,
						setPagination: setTablePagination
					},
					{
						key: USER_MANAGEMENT_TYPE.PERMISSION,
						label: getUserTypeText(USER_MANAGEMENT_TYPE.PERMISSION, '', '管理'),
						type: USER_MANAGEMENT_TYPE.PERMISSION,
						columns: permissionColumns,
						dataSource: permissions,
						rowKey: (record: Permission) => record.permissionId,
						scrollConfig: { ...TABLE_SCROLL_CONFIG, x: 1200 },
						pagination: tablePagination,
						setPagination: setTablePagination
					},
					{
						key: USER_MANAGEMENT_TYPE.ROLE,
						label: getUserTypeText(USER_MANAGEMENT_TYPE.ROLE, '', '管理'),
						type: USER_MANAGEMENT_TYPE.ROLE,
						columns: roleColumns,
						dataSource: roles,
						rowKey: (record: Role) => record.roleId,
						scrollConfig: { ...TABLE_SCROLL_CONFIG, x: 1200 },
						pagination: tablePagination,
						setPagination: setTablePagination
					}
				],
				filterObj,
				sortObj
			),
		[
			handleOpenAdd,
			handleTableChange,
			tableLoading,
			userColumns,
			userRoles,
			TABLE_SCROLL_CONFIG,
			rolePermissionColumns,
			rolePermissions,
			permissionColumns,
			permissions,
			TABLE_SCROLL_CONFIG,
			tablePagination,
			setTablePagination,
			filterObj,
			sortObj
		]
	);

	const hasAddOrEditAuth = useMemo(() => {
		const { create, update } = getCurrentFetchInfo().authInfo;
		if (editingItem) {
			const isCreator = userStore?.loginUsername === editingItem.createUser;
			return isCreator || userStore?.authorities.includes(update);
		}
		return userStore?.authorities.includes(create);
	}, [userStore, currentTabType, editingItem]);

	const handlePermissionTypeChange = (e: any) => {
		const v = e?.target?.value;
		// reset related fields when permission type changes
		form.setFieldsValue({
			permissionType: v,
			permissionResource: undefined,
			permissionAction: undefined,
			permissionDescription: ''
		});
	};

	return (
		<div className={styles.container}>
			<Tabs
				defaultActiveKey={currentTabType}
				className={styles.tabs}
				style={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					minHeight: 0
				}}
				items={tabItems}
				onChange={(key) => {
					setCurrentTabType(key as USER_MANAGEMENT_TYPE);
					setFilterObj({});
					setSortObj({});
				}}
			/>

			<UserManagementModal
				isModalVisible={isModalVisible}
				onCancel={handleModalClose}
				onOk={handleModalOk}
				confirmLoading={modalOkBtnLoading}
				form={form}
				currentTabType={currentTabType}
				editingItem={editingItem}
				commonData={commonData}
				hasAddOrEditAuth={hasAddOrEditAuth}
				authInfo={getCurrentFetchInfo().authInfo}
				onPermissionTypeChange={handlePermissionTypeChange}
			/>
		</div>
	);
}

export default UserManagement;
