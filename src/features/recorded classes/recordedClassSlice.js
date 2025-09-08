import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createRecording, listRecordedClasses, base64ToFile, DeleteRecordedClass } from "./recordedClassApi";


export const fetchRecordedClasses = createAsyncThunk(
    "recordings/fetchRecordedClasses",
    async ({ token, page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await listRecordedClasses(token, page, limit);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);



export const deleteRecordedClass = createAsyncThunk(
    "recordings/deleteRecordedClass",
    async (recording_id, { rejectWithValue }) => {
        try {
            const data = await DeleteRecordedClass(recording_id);

            if (!data || data.result === false) {
                return rejectWithValue(data?.message || "Failed to delete recorded class");
            }

            return recording_id; // reducer uses this to remove item
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);



// Add new recording
export const addRecording = createAsyncThunk(
    "recordings/addRecording",
    async (recordingData, { rejectWithValue }) => {
        console.log("Inside add recording thunk");

        try {
            const token = sessionStorage.getItem("accessToken");
            const screenshotBase64 = localStorage.getItem("screenshot");

            let fileScreenshot = null;
            if (screenshotBase64) {
                fileScreenshot = base64ToFile(screenshotBase64, "screenshot.png");
            }


            const payload = {
                title: recordingData.classTitle,
                course: 12,
                subject: "rec",
                duration: recordingData.classDuration,
                tutor_name: recordingData.tutorName,
                video_url: recordingData.videoUrl,
                recordimage: fileScreenshot
            };

            console.log("Mapped Payload being sent:", payload);
            return await createRecording(token, payload);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const recordingSlice = createSlice({
    name: "recordings",
    /* initialState: { list: [], loading: false, error: null }, */
    initialState: {
        list: [],
        loading: false,
        error: null,
        page: 1,
        limit: 10,
        totalPages: 1,
        totalItems: 0,
    },

    reducers: {},
    extraReducers: (builder) => {
        builder

            //for fetching recorded class
            .addCase(fetchRecordedClasses.pending, (state) => {
                state.loading = true;
            })

            .addCase(fetchRecordedClasses.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.data || [];

                if (action.payload.pagination) {
                    state.page = action.payload.pagination.page;
                    state.limit = action.payload.pagination.limit;
                    state.totalPages = action.payload.pagination.totalPages;
                    state.total = action.payload.pagination.total;
                }
            })

            .addCase(fetchRecordedClasses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(addRecording.pending, (state) => {
                state.loading = true;
            })
            .addCase(addRecording.fulfilled, (state, action) => {
                state.loading = false;
                state.list.push(action.payload);
            })
            .addCase(addRecording.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })



            .addCase(deleteRecordedClass.fulfilled, (state, action) => {
                state.list = state.list.filter((rec) => rec.id !== action.payload);
            })
            .addCase(deleteRecordedClass.rejected, (state, action) => {
                state.error = action.payload;
            });

    }
});

export default recordingSlice.reducer;
