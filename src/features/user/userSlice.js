// src/features/user/userSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser } from './userAPI';

export const login = createAsyncThunk('user/login', async (credentials, thunkAPI) => {
  try {
    const data = await loginUser(credentials);
    return data; // data = { user: { ... }, token: ... }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    token: null,
    role: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    hydrateUser: (state) => {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      console.log('user', user, token)
      if (user && token) {
        state.user = user;
        state.token = token;
        state.role = user.role;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user?.role || null; // <- ✅ fixed role assignment
        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },


});

export const { logout, hydrateUser, } = userSlice.actions;
export default userSlice.reducer;
