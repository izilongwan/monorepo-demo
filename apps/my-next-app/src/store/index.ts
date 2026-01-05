import { configureStore } from '@reduxjs/toolkit';
import someReducer from './some';
import countReducer from './count';

const SESSION_STORAGE_KEY = '__reduxState:my-next-app';

export function initialState() {
	if (typeof window === 'undefined') return undefined;

	try {
		const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
		if (saved) {
			const storeData = JSON.parse(saved);
			Object.entries(storeData).forEach(([key, value]) => {
				store.dispatch({ type: `${key}/init`, payload: value });
			});
		}
	} catch (e) {
		console.error('Failed to restore state:', e);
	}
	return undefined;
}

export const store = configureStore({
	reducer: {
		some: someReducer,
		count: countReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 保存状态
if (typeof window !== 'undefined') {
	store.subscribe(() => {
		try {
			const state = store.getState();
			sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
		} catch (e) {
			console.error('Failed to save state:', e);
		}
	});
}
