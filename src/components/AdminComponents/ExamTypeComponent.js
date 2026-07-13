// src/components/admin/ExamTypeComponent.js
import React, { useState } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";


const ExamTypeComponent = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width:600px)");
    const location = useLocation();
    const cs_id = location.state?.cs_id || "";
    const topic_id = location.state?.topic_id || "";
    // Hardcoded exam types - no state needed for this array
    const examTypes = ['Mock Test', 'Q-Bank'];

    // Only state needed is for user selection
    const [selectedExamType, setSelectedExamType] = useState("");

    const handleNextClick = () => {
        if (!selectedExamType) return; // Prevent navigation if nothing is selected
        console.log("course id in exam type comp", cs_id);
        // Pass the selected exam type to the next component via state
        navigate("/admin/question-type", {
            state: {
                exam_type: selectedExamType,
                cs_id,
                topic_id
            }
        });
    };

    const handleBackClick = () => {
        navigate("/admin/select-topic",{
             state: {     
                cs_id
            }
        });
        
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
                Test Type &nbsp;&gt;&nbsp; Exam Type
            </Typography>

            {/* Title */}
            <Typography variant="h5" fontWeight={600}>
                Select Exam Type
            </Typography>

            {/* Subtitle */}
            <Typography color="text.secondary">
                Choose the format best suited for your question.
            </Typography>

            {/* Dropdown */}
            <FormControl fullWidth>
                <Select
                    value={selectedExamType}
                    onChange={(e) => setSelectedExamType(e.target.value)}
                    displayEmpty
                    sx={{
                        borderRadius: 2,
                        fontWeight: 500,
                        bgcolor: "#f9f9f9",
                        "& .MuiSelect-select": { padding: 2 },
                    }}
                >
                    <MenuItem value="" disabled>
                        Select an Exam Type
                    </MenuItem>

                    {examTypes.map((type, index) => (
                        <MenuItem key={index} value={type}>
                            {type}
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
                    disabled={!selectedExamType}
                    sx={{ backgroundColor: "#FFD700", color: "#000" }}
                    fullWidth={isMobile}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default ExamTypeComponent;
