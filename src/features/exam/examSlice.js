// src/features/exam/examSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    postQuestion,
    fetchQuestionTypes,
    fetchMockTestQuestion as fetchMockTestQuestionAPI, postTest, fetchQBankQuestions, fetchQBankQuestionData
} from "./examAPI";
import { fetchTestQuestionsAPI } from "../../features/exam/examAPI";

// Async thunk for posting any question type
export const submitQuestion = createAsyncThunk(
    "questions/submitQuestion",
    async (payload, { rejectWithValue }) => {
        console.log("data response in thunk ::::",payload);
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
            const data = await fetchMockTestQuestionAPI();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);



// for listing test questions
export const getTestQuestions = createAsyncThunk(
    "exam/fetchTestQuestions",
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchTestQuestionsAPI(); // API call
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
// Async thunk for creating a new test
export const getQBankQuestions = createAsyncThunk(
    "questions/fetchQBankQuestions",
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchQBankQuestions(); // returns array
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
// Async Thunk for question bank data
export const getQBankQuestionData = createAsyncThunk(
    "questions/fetchQBankQuestionData",
    async (questionId, { rejectWithValue }) => {
        try {
            const data = await fetchQBankQuestionData(questionId); // returns single question object
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
        mockTestQuestionError: null,


        testQuestions: [],
        testQuestionsLoading: false,
        testQuestionsError: null,

        qBankQuestion: [],
        qBankQuestionLoading: false,
        qBankQuestionError: null,

        qBankQuestionData: null,
        qBankQuestionDataLoading: false,
        qBankQuestionDataError: null,

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
            // qBankQuestion fetch
            .addCase(getQBankQuestions.pending, (state) => {
                state.qBankQuestionLoading = true;
                state.qBankQuestionError = null;
                state.qBankQuestion = [];
            })
            .addCase(getQBankQuestions.fulfilled, (state, action) => {
                state.qBankQuestionLoading = false;
                state.qBankQuestion = Array.isArray(action.payload)
                    ? action.payload
                    : [];
            })
            .addCase(getQBankQuestions.rejected, (state, action) => {
                state.qBankQuestionLoading = false;
                state.qBankQuestionError = action.payload;
                state.qBankQuestion = [];
            })
            // get QBank data 
            .addCase(getQBankQuestionData.pending, (state) => {
                state.qBankQuestionDataLoading = true;
                state.qBankQuestionDataError = null;
                state.qBankQuestionData = null;
            })
            .addCase(getQBankQuestionData.fulfilled, (state, action) => {
                state.qBankQuestionDataLoading = false;
                state.qBankQuestionData = action.payload;
            })
            .addCase(getQBankQuestionData.rejected, (state, action) => {
                state.qBankQuestionDataLoading = false;
                state.qBankQuestionDataError = action.payload;
                state.qBankQuestionData = null;
            });
/* 

            //for listing test questions
            .addCase(getTestQuestions.pending, (state) => {
                state.testQuestionsLoading = true;
                state.testQuestionsError = null;
                state.testQuestions = [];
            })
            .addCase(getTestQuestions.fulfilled, (state, action) => {
                state.testQuestionsLoading = false;
                state.testQuestions = Array.isArray(action.payload)
                    ? action.payload
                    : [];
            })
            .addCase(getTestQuestions.rejected, (state, action) => {
                state.testQuestionsLoading = false;
                state.testQuestionsError = action.payload;
                state.testQuestions = [];
            }); */

    }
});

export const { resetStatus } = questionSlice.actions;
export default questionSlice.reducer;
