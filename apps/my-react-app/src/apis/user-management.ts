import {
	Permission,
	Role,
	RolePermission,
	UserManagementCommonDataItem,
	UserRights,
	UserRole,
	UserRoleList
} from '@/types/user-management.d';
import { execApiCode, getCommonList, getCommonPage } from './apicode';

export function getUserRightsPage(pageIndex: number, pageSize: number) {
	return getCommonPage<UserRights>({
		apiCode: 'GET_GITHUB_RIGHTS',
		pageIndex,
		pageSize
	});
}

export function getPermissionPage(
	pageIndex: number,
	pageSize: number,
	param = {}
) {
	return getCommonPage<Permission>({
		apiCode: 'GET_PERMISSION',
		param,
		pageIndex,
		pageSize
	});
}

export function updatePermission(param: Partial<Permission>) {
	return execApiCode({ apiCode: 'UPDATE_PERMISSION', param });
}

export function addPermission(param: Partial<Permission>) {
	return execApiCode({ apiCode: 'ADD_PERMISSION', param });
}

export function deletePermission(permissionIds: number[]) {
	return execApiCode({
		apiCode: 'DELETE_PERMISSION',
		param: { permissionIds }
	});
}

export function getUserRolePage(
	pageIndex: number,
	pageSize: number,
	param = {}
) {
	return getCommonPage<UserRole>({
		apiCode: 'GET_USER_ROLE',
		pageIndex,
		pageSize,
		param
	});
}

export function updateUserRole(userRoleJsonStr: string) {
	return execApiCode({
		apiCode: 'UPDATE_USER_ROLE',
		param: { userRoleJsonStr }
	});
}

export function addUserRole(userRoleJsonStr: string) {
	return execApiCode({ apiCode: 'ADD_USER_ROLE', param: { userRoleJsonStr } });
}

export function deleteUserRole(userRoleJsonStr: string) {
	return execApiCode({
		apiCode: 'DELETE_USER_ROLE',
		param: { userRoleJsonStr }
	});
}

export function getRolePermissionPage(
	pageIndex: number,
	pageSize: number,
	param = {}
) {
	return getCommonPage<RolePermission>({
		apiCode: 'GET_ROLE_PERMISSION',
		pageIndex,
		pageSize,
		param
	});
}

export function updateRolePermission(rolePermissionJsonStr: string) {
	return execApiCode({
		apiCode: 'UPDATE_ROLE_PERMISSION',
		param: { rolePermissionJsonStr }
	});
}

export function addRolePermission(rolePermissionJsonStr: string) {
	return execApiCode({
		apiCode: 'ADD_ROLE_PERMISSION',
		param: { rolePermissionJsonStr }
	});
}

export function deleteRolePermission(rolePermissionJsonStr: string) {
	return execApiCode({
		apiCode: 'DELETE_ROLE_PERMISSION',
		param: { rolePermissionJsonStr }
	});
}

export function getUserManagementCommonData() {
	return getCommonList<UserManagementCommonDataItem>({
		apiCode: 'GET_USER_MANAGEMENT_COMMON_DATA'
	});
}
