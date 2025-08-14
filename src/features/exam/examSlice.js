// src/features/questions/questionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postQuestion, fetchQuestionTypes, } from "./examAPI";

// Async thunk for posting any question type
export const submitQuestion = createAsyncThunk(
 
    
    "questions/submitQuestion",
    async (payload, { rejectWithValue }) => {
        console.log("inside submit question");
        console.log("Inside submit Question::::::::");
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

const questionSlice = createSlice({
    name: "questions",
    initialState: {
        loading: false,
        success: false,
        error: null,
        questionTypes: [],
        questionTypesLoading: false,
        questionTypesError: null
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
            });
    }
});
export const { resetStatus } = questionSlice.actions;

export default questionSlice.reducer;
