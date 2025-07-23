import React, { useRef, useState } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    IconButton,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Card,
    CardContent,
    Chip,
    Radio,
    Alert
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CloudUpload, Delete, Image, PictureAsPdf, Description } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const McqQuestionContent = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get any existing data from previous steps or question type
    const existingData = location.state?.questionData || {};
    const questionType = location.state?.questionType || existingData.questionType || "MCQ";

    // Form state
    const [question, setQuestion] = useState(existingData.question || "");
    const [options, setOptions] = useState(existingData.options || ["", ""]);
    const [correctAnswer, setCorrectAnswer] = useState(existingData.correctAnswer || "");
    const [selectedFile, setSelectedFile] = useState(existingData.exhibit || null);
    const [errors, setErrors] = useState({});

    const fileInputRef = useRef(null);

    // File upload handlers
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, file: 'File size must be less than 10MB' }));
                return;
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, file: 'Only images, PDF, and Word documents are allowed' }));
                return;
            }

            const fileData = {
                file: file,
                name: file.name,
                size: file.size,
                type: file.type,
                url: URL.createObjectURL(file),
                uploadedAt: new Date().toISOString()
            };

            setSelectedFile(fileData);
            setErrors(prev => ({ ...prev, file: null }));
            console.log('File selected:', fileData);
        }
        // Reset input value
        event.target.value = '';
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveFile = () => {
        if (selectedFile) {
            URL.revokeObjectURL(selectedFile.url);
            setSelectedFile(null);
            setErrors(prev => ({ ...prev, file: null }));
        }
    };

    // Option handlers
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);

        // Update correct answer if it was the changed option
        if (correctAnswer === options[index]) {
            setCorrectAnswer(value);
        }

        // Clear validation errors
        setErrors(prev => ({ ...prev, options: null }));
    };

    const handleAddOption = () => {
        if (options.length < 6) { // Maximum 6 options
            setOptions([...options, ""]);
        }
    };

    const handleRemoveOption = (index) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);

            // Reset correct answer if removed option was selected
            if (correctAnswer === options[index]) {
                setCorrectAnswer("");
            }

            setErrors(prev => ({ ...prev, options: null }));
        }
    };

    // Validation
    const validateForm = () => {
        const newErrors = {};

        // Question validation
        if (!question.trim()) {
            newErrors.question = 'Question is required';
        } else if (question.trim().length < 10) {
            newErrors.question = 'Question must be at least 10 characters long';
        }

        // Options validation
        const validOptions = options.filter(opt => opt.trim() !== "");
        if (validOptions.length < 2) {
            newErrors.options = 'At least 2 options are required';
        }

        // Check for duplicate options
        const uniqueOptions = new Set(validOptions.map(opt => opt.trim().toLowerCase()));
        if (uniqueOptions.size !== validOptions.length) {
            newErrors.options = 'Options must be unique';
        }

        // Correct answer validation
        if (!correctAnswer.trim()) {
            newErrors.correctAnswer = 'Please select the correct answer';
        } else if (!validOptions.includes(correctAnswer)) {
            newErrors.correctAnswer = 'Correct answer must be one of the provided options';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Navigation handlers
    const handleNext = () => {
        if (!validateForm()) {
            return;
        }

        // Prepare complete question data
        const questionData = {
            // Basic information
            questionType: questionType,
            question: question.trim(),

            // MCQ specific data
            options: options.filter(opt => opt.trim() !== "").map(opt => opt.trim()),
            correctAnswer: correctAnswer.trim(),

            // File attachment
            exhibit: selectedFile ? {
                name: selectedFile.name,
                type: selectedFile.type,
                size: selectedFile.size,
                url: selectedFile.url,
                file: selectedFile.file,
                uploadedAt: selectedFile.uploadedAt
            } : null,

            // Metadata
            createdAt: existingData.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            questionId: existingData.questionId || `${questionType}_${Date.now()}`,

            // Step tracking
            currentStep: 'content',
            completedSteps: ['type', 'content']
        };

        console.log('Sending to explanation step:', questionData);

        // Navigate to next step with complete data
        navigate('/admin/answer-explain', {
            state: {
                questionData: questionData,
                fromStep: 'content'
            }
        });
    };

    const handleBack = () => {
        // Prepare current data for potential restoration
        const currentData = {
            question: question.trim(),
            options: options,
            correctAnswer: correctAnswer.trim(),
            exhibit: selectedFile
        };

        navigate('/admin/question-type', {
            state: {
                questionData: currentData,
                fromStep: 'content'
            }
        });
    };

    // Helper functions
    const getFileIcon = (fileType) => {
        if (fileType?.startsWith('image/')) return <Image />;
        if (fileType === 'application/pdf') return <PictureAsPdf />;
        return <Description />;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const isFormValid = () => {
        const validOptions = options.filter(opt => opt.trim() !== "");
        return question.trim() !== "" &&
            question.trim().length >= 10 &&
            validOptions.length >= 2 &&
            correctAnswer.trim() !== "" &&
            validOptions.includes(correctAnswer);
    };

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            if (selectedFile && selectedFile.url) {
                URL.revokeObjectURL(selectedFile.url);
            }
        };
    }, [selectedFile]);

    return (
        <Box p={3} maxWidth="800px" mx="auto">
            {/* Breadcrumb */}
            <Typography variant="caption" color="textSecondary" mb={2} display="block">
                Test type &gt; Question Type &gt; <strong>Question Content</strong>
            </Typography>

            {/* Title */}
            <Typography variant="h5" mt={2} mb={1}>
                Enter {questionType} Question Content
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
                Write the question your students will answer — be clear, concise, and clinically relevant.
            </Typography>

            {/* Question Input */}
            <TextField
                fullWidth
                label="Enter your question *"
                multiline
                minRows={3}
                maxRows={6}
                value={question}
                onChange={(e) => {
                    setQuestion(e.target.value);
                    setErrors(prev => ({ ...prev, question: null }));
                }}
                variant="outlined"
                placeholder="Type your multiple choice question here..."
                error={!!errors.question}
                helperText={errors.question || `${question.length} characters (minimum 10 required)`}
                sx={{ mb: 2 }}
            />

            {/* File Upload Section */}
            <Box display="flex" justifyContent="flex-end" mt={1} mb={3} gap={1}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*,.pdf,.doc,.docx"
                    style={{ display: 'none' }}
                />
                <Button
                    variant="outlined"
                    onClick={handleButtonClick}
                    startIcon={<CloudUpload />}
                    size="small"
                >
                    + Add Exhibit
                </Button>
            </Box>

            {/* File Error Display */}
            {errors.file && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.file}
                </Alert>
            )}

            {/* Display Uploaded File */}
            {selectedFile && (
                <Card sx={{ mb: 3 }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box display="flex" alignItems="center" gap={2}>
                            {getFileIcon(selectedFile.type)}

                            <Box flex={1}>
                                <Typography variant="body2" fontWeight={500}>
                                    {selectedFile.name}
                                </Typography>
                                <Box display="flex" gap={1} mt={0.5}>
                                    <Chip
                                        label={formatFileSize(selectedFile.size)}
                                        size="small"
                                        variant="outlined"
                                    />
                                    <Chip
                                        label={selectedFile.type.split('/')[1]?.toUpperCase() || 'FILE'}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                </Box>
                            </Box>

                            {/* Image Preview */}
                            {selectedFile.type.startsWith('image/') && (
                                <Box
                                    component="img"
                                    src={selectedFile.url}
                                    alt={selectedFile.name}
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        objectFit: 'cover',
                                        borderRadius: 1
                                    }}
                                />
                            )}

                            <IconButton
                                onClick={handleRemoveFile}
                                color="error"
                                size="small"
                                title="Remove file"
                            >
                                <Delete />
                            </IconButton>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Options List */}
            <Typography variant="subtitle1" mb={2}>
                Answer Options *
            </Typography>

            {options.map((opt, index) => (
                <Box key={index} display="flex" alignItems="center" gap={1} mb={1}>
                    <Radio
                        checked={correctAnswer === opt && opt.trim() !== ""}
                        disabled
                        size="small"
                        color="success"
                    />
                    <TextField
                        fullWidth
                        placeholder={`Enter option ${index + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        size="small"
                        error={!!errors.options}
                    />
                    {options.length > 2 && (
                        <IconButton
                            onClick={() => handleRemoveOption(index)}
                            color="error"
                            size="small"
                            title="Remove option"
                        >
                            <Delete />
                        </IconButton>
                    )}
                </Box>
            ))}

            {/* Options Error */}
            {errors.options && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {errors.options}
                </Typography>
            )}

            {/* Add Option Button */}
            <Button
                startIcon={<AddIcon />}
                onClick={handleAddOption}
                sx={{ mt: 1, mb: 3 }}
                variant="outlined"
                size="small"
                disabled={options.length >= 6}
            >
                Add Option {options.length >= 6 && '(Max 6)'}
            </Button>

            {/* Correct Answer Selector */}
            <FormControl fullWidth margin="normal" error={!!errors.correctAnswer}>
                <InputLabel>Select Correct Answer *</InputLabel>
                <Select
                    value={correctAnswer}
                    onChange={(e) => {
                        setCorrectAnswer(e.target.value);
                        setErrors(prev => ({ ...prev, correctAnswer: null }));
                    }}
                    label="Select Correct Answer *"
                >
                    {options
                        .filter(opt => opt.trim() !== "")
                        .map((opt, idx) => (
                            <MenuItem key={idx} value={opt}>
                                {String.fromCharCode(65 + idx)}) {opt}
                            </MenuItem>
                        ))
                    }
                </Select>
                {errors.correctAnswer && (
                    <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                        {errors.correctAnswer}
                    </Typography>
                )}
            </FormControl>

            {/* Form Summary */}
            <Card sx={{ mt: 3, bgcolor: 'grey.50' }}>
                <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                        Question Summary:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • Question: {question ? '✓ Complete' : '✗ Required'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • Options: {options.filter(opt => opt.trim() !== "").length} provided (min. 2)
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • Correct Answer: {correctAnswer ? '✓ Selected' : '✗ Required'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • Exhibit: {selectedFile ? `✓ ${selectedFile.name}` : '○ Optional'}
                    </Typography>
                </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <Box mt={4} display="flex" justifyContent="space-between">
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleNext}
                    disabled={!isFormValid()}
                >
                    Next: Add Explanation
                </Button>
            </Box>
        </Box>
    );
};

export default McqQuestionContent;
