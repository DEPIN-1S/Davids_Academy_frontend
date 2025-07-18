import React, { useState } from "react";
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Grid
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";

const MetaInfoComponent = ({ onBack, onSubmit }) => {
    const [form, setForm] = useState({
        difficulty: "",
        subject: "",
        lesson: "",
        clientNeedArea: "",
        clientNeedTopic: ""
    });

    const handleChange = (field) => (event) => {
        setForm({ ...form, [field]: event.target.value });
    };

    const handleSubmit = () => {
        onSubmit(form);
    };

    return (
        <Box p={3}>
            {/* Breadcrumb */}
            <Typography variant="caption" color="textSecondary" mb={2}>
                Test type &gt; Question Type &gt; Question Content &gt; Explanation &gt; <strong>Add Tags</strong>
            </Typography>

            {/* Heading */}
            <Typography variant="h5" mt={2} mb={1}>
                Add Tags & Meta Information
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
                Label your question with relevant categories for better organization and performance insights.
            </Typography>

            {/* Select Fields */}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                        <InputLabel>Difficulty</InputLabel>
                        <Select
                            value={form.difficulty}
                            onChange={handleChange("difficulty")}
                            label="Difficulty"
                        >
                            <MenuItem value="Easy">Easy</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Hard">Hard</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                        <InputLabel>Subject</InputLabel>
                        <Select
                            value={form.subject}
                            onChange={handleChange("subject")}
                            label="Subject"
                        >
                            <MenuItem value="Fundamentals">Fundamentals</MenuItem>
                            <MenuItem value="Pharmacology">Pharmacology</MenuItem>
                            <MenuItem value="Adult Health">Adult Health</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                        <InputLabel>Lesson</InputLabel>
                        <Select
                            value={form.lesson}
                            onChange={handleChange("lesson")}
                            label="Lesson"
                        >
                            <MenuItem value="Skills / Procedures">Skills / Procedures</MenuItem>
                            <MenuItem value="Dosage Calculation">Dosage Calculation</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel>Client Need Area</InputLabel>
                        <Select
                            value={form.clientNeedArea}
                            onChange={handleChange("clientNeedArea")}
                            label="Client Need Area"
                        >
                            <MenuItem value="Safety & Infection Control">Safety & Infection Control</MenuItem>
                            <MenuItem value="Skills / Procedures">Skills / Procedures</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel>Client Need Topic</InputLabel>
                        <Select
                            value={form.clientNeedTopic}
                            onChange={handleChange("clientNeedTopic")}
                            label="Client Need Topic"
                        >
                            <MenuItem value="Complications of Diagnostic Procedures">
                                Complications of Diagnostic Procedures
                            </MenuItem>
                            <MenuItem value="Infection Prevention">Infection Prevention</MenuItem>
                            <MenuItem value="Dosage Admin">Dosage Admin</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box mt={4} display="flex" justifyContent="space-between">
                <Button startIcon={<ArrowBackIcon />} onClick={onBack}>
                    Back
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<LibraryAddCheckIcon />}
                    onClick={handleSubmit}
                    disabled={
                        !form.difficulty || !form.subject || !form.lesson || !form.clientNeedArea || !form.clientNeedTopic
                    }
                >
                    Add to Q-Bank
                </Button>
            </Box>
        </Box>
    );
};

export default MetaInfoComponent;
