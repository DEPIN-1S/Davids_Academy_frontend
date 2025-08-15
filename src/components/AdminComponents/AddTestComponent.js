import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    FormControl,
    Select,
    MenuItem,
    Button,
    TextField,
    OutlinedInput,
    Checkbox,
    ListItemText,
    useMediaQuery,
    CircularProgress,
    Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../../features/courses/courseSlice";
import { getMockTestQuestions, submitTest } from "../../features/exam/examSlice";

export default function AddTestComponent() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMobile = useMediaQuery("(max-width:600px)");

    // Selectors
    const { list: courses = [], loading: coursesLoading } = useSelector(
        (state) => state.course
    );

    const {
        mockTestQuestion: questions = [],
        mockTestQuestionLoading: questionLoading,
        mockTestQuestionError: questionError,
        loading: submitLoading,
        error: submitError,
        success: submitSuccess,
    } = useSelector((state) => state.exam);

    // Local state
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        dispatch(fetchCourses());
        dispatch(getMockTestQuestions());
    }, [dispatch]);

    useEffect(() => {
        if (submitSuccess) {
            // Optionally reset or navigate on success
            alert("Test created successfully!");
            navigate("/admin/question-management");  // or wherever you want
        }
    }, [submitSuccess, navigate]);

    const handleBackClick = () => {
        navigate("/admin/question-management");
    };

    const handleNextClick = () => {
        if (!selectedCourse || !startDate || !endDate || selectedQuestionIds.length === 0) {
            alert("Please fill in all fields.");
            return;
        }

        // Build payload matching your backend API keys
        const payload = {
            fromDate: startDate,
            toDate: endDate,
            testTitle: selectedCourse,  // or whatever your API expects for test title
            questionIds: selectedQuestionIds,
            courseId: selectedCourse,
        };

        dispatch(submitTest(payload));
    };

    const handleQuestionSelect = (event) => {
        const { value } = event.target;
        setSelectedQuestionIds(typeof value === "string" ? value.split(",") : value);
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", px: 2, py: 4, display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
                Tests &nbsp;&gt;&nbsp; Add Test
            </Typography>

            <Typography variant="h5" fontWeight={600}>
                Add New Test
            </Typography>

            {submitError && <Alert severity="error">{submitError}</Alert>}

            {/* Course Dropdown */}
            <FormControl fullWidth>
                <Select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    displayEmpty
                    sx={{ borderRadius: 2, fontWeight: 500, bgcolor: "#f9f9f9", "& .MuiSelect-select": { padding: 2 } }}
                >
                    <MenuItem value="" disabled>
                        Select Course
                    </MenuItem>
                    {coursesLoading && <MenuItem disabled>Loading courses...</MenuItem>}
                    {courses.map((c) => (
                        <MenuItem key={c.cs_id} value={c.cs_id}>
                            {c.cs_name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Start Date */}
            <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
            />

            {/* End Date */}
            <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
            />

            {/* Multi-Select Questions */}
            <FormControl fullWidth>
                <Select
                    multiple
                    value={selectedQuestionIds}
                    onChange={handleQuestionSelect}
                    input={<OutlinedInput label="Questions" />}
                    renderValue={(selected) =>
                        questions
                            .filter((q) => selected.includes(q.id))
                            .map((q) => q.question)
                            .join(", ")
                    }
                >
                    {questionLoading && <MenuItem disabled>Loading questions...</MenuItem>}
                    {questions.map((q) => (
                        <MenuItem key={q.id} value={q.id}>
                            <Checkbox checked={selectedQuestionIds.includes(q.id)} />
                            <ListItemText primary={q.question} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Navigation Buttons */}
            <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", flexDirection: isMobile ? "column" : "row", gap: 2 }}>
                <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBackClick} fullWidth={isMobile}>
                    Back
                </Button>
                <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleNextClick}
                    sx={{ backgroundColor: "#FFD700", color: "#000" }}
                    fullWidth={isMobile}
                    disabled={submitLoading}
                >
                    {submitLoading ? <CircularProgress size={24} color="inherit" /> : "Save Test"}
                </Button>
            </Box>
        </Box>
    );
}
