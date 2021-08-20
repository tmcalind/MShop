import {
    createSlice
  } from '@reduxjs/toolkit';
  
  export const userSlice = createSlice({
    name: 'user',
    initialState: {
      auth: null,
      roles: null
    },
    reducers: {
      setAuth: (state, action) => {
        state.auth = action.payload;
      },
      setRoles: (state, action) => {
        state.roles = action.payload;
      },
    },
  });
  
  export const {
    setAuth,
    setRoles
  } = userSlice.actions;
  
  export default userSlice.reducer;