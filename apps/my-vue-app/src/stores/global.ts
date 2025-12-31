import { QiankunProps } from 'vite-plugin-qiankun/dist/helper';
import { reactive } from 'vue';

type GlobalState = Record<string, any>;

export interface GlobalStateProps extends QiankunProps {
	base?: string;
	setGlobalState: (newState: Partial<GlobalState>) => void;
	onGlobalStateChange: (
		callback: (state: GlobalState, prevState: GlobalState) => void,
		immediate: boolean
	) => void;
	offGlobalStateChange: () => boolean;
}

export const globalState = reactive<Record<string, any>>({});

const globalProps = {} as GlobalStateProps;

export const initGlobalState = (props: GlobalStateProps) => {
	Object.assign(globalProps, props);

	globalProps.onGlobalStateChange?.((state, prevState) => {
		console.log('Global state changed:', state);
		Object.assign(globalState, state);
	}, true);
};

export const updateGlobalState = (
	newState: Partial<typeof globalState>,
	isCover = false
) => {
	const state = isCover ? { ...newState } : { ...globalState, ...newState };
	globalProps.setGlobalState?.(state);
};
