// src/features/contacts/contactSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postContact, listContacts } from "./contactAPI";

// Thunk to submit a contact message
export const submitContact = createAsyncThunk(
    "contacts/submitContact",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await postContact(payload);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk to list all contacts
export const fetchContacts = createAsyncThunk(
    "contacts/fetchContacts",
    async (_, { rejectWithValue }) => {
        try {
            const data = await listContacts();
            // If backend returns { list: [...] }
            return data.list || data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const contactSlice = createSlice({
    name: "contacts",
    initialState: {
        list: [],
        loading: false,
        error: null,
        submitLoading: false,
        submitSuccess: false,
        submitError: null,
    },
    reducers: {
        resetContactStatus: (state) => {
            state.submitLoading = false;
            state.submitSuccess = false;
            state.submitError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Submit contact
            .addCase(submitContact.pending, (state) => {
                state.submitLoading = true;
                state.submitSuccess = false;
                state.submitError = null;
            })
            .addCase(submitContact.fulfilled, (state) => {
                state.submitLoading = false;
                state.submitSuccess = true;
            })
            .addCase(submitContact.rejected, (state, action) => {
                state.submitLoading = false;
                state.submitError = action.payload;
            })

            // List contacts
            .addCase(fetchContacts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContacts.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchContacts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetContactStatus } = contactSlice.actions;
export default contactSlice.reducer;
