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
// ✅ Import from the correct slice path
import { listQuestionTypes } from "../../features/exam/examSlice";
import { useNavigate } from "react-router-dom";

const QuestionTypeComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width:600px)");

    const [questionType, setQuestionType] = useState("");

    // ✅ Access the correct state key - your store has 'exam' not 'questions'
    const {
        questionTypes = [],
        questionTypesLoading = false,
        questionTypesError = null
    } = useSelector((state) => state.exam || {});

    useEffect(() => {
        dispatch(listQuestionTypes());
    }, [dispatch]);

    const handleNextClick = () => {
        if (!questionType) return;
        const path = `/admin/${questionType.toLowerCase().replace(/\s+/g, "-")}-content`;
        navigate(path, { state: { questionType } });
    };

    const handleBackClick = () => {
        navigate("/admin/create-question");
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
                Test Type &nbsp;&gt;&nbsp; Question Type
            </Typography>

            {/* Title */}
            <Typography variant="h5" fontWeight={600}>
                Select Question Type
            </Typography>

            {/* Subtitle */}
            <Typography color="text.secondary">
                Choose the format best suited for your question.
            </Typography>

            {/* Dropdown */}
            <FormControl fullWidth>
                <Select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
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
                    disabled={!questionType}
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