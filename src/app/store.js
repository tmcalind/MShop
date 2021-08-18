import { configureStore } from '@reduxjs/toolkit';
import featureReducer from '../slices/featureSlice' 
import mapviewReducer from '../slices/mapviewSlice'

export const store = configureStore({
  reducer: {
    feature: featureReducer,
    mapview: mapviewReducer,
  },
});
