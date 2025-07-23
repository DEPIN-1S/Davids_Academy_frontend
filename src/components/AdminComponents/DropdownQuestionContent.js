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
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CloudUpload, Delete, Image, PictureAsPdf, Description, ExpandMore } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const DropdownQuestionContent = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get any existing data from previous steps
    const existingData = location.state?.questionData || {};
    const questionType = location.state?.questionType || existingData.questionType || "Dropdown";

    // Form state
    const [question, setQuestion] = useState(existingData.question || "");
    const [tabs, setTabs] = useState(existingData.tabs || [
        { tabKey: "", tabValue: "" }
    ]);
    const [dropdowns, setDropdowns] = useState(existingData.dropdowns || [
        { dropdownField: "", dropDownValue: [""] }
    ]);
    const [answers, setAnswers] = useState(existingData.answers || [
        { dropdownField: "", dropdownValue: "" }
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

    // Tab handlers
    const handleTabChange = (index, field, value) => {
        const newTabs = [...tabs];
        newTabs[index][field] = value;
        setTabs(newTabs);
        setErrors(prev => ({ ...prev, tabs: null }));
    };

    const handleAddTab = () => {
        setTabs([...tabs, { tabKey: "", tabValue: "" }]);
    };

    const handleRemoveTab = (index) => {
        if (tabs.length > 1) {
            const newTabs = tabs.filter((_, i) => i !== index);
            setTabs(newTabs);
        }
    };

    // Dropdown handlers
    const handleDropdownFieldChange = (index, value) => {
        const newDropdowns = [...dropdowns];
        newDropdowns[index].dropdownField = value;
        setDropdowns(newDropdowns);
        setErrors(prev => ({ ...prev, dropdowns: null }));
    };

    const handleDropdownValueChange = (dropdownIndex, valueIndex, value) => {
        const newDropdowns = [...dropdowns];
        newDropdowns[dropdownIndex].dropDownValue[valueIndex] = value;
        setDropdowns(newDropdowns);
        setErrors(prev => ({ ...prev, dropdowns: null }));
    };

    const handleAddDropdownValue = (dropdownIndex) => {
        const newDropdowns = [...dropdowns];
        newDropdowns[dropdownIndex].dropDownValue.push("");
        setDropdowns(newDropdowns);
    };

    const handleRemoveDropdownValue = (dropdownIndex, valueIndex) => {
        const newDropdowns = [...dropdowns];
        if (newDropdowns[dropdownIndex].dropDownValue.length > 1) {
            newDropdowns[dropdownIndex].dropDownValue = newDropdowns[dropdownIndex].dropDownValue.filter((_, i) => i !== valueIndex);
            setDropdowns(newDropdowns);
        }
    };

    const handleAddDropdown = () => {
        setDropdowns([...dropdowns, { dropdownField: "", dropDownValue: [""] }]);
    };

    const handleRemoveDropdown = (index) => {
        if (dropdowns.length > 1) {
            const newDropdowns = dropdowns.filter((_, i) => i !== index);
            setDropdowns(newDropdowns);

            // Remove corresponding answer
            const newAnswers = answers.filter((_, i) => i !== index);
            setAnswers(newAnswers);
        }
    };

    // Answer handlers
    const handleAnswerChange = (index, field, value) => {
        const newAnswers = [...answers];
        if (newAnswers[index]) {
            newAnswers[index][field] = value;
        } else {
            newAnswers[index] = { dropdownField: "", dropdownValue: "" };
            newAnswers[index][field] = value;
        }
        setAnswers(newAnswers);
        setErrors(prev => ({ ...prev, answers: null }));
    };

    // Validation
    const validateForm = () => {
        const newErrors = {};

        if (!question.trim()) {
            newErrors.question = 'Question is required';
        }

        const validTabs = tabs.filter(tab => tab.tabKey.trim() && tab.tabValue.trim());
        if (validTabs.length === 0) {
            newErrors.tabs = 'At least one tab with key and value is required';
        }

        const validDropdowns = dropdowns.filter(dropdown =>
            dropdown.dropdownField.trim() &&
            dropdown.dropDownValue.some(val => val.trim())
        );
        if (validDropdowns.length === 0) {
            newErrors.dropdowns = 'At least one dropdown with field and values is required';
        }

        const validAnswers = answers.filter(answer =>
            answer.dropdownField && answer.dropdownField.trim() &&
            answer.dropdownValue && answer.dropdownValue.trim()
        );
        if (validAnswers.length === 0) {
            newErrors.answers = 'At least one answer mapping is required';
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
            questionType: questionType,
            question: question.trim(),
            tabs: tabs.filter(tab => tab.tabKey.trim() && tab.tabValue.trim()),
            dropdowns: dropdowns.filter(dropdown =>
                dropdown.dropdownField.trim() &&
                dropdown.dropDownValue.some(val => val.trim())
            ).map(dropdown => ({
                ...dropdown,
                dropDownValue: dropdown.dropDownValue.filter(val => val.trim())
            })),
            answers: answers.filter(answer =>
                answer.dropdownField && answer.dropdownField.trim() &&
                answer.dropdownValue && answer.dropdownValue.trim()
            ),
            exhibit: selectedFile,
            createdAt: existingData.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            questionId: existingData.questionId || `${questionType}_${Date.now()}`,
            currentStep: 'content',
            completedSteps: ['type', 'content']
        };

        console.log('Sending dropdown question data:', questionData);

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
            tabs: tabs,
            dropdowns: dropdowns,
            answers: answers,
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
        const hasValidQuestion = question.trim() !== "";
        const hasValidTabs = tabs.some(tab => tab.tabKey.trim() && tab.tabValue.trim());
        const hasValidDropdowns = dropdowns.some(dropdown =>
            dropdown.dropdownField.trim() &&
            dropdown.dropDownValue.some(val => val.trim())
        );
        const hasValidAnswers = answers.some(answer =>
            answer.dropdownField && answer.dropdownField.trim() &&
            answer.dropdownValue && answer.dropdownValue.trim()
        );

        return hasValidQuestion && hasValidTabs && hasValidDropdowns && hasValidAnswers;
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
        <Box p={3} maxWidth="900px" mx="auto">
            {/* Breadcrumb */}
            <Typography variant="caption" color="textSecondary" mb={2} display="block">
                Test type &gt; Question Type &gt; <strong>Question Content</strong>
            </Typography>

            {/* Title */}
            <Typography variant="h5" mt={2} mb={1}>
                Enter Dropdown Question Content
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
                Create a dropdown question with multiple tabs and dropdown selections.
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
                placeholder="Type your dropdown question here..."
                error={!!errors.question}
                helperText={errors.question}
                sx={{ mb: 3 }}
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

            {/* Tabs Section */}
            <Accordion defaultExpanded sx={{ mb: 3 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" color="primary">
                        Question Tabs * ({tabs.length})
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {tabs.map((tab, index) => (
                        <Card key={index} sx={{ mb: 2, p: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="subtitle1">Tab {index + 1}</Typography>
                                {tabs.length > 1 && (
                                    <IconButton
                                        onClick={() => handleRemoveTab(index)}
                                        color="error"
                                        size="small"
                                    >
                                        <Delete />
                                    </IconButton>
                                )}
                            </Box>

                            <TextField
                                fullWidth
                                label="Tab Key/Title"
                                value={tab.tabKey}
                                onChange={(e) => handleTabChange(index, 'tabKey', e.target.value)}
                                placeholder="e.g., Triage Note, Vital Signs"
                                sx={{ mb: 2 }}
                                size="small"
                            />

                            <TextField
                                fullWidth
                                label="Tab Content"
                                multiline
                                minRows={3}
                                value={tab.tabValue}
                                onChange={(e) => handleTabChange(index, 'tabValue', e.target.value)}
                                placeholder="Enter the content that will be displayed in this tab..."
                            />
                        </Card>
                    ))}

                    <Button
                        startIcon={<AddIcon />}
                        onClick={handleAddTab}
                        variant="outlined"
                        size="small"
                    >
                        Add Tab
                    </Button>

                    {errors.tabs && (
                        <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                            {errors.tabs}
                        </Typography>
                    )}
                </AccordionDetails>
            </Accordion>

            {/* Dropdowns Section */}
            <Accordion defaultExpanded sx={{ mb: 3 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" color="primary">
                        Dropdown Fields * ({dropdowns.length})
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {dropdowns.map((dropdown, dropdownIndex) => (
                        <Card key={dropdownIndex} sx={{ mb: 2, p: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="subtitle1">Dropdown {dropdownIndex + 1}</Typography>
                                {dropdowns.length > 1 && (
                                    <IconButton
                                        onClick={() => handleRemoveDropdown(dropdownIndex)}
                                        color="error"
                                        size="small"
                                    >
                                        <Delete />
                                    </IconButton>
                                )}
                            </Box>

                            <TextField
                                fullWidth
                                label="Dropdown Label/Field"
                                value={dropdown.dropdownField}
                                onChange={(e) => handleDropdownFieldChange(dropdownIndex, e.target.value)}
                                placeholder="e.g., tachypnea, dull percussion"
                                sx={{ mb: 2 }}
                                size="small"
                            />

                            <Typography variant="subtitle2" mb={1}>
                                Dropdown Options:
                            </Typography>

                            {dropdown.dropDownValue.map((value, valueIndex) => (
                                <Box key={valueIndex} display="flex" alignItems="center" gap={1} mb={1}>
                                    <TextField
                                        fullWidth
                                        placeholder={`Option ${valueIndex + 1}`}
                                        value={value}
                                        onChange={(e) => handleDropdownValueChange(dropdownIndex, valueIndex, e.target.value)}
                                        size="small"
                                    />
                                    {dropdown.dropDownValue.length > 1 && (
                                        <IconButton
                                            onClick={() => handleRemoveDropdownValue(dropdownIndex, valueIndex)}
                                            color="error"
                                            size="small"
                                        >
                                            <Delete />
                                        </IconButton>
                                    )}
                                </Box>
                            ))}

                            <Button
                                startIcon={<AddIcon />}
                                onClick={() => handleAddDropdownValue(dropdownIndex)}
                                variant="text"
                                size="small"
                            >
                                Add Option
                            </Button>
                        </Card>
                    ))}

                    <Button
                        startIcon={<AddIcon />}
                        onClick={handleAddDropdown}
                        variant="outlined"
                        size="small"
                    >
                        Add Dropdown
                    </Button>

                    {errors.dropdowns && (
                        <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                            {errors.dropdowns}
                        </Typography>
                    )}
                </AccordionDetails>
            </Accordion>

            {/* Answers Section */}
            <Accordion defaultExpanded sx={{ mb: 3 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" color="primary">
                        Correct Answers * ({answers.length})
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {dropdowns.map((dropdown, index) => (
                        <Card key={index} sx={{ mb: 2, p: 2 }}>
                            <Typography variant="subtitle1" mb={2}>
                                Answer for: {dropdown.dropdownField || `Dropdown ${index + 1}`}
                            </Typography>

                            <Box display="flex" gap={2}>
                                <TextField
                                    label="Dropdown Field"
                                    value={answers[index]?.dropdownField || dropdown.dropdownField}
                                    onChange={(e) => handleAnswerChange(index, 'dropdownField', e.target.value)}
                                    size="small"
                                    sx={{ flex: 1 }}
                                />

                                <TextField
                                    label="Correct Answer"
                                    value={answers[index]?.dropdownValue || ""}
                                    onChange={(e) => handleAnswerChange(index, 'dropdownValue', e.target.value)}
                                    placeholder="Select from dropdown options"
                                    size="small"
                                    sx={{ flex: 1 }}
                                />
                            </Box>

                            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                                Available options: {dropdown.dropDownValue.filter(v => v.trim()).join(', ')}
                            </Typography>
                        </Card>
                    ))}

                    {errors.answers && (
                        <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                            {errors.answers}
                        </Typography>
                    )}
                </AccordionDetails>
            </Accordion>

            {/* Form Summary */}
            <Card sx={{ mt: 3, bgcolor: 'grey.50' }}>
                <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                        Dropdown Question Summary:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • Question: {question ? '✓ Complete' : '✗ Required'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • Tabs: {tabs.filter(tab => tab.tabKey.trim() && tab.tabValue.trim()).length} valid tabs
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • Dropdowns: {dropdowns.filter(d => d.dropdownField.trim() && d.dropDownValue.some(v => v.trim())).length} valid dropdowns
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • Answers: {answers.filter(a => a.dropdownField && a.dropdownValue).length} mappings defined
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

export default DropdownQuestionContent;
