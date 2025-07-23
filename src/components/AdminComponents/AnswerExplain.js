import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    Grid,
    Card,
    CardContent,
    Chip,
    IconButton,
    Alert
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CloudUpload, Delete, Image, PictureAsPdf, Description } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const AnswerExplain = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Receive data from previous component
    const previousQuestionData = location.state?.questionData || {};

    // ✅ Initialize state with existing data or defaults
    const [explanationHeading, setExplanationHeading] = useState(
        previousQuestionData.explanationHeading || ""
    );
    const [explanationText, setExplanationText] = useState(
        previousQuestionData.explanationText || ""
    );
    const [additionalInfoHeading, setAdditionalInfoHeading] = useState(
        previousQuestionData.additionalInfoHeading || ""
    );
    const [additionalInfo, setAdditionalInfo] = useState(
        previousQuestionData.additionalInfo || ""
    );
    const [selectedFile, setSelectedFile] = useState(
        previousQuestionData.infoImage || null
    );
    const [errors, setErrors] = useState({});

    const fileInputRef = useRef(null);

    // ✅ Debug: Log received data
    useEffect(() => {
        console.log('Received data from previous component:', previousQuestionData);
        console.log('Question Type:', previousQuestionData.questionType);
        console.log('Question:', previousQuestionData.question);
        console.log('Options:', previousQuestionData.options);
        console.log('Correct Answer:', previousQuestionData.correctAnswer);
        console.log('Exhibit:', previousQuestionData.exhibit);
    }, [previousQuestionData]);

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
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, file: 'Only images and PDF files are allowed' }));
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
            console.log('File selected for explanation:', fileData);
        }
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

    // Validation
    const validateForm = () => {
        const newErrors = {};

        if (!explanationHeading.trim()) {
            newErrors.explanationHeading = 'Explanation heading is required';
        }

        if (!explanationText.trim()) {
            newErrors.explanationText = 'Explanation text is required';
        } else if (explanationText.trim().length < 20) {
            newErrors.explanationText = 'Explanation must be at least 20 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ Navigation handlers with data merging
    const handleNext = () => {
        if (!validateForm()) {
            return;
        }

        // ✅ Merge previous data with current explanation data
        const mergedQuestionData = {
            // ===== DATA FROM PREVIOUS COMPONENT =====
            ...previousQuestionData, // Spread all previous data first

            // ===== EXPLANATION DATA (current component) =====
            explanationHeading: explanationHeading.trim(),
            explanationText: explanationText.trim(),
            additionalInfoHeading: additionalInfoHeading.trim() || null,
            additionalInfo: additionalInfo.trim() || null,
            infoImage: selectedFile,

            // ===== METADATA UPDATES =====
            updatedAt: new Date().toISOString(),
            currentStep: 'explanation',
            completedSteps: [
                ...(previousQuestionData.completedSteps || ['content']),
                'explanation'
            ],

            // ===== PROGRESS TRACKING =====
            stepData: {
                ...(previousQuestionData.stepData || {}),
                explanation: {
                    explanationHeading: explanationHeading.trim(),
                    explanationText: explanationText.trim(),
                    additionalInfoHeading: additionalInfoHeading.trim() || null,
                    additionalInfo: additionalInfo.trim() || null,
                    infoImage: selectedFile,
                    completedAt: new Date().toISOString()
                }
            }
        };

        console.log('✅ MERGED DATA - Sending to MetaInfo component:', mergedQuestionData);
        console.log('📋 Complete question structure:', {
            questionType: mergedQuestionData.questionType,
            question: mergedQuestionData.question,
            options: mergedQuestionData.options,
            correctAnswer: mergedQuestionData.correctAnswer,
            exhibit: mergedQuestionData.exhibit,
            explanationHeading: mergedQuestionData.explanationHeading,
            explanationText: mergedQuestionData.explanationText,
            additionalInfo: mergedQuestionData.additionalInfo,
            infoImage: mergedQuestionData.infoImage
        });

        // Navigate to final step (MetaInfo) with merged data
        navigate('/admin/meta-info', {
            state: {
                questionData: mergedQuestionData,
                fromStep: 'explanation'
            }
        });
    };

    const handleBack = () => {
        // ✅ Preserve current explanation data when going back
        const currentExplanationData = {
            explanationHeading: explanationHeading.trim(),
            explanationText: explanationText.trim(),
            additionalInfoHeading: additionalInfoHeading.trim(),
            additionalInfo: additionalInfo.trim(),
            infoImage: selectedFile
        };

        // Merge with previous data to preserve all changes
        const dataToSendBack = {
            ...previousQuestionData,
            ...currentExplanationData,
            updatedAt: new Date().toISOString()
        };

        console.log('🔙 Going back with preserved data:', dataToSendBack);

        // Navigate back based on question type
        const questionType = previousQuestionData.questionType || 'MCQ';
        const backPath = `/admin/${questionType.toLowerCase().replace(/\s+/g, "-")}-content`;

        navigate(backPath, {
            state: {
                questionData: dataToSendBack,
                fromStep: 'explanation'
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
        return explanationHeading.trim() !== "" &&
            explanationText.trim() !== "" &&
            explanationText.trim().length >= 20;
    };

    // Cleanup on unmount
    useEffect(() => {
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
                Test type &gt; Question Type &gt; Question Content &gt; <strong>Explanation</strong>
            </Typography>

            {/* ✅ Display Question Preview from Previous Component */}
            {previousQuestionData.question && (
                <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom color="primary">
                            📝 Question Preview ({previousQuestionData.questionType || 'MCQ'})
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>Q:</strong> {previousQuestionData.question}
                        </Typography>

                        {/* Display Options */}
                        {previousQuestionData.options && previousQuestionData.options.length > 0 && (
                            <Box mb={2}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Answer Options:
                                </Typography>
                                {previousQuestionData.options.map((option, index) => (
                                    <Typography
                                        key={index}
                                        variant="body2"
                                        sx={{
                                            color: option === previousQuestionData.correctAnswer ? 'success.main' : 'text.secondary',
                                            fontWeight: option === previousQuestionData.correctAnswer ? 'bold' : 'normal',
                                            ml: 1
                                        }}
                                    >
                                        {String.fromCharCode(65 + index)}) {option}
                                        {option === previousQuestionData.correctAnswer && " ✅ Correct"}
                                    </Typography>
                                ))}
                            </Box>
                        )}

                        {/* Display Exhibit if exists */}
                        {previousQuestionData.exhibit && (
                            <Box>
                                <Typography variant="subtitle2" color="primary">
                                    📎 Question Exhibit: {previousQuestionData.exhibit.name}
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Title */}
            <Typography variant="h5" mt={2} mb={1}>
                Answer Explanation
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
                Provide detailed explanations to help students understand the correct answer and learn from mistakes.
            </Typography>

            {/* Explanation Heading */}
            <Typography variant="h6" mb={1} color="primary">
                Explanation Heading *
            </Typography>
            <TextField
                fullWidth
                label="Enter explanation heading"
                value={explanationHeading}
                onChange={(e) => {
                    setExplanationHeading(e.target.value);
                    setErrors(prev => ({ ...prev, explanationHeading: null }));
                }}
                variant="outlined"
                placeholder="e.g., Why this answer is correct"
                error={!!errors.explanationHeading}
                helperText={errors.explanationHeading}
                sx={{ mb: 3 }}
            />

            {/* Explanation Text Area */}
            <Typography variant="h6" mb={1} color="primary">
                Explanation Text *
            </Typography>
            <TextField
                fullWidth
                label="Enter detailed explanation"
                multiline
                minRows={4}
                maxRows={8}
                value={explanationText}
                onChange={(e) => {
                    setExplanationText(e.target.value);
                    setErrors(prev => ({ ...prev, explanationText: null }));
                }}
                variant="outlined"
                placeholder="Provide a comprehensive explanation of why this answer is correct. Include relevant clinical reasoning, pathophysiology, or nursing principles..."
                error={!!errors.explanationText}
                helperText={errors.explanationText || `${explanationText.length} characters (minimum 20 required)`}
                sx={{ mb: 3 }}
            />

            {/* Additional Info Heading */}
            <Typography variant="h6" mb={1} color="secondary">
                Additional Information Heading
            </Typography>
            <TextField
                fullWidth
                label="Enter additional info heading (Optional)"
                value={additionalInfoHeading}
                onChange={(e) => setAdditionalInfoHeading(e.target.value)}
                variant="outlined"
                placeholder="e.g., Important Notes, Clinical Tips, Remember"
                sx={{ mb: 3 }}
            />

            {/* Additional Info Text Area */}
            <Typography variant="h6" mb={1} color="secondary">
                Additional Information
            </Typography>
            <TextField
                fullWidth
                label="Enter additional information (Optional)"
                multiline
                minRows={3}
                maxRows={6}
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                variant="outlined"
                placeholder="Any additional tips, warnings, or supplementary information that would help students understand the concept better..."
                sx={{ mb: 3 }}
            />

            {/* File Upload Section */}
            <Typography variant="h6" mb={1} color="primary">
                Supporting Image/Document
            </Typography>
            <Box display="flex" justifyContent="flex-start" mb={2}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*,.pdf"
                    style={{ display: 'none' }}
                />
                <Button
                    variant="outlined"
                    onClick={handleButtonClick}
                    startIcon={<CloudUpload />}
                    size="medium"
                >
                    Add Supporting File
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
                                        width: 80,
                                        height: 80,
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

            {/* ✅ Form Summary - Shows merged data status */}
            <Card sx={{ mt: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
                <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                        📊 Complete Question Status:
                    </Typography>
                    <Typography variant="body2">
                        • Question Content: {previousQuestionData.question ? '✅ Complete' : '❌ Missing'}
                    </Typography>
                    <Typography variant="body2">
                        • Answer Options: {previousQuestionData.options?.length >= 2 ? '✅ Complete' : '❌ Missing'}
                    </Typography>
                    <Typography variant="body2">
                        • Correct Answer: {previousQuestionData.correctAnswer ? '✅ Complete' : '❌ Missing'}
                    </Typography>
                    <Typography variant="body2">
                        • Explanation Heading: {explanationHeading ? '✅ Complete' : '❌ Required'}
                    </Typography>
                    <Typography variant="body2">
                        • Explanation Text: {explanationText && explanationText.length >= 20 ? '✅ Complete' : '❌ Required (min. 20 chars)'}
                    </Typography>
                    <Typography variant="body2">
                        • Additional Info: {additionalInfo ? `✅ ${additionalInfo.length} characters` : '➖ Optional'}
                    </Typography>
                    <Typography variant="body2">
                        • Supporting File: {selectedFile ? `✅ ${selectedFile.name}` : '➖ Optional'}
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
                    Next: Add Tags & Submit
                </Button>
            </Box>
        </Box>
    );
};

export default AnswerExplain;
