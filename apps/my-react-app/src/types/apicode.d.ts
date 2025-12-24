import { CommonObjectType, CreateUpdateTime, Loadings } from './common';
import { API_CODE_OUTPUT } from './apicode';
import { USER_AUTHORITITY } from './user-auth';

export interface ApiCode extends Loadings, CreateUpdateTime {
	apiCode: string;
	output: string;
	deleted: number;
	apiSql: string;
	apiSqlType: string;
	id: number;
	state: number;
	deleteAuth: USER_AUTHORITITY;
	updateAuth: USER_AUTHORITITY;
	createAuth: USER_AUTHORITITY;
	queryAuth: USER_AUTHORITITY;
}

export interface ApiCodeQueryParams {
  apiCode: string;
  param?: CommonObjectType;
  pageIndex?: number;
  pageSize?: number;
  output?: API_CODE_OUTPUT;
}

export interface PageApiCodeResult<T> {
  records: T[];
  total: number;
}
