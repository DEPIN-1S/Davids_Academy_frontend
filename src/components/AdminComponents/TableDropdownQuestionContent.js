import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    IconButton,
    Card,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    FormHelperText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CloudUpload, Delete, ExpandMore } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useFileContext } from "../../context/FileContext";
import { useDispatch, useSelector } from "react-redux";
import { deleteTabImage, uploadTabImage, getQuestionData } from "../../features/exam/examSlice";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

function TableDropdownQuestionContent() {
    const navigate = useNavigate();
    const location = useLocation();
    const { questionFile, hasQuestionFile } = useFileContext();
    const dispatch = useDispatch();

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

    const existingData = location.state?.questionData || {};
    const questionType =
        location.state?.questionType || existingData.questionType || "Dropdown";
    const cs_id = location.state?.cs_id || existingData.cs_id || "";
    const topic_id = location.state?.topic_id || existingData.topic_id || "";
    const exam_type = location.state?.exam_type || existingData.exam_type || "";
    const question_type_id = location.state?.question_type_id || existingData.question_type_id || "";

    const [question, setQuestion] = useState(existingData.question || "");
    const [instruction, setInstruction] = useState(
        existingData.instruction || ""
    );
    const [leftHeader, setLeftHeader] = useState(existingData.leftHeader || "");
    const [rightHeader, setRightHeader] = useState(
        existingData.rightHeader || ""
    );
    const [tabs, setTabs] = useState(
        existingData.tabs || [{ tabKey: "", tabValue: "" }]
    );
    const [selectedFile, setSelectedFile] = useState(null);
    const [errors, setErrors] = useState({});

    // ✅ Dynamic Table Row Section (Multiple Rows)
    const [rows, setRows] = useState(
        existingData.rows || [{ fieldLabel: "", dropdownOptions: [""], answer: "" }]
    );

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
            if (q.leftHeader) setLeftHeader(q.leftHeader);
            if (q.rightHeader) setRightHeader(q.rightHeader);
            if (q.rows && q.rows.length > 0) {
                setRows(q.rows.map((r) => ({
                    fieldLabel: r.fieldLabel || r.field_label || "",
                    dropdownOptions: Array.isArray(r.dropdownOptions) ? r.dropdownOptions.map(opt => typeof opt === "string" ? opt : (opt.option_value || opt.option || "")) : [""],
                    answer: r.answer || "",
                })));
            }
            if (q.tabsInfo && q.tabsInfo.length > 0) {
                setTabs(q.tabsInfo.map((t) => ({ tabKey: t.tabKey || "", tabValue: t.tabValue || "" })));
            }
        }
    }, [editQuestionId, fetchedQuestionData]);

    const handleAddRow = () => {
        setRows([...rows, { fieldLabel: "", dropdownOptions: [""] }]);
    };

    const handleRemoveRow = (rowIndex) => {
        if (rows.length > 1) {
            setRows(rows.filter((_, i) => i !== rowIndex));
        }
    };

    const handleRowFieldChange = (rowIndex, value) => {
        const updated = [...rows];
        updated[rowIndex].fieldLabel = value;
        setRows(updated);
    };

    const handleDropdownOptionChange = (rowIndex, optIndex, value) => {
        const updated = [...rows];
        updated[rowIndex].dropdownOptions[optIndex] = value;
        setRows(updated);
    };

    const handleAddDropdownOption = (rowIndex) => {
        const updated = [...rows];
        updated[rowIndex].dropdownOptions.push("");
        setRows(updated);
    };

    const handleRemoveDropdownOption = (rowIndex, optIndex) => {
        const updated = [...rows];
        if (updated[rowIndex].dropdownOptions.length > 1) {
            updated[rowIndex].dropdownOptions.splice(optIndex, 1);
            setRows(updated);
        }
    };

    useEffect(() => {
        if (questionFile) setSelectedFile(questionFile);
    }, [questionFile]);

    // ✅ Upload Tab Image
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

        const previewUrl = URL.createObjectURL(file);
        const newTabs = [...tabs];
        newTabs[index].previewUrl = previewUrl;
        setTabs(newTabs);

        try {
            const result = await dispatch(uploadTabImage(file)).unwrap();
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

    // ✅ Delete Tab Image
    const handleDeleteTabImage = async (index) => {
        const tab = tabs[index];
        if (!tab.tabImage) {
            const newTabs = [...tabs];
            newTabs[index].previewUrl = null;
            setTabs(newTabs);
            return;
        }

        try {
            const fileName = tab.tabImage.split("/").pop();
            await dispatch(deleteTabImage(fileName)).unwrap();

            const newTabs = [...tabs];
            newTabs[index].previewUrl = null;
            newTabs[index].tabImage = null;
            setTabs(newTabs);
        } catch (error) {
            console.error("Failed to delete tab image:", error);
        }
    };

    // ✅ Tab Handlers
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
            setTabs(tabs.filter((_, i) => i !== index));
        }
    };




    // ✅ Validation
    const validateForm = () => {
        const newErrors = {};

        if (!question.trim()) newErrors.question = "Question is required";
        if (!leftHeader.trim()) newErrors.leftHeader = "Left header is required";
        if (!rightHeader.trim()) newErrors.rightHeader = "Right header is required";

        const validTabs = tabs.filter(
            (tab) => tab.tabKey.trim() && tab.tabValue.trim()
        );
        if (validTabs.length === 0)
            newErrors.tabs = "At least one tab with key and value is required";

        if (!instruction.trim())
            newErrors.instruction = "Instruction field is required";

        // Validate rows
        rows.forEach((row, i) => {
            if (!row.fieldLabel.trim())
                newErrors[`fieldLabel_${i}`] = `Field label for row ${i + 1} is required`;

            if (
                row.dropdownOptions.length === 0 ||
                row.dropdownOptions.some((opt) => !opt.trim())
            ) {
                newErrors[`dropdownOptions_${i}`] = `All options in row ${i + 1} must be filled`;
            }

            // Validate that an answer is selected
            if (!row.answer || row.answer.trim() === "")
                newErrors[`answer_${i}`] = `Answer must be selected for row ${i + 1}`;
        });


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ Navigation Handlers
    const handleNext = () => {
        if (!validateForm()) return;

        // Prepare table dropdown fields
        const tableDropdownFields = rows.map(row => ({
            fieldLabel: row.fieldLabel.trim() || "",
            dropdownOptions: row.dropdownOptions.map(opt => opt.trim()),
        }));

        // Prepare table dropdown answers
        const tableDropdownAnswers = rows.map(row => ({
            rowLabel: row.fieldLabel.trim() || "",
            answer: row.answer || "",
        }));

        const tableHeaders = {
            leftHeader: leftHeader.trim(),
            rightHeader: rightHeader.trim(),
        };

        const realQuestionId = location.state?.questionId || location.state?.id || location.state?.questionData?.id || location.state?.questionData?.questionId || fetchedQuestionData?.data?.id || null;
        const isEditMode = location.state?.isEdit || Boolean(realQuestionId);

        const questionData = {
            cs_id,
            topic_id,
            exam_type,
            question_type_id,
            questionType,
            question: question.trim(),
            tableHeaders,
            tabs: tabs.filter((tab) => tab.tabKey.trim() && tab.tabValue.trim()),
            instruction: instruction.trim(),
            tableDropdownFields,
            tableDropdownAnswers,
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
            currentStep: "content",
            completedSteps: ["type", "content"],
        };

        navigate("/admin/answer-explain", {
            state: {
                isEdit: isEditMode,
                questionId: realQuestionId,
                questionData,
                hasFile: hasQuestionFile,
                fileInfo: selectedFile
                    ? {
                        name: selectedFile.name,
                        type: selectedFile.type,
                        size: selectedFile.size,
                    }
                    : null,
                fromStep: "content",
            },
        });
    };

    const handleBack = () => {
        if (location.state?.isEdit) {
            navigate('/admin/question-management');
            return;
        }
        const currentData = {
            question: question.trim(),
            leftHeader: leftHeader.trim(),
            rightHeader: rightHeader.trim(),
            tabs,
            rows,
        };

        navigate("/admin/question-type", {
            state: {
                questionData: currentData,
                fromStep: "content",
                cs_id,
                topic_id,
                exam_type,
                question_type_id,
            },
        });
    };

    const isFormValid = () => {
        if (location.state?.isEdit && question && question.trim()) return true;
        const hasValidQuestion = question.trim() !== "";
        return hasValidQuestion;
    };

    return (
        <Box p={3} maxWidth="900px" mx="auto">
            <Typography variant="caption" color="textSecondary" mb={2} display="block">
                Test type &gt; Question Type &gt; <strong>Question Content</strong>
            </Typography>

            {/* Title + Back Button Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={3}>
                <Box>
                    <Typography variant="h5" mb={0.5}>
                        {location.state?.isEdit ? "Edit Table Dropdown Question" : "Enter Table Drop down Question Content"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Create or edit a table dropdown question with rows and answer selections.
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
                        "&:hover": { borderColor: "#115293", backgroundColor: "#e3f2fd" },
                    }}
                >
                    Back to Question Management
                </Button>
            </Box>

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
                    setErrors((prev) => ({ ...prev, question: null }));
                }}
                variant="outlined"
                placeholder="Type your question here..."
                error={!!errors.question}
                helperText={errors.question}
                sx={{ mb: 3 }}
            />

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
                                    <IconButton onClick={() => handleRemoveTab(index)} color="error" size="small">
                                        <Delete />
                                    </IconButton>
                                )}
                            </Box>

                            <TextField
                                fullWidth
                                label="Tab Key/Title"
                                value={tab.tabKey}
                                onChange={(e) => handleTabChange(index, "tabKey", e.target.value)}
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

                            <Box display="flex" flexDirection="column" alignItems="flex-start" mt={5}>
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
                                    onClick={() => document.getElementById(`tab-file-input-${index}`).click()}
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
                                        <IconButton onClick={() => handleDeleteTabImage(index)} color="error" size="small">
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                )}
                            </Box>
                        </Card>
                    ))}

                    <Button startIcon={<AddIcon />} onClick={handleAddTab} variant="outlined" size="small">
                        Add Tab
                    </Button>

                    {errors.tabs && (
                        <Typography color="error" variant="caption" sx={{ display: "block", mt: 1 }}>
                            {errors.tabs}
                        </Typography>
                    )}
                </AccordionDetails>
            </Accordion>

            {/* ✅ Table Heading Section */}
            <Typography variant="h6" mb={1} color="primary">
                Table Heading *
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
                <TextField
                    fullWidth
                    label="Left Header"
                    value={leftHeader}
                    onChange={(e) => {
                        setLeftHeader(e.target.value);
                        setErrors((prev) => ({ ...prev, leftHeader: null }));
                    }}
                    variant="outlined"
                    placeholder="Enter left header"
                    error={!!errors.leftHeader}
                    helperText={errors.leftHeader}
                />

                <TextField
                    fullWidth
                    label="Right Header"
                    value={rightHeader}
                    onChange={(e) => {
                        setRightHeader(e.target.value);
                        setErrors((prev) => ({ ...prev, rightHeader: null }));
                    }}
                    variant="outlined"
                    placeholder="Enter right header"
                    error={!!errors.rightHeader}
                    helperText={errors.rightHeader}
                />
            </Box>

            {/* ✅ Dynamic Table Rows Section */}
            <Accordion defaultExpanded sx={{ mb: 3 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" color="primary">
                        Table Rows * ({rows.length})
                    </Typography>
                </AccordionSummary>

                <AccordionDetails>
                    {rows.map((row, rowIndex) => (
                        <Card key={rowIndex} sx={{ mb: 3, p: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="subtitle1" color="primary">
                                    Table Row {rowIndex + 1}
                                </Typography>
                                {rows.length > 1 && (
                                    <IconButton onClick={() => handleRemoveRow(rowIndex)} color="error" size="small">
                                        <Delete />
                                    </IconButton>
                                )}
                            </Box>

                            <TextField
                                fullWidth
                                label="Field Label"
                                value={row.fieldLabel}
                                onChange={(e) => handleRowFieldChange(rowIndex, e.target.value)}
                                error={!!errors[`fieldLabel_${rowIndex}`]}
                                helperText={errors[`fieldLabel_${rowIndex}`]}
                                sx={{ mb: 3 }}
                            />

                            {row.dropdownOptions.map((opt, optIndex) => (
                                <Box key={optIndex} display="flex" alignItems="center" mb={2} gap={1}>
                                    <TextField
                                        fullWidth
                                        label={`Option ${optIndex + 1}`}
                                        value={opt}
                                        onChange={(e) =>
                                            handleDropdownOptionChange(rowIndex, optIndex, e.target.value)
                                        }
                                    />
                                    {row.dropdownOptions.length > 1 && (
                                        <IconButton
                                            onClick={() => handleRemoveDropdownOption(rowIndex, optIndex)}
                                            color="error"
                                        >
                                            <Delete />
                                        </IconButton>
                                    )}
                                </Box>
                            ))}


                            <Button
                                startIcon={<AddIcon />}
                                onClick={() => handleAddDropdownOption(rowIndex)}
                                variant="outlined"
                                size="small"
                            >
                                Add Dropdown Option
                            </Button>

                            <FormControl fullWidth variant="outlined" error={!!errors[`answer_${rowIndex}`]} sx={{ mt: 5, mb: 2 }}>
                                <InputLabel id={`select-answer-label-${rowIndex}`}>Select Answer</InputLabel>
                                <Select
                                    labelId={`select-answer-label-${rowIndex}`}
                                    value={row.answer || ""}
                                    onChange={(e) => {
                                        const updated = [...rows];
                                        updated[rowIndex].answer = e.target.value;
                                        setRows(updated);
                                    }}
                                    label="Select Answer"
                                >
                                    <MenuItem value="" sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                                        <em>-- Select Answer --</em>
                                    </MenuItem>
                                    {row.dropdownOptions.map((opt, i) => (
                                        <MenuItem key={i} value={opt} sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                                            {opt}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors[`answer_${rowIndex}`] && (
                                    <FormHelperText>{errors[`answer_${rowIndex}`]}</FormHelperText>
                                )}
                            </FormControl>



                        </Card>
                    ))}

                    <Button
                        startIcon={<AddIcon />}
                        onClick={handleAddRow}
                        variant="contained"
                        size="small"
                    >
                        Add Another Table Row
                    </Button>
                </AccordionDetails>
            </Accordion>

            {/* Instruction */}
            <Typography variant="h6" mb={1} color="primary">
                Instruction *
            </Typography>
            <TextField
                fullWidth
                label="Enter Question Instruction"
                multiline
                minRows={3}
                maxRows={6}
                value={instruction}
                onChange={(e) => {
                    setInstruction(e.target.value);
                    setErrors((prev) => ({ ...prev, instruction: null }));
                }}
                variant="outlined"
                placeholder="Type your question instruction here..."
                error={!!errors.instruction}
                helperText={errors.instruction}
                sx={{ mb: 3 }}
            />

            {/* Navigation */}
            <Box mt={4} display="flex" justifyContent="space-between">
                <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
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
}

export default TableDropdownQuestionContent;
