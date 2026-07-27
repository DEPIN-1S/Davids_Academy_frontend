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
    FormControlLabel,
    Checkbox
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Delete, ExpandMore, Image, PictureAsPdf, Description } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFileContext } from '../../context/FileContext'; // ✅ Import the Context
import { useDispatch, useSelector } from "react-redux";
import { getQuestionData } from "../../features/exam/examSlice";

const FillinQuestionContent = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Use File Context instead of passing files through navigation
    const { addQuestionFile, questionFile, hasQuestionFile } = useFileContext();

    // Get any existing data from previous steps
    const existingData = location.state?.questionData || {};
    const cs_id = location.state?.cs_id || existingData.cs_id || "";
    const exam_type = location.state?.exam_type || existingData.exam_type || "";
    const question_type_id = location.state?.question_type_id || existingData.question_type_id || "";
    const topic_id = location.state?.topic_id || existingData.topic_id || "";
    const questionType = "Fill in the Blanks";

    // Form state
    const [question, setQuestion] = useState(existingData.question || "");
    const [tabs, setTabs] = useState(existingData.tabs || [
        { tabKey: "", tabValue: "" }
    ]);
    const [questionContent, setQuestionContent] = useState(existingData.question_content || [
        { question_text: "", fill_blanks_answer: "", blank_or_not: "false" }
    ]);
    const [options, setOptions] = useState(existingData.options || [
        { option_heading: "", option_value: [""] }
    ]);
    // ✅ Generate answer field from question content
    const [answer, setAnswer] = useState(existingData.answer || "");
    const [selectedFile, setSelectedFile] = useState(null); // ✅ Local state for UI, Context for persistence


    const dispatch = useDispatch();
    const { questionData: fetchedQuestionData } = useSelector((state) => state.exam);
    const editQuestionId = location.state?.questionId || existingData.id;

    // ✅ Fetch full question details when editing
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
            if (q.tabsInfo && q.tabsInfo.length > 0) {
                setTabs(
                    q.tabsInfo.map((t) => ({
                        tabKey: t.tabKey || "",
                        tabValue: t.tabValue || "",
                        tabImage: t.tabImage || "",
                    }))
                );
            }
            if (q.FTBquestion_content && q.FTBquestion_content.length > 0) {
                setQuestionContent(q.FTBquestion_content);
            }
            if (q.FTBoptions) {
                setOptions([{
                    option_heading: q.FTBoptions.heading || "",
                    option_value: Array.isArray(q.FTBoptions.options)
                        ? q.FTBoptions.options.map(o => typeof o === "string" ? o : (o.option_value || o.option || o.value || ""))
                        : [""]
                }]);
            }
        }
    }, [editQuestionId, fetchedQuestionData]);

    // ✅ Initialize with existing file from context if available
    React.useEffect(() => {
        if (questionFile) {
            setSelectedFile(questionFile);
        }
    }, [questionFile]);

    // ✅ Generate answer string from question content
    React.useEffect(() => {
        const answerParts = [];
        questionContent.forEach(content => {
            if (content.blank_or_not === "true" && content.fill_blanks_answer.trim()) {
                answerParts.push(content.fill_blanks_answer.trim());
            } else if (content.blank_or_not === "false" && content.question_text.trim()) {
                answerParts.push(content.question_text.trim());
            }
        });
        setAnswer(answerParts.join(' '));
    }, [questionContent]);

    const handleRemoveFile = () => {
        if (selectedFile) {
            URL.revokeObjectURL(selectedFile.url);
            setSelectedFile(null);
            addQuestionFile(null); // ✅ Remove from Context as well
        }
    };

    // Tab handlers
    const handleTabChange = (index, field, value) => {
        const newTabs = [...tabs];
        newTabs[index][field] = value;
        setTabs(newTabs);
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

    // Question content handlers
    const handleQuestionContentChange = (index, field, value) => {
        const newContent = [...questionContent];
        newContent[index][field] = value;
        setQuestionContent(newContent);
    };

    const handleAddQuestionContent = () => {
        setQuestionContent([...questionContent, { question_text: "", fill_blanks_answer: "", blank_or_not: "false" }]);
    };

    const handleRemoveQuestionContent = (index) => {
        if (questionContent.length > 1) {
            const newContent = questionContent.filter((_, i) => i !== index);
            setQuestionContent(newContent);
        }
    };

    // Options handlers
    const handleOptionChange = (optionIndex, field, value) => {
        const newOptions = [...options];
        newOptions[optionIndex][field] = value;
        setOptions(newOptions);
    };

    const handleOptionValueChange = (optionIndex, valueIndex, value) => {
        const newOptions = [...options];
        newOptions[optionIndex].option_value[valueIndex] = value;
        setOptions(newOptions);
    };

    const handleAddOptionValue = (optionIndex) => {
        const newOptions = [...options];
        newOptions[optionIndex].option_value.push("");
        setOptions(newOptions);
    };

    const handleRemoveOptionValue = (optionIndex, valueIndex) => {
        const newOptions = [...options];
        if (newOptions[optionIndex].option_value.length > 1) {
            newOptions[optionIndex].option_value.splice(valueIndex, 1);
            setOptions(newOptions);
        }
    };

    const handleAddOption = () => {
        setOptions([...options, { option_heading: "", option_value: [""] }]);
    };

    const handleRemoveOption = (index) => {
        if (options.length > 1) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };

    // ✅ Navigation handlers - NO files in navigation state
    const handleNext = () => {
        const realQuestionId = location.state?.questionId || location.state?.id || location.state?.questionData?.id || location.state?.questionData?.questionId || fetchedQuestionData?.data?.id || null;
        const isEditMode = location.state?.isEdit || Boolean(realQuestionId);

        const questionData = {
            cs_id: cs_id, topic_id: topic_id,
            exam_type: exam_type,
            question_type_id: question_type_id,
            questionType: questionType,
            question: question.trim(),
            answer: answer,
            tabs: tabs.filter(tab => tab.tabKey.trim() || tab.tabValue.trim()),
            question_content: questionContent,
            options: options.filter(opt => opt.option_heading.trim() || opt.option_value.some(val => val.trim())),
            explanationHeading: fetchedQuestionData?.data?.explanationHeading || (Array.isArray(fetchedQuestionData?.data?.explanation) ? fetchedQuestionData?.data?.explanation[0]?.heading : "") || existingData?.explanationHeading || "",
            explanationText: fetchedQuestionData?.data?.explanationText || (Array.isArray(fetchedQuestionData?.data?.explanation) ? fetchedQuestionData?.data?.explanation[0]?.explanation : "") || existingData?.explanationText || "",
            additionalInfo: fetchedQuestionData?.data?.additionalInfo || (Array.isArray(fetchedQuestionData?.data?.additionalInfo) ? fetchedQuestionData?.data?.additionalInfo[0]?.info : "") || existingData?.additionalInfo || "",
            difficulty: fetchedQuestionData?.data?.difficulty || existingData?.difficulty || "Medium",
            marks: fetchedQuestionData?.data?.marks || existingData?.marks || 1,
            createdAt: existingData.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            questionId: realQuestionId,
            id: realQuestionId,
            isEdit: isEditMode,
            currentStep: 'content',
            completedSteps: ['type', 'content']
        };

        console.log('✅ Navigating with serializable data only:', questionData);
        console.log('✅ File stored in Context:', hasQuestionFile ? 'Yes' : 'No');

        // ✅ Navigate with ONLY serializable data - NO file objects
        navigate('/admin/answer-explain', {
            state: {
                isEdit: isEditMode,
                questionId: realQuestionId,
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
        if (location.state?.isEdit) {
            navigate('/admin/question-management');
            return;
        }
        const currentData = {
            question: question.trim(),
            tabs: tabs,
            question_content: questionContent,
            options: options,
            answer: answer,
        };

        navigate('/admin/question-type', {
            state: {
                questionData: currentData,
                fromStep: 'content',
                cs_id: cs_id, topic_id: topic_id, exam_type: exam_type, question_type_id: question_type_id
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

    return (
        <Box p={3} maxWidth="800px" mx="auto">
            {/* Breadcrumb */}
            <Typography variant="caption" color="textSecondary" mb={2} display="block">
                Test type &gt; Question Type &gt; <strong>Question Content</strong>
            </Typography>

            {/* Title + Back Button Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={3}>
                <Box>
                    <Typography variant="h5" mb={0.5}>
                        {location.state?.isEdit ? "Edit Fill in the Blanks Question" : "Fill in the Blanks Question Content"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Create or edit fill-in-the-blank questions with multiple answer options for comprehensive assessment.
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

            {/* Main Question */}
            <Typography variant="h6" mb={1} color="primary">
                Main Question
            </Typography>
            <TextField
                fullWidth
                label="Enter your main question"
                multiline
                minRows={2}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                variant="outlined"
                placeholder="Enter the main question or instruction for students..."
                sx={{ mb: 3 }}
            />

            {/* File Upload Section */}
           {/*  <Box display="flex" justifyContent="flex-end" mt={1} mb={3} gap={1}>
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
                    <CardContent sx={{ p: 2 }}>
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
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" color="primary">
                        Information Tabs ({tabs.length})
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {tabs.map((tab, index) => (
                        <Card key={index} sx={{ mb: 2, bgcolor: 'grey.50' }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="subtitle1">Tab {index + 1}</Typography>
                                    {tabs.length > 1 && (
                                        <IconButton onClick={() => handleRemoveTab(index)} color="error" size="small">
                                            <Delete />
                                        </IconButton>
                                    )}
                                </Box>

                                <TextField
                                    fullWidth
                                    label="Tab Title"
                                    value={tab.tabKey}
                                    onChange={(e) => handleTabChange(index, 'tabKey', e.target.value)}
                                    variant="outlined"
                                    placeholder="e.g., Patient History, Lab Results"
                                    sx={{ mb: 2 }}
                                />

                                <TextField
                                    fullWidth
                                    label="Tab Content"
                                    multiline
                                    minRows={3}
                                    value={tab.tabValue}
                                    onChange={(e) => handleTabChange(index, 'tabValue', e.target.value)}
                                    variant="outlined"
                                    placeholder="Enter the detailed content for this tab..."
                                />
                            </CardContent>
                        </Card>
                    ))}

                    <Button startIcon={<AddIcon />} onClick={handleAddTab} variant="outlined" size="small">
                        Add Tab
                    </Button>
                </AccordionDetails>
            </Accordion>

            {/* Question Content Section */}
            <Accordion defaultExpanded sx={{ mt: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" color="primary">
                        Fill in the Blanks Content ({questionContent.length})
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {questionContent.map((content, index) => (
                        <Card key={index} sx={{ mb: 2, bgcolor: 'grey.50' }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="subtitle1">Content {index + 1}</Typography>
                                    {questionContent.length > 1 && (
                                        <IconButton onClick={() => handleRemoveQuestionContent(index)} color="error" size="small">
                                            <Delete />
                                        </IconButton>
                                    )}
                                </Box>

                                <TextField
                                    fullWidth
                                    label="Question Text"
                                    value={content.question_text}
                                    onChange={(e) => handleQuestionContentChange(index, 'question_text', e.target.value)}
                                    variant="outlined"
                                    placeholder="Enter text or use _____ for blanks"
                                    sx={{ mb: 2 }}
                                />

                                <TextField
                                    fullWidth
                                    label="Fill Blank Answer (if this is a blank)"
                                    value={content.fill_blanks_answer}
                                    onChange={(e) => handleQuestionContentChange(index, 'fill_blanks_answer', e.target.value)}
                                    variant="outlined"
                                    placeholder="Correct answer for this blank"
                                    sx={{ mb: 2 }}
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={content.blank_or_not === "true"}
                                            onChange={(e) => handleQuestionContentChange(index, 'blank_or_not', e.target.checked ? "true" : "false")}
                                        />
                                    }
                                    label="This is a blank to be filled"
                                />

                                {/* Preview */}
                                <Box sx={{ mt: 2, p: 1, bgcolor: 'primary.light', borderRadius: 1 }}>
                                    <Typography variant="caption" color="primary.contrastText">
                                        Preview: {content.blank_or_not === "true" ?
                                            `[BLANK: ${content.fill_blanks_answer || '___'}]` :
                                            content.question_text || 'Text content'}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}

                    <Button startIcon={<AddIcon />} onClick={handleAddQuestionContent} variant="outlined" size="small">
                        Add Content
                    </Button>
                </AccordionDetails>
            </Accordion>

            {/* Options Section */}
            <Accordion defaultExpanded sx={{ mt: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" color="primary">
                        Answer Options ({options.length})
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {options.map((option, optionIndex) => (
                        <Card key={optionIndex} sx={{ mb: 2, bgcolor: 'grey.50' }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="subtitle1">Option Group {optionIndex + 1}</Typography>
                                    {options.length > 1 && (
                                        <IconButton onClick={() => handleRemoveOption(optionIndex)} color="error" size="small">
                                            <Delete />
                                        </IconButton>
                                    )}
                                </Box>

                                <TextField
                                    fullWidth
                                    label="Option Group Heading"
                                    value={option.option_heading}
                                    onChange={(e) => handleOptionChange(optionIndex, 'option_heading', e.target.value)}
                                    variant="outlined"
                                    placeholder="e.g., Available Medications, Nursing Actions"
                                    sx={{ mb: 2 }}
                                />

                                <Typography variant="subtitle2" mb={1}>
                                    Option Values:
                                </Typography>

                                {option.option_value.map((value, valueIndex) => (
                                    <Box key={valueIndex} display="flex" alignItems="center" gap={1} mb={1}>
                                        <TextField
                                            fullWidth
                                            placeholder={`Option ${valueIndex + 1}`}
                                            value={value}
                                            onChange={(e) => handleOptionValueChange(optionIndex, valueIndex, e.target.value)}
                                            size="small"
                                        />
                                        {option.option_value.length > 1 && (
                                            <IconButton
                                                onClick={() => handleRemoveOptionValue(optionIndex, valueIndex)}
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
                                    onClick={() => handleAddOptionValue(optionIndex)}
                                    variant="outlined"
                                    size="small"
                                    sx={{ mt: 1 }}
                                >
                                    Add Option Value
                                </Button>
                            </CardContent>
                        </Card>
                    ))}

                    <Button startIcon={<AddIcon />} onClick={handleAddOption} variant="outlined" size="small">
                        Add Option Group
                    </Button>
                </AccordionDetails>
            </Accordion>

            {/* ✅ Enhanced Form Summary with Context information */}
            <Card sx={{ mt: 3, bgcolor: 'grey.50' }}>
                <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                        Fill in the Blanks Question Summary:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • Main Question: {question ? '✓ Complete' : '✗ Required'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • Generated Answer: {answer ? `"${answer.substring(0, 50)}${answer.length > 50 ? '...' : ''}"` : '✗ Auto-generated from content'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • Information Tabs: {tabs.filter(tab => tab.tabKey.trim() || tab.tabValue.trim()).length} tabs
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • Content Pieces: {questionContent.length} (Blanks: {questionContent.filter(c => c.blank_or_not === 'true').length})
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        • Option Groups: {options.filter(opt => opt.option_heading.trim() || opt.option_value.some(val => val.trim())).length} groups
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
                    disabled={!question.trim()}
                >
                    Next: Add Explanation
                </Button>
            </Box>
        </Box>
    );
};

export default FillinQuestionContent;
