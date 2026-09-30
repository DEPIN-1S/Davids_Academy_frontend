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
import { useFileContext } from '../../context/FileContext'; // ✅ Import the Context

const McqQuestionContent = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Use File Context instead of passing files through navigation
    const { addQuestionFile, questionFile, hasQuestionFile } = useFileContext();

    // ✅ Get data from QuestionTypeComponent according to the new structure
    /*     const {
            exam_type,
            question_type_id,
            questionType: questionTypeName,
            questionData: existingQuestionData,
            cs_id,
    
        } = location.state || {}; */


    const state = location.state || {};
    const {
        exam_type,
        question_type_id,
        questionType: questionTypeName,
        questionData: existingQuestionData,
        cs_id,
    } = state;


    // ✅ Redirect back if required data is missing
    React.useEffect(() => {
        console.log("Question type id in mcqContent :::: ", question_type_id);

        if (!exam_type || !question_type_id || !questionTypeName || !cs_id) {
            navigate("/admin/question-type");
        }
    }, [exam_type, question_type_id, questionTypeName, cs_id, navigate]);

    // Form state - initialize with existing data if available
    const [question, setQuestion] = useState(existingQuestionData?.question || "");
    const [options, setOptions] = useState(existingQuestionData?.options || ["", ""]);
    const [correctAnswer, setCorrectAnswer] = useState(existingQuestionData?.correctAnswer || "");
    const [selectedFile, setSelectedFile] = useState(null); // ✅ Local state for UI, Context for persistence
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    // ✅ Initialize with existing file from context if available
    React.useEffect(() => {
        if (questionFile) {
            setSelectedFile(questionFile);
        }
    }, [questionFile]);

    // ✅ File upload handlers - Store in Context instead of passing through navigation
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
            // ✅ Store in both local state (for UI) and Context (for persistence)
            setSelectedFile(fileData);
            addQuestionFile(fileData); // Store in Context
            setErrors(prev => ({ ...prev, file: null }));
            console.log('File stored in Context:', fileData.name);
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
            addQuestionFile(null); // ✅ Remove from Context as well
            setErrors(prev => ({ ...prev, file: null }));
        }
    };

    // Option handlers (unchanged)
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

    // Validation (unchanged)
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

    // ✅ Updated Navigation handlers - NO FormData in navigation state
    const handleNext = () => {
        if (!validateForm()) {
            return;
        }

        // ✅ Prepare ONLY serializable question data
        const questionData = {
            // Basic information from previous steps
            exam_type,
            question_type_id,
            questionType: questionTypeName,
            cs_id,

            // Question content
            question: question.trim(),

            // MCQ specific data
            options: options.filter(opt => opt.trim() !== "").map(opt => opt.trim()),
            correctAnswer: correctAnswer.trim(),

            // Metadata (all serializable)
            createdAt: existingQuestionData?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            questionId: existingQuestionData?.questionId || `${questionTypeName}_${Date.now()}`,

            // Step tracking
            currentStep: 'content',
            completedSteps: ['exam-type', 'question-type', 'content']
        };

        console.log('✅ Navigating with serializable data only:', questionData);
        console.log('✅ File stored in Context:', hasQuestionFile ? 'Yes' : 'No');

        // ✅ Navigate with ONLY serializable data - NO FormData objects
        navigate('/admin/answer-explain', {
            state: {
                questionData: questionData,
                // ✅ Only pass file metadata for UI display, actual file is in Context
                hasFile: hasQuestionFile,
                fileInfo: selectedFile ? {
                    name: selectedFile.name,
                    type: selectedFile.type,
                    size: selectedFile.size
                    // ✅ No 'file' or 'url' properties to avoid serialization issues
                } : null,
                fromStep: 'content'
            }
        });
    };

    const handleBack = () => {
        // ✅ Prepare current data for potential restoration (all serializable)
        const currentQuestionData = {
            question: question.trim(),
            options: options,
            correctAnswer: correctAnswer.trim(),
            // ✅ No file objects in navigation state
        };

        navigate('/admin/question-type', {
            state: {
                exam_type,
                questionData: currentQuestionData,
                fromStep: 'content',
                cs_id
            }
        });
    };

    // Helper functions (unchanged)
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

    // Cleanup on unmount (unchanged)
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
                Test type &gt; Exam Type ({exam_type}) &gt; Question Type ({questionTypeName}) &gt; <strong>Question Content</strong>
            </Typography>

            {/* Title */}
            <Typography variant="h5" mt={2} mb={1}>
                Enter {questionTypeName} Question Content
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
                Write the question your students will answer — be clear, concise, and clinically relevant.
            </Typography>

            {/* ✅ Display selected types with Context status */}
            <Card sx={{ mb: 3, bgcolor: "#f0f0f0" }}>
                <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                        Selection Summary:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • Exam Type: {exam_type}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • Question Type: {questionTypeName} (ID: {question_type_id})
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • File Management: ✅ Using React Context (Navigation Safe)
                    </Typography>
                    {selectedFile && (
                        <Typography variant="body2" color="textSecondary">
                            • File Ready: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                            <Chip
                                label="Stored in Context"
                                size="small"
                                color="success"
                                variant="outlined"
                                sx={{ ml: 1 }}
                            />
                        </Typography>
                    )}
                </CardContent>
            </Card>

            {/* Context Status Display */}
            <Card sx={{ mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                        🗂️ File Context Status:
                    </Typography>
                    <Typography variant="body2">
                        • Question file in Context: {hasQuestionFile ? '✅ Available' : '➖ None'}
                    </Typography>
                    <Typography variant="body2">
                        • Navigation safety: ✅ No FormData objects in navigation state
                    </Typography>
                    <Typography variant="body2">
                        • File persistence: ✅ Files maintained across component navigation
                    </Typography>
                </CardContent>
            </Card>

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
                    {selectedFile ? 'Change Exhibit' : '+ Add Exhibit'}
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
                                    <Chip
                                        label="Context Managed"
                                        size="small"
                                        color="success"
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

            {/* ✅ Enhanced Form Summary with Context information */}
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
                        • Exhibit: {selectedFile ? `✓ ${selectedFile.name} (Context Managed)` : '○ Optional'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • Navigation: ✅ FormData-safe using React Context
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
