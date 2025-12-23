import { HomeCommonAmount } from '@/types/home';
import { getCommonList } from './apicode';

export function getHomeCommonAmount() {
	return getCommonList<HomeCommonAmount>({
		apiCode: 'GET_HOME_COMMON_AMOUNT'
	});
}
