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
import { useDispatch, useSelector } from "react-redux";
import { deleteTabImage, uploadTabImage, getQuestionData } from "../../features/exam/examSlice";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';        

function TableHighlightsQuestionContent() {
    const navigate = useNavigate();
    const location = useLocation();
    const { questionFile, hasQuestionFile } = useFileContext();
    const dispatch = useDispatch();

    const existingData = location.state?.questionData || {};
    const questionType = location.state?.questionType || existingData.questionType || "Dropdown";
    const cs_id = location.state?.cs_id || existingData.cs_id || "";
    const topic_id = location.state?.topic_id || existingData.topic_id || "";
    const exam_type = location.state?.exam_type || existingData.exam_type || "";
    const question_type_id = location.state?.question_type_id || existingData.question_type_id || "";

    const [question, setQuestion] = useState(existingData.question || "");
    const [instruction, setInstruction] = useState(existingData.instruction || "");
    const [tabs, setTabs] = useState(existingData.tabs || [{ tabKey: "", tabValue: "" }]);
    const [headers, setHeaders] = useState(existingData.headers || ["", ""]);
    const [rows, setRows] = useState(existingData.rows || [{ options: [[""], [""]] }]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [answers, setAnswers] = useState(existingData.answers || []);

    const { questionData: fetchedQuestionData } = useSelector((state) => state.exam);
    const editQuestionId = location.state?.questionId || existingData.id;

    useEffect(() => {
        if (questionFile) setSelectedFile(questionFile);
    }, [questionFile]);

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
            if (q.headers && q.headers.length > 0) setHeaders(q.headers);
            if (q.answers && q.answers.length > 0) setAnswers(q.answers);
            if (q.rows && q.rows.length > 0) setRows(q.rows);
            if (q.tabsInfo && q.tabsInfo.length > 0) {
                setTabs(q.tabsInfo.map((t) => ({ tabKey: t.tabKey || "", tabValue: t.tabValue || "" })));
            }
        }
    }, [editQuestionId, fetchedQuestionData]);

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

        const realQuestionId = location.state?.questionId || location.state?.id || location.state?.questionData?.id || location.state?.questionData?.questionId || fetchedQuestionData?.data?.id || null;
        const isEditMode = location.state?.isEdit || Boolean(realQuestionId);

        const questionData = {
            cs_id,
            topic_id,
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
                    ? { name: selectedFile.name, type: selectedFile.type, size: selectedFile.size }
                    : null,
                fromStep: "content"
            }
        });
    };

    const handleBack = () => {
        if (location.state?.isEdit) {
            navigate('/admin/question-management');
            return;
        }
        const currentData = { question: question.trim(), headers, tabs, rows, instruction, answers };
        navigate("/admin/question-type", {
            state: { questionData: currentData, fromStep: "content", cs_id, topic_id, exam_type, question_type_id }
        });
    };

    return (
        <Box className="question-editor-futuristic" p={3} maxWidth="900px" mx="auto">
            <Typography variant="caption" color="textSecondary" mb={2} display="block">
                Test type &gt; Question Type &gt; <strong>Question Content</strong>
            </Typography>

            {/* Title + Back Button Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={3}>
                <Box>
                    <Typography variant="h5" mb={0.5}>
                        {location.state?.isEdit ? "Edit Table Highlight Question" : "Enter Table Highlight Question Content"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Create or edit a table highlight question.
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
                    placeholder="Type your question here..."
                    style={{ height: '120px', borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}
                />
                {errors.question && (
                    <Typography color="error" variant="caption" sx={{ display: 'block', mt: 5 }}>
                        {errors.question}
                    </Typography>
                )}
            </Box>

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
            <Box sx={{ minHeight: '170px', mb: 3 }}>
                <Typography variant="h6" mb={1} color="primary">
                    Instruction *
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
                    placeholder="Type your question instruction here..."
                    style={{ height: '120px', borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}
                />
                {errors.instruction && (
                    <Typography color="error" variant="caption" sx={{ display: 'block', mt: 5 }}>
                        {errors.instruction}
                    </Typography>
                )}
            </Box>

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
