import { parseSortInfo } from '@/components/Filter';
import { API_CODE_OUTPUT } from '@/types/apicode';
import { ApiCodeQueryParams } from '@/types/apicode.d';
import { CommonObjectType } from '@/types/common';
import { USER_AUTHORITITY } from '@/types/user-auth';

export function formatListWithIndex<T>(
	data: T[],
	pageNum: number = 1,
	pageSize: number = 10
): T[] {
	return (data || []).map((item, index) => ({
		...item,
		index: (pageNum - 1) * pageSize + index + 1
	}));
}

export function formatMapToUnderline(
	param: CommonObjectType
): CommonObjectType {
	return Object.entries(param).reduce(
		(prev, [key, value]) => {
			Object.assign(prev, {
				[key.replace(/([A-Z])/g, '_$1').toLowerCase()]:
					value !== null && typeof value === 'object'
						? formatMapToUnderline(value)
						: value
			});
			return prev;
		},
		Array.isArray(param) ? [] : {}
	);
}

export function jsonParseSafe<T>(str: string, defaultValue: T = {} as T) {
	try {
		return JSON.parse(str) as T;
	} catch {
		return defaultValue;
	}
}

export function noAuthTip(key: USER_AUTHORITITY): string {
	return `您暂无此操作权限，权限操作 [${key}]`;
}

export function formatApiData(data: ApiCodeQueryParams) {
	const paramClone = data.param || {};
	const { __sort, __filter } = paramClone;

	if (__sort) {
		Object.assign(paramClone, parseSortInfo(__sort));
		delete paramClone.__sort;
	}

	if (__filter) {
		Object.assign(paramClone, formatTableFilter(__filter));
		delete paramClone.__filter;
	}

	return {
		...data,
		output: API_CODE_OUTPUT.CAMEL_CASE,
		param: formatMapToUnderline(paramClone)
	};
}

export function formatTableFilter(filterObj: CommonObjectType) {
	const filter: CommonObjectType = {};
	Object.entries(filterObj).forEach(([key, value]) => {
		if (Array.isArray(value)) {
			filter[key] = key.endsWith('Enums') ? value : value[0];
			return;
		}
		filter[key] = value;
	});
	return filter;
}
