import {
    createSlice
  } from '@reduxjs/toolkit';
  
  export const featureSlice = createSlice({
    name: 'feature',
    initialState: {
      objectId: null,
      objectIdSelected: null,
      objectIdList: [],
      objectIdListSelected: []
    },
    reducers: {
      setObjectId: (state, action) => {
        state.objectId = action.payload;
      },
      setObjectIdSelected: (state, action) => {
        state.objectIdSelected = action.payload;
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
    setObjectIdSelected,
    setObjectIdList,
    setObjectIdListSelected
  } = featureSlice.actions;
  
  export default featureSlice.reducer;