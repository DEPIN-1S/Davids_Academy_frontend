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
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CloudUpload, Delete, Image, PictureAsPdf, Description, DragIndicator, ExpandMore } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { deleteTabImage, uploadTabImage } from "../../features/exam/examSlice";

const SortQuestionContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // Get any existing data from previous steps
    const existingData = location.state?.questionData || {};
    const questionType = location.state?.questionType || existingData.questionType || "Sorting";
    const cs_id = location.state?.cs_id || "";
    const exam_type = location.state?.exam_type || "";
    const question_type_id = location.state?.question_type_id || "";
    const [instruction, setInstruction] = useState(existingData.instruction || "");

    // Form state
    const [question, setQuestion] = useState(existingData.question || "");
    const [sortItems, setSortItems] = useState(existingData.sortItems || [
        { sortItem: "", itemOrder: 1 }
    ]);
    const [selectedFile, setSelectedFile] = useState(existingData.exhibit || null);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);
    const dispatch = useDispatch()


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
                exam_type: exam_type,
                question_type_id: question_type_id,
            }
        });
    };


    const isFormValid = () => {
        const hasValidQuestion = question.trim() !== "";
   
        const hasValidSortItems = sortItems.filter(item => item.sortItem.trim()).length >= 2;
        return hasValidQuestion  && hasValidSortItems;
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
