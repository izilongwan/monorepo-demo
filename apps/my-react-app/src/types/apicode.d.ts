import { CommonObjectType, CreateUpdateTime, Loadings } from './common';
import { API_CODE_OUTPUT } from './apicode';

export interface ApiCode extends Loadings, CreateUpdateTime {
  apiCode: string;
  output: string;
  deleted: number;
  apiSql: string;
  apiType: string;
  id: number;
  state: number;
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
