import { ROLE_TYPE } from '@/types/user-auth';
import { PERMISSION_TYPE, USER_MANAGEMENT_TYPE } from '@/types/user-management';
import type {
	FetchCurrentInfo,
	UserManagementCommonData,
	UserManagementRowRecord
} from '@/types/user-management.d';
import { noAuthTip } from '@/utils/tool';
import {
	AutoComplete,
	Form,
	FormInstance,
	Input,
	Modal,
	Radio,
	Select,
	Tag
} from 'antd';
import { useEffect, useMemo, useState } from 'react';

export interface UserManagementModalProps {
	isModalVisible: boolean;
	onCancel: () => void;
	onOk: () => void;
	confirmLoading: boolean;
	form: FormInstance;
	currentTabType: USER_MANAGEMENT_TYPE;
	editingItem: UserManagementRowRecord | null;
	commonData: UserManagementCommonData | null;
	hasAddOrEditAuth?: boolean;
	authInfo: FetchCurrentInfo['authInfo'];
	onPermissionTypeChange: (e: any) => void;
}

export const UserManagementModal = ({
	isModalVisible,
	onCancel,
	onOk,
	confirmLoading,
	form,
	currentTabType,
	editingItem,
	commonData,
	hasAddOrEditAuth,
	authInfo,
	onPermissionTypeChange
}: UserManagementModalProps) => {
	const [roleInputValue, setRoleInputValue] = useState<string>('');

	// 通用 Select 搜索过滤函数
	const commonFilterOption = (input: string, option: any) =>
		(option?.label ?? '').toLowerCase().includes(input.toLowerCase());

	// watch permissionType so UI re-renders when it changes
	const permissionType = Form.useWatch?.('permissionType', form);
	const isApiPermissionType = useMemo<boolean>(
		() => permissionType === PERMISSION_TYPE.API,
		[permissionType]
	);

	return (
		<Modal
			title={editingItem ? '编辑' : '添加'}
			open={isModalVisible}
			onOk={onOk}
			maskClosable={false}
			confirmLoading={confirmLoading}
			okButtonProps={{
				disabled: !hasAddOrEditAuth,
				title: hasAddOrEditAuth
					? undefined
					: editingItem
					? noAuthTip(authInfo.update)
					: noAuthTip(authInfo.create)
			}}
			onCancel={onCancel}>
			<Form form={form} layout="vertical">
				{currentTabType === USER_MANAGEMENT_TYPE.USER_ROLE && (
					<>
						<Form.Item
							name="userId"
							label="用户名称"
							rules={[{ required: true, message: '请选择用户' }]}>
							<Select
								placeholder="选择用户"
								showSearch={true}
								filterOption={commonFilterOption}
								options={commonData?.users.map((user: any) => ({
									label: user.userName,
									value: user.userId
								}))}
							/>
						</Form.Item>
						<Form.Item
							name="roleIds"
							label="分配角色"
							rules={[{ required: true, message: '请至少选择一个角色' }]}>
							<Select
								showSearch={true}
								mode="multiple"
								placeholder="选择要分配的角色"
								filterOption={commonFilterOption}
								options={commonData?.roles.map((role) => ({
									label: `${role.roleName} [${role.roleType}]`,
									value: role.roleId
								}))}
							/>
						</Form.Item>
					</>
				)}
				{currentTabType === USER_MANAGEMENT_TYPE.ROLE_PERMISSION && (
					<>
						<Form.Item
							name="roleId"
							label="角色名称"
							rules={[{ required: true, message: '请选择角色' }]}>
							{editingItem ? (
								<Tag>{form.getFieldValue('roleName')}</Tag>
							) : (
								<Select
									placeholder="选择角色"
									showSearch={true}
									filterOption={commonFilterOption}
									options={commonData?.roles.map((role) => ({
										label: `${role.roleName} [${role.roleType}]`,
										value: role.roleId,
										disabled: role.roleType === ROLE_TYPE.SYSTEM
									}))}></Select>
							)}
						</Form.Item>
						<Form.Item name="roleId" hidden noStyle />
						<Form.Item
							name="permissionIds"
							label="分配权限"
							rules={[{ required: true, message: '请至少选择一个权限' }]}>
							<Select
								mode="multiple"
								placeholder="选择要分配的权限"
								filterOption={commonFilterOption}
								options={commonData?.permissions.map((permission) => ({
									label: `${permission.permissionName} [${permission.permissionType}]`,
									value: permission.permissionId
								}))}></Select>
						</Form.Item>
					</>
				)}{' '}
				{currentTabType === USER_MANAGEMENT_TYPE.PERMISSION && (
					<>
						<Form.Item
							name="permissionType"
							label="权限类型"
							rules={[{ required: true, message: '请选择权限类型' }]}>
							<Radio.Group
								defaultValue={PERMISSION_TYPE.API}
								onChange={onPermissionTypeChange}>
								<Radio value={PERMISSION_TYPE.API}>API</Radio>
								<Radio value={PERMISSION_TYPE.CUSTOM}>自定义权限</Radio>
							</Radio.Group>
						</Form.Item>
					</>
				)}
				{currentTabType === USER_MANAGEMENT_TYPE.PERMISSION && (
					<>
						{isApiPermissionType ? (
							<Form.Item
								name="apiId"
								label="权限资源"
								rules={[{ required: true }]}>
								<Select
									placeholder="选择权限资源"
									showSearch={true}
									filterOption={commonFilterOption}
									options={commonData?.apiCodes.map((api) => ({
										label: api.apiCode,
										value: api.apiId
									}))}
								/>
							</Form.Item>
						) : (
							<Form.Item
								name="permissionResource"
								label="权限资源"
								rules={[{ required: true }]}>
								<Input />
							</Form.Item>
						)}

						<Form.Item
							name="permissionAction"
							label="权限操作"
							rules={[{ required: true }]}>
							{permissionType === PERMISSION_TYPE.API ? (
								<Select
									placeholder="选择权限资源操作"
									showSearch={true}
									filterOption={commonFilterOption}
									options={commonData?.permissionActions.map((action) => ({
										label: action,
										value: action
									}))}
								/>
							) : (
								<AutoComplete
									placeholder="选择或自定义权限操作"
									options={commonData?.permissionActions.map((action) => ({
										label: action,
										value: action
									}))}
									filterOption={commonFilterOption}
								/>
							)}
						</Form.Item>
						<Form.Item name="permissionDescription" label="权限描述">
							<Input.TextArea rows={4} />
						</Form.Item>
					</>
				)}
			</Form>
		</Modal>
	);
};
