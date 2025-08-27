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
    AccordionDetails,
    Grid
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CloudUpload, Delete, Image, PictureAsPdf, Description, ExpandMore, DragIndicator } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFileContext } from '../../context/FileContext'; // ✅ Import the Context


const DragdropQuestionContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // ✅ Use File Context instead of passing files through navigation
    const { addQuestionFile, questionFile, hasQuestionFile } = useFileContext();
    // Get any existing data from previous steps
    const existingData = location.state?.questionData || {};
    const questionType = location.state?.questionType || existingData.questionType || "Drag Drop";
    const  cs_id = location.state?.cs_id || "";
    const exam_type = location.state?.exam_type || "";
    const question_type_id = location.state?.question_type_id || "";

    // Form state
    const [question, setQuestion] = useState(existingData.question || "");
    const [dragDropContent, setDragDropContent] = useState(existingData.drag_drop_content || "");
    const [tabs, setTabs] = useState(existingData.tabs || [
        { tabKey: "", tabValue: "" }
    ]);
    const [dragAndDrop, setDragAndDrop] = useState(existingData.drag_and_drop || [
        {
            option_heading: "",
            question_answer: "",
            option_value: [""]
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

    // Drag and Drop handlers
    const handleDragDropHeadingChange = (index, value) => {
        const newDragAndDrop = [...dragAndDrop];
        newDragAndDrop[index].option_heading = value;
        setDragAndDrop(newDragAndDrop);
        setErrors(prev => ({ ...prev, dragAndDrop: null }));
    };

    const handleDragDropAnswerChange = (index, value) => {
        const newDragAndDrop = [...dragAndDrop];
        newDragAndDrop[index].question_answer = value;
        setDragAndDrop(newDragAndDrop);
    };

    const handleDragDropOptionChange = (sectionIndex, optionIndex, value) => {
        const newDragAndDrop = [...dragAndDrop];
        newDragAndDrop[sectionIndex].option_value[optionIndex] = value;
        setDragAndDrop(newDragAndDrop);
    };

    const handleAddDragDropOption = (sectionIndex) => {
        const newDragAndDrop = [...dragAndDrop];
        newDragAndDrop[sectionIndex].option_value.push("");
        setDragAndDrop(newDragAndDrop);
    };

    const handleRemoveDragDropOption = (sectionIndex, optionIndex) => {
        const newDragAndDrop = [...dragAndDrop];
        if (newDragAndDrop[sectionIndex].option_value.length > 1) {
            newDragAndDrop[sectionIndex].option_value = newDragAndDrop[sectionIndex].option_value.filter((_, i) => i !== optionIndex);
            setDragAndDrop(newDragAndDrop);
        }
    };

    const handleAddDragDropSection = () => {
        setDragAndDrop([...dragAndDrop, {
            option_heading: "",
            question_answer: "",
            option_value: [""]
        }]);
    };

    const handleRemoveDragDropSection = (index) => {
        if (dragAndDrop.length > 1) {
            const newDragAndDrop = dragAndDrop.filter((_, i) => i !== index);
            setDragAndDrop(newDragAndDrop);
        }
    };

    // Validation
    const validateForm = () => {
        const newErrors = {};

        if (!question.trim()) {
            newErrors.question = 'Question is required';
        }

        if (!dragDropContent.trim()) {
            newErrors.dragDropContent = 'Drag drop content description is required';
        }

        const validTabs = tabs.filter(tab => tab.tabKey.trim() && tab.tabValue.trim());
        if (validTabs.length === 0) {
            newErrors.tabs = 'At least one tab with key and value is required';
        }

        const validSections = dragAndDrop.filter(section =>
            section.option_heading.trim() &&
            section.question_answer.trim() &&
            section.option_value.some(val => val.trim())
        );
        if (validSections.length === 0) {
            newErrors.dragAndDrop = 'At least one drag and drop section with heading, answer, and options is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ Navigation handlers - NO files in navigation state
    const handleNext = () => {
        if (!validateForm()) {
            return;
        }
        // ✅ Prepare ONLY serializable question data
        const questionData = {
            cs_id:cs_id,
            exam_type:exam_type,
            questionType: questionType,
            question_type_id:question_type_id,
            question: question.trim(),
            drag_drop_content: dragDropContent.trim(),
            tabs: tabs.filter(tab => tab.tabKey.trim() && tab.tabValue.trim()),
            drag_and_drop: dragAndDrop.filter(section =>
                section.option_heading.trim() &&
                section.question_answer.trim() &&
                section.option_value.some(val => val.trim())
            ).map(section => ({
                ...section,
                option_value: section.option_value.filter(val => val.trim())
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
            drag_drop_content: dragDropContent.trim(),
            tabs: tabs,
            drag_and_drop: dragAndDrop,
         
            // ✅ No file objects in navigation state
        };

        navigate('/admin/question-type', {
            state: {
                questionData: currentData,
                fromStep: 'content',
                 cs_id
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
        const hasValidContent = dragDropContent.trim() !== "";
        const hasValidTabs = tabs.some(tab => tab.tabKey.trim() && tab.tabValue.trim());
        const hasValidSections = dragAndDrop.some(section =>
            section.option_heading.trim() &&
            section.question_answer.trim() &&
            section.option_value.some(val => val.trim())
        );

        return hasValidQuestion && hasValidContent && hasValidTabs && hasValidSections;
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
                Enter Drag & Drop Question Content
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
                Create a drag and drop question with multiple tabs and draggable sections.
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
                placeholder="Type your drag and drop question here..."
                error={!!errors.question}
                helperText={errors.question}
                sx={{ mb: 3 }}
            />

            {/* Drag Drop Content Description */}
            <Typography variant="h6" mb={1} color="primary">
                Drag & Drop Content Description *
            </Typography>
            <TextField
                fullWidth
                label="Content Description"
                value={dragDropContent}
                onChange={(e) => {
                    setDragDropContent(e.target.value);
                    setErrors(prev => ({ ...prev, dragDropContent: null }));
                }}
                variant="outlined"
                placeholder="e.g., Most likely experiencing, Action to take, etc."
                error={!!errors.dragDropContent}
                helperText={errors.dragDropContent || "Brief description of what students will be doing"}
                sx={{ mb: 3 }}
            />

            {/* File Upload Section */}
            {/* <Box display="flex" justifyContent="flex-end" mt={1} mb={3} gap={1}>
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

           
            {errors.file && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.file}
                </Alert>
            )} */}

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

            {/* Drag & Drop Sections */}
            <Accordion defaultExpanded sx={{ mb: 3 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" color="primary">
                        Drag & Drop Sections * ({dragAndDrop.length})
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {dragAndDrop.map((section, sectionIndex) => (
                        <Card key={sectionIndex} sx={{ mb: 3, p: 2, border: '2px solid', borderColor: 'primary.light' }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <DragIndicator color="action" />
                                    <Typography variant="subtitle1">
                                        Section {sectionIndex + 1}: {section.option_heading || 'Untitled'}
                                    </Typography>
                                </Box>
                                {dragAndDrop.length > 1 && (
                                    <IconButton
                                        onClick={() => handleRemoveDragDropSection(sectionIndex)}
                                        color="error"
                                        size="small"
                                    >
                                        <Delete />
                                    </IconButton>
                                )}
                            </Box>

                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Section Heading"
                                         value={section.option_heading}
                                        onChange={(e) => handleDragDropHeadingChange(sectionIndex, e.target.value)}
                                        placeholder="e.g., Action to take, Parameter to Monitor"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Correct Answer"
                                        value={section.question_answer}
                                        onChange={(e) => handleDragDropAnswerChange(sectionIndex, e.target.value)}
                                        placeholder="e.g., Option 1, Option 2"
                                        size="small"
                                    />
                                </Grid>
                            </Grid>

                            <Typography variant="subtitle2" mb={1}>
                                Draggable Options:
                            </Typography>

                            {section.option_value.map((option, optionIndex) => (
                                <Box key={optionIndex} display="flex" alignItems="center" gap={1} mb={1}>
                                    <Typography variant="body2" sx={{ minWidth: 60 }}>
                                        Option {optionIndex + 1}:
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder={`Draggable option ${optionIndex + 1}`}
                                        value={option}
                                        onChange={(e) => handleDragDropOptionChange(sectionIndex, optionIndex, e.target.value)}
                                        size="small"
                                    />
                                    {section.option_value.length > 1 && (
                                        <IconButton
                                            onClick={() => handleRemoveDragDropOption(sectionIndex, optionIndex)}
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
                                onClick={() => handleAddDragDropOption(sectionIndex)}
                                variant="text"
                                size="small"
                                color="primary"
                            >
                                Add Option
                            </Button>
                        </Card>
                    ))}

                    <Button
                        startIcon={<AddIcon />}
                        onClick={handleAddDragDropSection}
                        variant="outlined"
                        size="small"
                    >
                        Add Drag & Drop Section
                    </Button>

                    {errors.dragAndDrop && (
                        <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                            {errors.dragAndDrop}
                        </Typography>
                    )}
                </AccordionDetails>
            </Accordion>

            {/* ✅ Enhanced Form Summary with Context information */}
            <Card sx={{ mt: 3, bgcolor: 'grey.50' }}>
                <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                        Drag & Drop Question Summary:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • Question: {question ? '✓ Complete' : '✗ Required'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • Content Description: {dragDropContent ? '✓ Complete' : '✗ Required'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • Tabs: {tabs.filter(tab => tab.tabKey.trim() && tab.tabValue.trim()).length} valid tabs
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • Drag & Drop Sections: {dragAndDrop.filter(s => s.option_heading.trim() && s.question_answer.trim() && s.option_value.some(v => v.trim())).length} complete sections
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

export default DragdropQuestionContent;
