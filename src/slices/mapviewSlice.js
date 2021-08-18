import {
    createSlice
  } from '@reduxjs/toolkit';
  
  export const mapviewSlice = createSlice({
    name: 'mapview',
    initialState: {
      centerscale: null,
      extent: null,
    },
    reducers: {
      setCenterscale: (state, action) => {
        state.centerscale = action.payload;
      },
      setExtent: (state, action) => {
        state.extent = action.payload;
      }
    },
  });
  
  export const {
    setCenterscale,
    setExtent
  } = mapviewSlice.actions;
  
  export default mapviewSlice.reducer;