/**
 * App 视图的常量定义
 */

export const AUTH_TYPES = {
	ADMIN: 'admin',
	USER: 'user',
	NONE: 'none',
	DEFAULT: 'default'
} as const;

export type AuthType = (typeof AUTH_TYPES)[keyof typeof AUTH_TYPES];

export const BUTTON_CONFIG: Array<{
	label: string;
	type: AuthType | 'toggle' | 'increment';
	value?: AuthType;
}> = [
	{ label: 'admin', type: 'admin', value: AUTH_TYPES.ADMIN },
	{ label: 'user', type: 'user', value: AUTH_TYPES.USER },
	{ label: 'none', type: 'none', value: AUTH_TYPES.NONE },
	{ label: 'default', type: 'default', value: AUTH_TYPES.DEFAULT },
	{ label: 'Change Show', type: 'toggle' },
	{ label: 'Increase Count', type: 'increment' }
];
