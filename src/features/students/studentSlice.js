import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { editStudent, listStudents, resetStudentPassword } from "../../features/students/studentApi";
import { addStudent } from '../../features/students/studentApi'
import { deleteStudent } from "../../features/students/studentApi";
import { fetchStudentTestProgress } from "../../features/students/studentApi"


export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async ({ page, limit, searchQuery, filterStatus }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await listStudents(token, page, limit, searchQuery, filterStatus);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


//for fetching student progress
export const fetchStudentProgress = createAsyncThunk(
  "students/fetchStudentProgress",
  async (studentId, { rejectWithValue }) => {
    try {
      // ✅ get token from sessionStorage
      const token = sessionStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      // call API
      const response = await fetchStudentTestProgress(studentId);

      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch student progress");
    }
  }
);


export const createStudent = createAsyncThunk(
  "students/createStudent",
  async (studentData, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const data = await addStudent(studentData, token);
      console.log("student data ::", studentData);
      console.log("Received data from API:", data);
      if (!data || data.success === false) {
        // Backend failed to save
        return rejectWithValue(data?.message || "Failed to create student");
      }

      return data.student || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeStudent = createAsyncThunk(
  "students/removeStudent",
  async (studentId, { rejectWithValue }) => {


    try {
      const token = sessionStorage.getItem("accessToken");
      const data = await deleteStudent(studentId, token);
      if (!data || data.result === false) { // ✅ match backend field
        return rejectWithValue(data?.message || "Failed to delete student");
      }

      return studentId; // this will be used to remove from state
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



export const updateStudent = createAsyncThunk(
  "students/updateStudent",
  async (studentData, { rejectWithValue }) => {

    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) return rejectWithValue("No access token found");
      const data = await editStudent(studentData, token);
      if (!data || data.success === false || data.result === false) {
        return rejectWithValue(data?.message || "Failed to update student");
      }

      return data.student || data; // make sure your reducer can use this
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//reset password
export const resetPassword = createAsyncThunk(
  "students/resetPassword",
  async ({ email, newPassword }, { rejectWithValue }) => {
    console.log("Inside student pass");
    console.log(email);

    try {
      const data = await resetStudentPassword(email, newPassword);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const studentSlice = createSlice({
  name: "students",
  initialState: {
    tests: [],
    list: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    total: 0,

    resetLoading: false,
    resetSuccess: false,
    resetError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || [];   // or .list depending on API
        state.totalPages = action.payload.pagination.totalPages;
        state.currentPage = action.payload.pagination.page;
        state.total = action.payload.pagination.total;
      })

      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //for fetching student progress
      .addCase(fetchStudentProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload; // now payload is the array from data
      })
      .addCase(fetchStudentProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeStudent.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (student) => student.id !== action.payload
        );
      })


      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        if (updated) {
          const index = state.list.findIndex((s) => s.id === updated.id);
          if (index !== -1) {
            state.list[index] = { ...state.list[index], ...updated };
          }
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      //reset password
      .addCase(resetPassword.pending, (state) => {
        state.resetLoading = true;
        state.resetSuccess = false;
        state.resetError = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetLoading = false;
        state.resetSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetLoading = false;
        state.resetError = action.payload;
      })
  },
});

export default studentSlice.reducer;
