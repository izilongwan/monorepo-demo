import { useRef, useState } from 'react';

export function useStorage<T>(
	key: string,
	defaultValue?: T,
	type = StorageType.LOCAL,
	expire: number = 0
) {
	const storage =
		type === StorageType.SESSION ? window.sessionStorage : window.localStorage;
	const storedValue = storage.getItem(key);
	const storedObj = storedValue ? JSON.parse(storedValue) : null;
	let initialValue = storedObj?.value ?? defaultValue;
	const isExpired = useRef(
		storedObj && storedObj.expire > 0 && storedObj.expire < Date.now()
	);

	if (isExpired.current) {
		storage.removeItem(key);
		initialValue = defaultValue;
	}

	const [value, setValue] = useState<T>(initialValue);

	const setStoredValue = (newValue: T) => {
		setValue(newValue);
		storage.setItem(
			key,
			JSON.stringify({
				value: newValue,
				expire: expire > 0 ? Date.now() + expire : 0
			})
		);
	};

	return [value, setStoredValue] as const;
}

export enum StorageType {
	LOCAL = 'local',
	SESSION = 'session'
}

export const useLocalStorage = <T>(
	key: string,
	defaultValue?: T,
	expire: number = 0
) => useStorage<T>(key, defaultValue, StorageType.LOCAL, expire);

export const useSessionStorage = <T>(
	key: string,
	defaultValue?: T,
	expire: number = 0
) => useStorage<T>(key, defaultValue, StorageType.SESSION, expire);

export enum TimeUnits {
	SECOND = 1000,
	MINUTE = 1000 * 60,
	HOUR = 1000 * 60 * 60,
	DAY = 1000 * 60 * 60 * 24
}
