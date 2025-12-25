import { RequestResult } from '@/utils/request';
import { ReactElement } from 'react';
import { PageApiCodeResult } from './apicode.d';
import {
	CommonFunctionType,
	CreateUpdateTime,
	FilterItem,
	Loadings,
	CreateUpdateUser
} from './common.d';
import { USER_AUTHORITITY } from './user-auth';
import { PERMISSION_TYPE } from './user-management';

export interface UserProfile extends CreateUpdateTime {
	deleted: number;
	avatarUrl: string;
	loginUsername: string;
	id: string;
	authorities: string[];
}

export interface UserRights extends User, Role, Permission {}

interface User extends Loadings, CreateUpdateTime {
	userId: number;
	userName: string;
}

interface Role extends CreateUpdateTime, Loadings, CreateUpdateUser {
	roleName: string;
	roleResource: string;
	roleId: number;
	roleAction: string;
	roleDescription: string;
	roleType: string;
}

interface UserRole extends Partial<User>, Partial<Role> {
	roleInfo: string;
	roles: Role[];
	roleIds: number[];
}

interface UserRoleExecParam {
	userRoleList: UserRoleList;
}

type UserRoleList = Pick<UserRole, 'userId' | 'roleId'>[];

export interface RolePermission extends Partial<Role>, Partial<Permission> {
	permissionInfo: string;
	permissions: Permission[];
	permissionIds: number[];
}

export interface Permission
	extends ApiCodePermisson,
		CreateUpdateTime,
		CreateUpdateUser,
		Loadings {
	permissionDescription: string;
	permissionId: number;
	permissionName: string;
	permissionResource: string;
	permissionResourceName: string;
	permissionAction: string;
	permissionType: PERMISSION_TYPE;
	disabled?: boolean;
}

type UserManagementRowRecord = Permission | UserRole | RolePermission;

interface UserManagementCommonDataItem {
	type: 'user' | 'role' | 'permission';
	info: string;
}

interface UserManagementCommonData {
	users: User[];
	roles: Role[];
	permissions: Permission[];
	apiCodes: ApiCodePermisson[];
	roleTypes: FilterItem[];
	permissionTypes: FilterItem[];
	permissionActions: string[];
	permissionIds: FilterItem[];
}

interface ApiCodePermisson {
	apiId: number;
	apiCode: string;
	apiType?: string;
	apiDescription?: string;
}

interface UserManagementHandlers {
	open(record?: UserManagementRowRecord): void;
	create(record: UserManagementRowRecord): void;
	update(record: UserManagementRowRecord): void;
	delete(record: UserManagementRowRecord): void;
}

type OperateFunc = CommonFunctionType<RequestResult<number>>;

interface FetchCurrentInfo {
	create: OperateFunc;
	remove: OperateFunc;
	update: OperateFunc;
	page: CommonFunctionType<
		RequestResult<PageApiCodeResult<UserManagementRowRecord>>
	>;
	setData: (result: React.SetStateAction<any[]>) => void;
	data: UserManagementRowRecord[];
	id?: number;
	tip?: ReactElement;
	authInfo: {
		create: USER_AUTHORITITY;
		delete: USER_AUTHORITITY;
		update: USER_AUTHORITITY;
		query: USER_AUTHORITITY;
		access: USER_AUTHORITITY;
	};
	createAllowZeroCode?: boolean;
	openEditBefore?: (record: UserManagementRowRecord) => UserManagementRowRecord;
	openAddAfter?: () => void;
}
