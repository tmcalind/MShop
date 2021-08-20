import { configureStore } from '@reduxjs/toolkit'
import featureReducer from '../slices/featureSlice' 
import mapviewReducer from '../slices/mapviewSlice'
import userReducer from '../slices/userSlice'

export const store = configureStore({
  reducer: {
    feature: featureReducer,
    mapview: mapviewReducer,
    user: userReducer,
  },
});
