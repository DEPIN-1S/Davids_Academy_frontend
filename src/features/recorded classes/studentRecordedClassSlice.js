import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://lunarsenterprises.com:8002/davidsacademy';
const STUDENT_API_URL = `${API_BASE_URL}/student/recodings/list`;
// const token = sessionStorage.getItem('accessToken');

export const fetchStudentRecordedClasses = createAsyncThunk(
  "studentRecordings/fetchStudentRecordedClasses",
  async ({ token, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
     
      
      // Only send page and limit (no courseId, subjectId, searchQuery)
      const response = await axios.post(STUDENT_API_URL, { 
        page: page.toString(),  // API expects string
        limit: limit.toString() // API expects string
      }, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

     
      
      // Check if API returned success
      if (response.data.result === true) {
      
        return response.data;
      } else {
        throw new Error(response.data.message || 'API returned result: false');
      }
      
    } catch (error) {
      console.error('❌ API Error:', error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Failed to fetch recorded classes";
      
      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

const studentRecordingSlice = createSlice({
  name: "studentRecordings",
  initialState: {
    list: [],
    loading: false,
    error: null,
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: (state) => {
      state.list = [];
      state.loading = false;
      state.error = null;
      state.page = 1;
      state.totalPages = 1;
      state.totalItems = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentRecordedClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentRecordedClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        
        
        
        // Extract data array from API response
        const recordings = action.payload?.data || [];
       
        
        state.list = recordings;
        
        // Handle pagination from API response
        const pagination = action.payload?.pagination || {};
        state.page = parseInt(pagination.page) || 1;
        state.limit = parseInt(pagination.limit) || 10;
        state.totalPages = parseInt(pagination.totalPages) || 1;
        state.totalItems = parseInt(pagination.total) || recordings.length;
        
        
      })
      .addCase(fetchStudentRecordedClasses.rejected, (state, action) => {
        state.loading = false;
        state.list = [];
        state.error = action.payload?.message || "Failed to fetch recorded classes";
        
        console.error('💥 Redux error:', state.error);
      });
  },
});

export const { clearError, resetState } = studentRecordingSlice.actions;
export default studentRecordingSlice.reducer;
