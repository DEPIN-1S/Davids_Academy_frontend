// src/features/exam/examSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    postQuestion,
    fetchQuestionTypes,
    fetchMockTestQuestion as fetchMockTestQuestionAPI, fetchQBankQuestions, fetchQBankQuestionData
} from "./examAPI";
import { adminGetQBankQuestions, adminGetMockTestQuestions, adminGetTestQuestions } from "./examAPI";
import { fetchTestQuestionsAPI } from "../../features/exam/examAPI";
import { adminDeleteQuestion } from "../../features/exam/examAPI";
import { fetchMockTestQuestionsByCourseId } from "../../features/exam/examAPI"
import { adminCreateTest } from "../../features/exam/examAPI";



// Thunk for deleting a Q-Bank & mock test questions
export const adminDeleteQBankQuestion = createAsyncThunk(
    "admin/deleteQBankQuestion",
    async (id, { rejectWithValue }) => {
        try {
            const result = await adminDeleteQuestion(id);
            return result; // { success: true, id }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);



// Thunk to fetch mock test questions by courseId
export const adminFetchMockTestQuestionsByCourseId = createAsyncThunk(
    "exam/fetchMockTestQuestionsByCourseId",
    async (courseId, { rejectWithValue }) => {
        try {
            return await fetchMockTestQuestionsByCourseId(courseId);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


// Thunk for creating test by admin
export const adminCreateTestThunk = createAsyncThunk(
    "exam/adminCreateTest",
    async (testData, { rejectWithValue }) => {
        try {
            const data = await adminCreateTest(testData); // 👈 API function call
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);



// Thunk for admin fetching Q-Bank questions
export const adminFetchQBankQuestions = createAsyncThunk(
    "admin/fetchQBankQuestions",
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const data = await adminGetQBankQuestions(page, limit);
            // Return everything, not just list (so reducer knows totalPages, count, etc.)
            return {
                list: data.list || [],
                page: data.page,
                totalPages: data.totalPages,
                totalCount: data.totalCount,
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);



// Thunk for admin fetching Mock Test questions
export const adminFetchMockTestQuestions = createAsyncThunk(
    "admin/fetchMockTestQuestions",
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const data = await adminGetMockTestQuestions(page, limit);
            return {
                list: data.list || [],
                page: data.page,
                totalPages: data.totalPages,
                totalCount: data.totalCount,
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


// Thunk for fetching admin test questions
export const adminFetchTestQuestions = createAsyncThunk(
    "admin/fetchTestQuestions",
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const data = await adminGetTestQuestions(page, limit);
            return {
                list: data.list || [],
                page: data.page,
                totalPages: data.totalPages,
                totalCount: data.totalCount,
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);



// Async thunk for posting any question type
export const submitQuestion = createAsyncThunk(
    "questions/submitQuestion",
    async (payload, { rejectWithValue }) => {
        console.log("data response in thunk ::::", payload);
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

        // For QBank
        adminQBankQuestions: [],
        adminQBankQuestionsLoading: false,
        adminQBankQuestionsError: null,
        adminQBankCurrentPage: 1,
        adminQBankTotalPages: 1,
        adminQBankTotalCount: 0,

        // For Mock Test
        adminMockTestQuestions: [],
        adminMockTestQuestionsLoading: false,
        adminMockTestQuestionsError: null,
        adminMockTestCurrentPage: 1,
        adminMockTestTotalPages: 1,
        adminMockTestTotalCount: 0,


        //for test questions
        adminTestQuestions: [],
        adminTestQuestionsLoading: false,
        adminTestQuestionsError: null,
        adminTestQuestionsCurrentPage: 1,
        adminTestQuestionsTotalPages: 1,
        adminTestQuestionsTotalCount: 0,



        //for fetching admin fetching Mock Test questions by course Id
        adminMockTestQuestionsByCourseId: [],
        adminMockTestQuestionsByCourseIdLoading: false,
        adminMockTestQuestionsByCourseIdError: null,

        //for creating test
        adminCreateTestResult: null,   // stores API response
        adminCreateTestLoading: false, // loading flag
        adminCreateTestError: null,


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



            //Delete Question
            .addCase(adminDeleteQBankQuestion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminDeleteQBankQuestion.fulfilled, (state, action) => {
                state.loading = false;
                state.adminQBankQuestions = state.adminQBankQuestions.filter(
                    (q) => q.id !== action.payload.id   // ✅ use id from payload
                );
            })

            .addCase(adminDeleteQBankQuestion.rejected, (state, action) => {
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



            //fetch mock test questions by courseId
            .addCase(adminFetchMockTestQuestionsByCourseId.pending, (state) => {
                state.adminMockTestQuestionsByCourseIdLoading = true;
                state.adminMockTestQuestionsByCourseIdError = null;
            })
            .addCase(adminFetchMockTestQuestionsByCourseId.fulfilled, (state, action) => {
                state.adminMockTestQuestionsByCourseIdLoading = false;
                state.adminMockTestQuestionsByCourseId = action.payload; // ✅ questions array
            })
            .addCase(adminFetchMockTestQuestionsByCourseId.rejected, (state, action) => {
                state.adminMockTestQuestionsByCourseIdLoading = false;
                state.adminMockTestQuestionsByCourseIdError = action.payload;
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

            })


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

            })


            //for fetching questions in question bank in admin side
            .addCase(adminFetchQBankQuestions.pending, (state) => {
                state.adminQBankQuestionsLoading = true;
                state.adminQBankQuestionsError = null;

            })
            .addCase(adminFetchQBankQuestions.fulfilled, (state, action) => {
                state.adminQBankQuestionsLoading = false;
                state.adminQBankQuestions = action.payload.list;
                state.adminQBankCurrentPage = action.payload.page || 1;
                state.adminQBankTotalPages = action.payload.totalPages || 1;
                state.adminQBankTotalCount = action.payload.totalCount || 0;
            })
            .addCase(adminFetchQBankQuestions.rejected, (state, action) => {
                state.adminQBankQuestionsLoading = false;
                state.adminQBankQuestionsError = action.payload;
            })



            // for fetchng Admin Mock Test questions 
            .addCase(adminFetchMockTestQuestions.pending, (state) => {
                state.adminMockTestQuestionsLoading = true;
                state.adminMockTestQuestionsError = null;
            })

            .addCase(adminFetchMockTestQuestions.fulfilled, (state, action) => {
                state.adminMockTestQuestionsLoading = false;
                state.adminMockTestQuestions = action.payload.list || [];
                state.adminMockTestCurrentPage = action.payload.page || 1;
                state.adminMockTestTotalPages = action.payload.totalPages || 1;
                state.adminMockTestTotalCount = action.payload.totalCount || 0;
            })

            .addCase(adminFetchMockTestQuestions.rejected, (state, action) => {
                state.adminMockTestQuestionsLoading = false;
                state.adminMockTestQuestionsError = action.payload;
            })


            //for fetching test question in admin side 
            .addCase(adminFetchTestQuestions.pending, (state) => {
                state.adminTestQuestionsLoading = true;
                state.adminTestQuestionsError = null;
            })
            .addCase(adminFetchTestQuestions.fulfilled, (state, action) => {
                state.adminTestQuestionsLoading = false;
                state.adminTestQuestions = action.payload.list || [];
                state.adminTestQuestionsCurrentPage = action.payload.page || 1;
                state.adminTestQuestionsTotalPages = action.payload.totalPages || 1;
                state.adminTestQuestionsTotalCount = action.payload.totalCount || 0;
            })
            .addCase(adminFetchTestQuestions.rejected, (state, action) => {
                state.adminTestQuestionsLoading = false;
                state.adminTestQuestionsError = action.payload;
                state.adminTestQuestions = [];
            })



            //for creating test in admin side 
            .addCase(adminCreateTestThunk.pending, (state) => {
                state.adminCreateTestLoading = true;
                state.adminCreateTestError = null;
            })
            .addCase(adminCreateTestThunk.fulfilled, (state, action) => {
                state.adminCreateTestLoading = false;
                state.adminCreateTestResult = action.payload;
            })
            .addCase(adminCreateTestThunk.rejected, (state, action) => {
                state.adminCreateTestLoading = false;
                state.adminCreateTestError = action.payload || "Failed to create test";
            })

    }
});

export const { resetStatus } = questionSlice.actions;
export default questionSlice.reducer;
