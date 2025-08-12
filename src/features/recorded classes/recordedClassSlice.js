import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createRecording, listRecordedClasses, base64ToFile } from "./recordedClassApi";

// Fetch list
export const fetchRecordedClasses = createAsyncThunk(
    "recordings/fetchRecordedClasses",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("accessToken");
            console.log("Token ::::::", token);

            const response = await listRecordedClasses(token);
            console.log("API Response ::::::", response); // 👈 Check the raw response

            return response; // return to Redux state
        } catch (error) {
            console.error("Error fetching recorded classes:", error);
            return rejectWithValue(error.message);
        }
    }
);


// Add new recording
export const addRecording = createAsyncThunk(
    "recordings/addRecording",
    async (recordingData, { rejectWithValue }) => {
        console.log("Inside add recording thunk");

        try {
            const token = localStorage.getItem("accessToken");
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
    initialState: { list: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecordedClasses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRecordedClasses.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
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
            });
    }
});

export default recordingSlice.reducer;
