import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';

const some = createSlice({
	name: 'some',
	initialState: { value: 0 },
	reducers: {
		init(state, action) {
			return action.payload;
		},
		increment: (state) => {
			state.value += 1;
		},
		decrement: (state) => {
			state.value -= 1;
		}
	}
});

export const { increment, decrement } = some.actions;

export const selectSomeValue = (state: RootState) => state.some.value;

export default some.reducer;
