import { MainApi, MainTrend } from '@/types/main.d';
import { getCommonList } from './apicode';

export const getMainTrend = () =>
	getCommonList<MainTrend>({ apiCode: 'GET_MAIN_TREND' });

export const getMainApiTrend = async () =>
	getCommonList<MainApi>({ apiCode: 'GET_MAIN_API_TREND' }).promise;
