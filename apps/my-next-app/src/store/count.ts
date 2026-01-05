import { createSlice } from '@reduxjs/toolkit';
import { init } from 'next/dist/compiled/webpack/webpack';

export const count = createSlice({
	name: 'count',
	initialState: { value: 0 },
	reducers: {
		init(state, action) {
			return action.payload;
		},
		increment: (state, action) => {
			state.value += action.payload;
		},
		decrement: (state, action) => {
			state.value -= action.payload;
		}
	}
});

export const { increment: countIncrement, decrement: countDecrement } =
	count.actions;

export const selectCountValue = (state: any) => state.count.value;

export default count.reducer;
