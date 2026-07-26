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
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CloudUpload, Delete, DragIndicator, ExpandMore } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { deleteTabImage, uploadTabImage, getQuestionData } from "../../features/exam/examSlice";
import ReactQuill from 'react-quill-new'; // <-- CHANGE THIS
import 'react-quill-new/dist/quill.snow.css';

const SortQuestionContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // Get any existing data from previous steps
    const existingData = location.state?.questionData || {};
    const questionType = location.state?.questionType || existingData.questionType || "Sorting";
    const cs_id = location.state?.cs_id || existingData.cs_id || "";
    const topic_id = location.state?.topic_id || existingData.topic_id || "";
    const exam_type = location.state?.exam_type || existingData.exam_type || "";
    const question_type_id = location.state?.question_type_id || existingData.question_type_id || "";
    const [instruction, setInstruction] = useState(existingData.instruction || "");

    // Form state
    const [question, setQuestion] = useState(existingData.question || "");
    const [sortItems, setSortItems] = useState(existingData.sortItems || [
        { sortItem: "", itemOrder: 1 }
    ]);
    const [selectedFile] = useState(existingData.exhibit || null);
    const [errors, setErrors] = useState({});
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
            if (q.instructions) setInstruction(q.instructions);
            const items = q.sortingoptions || q.sortItems;
            if (items && items.length > 0) {
                setSortItems(items.map((s, i) => ({
                    sortItem: typeof s === "string" ? s : (s.sortingoption || s.sortItem || s.option || ""),
                    itemOrder: s.correct_order || s.itemOrder || i + 1
                })));
            }
            if (q.tabsInfo && q.tabsInfo.length > 0) {
                setTabs(q.tabsInfo.map((t) => ({ tabKey: t.tabKey || "", tabValue: t.tabValue || "" })));
            }
        }
    }, [editQuestionId, fetchedQuestionData]);


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


    // Sort item handlers
    const handleSortItemChange = (index, value) => {
        const newSortItems = [...sortItems];
        newSortItems[index].sortItem = value;
        setSortItems(newSortItems);
        setErrors(prev => ({ ...prev, sortItems: null }));
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


    //tabs section 
    const [tabs, setTabs] = useState(
        existingData?.tabs || [{ tabKey: "", tabValue: "" }]
    );



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
            topic_id: topic_id,
            exam_type: exam_type,
            question_type_id: question_type_id,
            questionType: questionType,
            question: question.trim(),
            sortItems: sortItems.filter(item => item.sortItem.trim()).map((item, index) => ({
                sortItem: item.sortItem.trim(),
                itemOrder: index + 1 // Ensure sequential ordering
            })),
            exhibit: selectedFile,
            instruction: instruction.trim(),
            tabs: tabs.filter((tab) => tab.tabKey.trim() && tab.tabValue.trim()),
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
                topic_id: topic_id,
                exam_type: exam_type,
                question_type_id: question_type_id,
            }
        });
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
        <Box p={3} maxWidth="800px" mx="auto">
            {/* Breadcrumb */}
            <Typography variant="caption" color="textSecondary" mb={2} display="block">
                Test type &gt; Question Type &gt; <strong>Question Content</strong>
            </Typography>

            {/* Title + Back Button Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={3}>
                <Box>
                    <Typography variant="h5" mb={0.5}>
                        {location.state?.isEdit ? "Edit Sorting Question" : "Enter Sorting Question Content"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Create or edit a sorting question where students arrange items in the correct order.
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
                    placeholder="Type your sorting question here (e.g., 'Arrange the steps in the correct order for performing...')"
                    style={{ height: '120px', borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}
                />
                {errors.question && (
                    <Typography color="error" variant="caption" sx={{ display: 'block', mt: 5 }}>
                        {errors.question}
                    </Typography>
                )}
            </Box>

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


            <Box sx={{ minHeight: '170px', mb: 3 }}>
                <Typography variant="h6" mb={1} color="primary">
                    Instruction*
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
                    placeholder="Type your sorting question instruction here..."
                    style={{ height: '120px', borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}
                />
                {errors.instruction && (
                    <Typography color="error" variant="caption" sx={{ display: 'block', mt: 5 }}>
                        {errors.instruction}
                    </Typography>
                )}
            </Box>


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
