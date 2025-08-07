// src/features/courses/courseSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    addCourse,
    listCourses,
    updateCourse,
    deleteCourse,
    listCoursesByCsId
} from "./courseAPI";

// Async thunks
export const fetchCourses = createAsyncThunk(
    "courses/fetchCourses",
    async (_, { rejectWithValue }) => {
        try {
            const data = await listCourses();
            // If backend returns { list: [...] }
            return data.list || data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCoursesByCsId = createAsyncThunk(
    "courses/fetchCoursesByCsId",
    async (cs_id, { rejectWithValue }) => {
        try {
            const data = await listCoursesByCsId(cs_id);
            return data.list || data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createCourse = createAsyncThunk(
    "courses/createCourse",
    async (formData, { rejectWithValue }) => {
        try {
            const data = await addCourse(formData);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const editCourse = createAsyncThunk(
    "courses/editCourse",
    async (formData, { rejectWithValue }) => {
        try {
            const data = await updateCourse(formData);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeCourse = createAsyncThunk(
    "courses/removeCourse",
    async (id, { rejectWithValue }) => {
        try {
            const data = await deleteCourse(id);
            return { ...data, id }; // In case backend does not echo back the deleted id
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const courseSlice = createSlice({
    name: "courses",
    initialState: {
        list: [],
        loading: false,
        success: false,
        error: null,

        createLoading: false,
        createSuccess: false,
        createError: null,

        editLoading: false,
        editSuccess: false,
        editError: null,

        deleteLoading: false,
        deleteSuccess: false,
        deleteError: null,
    },
    reducers: {
        resetCourseStatus: (state) => {
            state.success = false;
            state.error = null;
            state.createSuccess = false;
            state.createError = null;
            state.editSuccess = false;
            state.editError = null;
            state.deleteSuccess = false;
            state.deleteError = null;
        }
    },
    extraReducers: (builder) => {
        // FETCH (ALL)
        builder
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // FETCH by cs_id
            .addCase(fetchCoursesByCsId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCoursesByCsId.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchCoursesByCsId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // CREATE
            .addCase(createCourse.pending, (state) => {
                state.createLoading = true;
                state.createError = null;
                state.createSuccess = false;
            })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.createLoading = false;
                state.createSuccess = true;
            })
            .addCase(createCourse.rejected, (state, action) => {
                state.createLoading = false;
                state.createError = action.payload;
            })

            // EDIT
            .addCase(editCourse.pending, (state) => {
                state.editLoading = true;
                state.editError = null;
                state.editSuccess = false;
            })
            .addCase(editCourse.fulfilled, (state, action) => {
                state.editLoading = false;
                state.editSuccess = true;
            })
            .addCase(editCourse.rejected, (state, action) => {
                state.editLoading = false;
                state.editError = action.payload;
            })

            // REMOVE/DELETE
            .addCase(removeCourse.pending, (state) => {
                state.deleteLoading = true;
                state.deleteError = null;
                state.deleteSuccess = false;
            })
            .addCase(removeCourse.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.deleteSuccess = true;
                // Optimistic update: remove from list if id present
                if (action.payload?.id) {
                    state.list = state.list.filter(c => String(c.id) !== String(action.payload.id));
                }
            })
            .addCase(removeCourse.rejected, (state, action) => {
                state.deleteLoading = false;
                state.deleteError = action.payload;
            })

    }
});

export const { resetCourseStatus } = courseSlice.actions;
export default courseSlice.reducer;
