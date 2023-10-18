/* eslint-disable prettier/prettier */
// app/store.ts
import {configureStore} from '@reduxjs/toolkit';
import dataReducer from './dataSlice';

export const store = configureStore({
  reducer: {
    data: dataReducer,
  },
});
