import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, createUserAPI, verifyOtpAPI, forgotPasswordAPI } from './userAPI';

// LOGIN
export const login = createAsyncThunk('user/login', async (credentials, thunkAPI) => {
  try {
    const data = await loginUser(credentials); // { user, token }
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// CREATE USER
export const createUser = createAsyncThunk('user/createUser', async (userData, thunkAPI) => {
  try {
    const response = await createUserAPI(userData); // { user, token }
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});
// verify otp  
export const verifyOtp = createAsyncThunk('user/verifyOtp', async (payload, thunkAPI) => {
  try {
    const response = await verifyOtpAPI(payload); // expected: { user, token }
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});
// forgot password
export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (emailPayload, thunkAPI) => {
    try {
      const response = await forgotPasswordAPI(emailPayload);
      return response; // usually { message: 'OTP sent to email' }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
// INITIAL STATE
const initialState = {
  user: null,
  token: null,
  role: null,
  loading: false,
  error: null,
};

// SLICE
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    hydrateUser: (state) => {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (userStr && userStr !== 'undefined' && token) {
        try {
          const user = JSON.parse(userStr);
          state.user = user;
          state.token = token;
          state.role = user.role || null;
        } catch (err) {
          state.user = null;
          state.token = null;
          state.role = null;
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user?.role || null;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE USER
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user?.role || null;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user?.role || null;

        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        // You can save a flag or just show a toast in component
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export const { logout, hydrateUser } = userSlice.actions;
export default userSlice.reducer;
