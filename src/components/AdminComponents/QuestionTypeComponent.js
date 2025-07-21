import React, { useState } from "react";
import {
    Box,
    Typography,
    FormControl,
    Select,
    MenuItem,
    Button,
    IconButton,
    useMediaQuery
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
const QuestionTypeComponent = ({ onBack, onNext }) => {
    const [questionType, setQuestionType] = useState("MCQ");
    const isMobile = useMediaQuery("(max-width: 600px)");
    const navigate = useNavigate();
    const handleNextClick = () => {
        navigate('/admin/mcq-content');

    };
    onBack = () => {
        navigate('/admin/create-question');

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
                gap: 3
            }}
        >
            {/* Breadcrumb */}
            <Typography variant="subtitle2" color="text.secondary">
                Test type &nbsp;&gt;&nbsp; Question Type &nbsp;&gt;
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
                    sx={{
                        borderRadius: 2,
                        fontWeight: 500,
                        bgcolor: "#f9f9f9",
                        "& .MuiSelect-select": { padding: 2 },
                    }}
                >
                    <MenuItem value="MCQ">Multiple Choice (MCQ)</MenuItem>
                    <MenuItem value="Dropdown">Dropdown</MenuItem>
                    <MenuItem value="Sort">Sort Order</MenuItem>
                    <MenuItem value="CaseStudy">Case Study</MenuItem>
                </Select>
            </FormControl>

            {/* Buttons */}
            <Box
                sx={{
                    mt: 4,
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: isMobile ? "column" : "row",
                    gap: 2
                }}
            >
                <Button
                    variant="outlined"
                    onClick={onBack}
                    startIcon={<ArrowBackIcon />}
                    fullWidth={isMobile}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    onClick={handleNextClick}
                    endIcon={<ArrowForwardIcon />}
                    fullWidth={isMobile}
                    sx={{ backgroundColor: "#FFD700", color: "#000" }}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default QuestionTypeComponent;
