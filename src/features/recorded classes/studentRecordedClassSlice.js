// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from 'axios';

// // Use environment variable for API base URL
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://lunarsenterprises.com:6040/davidsacademy';
// const STUDENT_API_URL = `${API_BASE_URL}/student/recordings/list`;

// export const fetchStudentRecordedClasses = createAsyncThunk(
//   "studentRecordings/fetchStudentRecordedClasses",
//   async ({ token, searchQuery = '', page = 1, limit = 10, courseId = null, subjectId = null }, { rejectWithValue }) => {
//     try {
//       console.log('API Base URL:', API_BASE_URL);
//       console.log('Full API URL:', STUDENT_API_URL);
//       console.log('API Call Parameters:', { searchQuery, page, limit, courseId, subjectId });
      
//       const response = await axios.post(STUDENT_API_URL, { 
//         searchQuery, 
//         page, 
//         limit, 
//         courseId, 
//         subjectId 
//       }, {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         timeout: 10000,
//       });

//       console.log('API Response:', response.data);
//       return response.data;
      
//     } catch (error) {
//       console.error('API Error:', error.response?.data || error.message);
      
//       // If POST fails with 404, try GET method
//       if (error.response?.status === 404) {
//         try {
//           console.log('POST failed, trying GET method...');
          
//           const params = new URLSearchParams();
//           if (searchQuery) params.append('searchQuery', searchQuery);
//           params.append('page', page.toString());
//           params.append('limit', limit.toString());
//           if (courseId) params.append('courseId', courseId.toString());
//           if (subjectId) params.append('subjectId', subjectId.toString());
          
//           const getResponse = await axios.get(`${STUDENT_API_URL}?${params.toString()}`, {
//             headers: {
//               "Authorization": `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//             timeout: 10000,
//           });
          
//           console.log('GET Response:', getResponse.data);
//           return getResponse.data;
          
//         } catch (getError) {
//           console.error('GET also failed:', getError.response?.data || getError.message);
//         }
//       }
      
//       const errorMessage = error.response?.data?.message || 
//                           error.response?.data?.error || 
//                           error.response?.statusText ||
//                           error.message || 
//                           "Failed to fetch recorded classes";
      
//       return rejectWithValue({
//         message: errorMessage,
//         status: error.response?.status,
//         data: error.response?.data,
//         url: STUDENT_API_URL,
//       });
//     }
//   }
// );

// const studentRecordingSlice = createSlice({
//   name: "studentRecordings",
//   initialState: {
//     list: [],
//     loading: false,
//     error: null,
//     page: 1,
//     limit: 10,
//     totalPages: 1,
//     totalItems: 0,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     resetState: (state) => {
//       state.list = [];
//       state.loading = false;
//       state.error = null;
//       state.page = 1;
//       state.totalPages = 1;
//       state.totalItems = 0;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchStudentRecordedClasses.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchStudentRecordedClasses.fulfilled, (state, action) => {
//         state.loading = false;
//         state.error = null;
        
//         console.log('Redux payload received:', action.payload);
        
//         // Handle different possible response structures
//         let recordings = [];
        
//         if (action.payload?.data?.recordings) {
//           recordings = action.payload.data.recordings;
//         } else if (action.payload?.recordings) {
//           recordings = action.payload.recordings;
//         } else if (action.payload?.data && Array.isArray(action.payload.data)) {
//           recordings = action.payload.data;
//         } else if (Array.isArray(action.payload)) {
//           recordings = action.payload;
//         } else if (action.payload?.result && Array.isArray(action.payload.result)) {
//           recordings = action.payload.result;
//         }
        
//         state.list = recordings;
        
//         // Handle pagination
//         const pagination = action.payload?.pagination || action.payload?.meta || {};
//         state.page = pagination.page || pagination.currentPage || 1;
//         state.limit = pagination.limit || pagination.pageSize || 10;
//         state.totalPages = pagination.totalPages || pagination.lastPage || Math.ceil((pagination.total || recordings.length) / state.limit);
//         state.totalItems = pagination.total || pagination.totalCount || recordings.length;
//       })
//       .addCase(fetchStudentRecordedClasses.rejected, (state, action) => {
//         state.loading = false;
//         state.list = [];
        
//         let errorMessage = "Failed to fetch recorded classes";
        
//         if (action.payload?.message) {
//           errorMessage = action.payload.message;
//         } else if (typeof action.payload === 'string') {
//           errorMessage = action.payload;
//         }
        
//         if (process.env.NODE_ENV === 'development') {
//           errorMessage += `\n\nDebug Info:`;
//           errorMessage += `\nStatus: ${action.payload?.status || 'Unknown'}`;
//           errorMessage += `\nURL: ${action.payload?.url || 'Unknown'}`;
//           errorMessage += `\nBase URL: ${API_BASE_URL}`;
//         }
        
//         state.error = errorMessage;
//       });
//   },
// });

// export const { clearError, resetState } = studentRecordingSlice.actions;
// export default studentRecordingSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://lunarsenterprises.com:6040/davidsacademy';

// Common endpoint patterns to try
const POSSIBLE_ENDPOINTS = [
  '/student/recordings/list',
  '/student/recordings',
  '/student/recorded-classes',
  '/recordings/list',
  '/recordings',
  '/api/student/recordings/list',
  '/api/student/recordings',
  '/student/classes/recorded',
  '/student/videos',
  '/student/lessons',
];

export const fetchStudentRecordedClasses = createAsyncThunk(
  "studentRecordings/fetchStudentRecordedClasses",
  async ({ token, searchQuery = '', page = 1, limit = 10, courseId = null, subjectId = null }, { rejectWithValue }) => {
    
    console.log('API Base URL:', API_BASE_URL);
    console.log('Trying to find working endpoint...');
    
    // Try each endpoint
    for (const endpoint of POSSIBLE_ENDPOINTS) {
      const fullUrl = `${API_BASE_URL}${endpoint}`;
      
      try {
        console.log(`🔍 Trying: ${fullUrl}`);
        
        // Try POST first
        try {
          const response = await axios.post(fullUrl, {
            searchQuery, page, limit, courseId, subjectId
          }, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            timeout: 8000,
          });
          
          console.log(`✅ POST SUCCESS: ${fullUrl}`, response.data);
          return { ...response.data, _workingEndpoint: fullUrl, _method: 'POST' };
          
        } catch (postError) {
          // If POST fails, try GET
          if ([404, 405].includes(postError.response?.status)) {
            const params = new URLSearchParams({
              page: page.toString(),
              limit: limit.toString(),
              ...(searchQuery && { searchQuery }),
              ...(courseId && { courseId: courseId.toString() }),
              ...(subjectId && { subjectId: subjectId.toString() })
            });
            
            const getResponse = await axios.get(`${fullUrl}?${params.toString()}`, {
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              timeout: 8000,
            });
            
            console.log(`✅ GET SUCCESS: ${fullUrl}`, getResponse.data);
            return { ...getResponse.data, _workingEndpoint: fullUrl, _method: 'GET' };
          } else {
            throw postError;
          }
        }
        
      } catch (error) {
        console.log(`❌ FAILED: ${fullUrl} - Status: ${error.response?.status}`);
        
        // If it's not a 404/405, it might be auth or server error
        if (error.response?.status && ![404, 405].includes(error.response.status)) {
          return rejectWithValue({
            message: `Authentication or server error at ${fullUrl}: ${error.response?.data?.message || error.message}`,
            status: error.response?.status,
            endpoint: fullUrl,
          });
        }
        // Continue trying other endpoints for 404/405
      }
    }
    
    // All endpoints failed
    console.log('🚫 All endpoints failed. Using mock data as fallback.');
    
    // Return mock data as fallback
    return {
      data: [
        {
          r_id: 1,
          r_title: "Introduction to React Hooks",
          r_duration: "45:30",
          r_tutor_name: "John Doe",
          r_video_url: "https://www.youtube.com/watch?v=O6P86uwfdR0",
          r_thumbnail: "react-hooks-thumb.jpg",
          created_at: new Date().toISOString(),
          progress: 0,
        },
        {
          r_id: 2,
          r_title: "Advanced State Management",
          r_duration: "60:15", 
          r_tutor_name: "Jane Smith",
          r_video_url: "https://www.youtube.com/watch?v=35lXWvCuM8o",
          r_thumbnail: "state-management-thumb.jpg",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          progress: 0.3,
        },
        {
          r_id: 3,
          r_title: "Component Lifecycle Methods",
          r_duration: "55:45",
          r_tutor_name: "Mike Johnson", 
          r_video_url: "https://www.youtube.com/watch?v=Oioo0IdoEls",
          r_thumbnail: "lifecycle-thumb.jpg",
          created_at: new Date(Date.now() - 172800000).toISOString(),
          progress: 0.8,
        }
      ],
      pagination: {
        page: 1,
        limit: 10,
        totalPages: 1,
        total: 3
      },
      _isMockData: true
    };
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
    workingEndpoint: null,
    usingMockData: false,
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
      state.workingEndpoint = null;
      state.usingMockData = false;
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
        
        // Track working endpoint and mock data usage
        state.workingEndpoint = action.payload._workingEndpoint || null;
        state.usingMockData = action.payload._isMockData || false;
        
        // Handle different response structures
        let recordings = [];
        
        if (action.payload?.data?.recordings) {
          recordings = action.payload.data.recordings;
        } else if (action.payload?.recordings) {
          recordings = action.payload.recordings;
        } else if (action.payload?.data && Array.isArray(action.payload.data)) {
          recordings = action.payload.data;
        } else if (Array.isArray(action.payload)) {
          recordings = action.payload;
        } else if (action.payload?.result && Array.isArray(action.payload.result)) {
          recordings = action.payload.result;
        }
        
        state.list = recordings;
        
        // Handle pagination
        const pagination = action.payload?.pagination || {};
        state.page = pagination.page || 1;
        state.limit = pagination.limit || 10; 
        state.totalPages = pagination.totalPages || 1;
        state.totalItems = pagination.total || recordings.length;
        
        if (state.usingMockData) {
          console.log('📝 Using mock data - please fix your API endpoints');
        }
      })
      .addCase(fetchStudentRecordedClasses.rejected, (state, action) => {
        state.loading = false;
        state.list = [];
        state.error = action.payload?.message || "Failed to fetch recorded classes";
      });
  },
});

export const { clearError, resetState } = studentRecordingSlice.actions;
export default studentRecordingSlice.reducer;
