import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { editStudent, listStudents } from "../../features/students/studentApi";
import { addStudent } from '../../features/students/studentApi'
import { deleteStudent } from "../../features/students/studentApi";



export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async ({ page, limit }, { rejectWithValue }) => {
    try {

      const token = sessionStorage.getItem("accessToken");
      const response = await listStudents(token, page, limit);
      return response; // { data: [...], pagination: {...}, result, message }

    } catch (error) {
      return rejectWithValue(error.message);
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


const studentSlice = createSlice({
  name: "students",
  initialState: {
    list: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    total: 0,
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
  },
});

export default studentSlice.reducer;
