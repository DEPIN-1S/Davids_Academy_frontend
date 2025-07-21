import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import examReducer from '../features/exam/examSlice'
export const store = configureStore({
  reducer: {
    user: userReducer,
    exam: examReducer
  },
});
