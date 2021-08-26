import {
    createSlice
  } from '@reduxjs/toolkit';
  
  export const featureSlice = createSlice({
    name: 'feature',
    initialState: {
      objectId: null,
      objectIdList: [],
      objectIdListSelected: []
    },
    reducers: {
      setObjectId: (state, action) => {
        state.objectId = action.payload;
      },
      setObjectIdList: (state, action) => {
        state.objectIdList = action.payload;
        state.objectIdListSelected = [];
      },
      setObjectIdListSelected: (state, action) => {
        state.objectIdListSelected = action.payload;
      }
    },
  });
  
  export const {
    setObjectId,
    setObjectIdList,
    setObjectIdListSelected
  } = featureSlice.actions;
  
  export default featureSlice.reducer;