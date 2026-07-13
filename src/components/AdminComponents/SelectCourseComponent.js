import React, { useEffect, useState } from 'react';
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
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';


import { fetchCourses } from "../../features/courses/courseSlice";
const SelectCourseComponent = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width:600px)");
    const { list: courses } = useSelector((state) => state.course);
    const dispatch = useDispatch();
    const [selectedCourseType, setSelectedCourseType] = useState("");

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    const handleNextClick = () => {
        if (!selectedCourseType) return;
        navigate("/admin/select-topic", {
            state: { cs_id: selectedCourseType }
        });

    };

    const handleBackClick = () => {
        navigate("/admin/question-management");
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
                Course &nbsp;&gt;&nbsp; course Type
            </Typography>

            {/* Title */}
            <Typography variant="h5" fontWeight={600}>
                Select course
            </Typography>

            {/* Subtitle */}
            <Typography color="text.secondary">
                Choose a course.
            </Typography>

            {/* Dropdown */}
            <FormControl fullWidth>
                <Select
                    value={selectedCourseType}
                    onChange={(e) => setSelectedCourseType(e.target.value)}
                    displayEmpty
                    sx={{
                        borderRadius: 2,
                        fontWeight: 500,
                        bgcolor: "#f9f9f9",
                        "& .MuiSelect-select": { padding: 2 },
                    }}
                >
                    <MenuItem value="" disabled>
                        Select Course
                    </MenuItem>
                    {courses.map((courses, index) => (
                        <MenuItem key={index} value={courses.cs_id}>
                            {courses.cs_name}
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
                    disabled={!selectedCourseType}
                    sx={{ backgroundColor: "#FFD700", color: "#000" }}
                    fullWidth={isMobile}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default SelectCourseComponent;
