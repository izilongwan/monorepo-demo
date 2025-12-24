import type { ApiCode, ApiCodeQueryParams } from '@/types/apicode.d';
import httpClient from '@/utils/request';
import { formatApiData } from '@/utils/tool';
import { API_HOST } from './const';

const API_CODE_HOST = `${API_HOST}/api-code`;

export function getCommonPage<T = any>(data: ApiCodeQueryParams) {
	return httpClient.postPage<T>(
		`${API_CODE_HOST}/v1/page/${data.pageIndex}/${data.pageSize}`,
		formatApiData(data)
	);
}

export function getCommonList<T = any>(data: ApiCodeQueryParams) {
	return httpClient.post<T[]>(`${API_CODE_HOST}/v1/list`, formatApiData(data));
}

export function execApiCode(data: ApiCodeQueryParams) {
	return httpClient.post<number>(
		`${API_CODE_HOST}/v1/exec`,
		formatApiData(data)
	);
}

export function getApiCodePageList(
	pageNum: number,
	pageSize: number,
	data: Partial<ApiCode> = {}
) {
	return httpClient.postPage<ApiCode>(
		`${API_CODE_HOST}/list/${pageNum}/${pageSize}`,
		data
	);
}

export function getApiCodePageList2(
	pageNum: number,
	pageSize: number,
	data: Partial<ApiCodeQueryParams> = {}
) {
	return getCommonPage<ApiCode>({
		...data,
		apiCode: 'GET_API_CODE',
		pageIndex: pageNum,
		pageSize: pageSize
	});
}

export function deleteApiCode(ids: number[]) {
	return httpClient.delete<boolean>(`${API_CODE_HOST}/delete/${ids.join(',')}`);
}

export function updateApiCode(data: Partial<ApiCode>) {
	return httpClient.post<boolean>(`${API_CODE_HOST}/update`, data);
}

export function addApiCode(data: ApiCode) {
	return httpClient.put<boolean>(`${API_CODE_HOST}/add`, data);
}
