/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppState} from '../types';

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    indexWheel: null,
    indexEvent: null,
  } as AppState,
  reducers: {
    setIndexWheel: (state, action: PayloadAction<number>) => {
      state.indexWheel = action.payload;
    },
    setIndexEvent: (state, action: PayloadAction<number>) => {
      state.indexEvent = action.payload;
    },
  },
});

export const {setIndexWheel, setIndexEvent} = dataSlice.actions;
export default dataSlice.reducer;
