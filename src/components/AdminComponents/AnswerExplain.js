import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
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

    // ✅ Receive data including previous file information
    const previousQuestionData = location.state?.questionData || {};
    const hasQuestionFile = location.state?.hasFile || false;
    const questionFileInfo = location.state?.fileInfo || null;

    // Component state
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
    const [selectedFile, setSelectedFile] = useState(null);
    const [errors, setErrors] = useState({});

    const fileInputRef = useRef(null);

    // ✅ Restore previous question file if it exists
    useEffect(() => {
        if (hasQuestionFile && questionFileInfo && window.questionFileRef) {
            console.log('✅ Previous question file available:', questionFileInfo);
        }
    }, [hasQuestionFile, questionFileInfo]);

    // ✅ Create FormData factory function that includes BOTH files
    const createFormDataFactory = () => {
        return () => {
            const formData = new FormData();

            // Add basic question data
            formData.append('exam_type', previousQuestionData.exam_type || '');
            formData.append('question_type_id', previousQuestionData.question_type_id?.toString() || '');
            formData.append('questionType', previousQuestionData.questionType || '');
            formData.append('question', previousQuestionData.question || '');
            formData.append('correctAnswer', previousQuestionData.correctAnswer || '');
            formData.append('options', JSON.stringify(previousQuestionData.options || []));

            // Add explanation data
            formData.append('explanationHeading', explanationHeading.trim());
            formData.append('explanationText', explanationText.trim());
            formData.append('additionalInfoHeading', additionalInfoHeading.trim() || '');
            formData.append('additionalInfo', additionalInfo.trim() || '');

            // ✅ Add PREVIOUS question file (exhibit) if it exists
            if (hasQuestionFile && window.questionFileRef) {
                formData.append('exhibit', window.questionFileRef.file, window.questionFileRef.name);
                console.log('📎 Added previous question file to FormData:', window.questionFileRef.name);
            }

            // ✅ Add CURRENT explanation file if it exists
            if (selectedFile?.file) {
                formData.append('infoImage', selectedFile.file, selectedFile.name);
                console.log('📎 Added explanation file to FormData:', selectedFile.name);
            }

            // Add metadata
            formData.append('createdAt', previousQuestionData.createdAt || new Date().toISOString());
            formData.append('updatedAt', new Date().toISOString());
            formData.append('questionId', previousQuestionData.questionId || `${previousQuestionData.questionType}_${Date.now()}`);
            formData.append('currentStep', 'explanation');
            formData.append('completedSteps', JSON.stringify(['exam-type', 'question-type', 'content', 'explanation']));

            return formData;
        };
    };

    // File upload handlers for explanation file
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

    // ✅ Navigation handler with both files passed through
    const handleNext = () => {
        if (!validateForm()) {
            return;
        }

        // Create serializable data
        const mergedQuestionData = {
            // Previous step data
            exam_type: previousQuestionData.exam_type,
            question_type_id: previousQuestionData.question_type_id,
            questionType: previousQuestionData.questionType,
            question: previousQuestionData.question,
            options: previousQuestionData.options,
            correctAnswer: previousQuestionData.correctAnswer,
            createdAt: previousQuestionData.createdAt,
            questionId: previousQuestionData.questionId,

            // Current explanation data
            explanationHeading: explanationHeading.trim(),
            explanationText: explanationText.trim(),
            additionalInfoHeading: additionalInfoHeading.trim() || null,
            additionalInfo: additionalInfo.trim() || null,

            // File metadata for both files
            questionFileMeta: hasQuestionFile ? questionFileInfo : null,
            explanationFileMeta: selectedFile ? {
                name: selectedFile.name,
                size: selectedFile.size,
                type: selectedFile.type,
                uploadedAt: selectedFile.uploadedAt
            } : null,

            // Metadata
            updatedAt: new Date().toISOString(),
            currentStep: 'explanation',
            completedSteps: ['exam-type', 'question-type', 'content', 'explanation']
        };

        // ✅ Store FormData creation function globally
        window.createQuestionFormData = createFormDataFactory();

        // ✅ Store current explanation file reference globally
        if (selectedFile?.file) {
            window.explanationFileRef = {
                file: selectedFile.file,
                name: selectedFile.name
            };
        }

        // ✅ Ensure previous question file is still available
        // (This should already be set from the previous component, but we maintain it)
        if (hasQuestionFile && !window.questionFileRef) {
            console.warn('⚠️ Previous question file reference not found in global scope');
        }

        console.log('✅ Navigating with both files available:');
        console.log('📎 Question file:', hasQuestionFile ? questionFileInfo?.name : 'None');
        console.log('📎 Explanation file:', selectedFile?.name || 'None');

        // Navigate with complete file information
        navigate('/admin/meta-info', {
            state: {
                questionData: mergedQuestionData,

                // ✅ Pass information about BOTH files
                hasQuestionFile: hasQuestionFile,
                hasExplanationFile: !!selectedFile,

                // ✅ Pass metadata for BOTH files
                questionFileInfo: questionFileInfo,
                explanationFileInfo: selectedFile ? {
                    name: selectedFile.name,
                    type: selectedFile.type,
                    size: selectedFile.size,
                    uploadedAt: selectedFile.uploadedAt
                } : null,

                // ✅ File availability flags
                bothFilesAvailable: hasQuestionFile && !!selectedFile,
                formDataCreatorAvailable: true,
                fromStep: 'explanation'
            }
        });
    };

    const handleBack = () => {
        // Preserve current explanation data
        const dataToSendBack = {
            // Previous data
            exam_type: previousQuestionData.exam_type,
            question_type_id: previousQuestionData.question_type_id,
            questionType: previousQuestionData.questionType,
            question: previousQuestionData.question,
            options: previousQuestionData.options,
            correctAnswer: previousQuestionData.correctAnswer,
            createdAt: previousQuestionData.createdAt,
            questionId: previousQuestionData.questionId,

            // Current explanation data
            explanationHeading: explanationHeading.trim(),
            explanationText: explanationText.trim(),
            additionalInfoHeading: additionalInfoHeading.trim(),
            additionalInfo: additionalInfo.trim(),

            // Metadata
            updatedAt: new Date().toISOString()
        };

        navigate('/admin/mcq-content', {
            state: {
                questionData: dataToSendBack,
                hasFile: hasQuestionFile,
                fileInfo: questionFileInfo,
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
                Test type &gt; Exam Type ({previousQuestionData.exam_type}) &gt; Question Type ({previousQuestionData.questionType}) &gt; Question Content &gt; <strong>Explanation</strong>
            </Typography>

            {/* Question Preview with File Info */}
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

                        {/* ✅ Display Previous Question File Info */}
                        {hasQuestionFile && questionFileInfo && (
                            <Box sx={{ mt: 2, p: 1, bgcolor: 'primary.light', borderRadius: 1 }}>
                                <Typography variant="subtitle2" color="primary.contrastText">
                                    📎 Question Exhibit: {questionFileInfo.name}
                                </Typography>
                                <Typography variant="body2" color="primary.contrastText">
                                    Size: {formatFileSize(questionFileInfo.size)} |
                                    Type: {questionFileInfo.type} |
                                    Status: Available for FormData
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* ✅ File Status Display */}
            <Card sx={{ mb: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
                <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                        📂 File Management Status:
                    </Typography>
                    <Typography variant="body2">
                        • Previous question file: {hasQuestionFile ? `✅ ${questionFileInfo?.name}` : '➖ None'}
                    </Typography>
                    <Typography variant="body2">
                        • Current explanation file: {selectedFile ? `✅ ${selectedFile.name}` : '➖ None'}
                    </Typography>
                    <Typography variant="body2">
                        • FormData will include: {hasQuestionFile || selectedFile ?
                            `${hasQuestionFile ? 'exhibit' : ''}${hasQuestionFile && selectedFile ? ' + ' : ''}${selectedFile ? 'infoImage' : ''}` :
                            'text data only'}
                    </Typography>
                </CardContent>
            </Card>

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
                placeholder="Provide a comprehensive explanation of why this answer is correct..."
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
                placeholder="Any additional tips, warnings, or supplementary information..."
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
                    {selectedFile ? 'Change Supporting File' : 'Add Supporting File'}
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
                                        label="Ready for FormData"
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

            {/* ✅ Enhanced Form Summary showing both files */}
            <Card sx={{ mt: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
                <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                        📊 Complete Form Status:
                    </Typography>
                    <Typography variant="body2">
                        • Question Content: {previousQuestionData.question ? '✅ Complete' : '❌ Missing'}
                    </Typography>
                    <Typography variant="body2">
                        • Previous Question File: {hasQuestionFile ? `✅ ${questionFileInfo?.name}` : '➖ None'}
                    </Typography>
                    <Typography variant="body2">
                        • Explanation Heading: {explanationHeading ? '✅ Complete' : '❌ Required'}
                    </Typography>
                    <Typography variant="body2">
                        • Explanation Text: {explanationText && explanationText.length >= 20 ? '✅ Complete' : '❌ Required'}
                    </Typography>
                    <Typography variant="body2">
                        • Explanation File: {selectedFile ? `✅ ${selectedFile.name}` : '➖ Optional'}
                    </Typography>
                    <Typography variant="body2">
                        • Total Files for FormData: {(hasQuestionFile ? 1 : 0) + (selectedFile ? 1 : 0)}
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
