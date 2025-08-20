import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { editStudent, listStudents } from "../../features/students/studentApi";
import { addStudent } from '../../features/students/studentApi'
import { deleteStudent } from "../../features/students/studentApi";



export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      console.log("Access toke in student list", token);

      const data = await listStudents(token);
      if (Array.isArray(data)) {
        return data;
      } else if (Array.isArray(data.list)) {
        return data.list;
      } else if (Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const createStudent = createAsyncThunk(
  "students/createStudent",
  async (studentData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
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
      const token = localStorage.getItem("accessToken");
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
      console.log("inside student edit slicee :::: ");
      
      const token = localStorage.getItem("accessToken");
      const data = await editStudent(studentData, token);

      if (!data || data.success === false || data.result === false) {
        return rejectWithValue(data?.message || "Failed to update student");
      }

      return data.student || data;
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
        state.list = action.payload;
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
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        // update the list with the edited student
        const updated = action.payload?.student;
        if (updated) {
          const index = state.list.findIndex(s => s.id === updated.id);
          if (index !== -1) {
            state.list[index] = updated;
          }
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });




  },
});

export default studentSlice.reducer;
