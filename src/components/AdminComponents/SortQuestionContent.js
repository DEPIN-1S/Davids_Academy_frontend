import React, { useState, useRef } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    IconButton,
    Card,
    CardContent,
    Chip,
    Alert,
    Paper
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CloudUpload, Delete, Image, PictureAsPdf, Description, DragIndicator } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const SortQuestionContent = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get any existing data from previous steps
    const existingData = location.state?.questionData || {};
    const questionType = location.state?.questionType || existingData.questionType || "Sorting";
    const cs_id = location.state?.cs_id || "";
    const exam_type = location.state?.exam_type || "";
    const question_type_id = location.state?.question_type_id || "";

    // Form state
    const [question, setQuestion] = useState(existingData.question || "");
    const [sortItems, setSortItems] = useState(existingData.sortItems || [
        { sortItem: "", itemOrder: 1 }
    ]);
    const [selectedFile, setSelectedFile] = useState(existingData.exhibit || null);
    const [errors, setErrors] = useState({});

    const fileInputRef = useRef(null);

    // File upload handlers
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, file: 'File size must be less than 10MB' }));
                return;
            }

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

    // Sort item handlers
    const handleSortItemChange = (index, value) => {
        const newSortItems = [...sortItems];
        newSortItems[index].sortItem = value;
        setSortItems(newSortItems);
        setErrors(prev => ({ ...prev, sortItems: null }));
    };

    const handleSortOrderChange = (index, value) => {
        const newSortItems = [...sortItems];
        const orderValue = parseInt(value) || 1;
        newSortItems[index].itemOrder = orderValue;
        setSortItems(newSortItems);
    };

    const handleAddSortItem = () => {
        const newOrder = sortItems.length + 1;
        setSortItems([...sortItems, { sortItem: "", itemOrder: newOrder }]);
    };

    const handleRemoveSortItem = (index) => {
        if (sortItems.length > 1) {
            const newSortItems = sortItems.filter((_, i) => i !== index);
            // Reorder the remaining items
            const reorderedItems = newSortItems.map((item, idx) => ({
                ...item,
                itemOrder: idx + 1
            }));
            setSortItems(reorderedItems);
        }
    };

    const moveSortItem = (index, direction) => {
        const newSortItems = [...sortItems];
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex >= 0 && newIndex < sortItems.length) {
            // Swap items
            [newSortItems[index], newSortItems[newIndex]] = [newSortItems[newIndex], newSortItems[index]];

            // Update order numbers
            const reorderedItems = newSortItems.map((item, idx) => ({
                ...item,
                itemOrder: idx + 1
            }));

            setSortItems(reorderedItems);
        }
    };

    // Validation
    const validateForm = () => {
        const newErrors = {};

        if (!question.trim()) {
            newErrors.question = 'Question is required';
        }

        const validSortItems = sortItems.filter(item => item.sortItem.trim());
        if (validSortItems.length < 2) {
            newErrors.sortItems = 'At least two sort items are required';
        }

        // Check for duplicate order numbers
        const orders = sortItems.map(item => item.itemOrder);
        const uniqueOrders = new Set(orders);
        if (uniqueOrders.size !== orders.length) {
            newErrors.sortItems = 'Each item must have a unique order number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Navigation handlers
    const handleNext = () => {
        if (!validateForm()) {
            return;
        }

        const questionData = {
            cs_id: cs_id,
            exam_type: exam_type,
            question_type_id: question_type_id,
            questionType: questionType,
            question: question.trim(),
            sortItems: sortItems.filter(item => item.sortItem.trim()).map((item, index) => ({
                sortItem: item.sortItem.trim(),
                itemOrder: index + 1 // Ensure sequential ordering
            })),
            exhibit: selectedFile,
            createdAt: existingData.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            questionId: existingData.questionId || `${questionType}_${Date.now()}`,
            currentStep: 'content',
            completedSteps: ['type', 'content']
        };

        console.log('Sending sorting question data:', questionData);

        navigate('/admin/answer-explain', {
            state: {
                questionData: questionData,
                fromStep: 'content'
            }
        });
    };

    const handleBack = () => {
        const currentData = {
            question: question.trim(),
            sortItems: sortItems,
            exhibit: selectedFile
        };

        navigate('/admin/question-type', {
            state: {
                questionData: currentData,
                fromStep: 'content',
                cs_id: cs_id,
                exam_type: exam_type,
                question_type_id: question_type_id,
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
        const hasValidQuestion = question.trim() !== "";
        const hasValidSortItems = sortItems.filter(item => item.sortItem.trim()).length >= 2;
        return hasValidQuestion && hasValidSortItems;
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
                Enter Sorting Question Content
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
                Create a sorting question where students need to arrange items in the correct order.
            </Typography>

            {/* Question Input */}
            <Typography variant="h6" mb={1} color="primary">
                Question Text *
            </Typography>
            <TextField
                fullWidth
                label="Enter your question"
                multiline
                minRows={3}
                maxRows={6}
                value={question}
                onChange={(e) => {
                    setQuestion(e.target.value);
                    setErrors(prev => ({ ...prev, question: null }));
                }}
                variant="outlined"
                placeholder="Type your sorting question here (e.g., 'Arrange the steps in the correct order for performing...')"
                error={!!errors.question}
                helperText={errors.question}
                sx={{ mb: 3 }}
            />

            {/* File Upload Section */}
          {/*   <Box display="flex" justifyContent="flex-end" mt={1} mb={3} gap={1}>
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

          
            {errors.file && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.file}
                </Alert>
            )}
 */}
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
                                <Chip
                                    label={formatFileSize(selectedFile.size)}
                                    size="small"
                                    variant="outlined"
                                />
                            </Box>
                            {selectedFile.type.startsWith('image/') && (
                                <Box
                                    component="img"
                                    src={selectedFile.url}
                                    alt={selectedFile.name}
                                    sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                                />
                            )}
                            <IconButton onClick={handleRemoveFile} color="error" size="small">
                                <Delete />
                            </IconButton>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Sort Items Section */}
            <Typography variant="h6" mb={2} color="primary">
                Sort Items * (Correct Order)
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={2}>
                Add the steps/items that students need to sort. The order you create here will be the correct answer.
            </Typography>

            {sortItems.map((item, index) => (
                <Paper key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <DragIndicator color="action" />
                            <Typography variant="h6" color="primary" sx={{ minWidth: 40, textAlign: 'center' }}>
                                {index + 1}
                            </Typography>
                        </Box>

                        <TextField
                            fullWidth
                            label={`Step ${index + 1}`}
                            multiline
                            minRows={2}
                            value={item.sortItem}
                            onChange={(e) => handleSortItemChange(index, e.target.value)}
                            placeholder={`Enter step ${index + 1} description...`}
                            sx={{ flex: 1 }}
                        />

                        <Box display="flex" flexDirection="column" gap={1}>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => moveSortItem(index, 'up')}
                                disabled={index === 0}
                            >
                                ↑
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => moveSortItem(index, 'down')}
                                disabled={index === sortItems.length - 1}
                            >
                                ↓
                            </Button>
                        </Box>

                        {sortItems.length > 1 && (
                            <IconButton
                                onClick={() => handleRemoveSortItem(index)}
                                color="error"
                                size="small"
                            >
                                <Delete />
                            </IconButton>
                        )}
                    </Box>
                </Paper>
            ))}

            <Button
                startIcon={<AddIcon />}
                onClick={handleAddSortItem}
                variant="outlined"
                sx={{ mb: 3 }}
            >
                Add Sort Item
            </Button>

            {errors.sortItems && (
                <Typography color="error" variant="caption" sx={{ display: 'block', mb: 2 }}>
                    {errors.sortItems}
                </Typography>
            )}

            {/* Preview Section */}
            <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                        📋 Correct Order Preview
                    </Typography>
                    <Typography variant="body2" color="textSecondary" mb={2}>
                        This is how the correct sequence will look:
                    </Typography>
                    {sortItems.filter(item => item.sortItem.trim()).map((item, index) => (
                        <Box key={index} display="flex" alignItems="center" gap={1} mb={1}>
                            <Chip
                                label={index + 1}
                                size="small"
                                color="primary"
                                sx={{ minWidth: 30 }}
                            />
                            <Typography variant="body2">
                                {item.sortItem || `Step ${index + 1} - Not filled`}
                            </Typography>
                        </Box>
                    ))}
                </CardContent>
            </Card>

            {/* Form Summary */}
            <Card sx={{ mb: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
                <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                        Sorting Question Summary:
                    </Typography>
                    <Typography variant="body2">
                        • Question: {question ? '✅ Complete' : '❌ Required'}
                    </Typography>
                    <Typography variant="body2">
                        • Sort Items: {sortItems.filter(item => item.sortItem.trim()).length} items ({sortItems.filter(item => item.sortItem.trim()).length >= 2 ? '✅' : '❌'} min. 2 required)
                    </Typography>
                    <Typography variant="body2">
                        • File Attachment: {selectedFile ? `✅ ${selectedFile.name}` : '➖ Optional'}
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

export default SortQuestionContent;
