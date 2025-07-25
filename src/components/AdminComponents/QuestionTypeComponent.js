// src/components/admin/QuestionTypeComponent.js
import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    FormControl,
    Select,
    MenuItem,
    Button,
    useMediaQuery,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useDispatch, useSelector } from "react-redux";
import { listQuestionTypes } from "../../features/exam/examSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { QUESTION_TYPE_TO_ROUTE } from './QuestionRoutes';

const QuestionTypeComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery("(max-width:600px)");

    // ✅ Store the complete question type object instead of just the type name
    const [selectedQuestionType, setSelectedQuestionType] = useState(null);

    // ✅ Receive exam_type from previous component
    const { exam_type } = location.state || {};

    // ✅ Access the correct state key - your store has 'exam' not 'questions'
    const {
        questionTypes = [],
        questionTypesLoading = false,
        questionTypesError = null
    } = useSelector((state) => state.exam || {});

    useEffect(() => {
        dispatch(listQuestionTypes());
    }, [dispatch]);

    // ✅ Redirect back if no exam_type is received
    useEffect(() => {
        if (!exam_type) {
            navigate("/admin/exam-type");
        }
    }, [exam_type, navigate]);

    const handleNextClick = () => {
        if (!selectedQuestionType) return; // nothing selected

        const path = QUESTION_TYPE_TO_ROUTE[selectedQuestionType.type];

        if (path) {
            // ✅ Pass exam_type, questionType details, and combined data
            navigate(path, {
                state: {
                    exam_type,
                    question_type_id: selectedQuestionType.id,
                    questionType: selectedQuestionType.type
                },
            });
        } else {
            console.error(`No route mapped for ${selectedQuestionType.type}`);
        }
    };

    const handleBackClick = () => {
        // ✅ Go back to exam type selection, preserving any state if needed
        navigate("/admin/exam-type");
    };

    // ✅ Handle dropdown change to store complete question type object
    const handleQuestionTypeChange = (event) => {
        const selectedValue = event.target.value;
        const questionTypeObj = questionTypes.find(type => type.type === selectedValue);
        setSelectedQuestionType(questionTypeObj);
    };

    return (
        <Box
            sx={{
                maxWidth: 600,
                mx: "auto",
                px: 2,
                py: 4,
                display: "flex",
                flexDirection: "column",
                gap: 3,
            }}
        >
            {/* Breadcrumb */}
            <Typography variant="subtitle2" color="text.secondary">
                Test Type &nbsp;&gt;&nbsp; Exam Type ({exam_type}) &nbsp;&gt;&nbsp; Question Type
            </Typography>

            {/* Title */}
            <Typography variant="h5" fontWeight={600}>
                Select Question Type
            </Typography>

            {/* Subtitle */}
            <Typography color="text.secondary">
                Choose the format best suited for your {exam_type} question.
            </Typography>

            {/* Display selected exam type */}
            <Box sx={{ p: 2, bgcolor: "#f0f0f0", borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    Selected Exam Type:
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                    {exam_type}
                </Typography>
            </Box>

            {/* Dropdown */}
            <FormControl fullWidth>
                <Select
                    value={selectedQuestionType?.type || ""}
                    onChange={handleQuestionTypeChange}
                    displayEmpty
                    sx={{
                        borderRadius: 2,
                        fontWeight: 500,
                        bgcolor: "#f9f9f9",
                        "& .MuiSelect-select": { padding: 2 },
                    }}
                >
                    <MenuItem value="" disabled>
                        Select a Question Type
                    </MenuItem>

                    {questionTypesLoading && (
                        <MenuItem disabled>Loading...</MenuItem>
                    )}

                    {questionTypesError && (
                        <MenuItem disabled>Error loading question types</MenuItem>
                    )}

                    {questionTypes.map((type) => (
                        <MenuItem key={type.id} value={type.type}>
                            {type.type}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Display selected question type details (optional) */}
            {selectedQuestionType && (
                <Box sx={{ p: 2, bgcolor: "#e8f5e8", borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Selected Question Type:
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                        {selectedQuestionType.type} (ID: {selectedQuestionType.id})
                    </Typography>
                </Box>
            )}

            {/* Navigation Buttons */}
            <Box
                sx={{
                    mt: 4,
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: isMobile ? "column" : "row",
                    gap: 2,
                }}
            >
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBackClick}
                    fullWidth={isMobile}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleNextClick}
                    disabled={!selectedQuestionType}
                    sx={{ backgroundColor: "#FFD700", color: "#000" }}
                    fullWidth={isMobile}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default QuestionTypeComponent;
