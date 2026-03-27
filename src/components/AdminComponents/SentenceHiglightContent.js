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
    Paper,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CloudUpload, Delete, Image, PictureAsPdf, Description, ExpandMore, Highlight } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
/* import { FormControl } from "react-bootstrap"; */
import { FormControl } from "@mui/material";
import { deleteTabImage, uploadTabImage } from "../../features/exam/examSlice";
import { useDispatch } from "react-redux";
import ReactQuill from 'react-quill-new'; // <-- CHANGE THIS
import 'react-quill-new/dist/quill.snow.css';

const SentenceHighlightContent = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get any existing data from previous steps
    const existingData = location.state?.questionData || {};
    const questionType = location.state?.questionType || existingData.questionType || "Sentence Highlight";
    const cs_id = location.state?.cs_id || existingData.cs_id || "";
    const exam_type = location.state?.exam_type || existingData.exam_type || "";
    const question_type_id = location.state?.question_type_id || existingData.question_type_id || "";
    const topic_id = location.state?.topic_id || existingData.topic_id || "";
    const [instruction, setInstruction] = useState(existingData.instruction || "")
    // Form state
    const [question, setQuestion] = useState(existingData.question || "");
    const [tabs, setTabs] = useState(existingData.tabs || [
        { tabKey: "", tabValue: "" }
    ]);
    const [passage, setPassage] = useState(existingData.passage || "");
    const [correctHighlights, setCorrectHighlights] = useState(existingData.correctHighlights || [""]);
    const [selectedFile, setSelectedFile] = useState(existingData.exhibit || null);
    const [errors, setErrors] = useState({});
    const [answer, setAnswer] = useState(existingData?.answer || [])

    const fileInputRef = useRef(null);


    // here tab image is added to backend when user selects image from their local machine at that moment api call is triggered
    // File upload handler for tab image
    const dispatch = useDispatch();
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

    // Highlight handlers
    const handleCorrectHighlightChange = (index, value) => {
        const newHighlights = [...correctHighlights];
        newHighlights[index] = value;
        setCorrectHighlights(newHighlights);
        setErrors(prev => ({ ...prev, correctHighlights: null }));
    };

    const handleAddCorrectHighlight = () => {
        setCorrectHighlights([...correctHighlights, ""]);
    };

    const handleRemoveCorrectHighlight = (index) => {
        if (correctHighlights.length > 1) {
            const newHighlights = correctHighlights.filter((_, i) => i !== index);
            setCorrectHighlights(newHighlights);
        }
    };

    // Validation
    const validateForm = () => {
        const newErrors = {};

        if (!question.trim()) {
            newErrors.question = 'Question is required';
        }  

        if (!passage.trim()) {
            newErrors.passage = 'Passage text is required';
        }

        const validHighlights = correctHighlights.filter(highlight => highlight.trim());
        if (validHighlights.length === 0) {
            newErrors.correctHighlights = 'At least one correct highlight text is required';
        }

        if (answer.length === 0) {
            newErrors.answer = "Select at least one correct highlight";
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
            cs_id: cs_id, topic_id: topic_id,
            exam_type: exam_type,
            question_type_id: question_type_id,
            questionType: questionType,
            question: question.trim(),
            tabs: tabs.filter(tab => tab.tabKey.trim() && tab.tabValue.trim()),
            passage: passage.trim(),
            answer: answer,
            instruction: instruction.trim(),
            correctHighlights: correctHighlights.filter(highlight => highlight.trim()),
            exhibit: selectedFile,
            createdAt: existingData.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            questionId: existingData.questionId || `${questionType}_${Date.now()}`,
            currentStep: 'content',
            completedSteps: ['type', 'content']
        };

        console.log('Sending sentence highlight question data:', questionData);
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
            passage: passage.trim(),
            correctHighlights: correctHighlights,
            exhibit: selectedFile
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

    const isFormValid = () => {
        const hasValidQuestion = question.trim() !== "";
        
        const hasValidPassage = passage.trim() !== "";

        const hasValidHighlights = correctHighlights.some(highlight => highlight.trim());
      
        return hasValidQuestion && hasValidPassage && hasValidHighlights ;
    };

    // Helper function to create highlighted preview
    const createHighlightPreview = () => {
        if (!passage.trim()) return "Passage text will appear here...";

        let previewText = passage;
        correctHighlights.filter(h => h.trim()).forEach((highlight, index) => {
            if (highlight.trim() && previewText.includes(highlight.trim())) {
                previewText = previewText.replace(
                    new RegExp(highlight.trim(), 'gi'),
                    `<mark style="background-color: #ffeb3b; color: #000;">${highlight.trim()}</mark>`
                );
            }
        });

        return previewText;
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
                Enter Sentence Highlight Question Content
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
                Create a sentence highlighting question where students identify specific text in a passage.
            </Typography>

            {/* Question Input */}
            <Box sx={{ minHeight: '170px', mb: 3 }}>
                <Typography variant="h6" mb={1} color="primary">
                    Question Text *
                </Typography>
                <ReactQuill
                    theme="snow"
                    value={question}
                    onChange={(content) => {
                        setQuestion(content);
                        setErrors(prev => ({ ...prev, question: null }));
                    }}
                    modules={tabModules}
                    formats={tabFormats}
                    placeholder="Type your sentence highlighting question here..."
                    style={{ height: '120px', borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}
                />
                {errors.question && (
                    <Typography color="error" variant="caption" sx={{ display: 'block', mt: 5 }}>
                        {errors.question}
                    </Typography>
                )}
            </Box>

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
                        Question Tabs ({tabs.length})
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
                                placeholder="e.g., Patient Chart, Nurse Notes"
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

            <Box sx={{ minHeight: '170px', mb: 3 }}>
                <Typography variant="h6" mb={1} color="primary">
                    Instruction
                </Typography>
                <ReactQuill
                    theme="snow"
                    value={instruction}
                    onChange={(content) => {
                        setInstruction(content);
                        setErrors(prev => ({ ...prev, instruction: null }));
                    }}
                    modules={tabModules}
                    formats={tabFormats}
                    placeholder="Type your drag drop question instruction here..."
                    style={{ height: '120px', borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}
                />
                {errors.instruction && (
                    <Typography color="error" variant="caption" sx={{ display: 'block', mt: 5 }}>
                        {errors.instruction}
                    </Typography>
                )}
            </Box>


            {/* Passage Section */}
            <Typography variant="h6" mb={1} color="primary">
                Passage Text *
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={2}>
                Enter the passage that students will read and highlight from.
            </Typography>
            <TextField
                fullWidth
                label="Enter passage text"
                multiline
                minRows={6}
                maxRows={12}
                value={passage}
                onChange={(e) => {
                    setPassage(e.target.value);
                    setErrors(prev => ({ ...prev, passage: null }));
                }}
                variant="outlined"
                placeholder="Enter the passage text that students will read and highlight specific sentences or phrases from..."
                error={!!errors.passage}
                helperText={errors.passage || `${passage.length} characters`}
                sx={{ mb: 3 }}
            />


            {/* Correct Highlights Section */}
            <Typography variant="h6" mb={1} color="primary">
                Correct Highlight Texts *
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={2}>
                Enter the exact text phrases that should be highlighted. These must match text in the passage above.
            </Typography>

            {correctHighlights.map((highlight, index) => (
                <Paper key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'warning.main' }}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Highlight color="warning" />
                        <Typography variant="body2" sx={{ minWidth: 100 }}>
                            Highlight {index + 1}:
                        </Typography>
                        <TextField
                            fullWidth
                            label={`Highlight Option ${index + 1}`}
                            multiline
                            minRows={2}
                            value={highlight}
                            onChange={(e) => handleCorrectHighlightChange(index, e.target.value)}
                            placeholder="Enter the exact text that should be highlighted..."
                        />
                        {correctHighlights.length > 1 && (
                            <IconButton
                                onClick={() => handleRemoveCorrectHighlight(index)}
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
                onClick={handleAddCorrectHighlight}
                variant="outlined"
                sx={{ mb: 3 }}
                color="warning"
            >
                Add Correct Highlight
            </Button>

            {errors.correctHighlights && (
                <Typography color="error" variant="caption" sx={{ display: 'block', mb: 2 }}>
                    {errors.correctHighlights}
                </Typography>
            )}

            <Typography variant="h6" mb={1} color="primary">
                Select Correct Highlight *
            </Typography>


            <FormControl fullWidth margin="normal" className="pb-4" error={!!errors.answer}>
                <Select
                    multiple
                    displayEmpty
                    value={answer}
                    onChange={(e) => {
                        setAnswer(e.target.value);
                        setErrors(prev => ({ ...prev, answer: null }));
                    }}
                    renderValue={(selected) => {
                        if (selected.length === 0) {
                            return <span style={{ color: "#999" }}>Select correct highlights from the options</span>;
                        }
                        return selected.join(", ");
                    }}
                >
                    {correctHighlights
                        .filter(h => h.trim() !== "")
                        .map((highlight, idx) => (
                            <MenuItem key={idx} value={highlight}>
                                <Checkbox checked={answer.indexOf(highlight) > -1} />
                                <ListItemText
                                    primary={`Highlight ${idx + 1}: ${highlight.length > 50 ? highlight.slice(0, 50) + "..." : highlight
                                        }`}
                                />
                            </MenuItem>
                        ))}
                </Select>

                {errors.answer && (
                    <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                        {errors.answer}
                    </Typography>
                )}
            </FormControl>



            {/* Preview Section */}
            <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                        🔍 Highlight Preview
                    </Typography>
                    <Typography variant="body2" color="textSecondary" mb={2}>
                        This is how the passage will look with correct highlights:
                    </Typography>
                    <Box
                        sx={{
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            bgcolor: 'white',
                            maxHeight: 200,
                            overflow: 'auto'
                        }}
                        dangerouslySetInnerHTML={{ __html: createHighlightPreview() }}
                    />
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                        Yellow highlights show the correct answers students should select.
                    </Typography>
                </CardContent>
            </Card>

            {/* Form Summary */}
            <Card sx={{ mb: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
                <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                        Sentence Highlight Question Summary:
                    </Typography>
                    <Typography variant="body2">
                        • Question: {question ? '✅ Complete' : '❌ Required'}
                    </Typography>
                    <Typography variant="body2">
                        • Tabs: {tabs.filter(tab => tab.tabKey.trim() && tab.tabValue.trim()).length} valid tabs
                    </Typography>
                    <Typography variant="body2">
                        • Passage: {passage ? `✅ ${passage.length} characters` : '❌ Required'}
                    </Typography>
                    <Typography variant="body2">
                        • Instructions: {instruction ? '✅ Complete' : '❌ Required'}
                    </Typography>
                    <Typography variant="body2">
                        • Correct Highlights: {correctHighlights.filter(h => h.trim()).length} defined
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

export default SentenceHighlightContent;
