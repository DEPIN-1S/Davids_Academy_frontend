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

// Thunk to list all contacts (without auth header)
export const fetchContacts = createAsyncThunk(
    "contacts/fetchContacts",
    async (_, { rejectWithValue }) => {
        try {
            const data = await listContacts();
            return data.list || data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// NEW Thunk: fetch recent enquiries with token auth header
export const fetchRecentEnquiries = createAsyncThunk(
    "contacts/fetchRecentEnquiries",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('accessToken');
            console.log("acess token", token);
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/exam/list/contact-us`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({}),
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }

            const data = await response.json();
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

            // List contacts (non-auth)
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
            })

            // New fetchRecentEnquiries
            .addCase(fetchRecentEnquiries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecentEnquiries.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchRecentEnquiries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetContactStatus } = contactSlice.actions;
export default contactSlice.reducer;
