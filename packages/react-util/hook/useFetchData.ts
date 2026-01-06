import { useCallback, useEffect, useRef, useState } from 'react';

interface UseFetchDataState<T> {
	data: T | undefined;
	error: Error | null;
	isLoading: boolean;
	refetch: () => Promise<T | undefined>;
	setData: React.Dispatch<React.SetStateAction<T | undefined>>;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useFetchData = <T = any>(
	fetcher: () => Promise<T>,
	immediate = true
): UseFetchDataState<T> => {
	const [data, setData] = useState<T | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	const refetch = useCallback(async () => {
		// ✅ 取消之前的请求
		abortControllerRef.current?.abort();
		abortControllerRef.current = new AbortController();

		setLoading(true);
		setError(null);

		try {
			const result = await fetcher();
			setData(result);
			return result;
		} catch (err) {
			// ✅ 忽略被取消的请求
			if (err instanceof Error && err.name === 'AbortError') {
				return undefined;
			}
			const error = err instanceof Error ? err : new Error(String(err));
			setError(error);
			return undefined;
		} finally {
			setLoading(false);
		}
	}, [fetcher]);

	useEffect(() => {
		if (!immediate) return;
		refetch();

		// ✅ 组件卸载时取消请求
		return () => {
			abortControllerRef.current?.abort();
		};
	}, [immediate]);

	return { data, isLoading: loading, error, refetch, setData, setLoading };
};
