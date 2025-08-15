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
import { useFileContext } from '../../context/FileContext'; // ✅ Import the Context

const DropdownQuestionContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // ✅ Use File Context instead of passing files through navigation
    const { addQuestionFile, questionFile, hasQuestionFile } = useFileContext();

    // Get any existing data from previous steps
    const existingData = location.state?.questionData || {};
    const questionType = location.state?.questionType || existingData.questionType || "Dropdown";
    const cs_id = location.state?.cs_id || "";
    const exam_type = location.state?.exam_type || "";
    const question_type_id = location.state?.question_type_id || "";

    // Form state
    const [question, setQuestion] = useState(existingData.question || "");
    const [tabs, setTabs] = useState(existingData.tabs || [
        { tabKey: "", tabValue: "" }
    ]);
    const [dropdowns, setDropdowns] = useState(existingData.dropdowns || [
        {
            dropdownField: "",
            dropdownanswer: "",
            blank_or_not: true,
            dropDowneOption: [""]
        }
    ]);
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

            // ✅ Store in both local state (for UI) and Context (for persistence)
            setSelectedFile(fileData);
            addQuestionFile(fileData); // Store in Context
            setErrors(prev => ({ ...prev, file: null }));

            console.log('File stored in Context:', fileData.name);
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
            addQuestionFile(null); // ✅ Remove from Context as well
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

    // ✅ Updated dropdown handlers to match the required data structure
    const handleDropdownFieldChange = (index, value) => {
        const newDropdowns = [...dropdowns];
        newDropdowns[index].dropdownField = value;
        setDropdowns(newDropdowns);
        setErrors(prev => ({ ...prev, dropdowns: null }));
    };

    const handleDropdownAnswerChange = (index, value) => {
        const newDropdowns = [...dropdowns];
        newDropdowns[index].dropdownanswer = value;
        setDropdowns(newDropdowns);
    };

    const handleDropdownOptionChange = (dropdownIndex, optionIndex, value) => {
        const newDropdowns = [...dropdowns];
        newDropdowns[dropdownIndex].dropDowneOption[optionIndex] = value;
        setDropdowns(newDropdowns);
        setErrors(prev => ({ ...prev, dropdowns: null }));
    };

    const handleAddDropdownOption = (dropdownIndex) => {
        const newDropdowns = [...dropdowns];
        newDropdowns[dropdownIndex].dropDowneOption.push("");
        setDropdowns(newDropdowns);
    };

    const handleRemoveDropdownOption = (dropdownIndex, optionIndex) => {
        const newDropdowns = [...dropdowns];
        if (newDropdowns[dropdownIndex].dropDowneOption.length > 1) {
            newDropdowns[dropdownIndex].dropDowneOption =
                newDropdowns[dropdownIndex].dropDowneOption.filter((_, i) => i !== optionIndex);
            setDropdowns(newDropdowns);
        }
    };

    const handleAddDropdown = () => {
        setDropdowns([...dropdowns, {
            dropdownField: "",
            dropdownanswer: "",
            blank_or_not: true,
            dropDowneOption: [""]
        }]);
    };

    const handleRemoveDropdown = (index) => {
        if (dropdowns.length > 1) {
            const newDropdowns = dropdowns.filter((_, i) => i !== index);
            setDropdowns(newDropdowns);
        }
    };

    const handleToggleBlankOrNot = (index) => {
        const newDropdowns = [...dropdowns];
        newDropdowns[index].blank_or_not = !newDropdowns[index].blank_or_not;
        setDropdowns(newDropdowns);
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
            (dropdown.blank_or_not === false || (dropdown.dropdownanswer.trim() && dropdown.dropDowneOption.some(val => val.trim())))
        );
        if (validDropdowns.length === 0) {
            newErrors.dropdowns = 'At least one dropdown with field and values is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ Navigation handlers - NO files in navigation state
    const handleNext = () => {
        if (!validateForm()) {
            return;
        }

        // ✅ Prepare ONLY serializable question data matching the required structure
        const questionData = {
            cs_id: cs_id,
            exam_type: exam_type,
            question_type_id: question_type_id,
            questionType: questionType,
            question: question.trim(),
            tabs: tabs.filter(tab => tab.tabKey.trim() && tab.tabValue.trim()),
            dropdowns: dropdowns.filter(dropdown =>
                dropdown.dropdownField.trim() &&
                (dropdown.blank_or_not === false || (dropdown.dropdownanswer.trim() && dropdown.dropDowneOption.some(val => val.trim())))
            ).map(dropdown => ({
                dropdownField: dropdown.dropdownField,
                dropdownanswer: dropdown.dropdownanswer,
                blank_or_not: dropdown.blank_or_not,
                dropDowneOption: dropdown.dropDowneOption.filter(val => val.trim())
            })),
            // ✅ No file objects in navigation state
            createdAt: existingData.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            questionId: existingData.questionId || `${questionType}_${Date.now()}`,
            currentStep: 'content',
            completedSteps: ['type', 'content']
        };

        console.log('✅ Navigating with serializable data only:', questionData);
        console.log('✅ File stored in Context:', hasQuestionFile ? 'Yes' : 'No');

        // ✅ Navigate with ONLY serializable data - NO file objects
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
        const currentData = {
            question: question.trim(),
            tabs: tabs,
            dropdowns: dropdowns,
            // ✅ No file objects in navigation state
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
        const hasValidTabs = tabs.some(tab => tab.tabKey.trim() && tab.tabValue.trim());
        const hasValidDropdowns = dropdowns.some(dropdown =>
            dropdown.dropdownField.trim() &&
            (dropdown.blank_or_not === false || (dropdown.dropdownanswer.trim() && dropdown.dropDowneOption.some(val => val.trim())))
        );

        return hasValidQuestion && hasValidTabs && hasValidDropdowns;
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

            {/* ✅ Context Status Display */}
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

            {/* ✅ Updated Dropdowns Section matching required structure */}
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
                                label="Dropdown Field Text"
                                value={dropdown.dropdownField}
                                onChange={(e) => handleDropdownFieldChange(dropdownIndex, e.target.value)}
                                placeholder="e.g., Based on the client's, And, this client is at highest risk for"
                                sx={{ mb: 2 }}
                                size="small"
                            />

                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                                <Button
                                    variant={dropdown.blank_or_not ? "contained" : "outlined"}
                                    onClick={() => handleToggleBlankOrNot(dropdownIndex)}
                                    size="small"
                                >
                                    {dropdown.blank_or_not ? "Dropdown Field" : "Text Only"}
                                </Button>
                                <Typography variant="caption" color="textSecondary">
                                    {dropdown.blank_or_not ? "Has dropdown options" : "Text field only"}
                                </Typography>
                            </Box>

                            {dropdown.blank_or_not && (
                                <>
                                    <TextField
                                        fullWidth
                                        label="Correct Answer"
                                        value={dropdown.dropdownanswer}
                                        onChange={(e) => handleDropdownAnswerChange(dropdownIndex, e.target.value)}
                                        placeholder="e.g., pneumonia, hemothorax"
                                        sx={{ mb: 2 }}
                                        size="small"
                                    />

                                    <Typography variant="subtitle2" mb={1}>
                                        Dropdown Options:
                                    </Typography>

                                    {dropdown.dropDowneOption.map((option, optionIndex) => (
                                        <Box key={optionIndex} display="flex" alignItems="center" gap={1} mb={1}>
                                            <TextField
                                                fullWidth
                                                placeholder={`Option ${optionIndex + 1}`}
                                                value={option}
                                                onChange={(e) => handleDropdownOptionChange(dropdownIndex, optionIndex, e.target.value)}
                                                size="small"
                                            />
                                            {dropdown.dropDowneOption.length > 1 && (
                                                <IconButton
                                                    onClick={() => handleRemoveDropdownOption(dropdownIndex, optionIndex)}
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
                                        onClick={() => handleAddDropdownOption(dropdownIndex)}
                                        variant="text"
                                        size="small"
                                    >
                                        Add Option
                                    </Button>
                                </>
                            )}
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

            {/* ✅ Enhanced Form Summary with Context information */}
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
                        • Dropdowns: {dropdowns.filter(d => d.dropdownField.trim() && (d.blank_or_not === false || (d.dropdownanswer.trim() && d.dropDowneOption.some(v => v.trim())))).length} valid dropdowns
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

export default DropdownQuestionContent;
