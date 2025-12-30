import { CommonObjectType } from '@/types/common';
import { create } from 'zustand';

export interface GlobalState {
	globalState?: CommonObjectType;
	updateGlobalState: (newState: CommonObjectType, isCover?: boolean) => void;
}

export interface GlobalProps extends CommonObjectType {
	base?: string;
	setGlobalState: (newState: Partial<GlobalState>) => void;
	onGlobalStateChange: (
		callback: (state: GlobalState, prevState: GlobalState) => void,
		immediate: boolean
	) => void;
	offGlobalStateChange: () => boolean;
}

export const useGlobalStore = create<GlobalState>((set, get) => ({
	globalState: {},
	updateGlobalState: (newState: CommonObjectType, isCover = false) => {
		globalProps.setGlobalState?.(
			isCover
				? newState
				: {
						...get().globalState,
						...newState
				  }
		);
	}
}));

const globalProps = {} as GlobalProps;

export const initGlobalState = (props: GlobalProps) => {
	Object.assign(globalProps, props);
	props.onGlobalStateChange?.((state, prevState) => {
		console.log('Global state changed:', state);
		useGlobalStore.setState({ globalState: state });
	}, true);
};
