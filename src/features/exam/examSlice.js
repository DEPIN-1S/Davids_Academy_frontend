// src/features/questions/questionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    postQuestion,
    fetchQuestionTypes,
    fetchMockTestQuestion as fetchMockTestQuestionAPI, postTest
} from "./examAPI";

// Async thunk for posting any question type
export const submitQuestion = createAsyncThunk(
    "questions/submitQuestion",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await postQuestion(payload);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk for listing question types
export const listQuestionTypes = createAsyncThunk(
    "questions/listQuestionTypes",
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchQuestionTypes();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk for listing mock test questions
export const getMockTestQuestions = createAsyncThunk(
    "questions/fetchMockTestQuestion",
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchMockTestQuestionAPI(); // returns array
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
// Async thunk for creating a new test
export const submitTest = createAsyncThunk(
    "exam/createTest",
    async (testData, { rejectWithValue }) => {
        try {
            const data = await postTest(testData);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const questionSlice = createSlice({
    name: "questions",
    initialState: {
        loading: false,
        success: false,
        error: null,

        questionTypes: [],
        questionTypesLoading: false,
        questionTypesError: null,

        mockTestQuestion: [],
        mockTestQuestionLoading: false,
        mockTestQuestionError: null
    },
    reducers: {
        resetStatus: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // submitQuestion
            .addCase(submitQuestion.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(submitQuestion.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(submitQuestion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // listQuestionTypes
            .addCase(listQuestionTypes.pending, (state) => {
                state.questionTypesLoading = true;
                state.questionTypesError = null;
            })
            .addCase(listQuestionTypes.fulfilled, (state, action) => {
                state.questionTypesLoading = false;
                state.questionTypes = action.payload;
            })
            .addCase(listQuestionTypes.rejected, (state, action) => {
                state.questionTypesLoading = false;
                state.questionTypesError = action.payload;
            })

            // list mock test questions
            .addCase(getMockTestQuestions.pending, (state) => {
                state.mockTestQuestionLoading = true;
                state.mockTestQuestionError = null;
                state.mockTestQuestion = []; // clear old data
            })
            .addCase(getMockTestQuestions.fulfilled, (state, action) => {
                state.mockTestQuestionLoading = false;
                state.mockTestQuestion = Array.isArray(action.payload)
                    ? action.payload
                    : [];
            })
            .addCase(getMockTestQuestions.rejected, (state, action) => {
                state.mockTestQuestionLoading = false;
                state.mockTestQuestionError = action.payload;
                state.mockTestQuestion = [];
            }) // submitTest
            .addCase(submitTest.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(submitTest.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(submitTest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


    }
});

export const { resetStatus } = questionSlice.actions;
export default questionSlice.reducer;
