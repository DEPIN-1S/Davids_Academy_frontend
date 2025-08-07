import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import examReducer from '../features/exam/examSlice'
import courseReducer from '../features/courses/courseSlice';
import contactReducer from '../features/contact/contactSlice'
export const store = configureStore({
  reducer: {
    user: userReducer,
    exam: examReducer,
    course: courseReducer,
    contact: contactReducer
  },
});
