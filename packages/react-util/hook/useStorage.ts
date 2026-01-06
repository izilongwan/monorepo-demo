import { useState } from 'react';

export function useStorage<T>(
	key: string,
	defaultValue?: T,
	type = StorageType.LOCAL
) {
	const storage =
		type === StorageType.SESSION ? window.sessionStorage : window.localStorage;
	const storedValue = storage.getItem(key);
	const initialValue = storedValue ? JSON.parse(storedValue) : defaultValue;

	const [value, setValue] = useState<T>(initialValue);

	const setStoredValue = (newValue: T) => {
		setValue(newValue);
		storage.setItem(key, JSON.stringify(newValue));
	};

	return [value, setStoredValue] as const;
}

export enum StorageType {
	LOCAL = 'local',
	SESSION = 'session'
}

export const useLocalStorage = <T>(key: string, defaultValue?: T) =>
	useStorage<T>(key, defaultValue, StorageType.LOCAL);

export const useSessionStorage = <T>(key: string, defaultValue?: T) =>
	useStorage<T>(key, defaultValue, StorageType.SESSION);
