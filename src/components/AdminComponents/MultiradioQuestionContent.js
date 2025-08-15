import React, { useState, useRef } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    IconButton,
    Radio,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    Chip,
    Alert,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper,
    Divider
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CloudUpload, Delete, Image, PictureAsPdf, Description, ExpandMore } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
// ✅ Updated import path (might need adjustment based on your project structure)
import { useFileContext } from '../../context/FileContext'; // or '../../context/FileContext'

const MultiradioQuestionContent = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Use File Context instead of passing files through navigation
    const { addQuestionFile, questionFile, hasQuestionFile } = useFileContext();

    // Get any existing data from previous steps
    const existingData = location.state?.questionData || {};
    const questionType = location.state?.questionType || existingData.questionType || "Multiple Radio";
    const cs_id = location.state?.cs_id || "";
    const exam_type = location.state?.exam_type || "";
    const question_type_id = location.state?.question_type_id || "";

    // Form state
    const [question, setQuestion] = useState(existingData.question || "");
    const [tabs, setTabs] = useState(existingData.tabs || [
        { tabKey: "", tabValue: "" }
    ]);
    const [questionContent, setQuestionContent] = useState(existingData.question_content || [
        { question_text: "", question_answer: "" }
    ]);
    const [radioOptions, setRadioOptions] = useState(existingData.radio_options || [
        { option_value: "" }
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

    // Question content handlers (sentences)
    const handleQuestionTextChange = (index, value) => {
        const newQuestionContent = [...questionContent];
        newQuestionContent[index].question_text = value;
        setQuestionContent(newQuestionContent);
        setErrors(prev => ({ ...prev, questionContent: null }));
    };

    const handleQuestionAnswerChange = (index, value) => {
        const newQuestionContent = [...questionContent];
        newQuestionContent[index].question_answer = value;
        setQuestionContent(newQuestionContent);
    };

    const handleAddQuestion = () => {
        setQuestionContent([...questionContent, { question_text: "", question_answer: "" }]);
    };

    const handleRemoveQuestion = (index) => {
        if (questionContent.length > 1) {
            const newQuestionContent = questionContent.filter((_, i) => i !== index);
            setQuestionContent(newQuestionContent);
        }
    };

    // Radio options handlers
    const handleRadioOptionChange = (index, value) => {
        const newRadioOptions = [...radioOptions];
        newRadioOptions[index].option_value = value;
        setRadioOptions(newRadioOptions);
        setErrors(prev => ({ ...prev, radioOptions: null }));
    };

    const handleAddRadioOption = () => {
        setRadioOptions([...radioOptions, { option_value: "" }]);
    };

    const handleRemoveRadioOption = (index) => {
        if (radioOptions.length > 2) {
            const newRadioOptions = radioOptions.filter((_, i) => i !== index);
            setRadioOptions(newRadioOptions);
        }
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

        const validQuestions = questionContent.filter(q => q.question_text.trim() && q.question_answer.trim());
        if (validQuestions.length === 0) {
            newErrors.questionContent = 'At least one sentence with answer is required';
        }

        const validRadioOptions = radioOptions.filter(option => option.option_value.trim());
        if (validRadioOptions.length < 2) {
            newErrors.radioOptions = 'At least two radio options are required';
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
            cs_id: cs_id,
            exam_type: exam_type,
            question_type_id: question_type_id,
            questionType: questionType,
            question: question.trim(),
            tabs: tabs.filter(tab => tab.tabKey.trim() && tab.tabValue.trim()),
            question_content: questionContent.filter(q => q.question_text.trim() && q.question_answer.trim()),
            radio_options: radioOptions.filter(option => option.option_value.trim()),
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
            question_content: questionContent,
            radio_options: radioOptions,
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
        const hasValidQuestions = questionContent.some(q => q.question_text.trim() && q.question_answer.trim());
        const hasValidRadioOptions = radioOptions.filter(option => option.option_value.trim()).length >= 2;
        return hasValidQuestion && hasValidTabs && hasValidQuestions && hasValidRadioOptions;
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
                Enter Multiple Radio Question Content
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
                Create a multiple radio question with tabs and sentence-based radio selections.
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
                placeholder="Type your multiple radio question here..."
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

            {/* Radio Options Section */}
            <Accordion defaultExpanded sx={{ mb: 3 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" color="primary">
                        Radio Button Options * ({radioOptions.length})
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body2" color="textSecondary" mb={2}>
                        These are the answer choices that will be available for each sentence.
                    </Typography>

                    {radioOptions.map((option, index) => (
                        <Box key={index} display="flex" alignItems="center" gap={1} mb={1}>
                            <Typography variant="body2" sx={{ minWidth: 80 }}>
                                Option {index + 1}:
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder={`Radio option ${index + 1}`}
                                value={option.option_value}
                                onChange={(e) => handleRadioOptionChange(index, e.target.value)}
                                size="small"
                            />
                            {radioOptions.length > 2 && (
                                <IconButton
                                    onClick={() => handleRemoveRadioOption(index)}
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
                        onClick={handleAddRadioOption}
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1 }}
                    >
                        Add Radio Option
                    </Button>

                    {errors.radioOptions && (
                        <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                            {errors.radioOptions}
                        </Typography>
                    )}
                </AccordionDetails>
            </Accordion>

            {/* Question Content/Sentences Section */}
            <Accordion defaultExpanded sx={{ mb: 3 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" color="primary">
                        Sentences & Answers * ({questionContent.length})
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body2" color="textSecondary" mb={2}>
                        Add sentences and select the correct answer for each from the radio options above.
                    </Typography>

                    {questionContent.map((content, index) => (
                        <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="subtitle1">Sentence {index + 1}</Typography>
                                {questionContent.length > 1 && (
                                    <IconButton
                                        onClick={() => handleRemoveQuestion(index)}
                                        color="error"
                                        size="small"
                                    >
                                        <Delete />
                                    </IconButton>
                                )}
                            </Box>

                            <TextField
                                fullWidth
                                label="Sentence Text"
                                multiline
                                minRows={2}
                                value={content.question_text}
                                onChange={(e) => handleQuestionTextChange(index, e.target.value)}
                                placeholder="Enter the sentence or statement..."
                                sx={{ mb: 2 }}
                            />

                            <FormControl fullWidth>
                                <InputLabel>Correct Answer</InputLabel>
                                <Select
                                    value={content.question_answer}
                                    onChange={(e) => handleQuestionAnswerChange(index, e.target.value)}
                                    label="Correct Answer"
                                >
                                    {radioOptions.filter(opt => opt.option_value.trim()).map((option, optIdx) => (
                                        <MenuItem key={optIdx} value={option.option_value}>
                                            {option.option_value}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Visual Preview */}
                            <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                <Typography variant="caption" color="textSecondary">Preview:</Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    {content.question_text || "Sentence text will appear here..."}
                                </Typography>
                                {radioOptions.filter(opt => opt.option_value.trim()).map((option, optIdx) => (
                                    <Box key={optIdx} display="flex" alignItems="center" gap={1}>
                                        <Radio
                                            checked={content.question_answer === option.option_value}
                                            size="small"
                                            disabled
                                        />
                                        <Typography variant="body2">{option.option_value}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    ))}

                    <Button
                        startIcon={<AddIcon />}
                        onClick={handleAddQuestion}
                        variant="outlined"
                        size="small"
                    >
                        Add Sentence
                    </Button>

                    {errors.questionContent && (
                        <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                            {errors.questionContent}
                        </Typography>
                    )}
                </AccordionDetails>
            </Accordion>

            {/* ✅ Enhanced Form Summary with Context information */}
            <Card sx={{ mt: 3, bgcolor: 'grey.50' }}>
                <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                        Multiple Radio Question Summary:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • Question: {question ? '✓ Complete' : '✗ Required'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • Tabs: {tabs.filter(tab => tab.tabKey.trim() && tab.tabValue.trim()).length} valid tabs
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • Radio Options: {radioOptions.filter(opt => opt.option_value.trim()).length} options
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • Sentences: {questionContent.filter(q => q.question_text.trim() && q.question_answer.trim()).length} complete sentences
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

export default MultiradioQuestionContent;
