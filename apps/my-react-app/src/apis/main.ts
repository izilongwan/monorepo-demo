import { MainTrend } from '@/types/main';
import { getCommonList } from './apicode';

export const getMainTrend = () =>
	getCommonList<MainTrend>({ apiCode: 'GET_MAIN_TREND' });
