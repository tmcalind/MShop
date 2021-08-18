import { configureStore } from '@reduxjs/toolkit';
import featureReducer from '../slices/featureSlice' 

export const store = configureStore({
  reducer: {
    feature: featureReducer,
  },
});
