export interface Loadings {
	deleteLoading: boolean;
	editLoading: boolean;
	addLoading: boolean;
	fetchLoading: boolean;
}

export interface CreateUpdateTime {
	createTime: string;
	updateTime: string;
}

export interface CreateUpdateUser {
	createUser: string;
	updateUser: string;
}

export type CommonObjectType = Record<string, any>;

export type CommonFunctionType<T = any> = (...args: any[]) => T;

export interface FilterItem {
	text: string;
	value: string | number;
}
