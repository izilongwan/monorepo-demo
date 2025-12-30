import { initGlobalState } from 'qiankun';

export interface QiankunStore {
	user: any;
	app: any;
	info: any;
	count: number;
	now: string;
}

const qiankunStore = initGlobalState({
	user: null,
	app: null,
	info: null,
	count: 0,
	now: new Date().toLocaleString()
});

export const onGlobalStateChange = qiankunStore.onGlobalStateChange;
export const setGlobalState = qiankunStore.setGlobalState;
export const offGlobalStateChange = qiankunStore.offGlobalStateChange;

export default qiankunStore;
