import { API_CODE_OUTPUT, API_CODE_STATE } from '@/types/apicode';
import { ROLE_TYPE } from '@/types/user-auth';
import { PERMISSION_TYPE } from '@/types/user-management';

export const INITIAL_PAGINATION = {
	current: 1,
	pageSize: 10,
	total: 0,
	showSizeChanger: true,
	showTotal: (total: number) => `共 ${total} 条`
};

export const OUTPUT_OPTIONS = [
	{ label: '正常', value: API_CODE_OUTPUT.NORMAL },
	{ label: '小驼峰', value: API_CODE_OUTPUT.CAMEL_CASE },
	{ label: '常量', value: API_CODE_OUTPUT.CONSTANT_CASE }
];

export const API_CODE_STATE_OPTIONS = [
	{ text: '启用', value: API_CODE_STATE.PUBLISH },
	{ text: '禁用', value: API_CODE_STATE.UNPUBLISH }
];

export const API_CODE_STATE_MAP = API_CODE_STATE_OPTIONS.reduce((acc, item) => {
	acc[item.value] = item.text;
	return acc;
}, {} as Record<API_CODE_STATE, string>);

export const API_CODE_SQL_TYPE_OPTIONS = [
	{ text: 'SELECT', value: 'SELECT' },
	{ text: 'INSERT', value: 'INSERT' },
	{ text: 'UPDATE', value: 'UPDATE' },
	{ text: 'DELETE', value: 'DELETE' },
	{ text: 'CALL', value: 'CALL' },
	{ text: 'OTHER', value: '' }
];
