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
    FormControlLabel,
    Checkbox,
    FormHelperText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CloudUpload, Delete, ExpandMore } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useFileContext } from "../../context/FileContext";
import { useDispatch } from "react-redux";
import { deleteTabImage, uploadTabImage } from "../../features/exam/examSlice";

function TableHighlightsQuestionContent() {
    const navigate = useNavigate();
    const location = useLocation();
    const { questionFile, hasQuestionFile } = useFileContext();
    const dispatch = useDispatch();

    const existingData = location.state?.questionData || {};
    const questionType = location.state?.questionType || existingData.questionType || "Dropdown";
    const cs_id = location.state?.cs_id || "";
    const exam_type = location.state?.exam_type || "";
    const question_type_id = location.state?.question_type_id || "";

    const [question, setQuestion] = useState(existingData.question || "");
    const [instruction, setInstruction] = useState(existingData.instruction || "");
    const [tabs, setTabs] = useState(existingData.tabs || [{ tabKey: "", tabValue: "" }]);
    const [headers, setHeaders] = useState(existingData.headers || ["", ""]);
    const [rows, setRows] = useState(existingData.rows || [{ options: [[""], [""]] }]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [answers, setAnswers] = useState(existingData.answers || []);

    useEffect(() => {
        if (questionFile) setSelectedFile(questionFile);
    }, [questionFile]);

    // ---------------- Tab Handlers ----------------
    const handleTabChange = (index, field, value) => {
        const newTabs = [...tabs];
        newTabs[index][field] = value;
        setTabs(newTabs);
        setErrors((prev) => ({ ...prev, tabs: null }));
    };
    const handleAddTab = () => setTabs([...tabs, { tabKey: "", tabValue: "" }]);
    const handleRemoveTab = (index) => {
        if (tabs.length > 1) setTabs(tabs.filter((_, i) => i !== index));
    };

    const handleTabFileUpload = async (index, event) => {
        const file = event.target.files[0];
        if (!file) return;
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            setErrors((prev) => ({ ...prev, [`tabFile_${index}`]: "Only images allowed" }));
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
        } catch {
            setErrors((prev) => ({ ...prev, [`tabFile_${index}`]: "Upload failed" }));
            newTabs[index].previewUrl = null;
            setTabs(newTabs);
        }
    };

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
        } catch (err) {
            console.error(err);
        }
    };

    // ---------------- Row Handlers ----------------
    const handleColumnOptionChange = (rowIndex, colIndex, optIndex, value) => {
        const updated = [...rows];
        updated[rowIndex].options[colIndex][optIndex] = value;
        setRows(updated);
    };
    const handleAddRow = () => setRows([...rows, { options: [[""], [""]] }]);
    const handleRemoveRow = (rowIndex) => {
        if (rows.length > 1) setRows(rows.filter((_, i) => i !== rowIndex));
    };

    // ---------------- Checkbox Answer Handler ----------------
    const handleAnswerChange = (value) => {
        if (answers.includes(value)) {
            setAnswers(answers.filter((ans) => ans !== value));
        } else {
            setAnswers([...answers, value]);
        }
    };

    // ---------------- Validation ----------------
    const validateForm = () => {
        const newErrors = {};
        if (!question.trim()) newErrors.question = "Question is required";
        if (!instruction.trim()) newErrors.instruction = "Instruction is required";

        rows.forEach((row, i) => {
            row.options.forEach((colOptions, colIndex) => {
                if (!colOptions.length || colOptions.some(opt => !opt.trim())) {
                    newErrors[`options_${i}_${colIndex}`] = `All options in row ${i + 1}, column ${colIndex + 1} required`;
                }
            });
        });

        if (answers.length === 0) newErrors.answers = "Please select at least one correct answer";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ---------------- Navigation ----------------
    const handleNext = () => {
        if (!validateForm()) return;

        const tableFields = rows.map(row => ({
            leftColumn: row.options[0][0],
            rightColumn: row.options[1][0],
        }));

        const questionData = {
            cs_id,
            exam_type,
            question_type_id,
            questionType,
            question: question.trim(),
            tableHeaders: {
                leftHeader: headers[0],
                rightHeader: headers[1],
            },
            tableFields,
            tabs: tabs.filter((tab) => tab.tabKey.trim() && tab.tabValue.trim()),
            instruction: instruction.trim(),
            answers,
            createdAt: existingData.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            questionId: existingData.questionId || `${questionType}_${Date.now()}`,
            currentStep: "content",
            completedSteps: ["type", "content"],
        };

        navigate("/admin/answer-explain", {
            state: {
                questionData,
                hasFile: hasQuestionFile,
                fileInfo: selectedFile
                    ? { name: selectedFile.name, type: selectedFile.type, size: selectedFile.size }
                    : null,
                fromStep: "content"
            }
        });
    };

    const handleBack = () => {
        const currentData = { question: question.trim(), headers, tabs, rows, instruction, answers };
        navigate("/admin/question-type", {
            state: { questionData: currentData, fromStep: "content", cs_id, exam_type, question_type_id }
        });
    };

    return (
        <Box p={3} maxWidth="900px" mx="auto">
            <Typography variant="caption" color="textSecondary" mb={2} display="block">
                Test type &gt; Question Type &gt; <strong>Question Content</strong>
            </Typography>

            <Typography variant="h5" mt={2} mb={1}>
                Enter Table Highlight Question Content
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
                onChange={(e) => setQuestion(e.target.value)}
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
                                sx={{ mb: 2 }}
                                size="small"
                            />

                            <TextField
                                fullWidth
                                label="Tab Content"
                                multiline
                                minRows={3}
                                value={tab.tabValue}
                                onChange={(e) => handleTabChange(index, "tabValue", e.target.value)}
                                placeholder="Enter content for this tab..."
                            />

                            <Box display="flex" flexDirection="column" alignItems="flex-start" mt={2}>
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
                </AccordionDetails>
            </Accordion>

            {/* Table Header Section */}
            <Typography variant="h6" mb={1} color="primary">
                Table Header *
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
                <TextField
                    fullWidth
                    label="Left Column Header"
                    value={headers[0]}
                    onChange={(e) => setHeaders([e.target.value, headers[1]])}
                />
                <TextField
                    fullWidth
                    label="Right Column Header"
                    value={headers[1]}
                    onChange={(e) => setHeaders([headers[0], e.target.value])}
                />
            </Box>

            {/* Table Rows Section */}
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
                                label="Left Column content"
                                value={row.options[0][0]}
                                onChange={(e) => handleColumnOptionChange(rowIndex, 0, 0, e.target.value)}
                                sx={{ mb: 2 }}
                                error={!!errors[`options_${rowIndex}_0`]}
                                helperText={errors[`options_${rowIndex}_0`] || ""}
                            />

                            <TextField
                                fullWidth
                                label="Right Column content"
                                value={row.options[1][0]}
                                onChange={(e) => handleColumnOptionChange(rowIndex, 1, 0, e.target.value)}
                                error={!!errors[`options_${rowIndex}_1`]}
                                helperText={errors[`options_${rowIndex}_1`] || ""}
                            />
                        </Card>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={handleAddRow} variant="contained" size="small">
                        Add Another Table Row
                    </Button>
                </AccordionDetails>
            </Accordion>

            {/* Checkbox Answers Section */}
            <Typography variant="h6" mb={1} color="primary">
                   Choose one or more correct answers from the Right Column entries *
            </Typography>
            <Box display="flex" flexDirection="column" mb={2}>
                {rows.map((row, index) => {
                    const option = row.options[1][0];
                    return (
                        <FormControlLabel
                            key={index}
                            control={
                                <Checkbox
                                    checked={answers.includes(option)}
                                    onChange={() => handleAnswerChange(option)}
                                    color="primary"
                                />
                            }
                            label={
                                <Typography variant="body1">
                                    {option || `Option ${index + 1}`}
                                </Typography>
                            }
                        />
                    );
                })}
                {errors.answers && <FormHelperText error>{errors.answers}</FormHelperText>}
            </Box>

            {/* Instruction Section */}
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
                onChange={(e) => setInstruction(e.target.value)}
                variant="outlined"
                placeholder="Type your question instruction here..."
                error={!!errors.instruction}
                helperText={errors.instruction}
                sx={{ mb: 3 }}
            />

            {/* Navigation Buttons */}
            <Box mt={4} display="flex" justifyContent="space-between">
                <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
                    Back
                </Button>
                <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleNext}
                >
                    Next: Add Explanation
                </Button>
            </Box>
        </Box>
    );
}

export default TableHighlightsQuestionContent;
