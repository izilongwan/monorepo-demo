import { reactive, toRefs } from 'vue';

export const useFetchData = () => {
	// Simulate fetching data
	const data = reactive({
		data: null,
		isLoading: false,
		error: null
	});
	return toRefs(data);
};
