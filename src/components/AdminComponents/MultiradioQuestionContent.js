import React, { useState } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    IconButton,
    RadioGroup,
    Radio,
    FormControlLabel,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from 'react-router-dom';
const MultiradioQuestionContent = ({ onBack, onNext }) => {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([""]);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const navigate = useNavigate()
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleAddOption = () => {
        setOptions([...options, ""]);
    };

    const handleNext = () => {
        const data = {
            question,
            options,
            correctAnswer,
        };
        // onNext(data);
        navigate('/admin/answer-explain');
    };
    onBack = () => {
        navigate('/admin/question-type');
    };
    return (
        <Box p={3}>
            {/* Breadcrumb */}
            <Typography variant="caption" color="textSecondary">
                Test type &gt; Question Type &gt; <strong>Question Content</strong>
            </Typography>

            {/* Title */}
            <Typography variant="h5" mt={2} mb={1}>
                Enter Question Content
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
                Write the question your students will answer — be clear, concise, and clinically relevant.
            </Typography>

            {/* Question Input */}
            <TextField
                fullWidth
                label="Enter your question"
                multiline
                minRows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                variant="outlined"
            />

            {/* Image & Exhibit Buttons */}
            <Box display="flex" justifyContent="flex-end" mt={1} mb={3} gap={1}>
                <Button variant="outlined">+ Add Image</Button>
                <Button variant="outlined">+ Add Exhibit</Button>
            </Box>

            {/* Options List */}
            <Typography variant="subtitle1">Answers</Typography>
            {options.map((opt, index) => (
                <Box key={index} display="flex" alignItems="center" gap={1} mt={1}>
                    <Radio disabled />
                    <TextField
                        fullWidth
                        placeholder={`Option ${index + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                </Box>
            ))}

            {/* Add Option Button */}
            <Button startIcon={<AddIcon />} onClick={handleAddOption} sx={{ mt: 2 }}>
                Add Option
            </Button>

            {/* Correct Answer Selector */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Correct Answer</InputLabel>
                <Select
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    label="Correct Answer"
                >
                    {options.map((opt, idx) => (
                        <MenuItem key={idx} value={opt}>
                            {opt || `Option ${idx + 1}`}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Navigation Buttons */}
            <Box mt={4} display="flex" justifyContent="space-between">
                <Button variant="text" startIcon={<ArrowBackIcon />} onClick={onBack}>
                    Back
                </Button>
                <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleNext}
                // disabled={!question || options.length < 2 || !correctAnswer}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default MultiradioQuestionContent;
