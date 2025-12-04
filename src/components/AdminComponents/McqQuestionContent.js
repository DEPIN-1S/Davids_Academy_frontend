import React, { useRef, useState } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    IconButton,
    FormControl,
    Card,
    CardContent,
    Chip,
    Radio,
    Alert,
    Checkbox,
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

import { useDispatch } from "react-redux";
import { deleteTabImage, uploadTabImage } from "../../features/exam/examSlice";

const McqQuestionContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch()
    // ✅ Use File Context instead of passing files through navigation
    const { addQuestionFile, questionFile, hasQuestionFile } = useFileContext();
    const state = location.state || {};
    const {
        exam_type,
        question_type_id,
        questionType: questionTypeName,
        questionData: existingQuestionData,
        cs_id,
    } = state;
    const [instruction, setInstruction] = useState(existingQuestionData?.instruction || "")
    React.useEffect(() => {
        if (!exam_type || !question_type_id || !questionTypeName || !cs_id) {
            navigate("/admin/question-type");
        }
    }, [exam_type, question_type_id, questionTypeName, cs_id, navigate]);

    // Form state - initialize with existing data if available
    const [question, setQuestion] = useState(existingQuestionData?.question || "");
    const [options, setOptions] = useState(existingQuestionData?.options || ["", ""]);
    const [correctAnswer, setCorrectAnswer] = useState(
        Array.isArray(existingQuestionData?.correctAnswer)
            ? existingQuestionData.correctAnswer
            : []
    );

    const [selectedFile, setSelectedFile] = useState(null);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    React.useEffect(() => {
        if (questionFile) {
            setSelectedFile(questionFile);
        }
    }, [questionFile]);

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
            addQuestionFile(fileData);
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
            addQuestionFile(null);
            setErrors(prev => ({ ...prev, file: null }));
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
        setErrors(prev => ({ ...prev, options: null }));
    };

    const handleAddOption = () => {
        if (options.length < 6) {
            setOptions([...options, ""]);
        }
    };

    const handleRemoveOption = (index) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
            setErrors(prev => ({ ...prev, options: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!question.trim()) {
            newErrors.question = 'Question is required';
        } else if (question.trim().length < 10) {
            newErrors.question = 'Question must be at least 10 characters long';
        }
        const validOptions = options.filter(opt => opt.trim() !== "");
        if (validOptions.length < 2) {
            newErrors.options = 'At least 2 options are required';
        }

        const uniqueOptions = new Set(validOptions.map(opt => opt.trim().toLowerCase()));
        if (uniqueOptions.size !== validOptions.length) {
            newErrors.options = 'Options must be unique';
        }

        if (correctAnswer.length === 0) {
            newErrors.correctAnswer = 'Please select at least one correct answer';
        } else if (!correctAnswer.every(ans => validOptions.includes(ans))) {
            newErrors.correctAnswer = 'All correct answers must be from the provided options';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };



    //tabs section 
    const [tabs, setTabs] = useState(
        existingQuestionData?.tabs || [{ tabKey: "", tabValue: "" }]
    );


    // ✅ Initialize with existing file from context if available
    React.useEffect(() => {
        if (questionFile) {
            setSelectedFile(questionFile);
        }
    }, [questionFile]);

    // here tab image is added to backend when user selects image from their local machine at that moment api call is triggered

    // File upload handler for tab image
    const handleTabFileUpload = async (index, event) => {
        const file = event.target.files[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            setErrors((prev) => ({
                ...prev,
                [`tabFile_${index}`]: "Only images are allowed",
            }));
            return;
        }

        // Local preview
        const previewUrl = URL.createObjectURL(file);
        const newTabs = [...tabs];
        newTabs[index].previewUrl = previewUrl;
        setTabs(newTabs);

        try {
            // Upload immediately
            const result = await dispatch(uploadTabImage(file)).unwrap();
            console.log("Upload result:", result);

            // ✅ Store uploaded image URL in `tabImage` key
            newTabs[index].tabImage = result?.data?.imageUrl || null;
            setTabs(newTabs);
        } catch (err) {
            console.error("Upload failed:", err);
            setErrors((prev) => ({
                ...prev,
                [`tabFile_${index}`]: "Upload failed. Try again.",
            }));
            newTabs[index].previewUrl = null;
            setTabs(newTabs);
        }
    };

    // Delete handler
    const handleDeleteTabImage = async (index) => {
        const tab = tabs[index];
        console.log("Inside delete img::");

        if (!tab.tabImage) {
            // No uploaded image, just remove preview
            const newTabs = [...tabs];
            newTabs[index].previewUrl = null;
            setTabs(newTabs);
            return;
        }

        try {
            console.log("Inside try :::");

            // Extract only filename
            const fileName = tab.tabImage.split("/").pop();
            console.log("Sending filename to delete API:", fileName);
            // Call delete API
            await dispatch(deleteTabImage(fileName)).unwrap();
            const newTabs = [...tabs];
            newTabs[index].previewUrl = null;
            newTabs[index].tabImage = null; // ✅ Clear tabImage
            setTabs(newTabs);

            console.log("Tab image deleted successfully");
        } catch (error) {
            console.error("Failed to delete tab image:", error);
        }
    };

    // Tab handlers
    const handleTabChange = (index, field, value) => {
        const newTabs = [...tabs];
        newTabs[index][field] = value;
        setTabs(newTabs);
        setErrors((prev) => ({ ...prev, tabs: null }));
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


    const handleNext = () => {
        if (!validateForm()) {
            return;
        }

        const questionData = {
            exam_type,
            question_type_id,
            questionType: questionTypeName,
            cs_id,
            tabs: tabs.filter((tab) => tab.tabKey.trim() && tab.tabValue.trim()),
            question: question.trim(),
            options: options.filter(opt => opt.trim() !== "").map(opt => opt.trim()),
            correctAnswer: correctAnswer,
            instruction: instruction.trim(),
            createdAt: existingQuestionData?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            questionId: existingQuestionData?.questionId || `${questionTypeName}_${Date.now()}`,
            currentStep: 'content',
            completedSteps: ['exam-type', 'question-type', 'content']
        };

        navigate('/admin/answer-explain', {
            state: {
                questionData: questionData,
                hasFile: hasQuestionFile,
                fileInfo: selectedFile ? {
                    name: selectedFile.name,
                    type: selectedFile.type,
                    size: selectedFile.size
                } : null,
                fromStep: 'content'
            }
        });
    };

    const handleBack = () => {
        const currentQuestionData = {
            question: question.trim(),
            options: options,
            correctAnswer: correctAnswer,
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

    // ✅ FIXED: updated to work with array
    const isFormValid = () => {
        const validOptions = options.filter(opt => opt.trim() !== "");
        
        return (
            question.trim() !== "" &&
            question.trim().length >= 10 &&
            validOptions.length >= 2 &&
            correctAnswer.length > 0 &&
            correctAnswer.every(ans => validOptions.includes(ans))

        );
    };


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

            <Accordion defaultExpanded sx={{ mb: 3 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" color="primary">
                        Question Tabs * ({tabs.length})
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {tabs.map((tab, index) => (
                        <Card key={index} sx={{ mb: 2, p: 2 }}>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                mb={2}
                            >
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
                                onChange={(e) =>
                                    handleTabChange(index, "tabKey", e.target.value)
                                }
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
                                onChange={(e) =>
                                    handleTabChange(index, "tabValue", e.target.value)
                                }
                                placeholder="Enter the content that will be displayed in this tab..."
                            />

                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="flex-start"
                                mt={2}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    id={`tab-file-input-${index}`}
                                    onChange={(e) => handleTabFileUpload(index, e)}
                                />
                                <Button
                                    variant="outlined"
                                    component="span"
                                    onClick={() =>
                                        document.getElementById(`tab-file-input-${index}`).click()
                                    }
                                    startIcon={<CloudUpload />}
                                    size="small"
                                >
                                    {tab.previewUrl ? "Change Image" : "Add Image"}
                                </Button>

                                {/*   {tab.previewUrl && (
                                    <Box mt={1}>
                                        <img
                                            src={tab.previewUrl}
                                            alt={`Tab ${index} preview`}
                                            style={{ maxWidth: "200px", maxHeight: "150px", objectFit: "cover", borderRadius: "4px" }}
                                        />
                                    </Box>
                                )} */}
                                {tab.previewUrl && (
                                    <Box mt={1} display="flex" alignItems="center" gap={1}>
                                        <img
                                            src={tab.previewUrl}
                                            alt={`Tab ${index} preview`}
                                            style={{
                                                maxWidth: "200px",
                                                maxHeight: "150px",
                                                objectFit: "cover",
                                                borderRadius: "4px",
                                            }}
                                        />
                                        <IconButton
                                            onClick={() => handleDeleteTabImage(index)}
                                            color="error"
                                            size="small"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                )}

                                {errors[`tabFile_${index}`] && (
                                    <Typography variant="caption" color="error">
                                        {errors[`tabFile_${index}`]}
                                    </Typography>
                                )}
                            </Box>
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
                        <Typography
                            color="error"
                            variant="caption"
                            sx={{ display: "block", mt: 1 }}
                        >
                            {errors.tabs}
                        </Typography>
                    )}
                </AccordionDetails>
            </Accordion>

            <Typography variant="h6" mb={1} color="primary">
                Instruction *
            </Typography>
            <TextField
                fullWidth
                label="Enter Question Instruction *"
                multiline
                minRows={3}
                maxRows={6}
                value={instruction}
                onChange={(e) => {
                    setInstruction(e.target.value);
                    setErrors(prev => ({ ...prev, instruction: null }));
                }}
                variant="outlined"
                placeholder="Type your question instruction here..."
                error={!!errors.instruction}
                sx={{ mb: 3 }}
            />


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
                <Typography variant="subtitle1" mb={1}>
                    Select Correct Answer(s) *
                </Typography>

                {options.filter(opt => opt.trim() !== "").length === 0 ? (
                    <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                        ➡️ Please add answer options to select correct answers
                    </Typography>
                ) : (
                    options
                        .filter(opt => opt.trim() !== "")
                        .map((opt, idx) => (
                            <Box key={idx} display="flex" alignItems="center" mb={1}>
                                <Checkbox
                                    checked={correctAnswer.includes(opt)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setCorrectAnswer([...correctAnswer, opt]);
                                        } else {
                                            setCorrectAnswer(correctAnswer.filter(ans => ans !== opt));
                                        }
                                        setErrors(prev => ({ ...prev, correctAnswer: null }));
                                    }}
                                    size="small"
                                    color="success"
                                />
                                <Typography variant="body2">
                                    {String.fromCharCode(65 + idx)}) {opt}
                                </Typography>
                            </Box>
                        ))
                )}

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

