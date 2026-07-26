import React, { useState } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    IconButton,
    Card,
    CardContent,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    Select,
    MenuItem
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CloudUpload, Delete, Image, PictureAsPdf, Description, ExpandMore, DragIndicator } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFileContext } from '../../context/FileContext'; // ✅ Import the Context
import { deleteTabImage, uploadTabImage, getQuestionData } from "../../features/exam/examSlice";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from 'react-quill-new'; // <-- CHANGE THIS
import 'react-quill-new/dist/quill.snow.css';


const DragdropQuestionContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // ✅ Use File Context instead of passing files through navigation
    const { addQuestionFile, questionFile, hasQuestionFile } = useFileContext();
    // Get any existing data from previous steps
    const existingData = location.state?.questionData || {};
    const questionType = location.state?.questionType || existingData.questionType || "Drag Drop";
    const cs_id = location.state?.cs_id || existingData.cs_id || "";
    const exam_type = location.state?.exam_type || existingData.exam_type || "";
    const question_type_id = location.state?.question_type_id || existingData.question_type_id || "";
    const topic_id = location.state?.topic_id || existingData.topic_id || "";
    const [instruction, setInstruction] = useState(existingData.instruction || "")
    // Form state
    const [question, setQuestion] = useState(existingData.question || "");
    const [dragDropContent, setDragDropContent] = useState(existingData.drag_drop_content || "");
    const [tabs, setTabs] = useState(existingData.tabs || [
        { tabKey: "", tabValue: "" }
    ]);


    const [dragAndDrop, setDragAndDrop] = useState(
        existingData.drag_and_drop || Array.from({ length: 5 }, () => ({
            option_heading: "",
            question_answer: "",
            option_value: [""],
        }))
    );

    const dispatch = useDispatch();
    const { questionData: fetchedQuestionData } = useSelector((state) => state.exam);
    const editQuestionId = location.state?.questionId || existingData.id;

    // ✅ Fetch full Drag & Drop question details when editing
    React.useEffect(() => {
        if (editQuestionId) {
            dispatch(getQuestionData(editQuestionId));
        }
    }, [dispatch, editQuestionId]);

    // ✅ Populate form state when fetchedQuestionData arrives
    React.useEffect(() => {
        if (editQuestionId && fetchedQuestionData?.data) {
            const q = fetchedQuestionData.data;
            if (q.question) setQuestion(q.question);
            if (q.instructions) setInstruction(q.instructions);
            if (q.drag_drop_content) setDragDropContent(q.drag_drop_content);
            if (q.tabsInfo && q.tabsInfo.length > 0) {
                setTabs(
                    q.tabsInfo.map((t) => ({
                        tabKey: t.tabKey || "",
                        tabValue: t.tabValue || "",
                        tabImage: t.tabImage || "",
                    }))
                );
            }
            if (q.branches && q.branches.length > 0) {
                setDragAndDrop(
                    q.branches.map((b) => ({
                        id: b.id,
                        option_heading: b.heading || b.option_heading || "",
                        question_answer: b.answer || b.question_answer || "",
                        option_value: Array.isArray(b.dragdropoption)
                            ? b.dragdropoption.map((o) => typeof o === "string" ? o : (o.option_value || o.option || o.value || ""))
                            : [""],
                    }))
                );
            }
        }
    }, [editQuestionId, fetchedQuestionData]);

    const [selectedFile, setSelectedFile] = useState(null); // ✅ Local state for UI, Context for persistence
    const [errors, setErrors] = useState({});


    // Add this definition near your other constants/modules
    const tabModules = {
        toolbar: [
            ['bold', 'italic', 'underline'], // Basic formatting
            [{ 'list': 'bullet' }], // Bullet points
            [{ 'color': [] },],

        ],
        clipboard: {
            matchVisual: false, // Important!
        },
    };

    const tabFormats = [
        'bold', 'italic', 'underline',
        'list', 'bullet',
        'link',
        'color',
    ];


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

        // ✅ Require ALL sections to be valid
        const allValidSections = dragAndDrop.every(section =>
            section.option_heading.trim() &&
            section.question_answer.trim() &&
            section.option_value.some(val => val.trim())
        );
        if (!allValidSections) {
            newErrors.dragAndDrop = 'All 5 drag and drop sections must have heading, answer, and options';
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
            cs_id: cs_id, topic_id: topic_id,
            exam_type: exam_type,
            questionType: questionType,
            question_type_id: question_type_id,
            question: question.trim(),
            drag_drop_content: dragDropContent.trim(),
            instruction: instruction.trim(),
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
                cs_id, topic_id, exam_type, question_type_id
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
        if (location.state?.isEdit && question && question.trim()) return true;
        const hasValidQuestion = question.trim() !== "";
        return hasValidQuestion;
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

            {/* Title + Back Button Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={3}>
                <Box>
                    <Typography variant="h5" mb={0.5}>
                        {location.state?.isEdit ? "Edit Drag & Drop Question" : "Enter Drag & Drop Question Content"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Create or edit a drag and drop question with multiple tabs and draggable sections.
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/admin/question-management")}
                    sx={{
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: 600,
                        color: "#1976d2",
                        borderColor: "#1976d2",
                        "&:hover": {
                            borderColor: "#115293",
                            backgroundColor: "#e3f2fd",
                        },
                    }}
                >
                    Back to Question Management
                </Button>
            </Box>

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

                            <Box sx={{ minHeight: '170px', mb: 2 }}> {/* Added marginBottom for spacing */}
                                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Tab Content</Typography>
                                <ReactQuill
                                    theme="snow"
                                    value={tab.tabValue} // Bind to tab.tabValue
                                    onChange={(content) =>
                                        // Crucial: React-Quill returns the HTML string directly
                                        handleTabChange(index, "tabValue", content)
                                    }
                                    modules={tabModules} // Use the specific modules for tabs
                                    formats={tabFormats}
                                    placeholder="Enter the content that will be displayed in this tab..."
                                    // Setting a fixed height helps prevent layout shifts
                                    style={{ height: '120px', borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}
                                />
                            </Box>


                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="flex-start"
                                mt={5}
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
                        <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                            {errors.tabs}
                        </Typography>
                    )}
                </AccordionDetails>
            </Accordion>


            <Typography variant="h6" mb={1} color="primary">
                Instruction*
            </Typography>
            <TextField
                fullWidth
                label="Enter Question instruction"
                multiline
                minRows={3}
                maxRows={6}
                value={instruction}
                onChange={(e) => {
                    setInstruction(e.target.value);
                    setErrors(prev => ({ ...prev, instruction: null }));
                }}
                variant="outlined"
                placeholder="Type your drag drop question instruction here..."
                error={!!errors.instruction}
                helperText={errors.instruction}
                sx={{ mb: 3 }}
            />

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
                                    {/* <TextField
                                        fullWidth
                                        label="Correct Answer"
                                        value={section.question_answer}
                                        onChange={(e) => handleDragDropAnswerChange(sectionIndex, e.target.value)}
                                        placeholder="e.g., Option 1, Option 2"
                                        size="small"
                                    /> */}

                                    <Select
                                        sx={{ color: "gray" }}
                                        fullWidth
                                        size="small"
                                        value={section.question_answer || ""}
                                        onChange={(e) => handleDragDropAnswerChange(sectionIndex, e.target.value)}
                                        displayEmpty
                                    >
                                        <MenuItem value="" sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                                            <em>Select Correct Answer</em>
                                        </MenuItem>
                                        {section.option_value
                                            .filter(option => option.trim() !== "") // only that section's options
                                            .map((option, optionIndex) => (
                                                <MenuItem key={optionIndex} value={option} sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                    </Select>



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

                    {/* <Button
                        startIcon={<AddIcon />}
                        onClick={handleAddDragDropSection}
                        variant="outlined"
                        size="small"
                    >
                        Add Drag & Drop Section
                    </Button> */}

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
