import { onMounted, reactive, toRefs } from 'vue';

export interface FetchState {
	data: any;
	isLoading: boolean;
	error: Error | null | unknown;
	refetch: () => Promise<void>;
}

export const useFetchData = (fetcher: () => Promise<any>, immediate = true) => {
	// Simulate fetching data
	const state = reactive<FetchState>({
		data: null,
		isLoading: false,
		error: null,
		refetch: async () => {}
	});
	let abortController = new AbortController();

	const refetch = async () => {
		try {
			abortController.abort?.();
			abortController = new AbortController();
			state.isLoading = true;
			state.data = await fetcher();
		} catch (error) {
			state.error = error;
			state.data = null;
		} finally {
			state.isLoading = false;
		}
	};

	onMounted(() => {
		if (immediate) {
			refetch();
		}
	});

	return toRefs(state);
};
