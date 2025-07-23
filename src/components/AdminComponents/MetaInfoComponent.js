import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Grid,
    CircularProgress,
    Card,
    CardContent
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import { useNavigate, useLocation } from 'react-router-dom';
import { submitQuestion, resetStatus } from "../../features/exam/examSlice";

const MetaInfoComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Receive complete question data from previous component
    const receivedQuestionData = location.state?.questionData || {};

    const { loading, success, error } = useSelector(state => state.exam);

    const [form, setForm] = useState({
        difficulty: receivedQuestionData.difficulty || "",
        subject: receivedQuestionData.subject || "",
        lesson: receivedQuestionData.lesson || "",
        clientNeedArea: receivedQuestionData.clientNeedArea || "",
        clientNeedTopic: receivedQuestionData.clientNeedTopic || ""
    });

    // ✅ Debug: Log received data
    useEffect(() => {
        console.log('📨 Received question data from explanation component:', receivedQuestionData);
        console.log('🔍 Question Type:', receivedQuestionData.questionType);
    }, [receivedQuestionData]);

    // Handle toast notifications based on Redux state
    useEffect(() => {
        if (success) {
            toast.success('🎉 Question successfully added to Q-Bank!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            // Redirect after showing success toast
            setTimeout(() => {
                dispatch(resetStatus());
                navigate('/admin/question-management');
            }, 2000);
        }

        if (error) {
            toast.error(`❌ Failed to add question: ${error}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    }, [success, error, dispatch, navigate]);

    const handleChange = (field) => (event) => {
        setForm({ ...form, [field]: event.target.value });
    };

    // ✅ Question type to ID mapping
    const getQuestionTypeId = (questionType) => {
        const typeMapping = {
            'MCQ': 1,
            'Dropdown': 2,
            'Drag Drop': 3,
            'Drag and Drop': 3,
            'Multiple Radio': 4,
            'Sorting': 5,
            'Sort': 5,
            'Sentence Highlight': 6,
            'Fill in the Blanks': 7,
            'Fill in Blanks': 7
        };
        return typeMapping[questionType] || 1;
    };

    // ✅ Construct question data based on question type
    const constructQuestionData = () => {
        const questionType = receivedQuestionData.questionType || 'MCQ';

        // Base data common to all question types
        const baseData = {
            questionType: questionType,
            question_type_id: getQuestionTypeId(questionType),
            question: receivedQuestionData.question || "",
            difficulty: form.difficulty,
            subject: parseInt(form.subject),
            lesson: parseInt(form.lesson),
            clientNeedArea: parseInt(form.clientNeedArea),
            clientNeedTopic: parseInt(form.clientNeedTopic),
            exhibit: receivedQuestionData.exhibit?.url || null,
            explanationHeading: receivedQuestionData.explanationHeading || "",
            explanationText: receivedQuestionData.explanationText || "",
            info: receivedQuestionData.additionalInfo || "",
            infoImage: receivedQuestionData.infoImage?.url || null
        };

        // ✅ Question type specific data construction
        switch (questionType) {
            case 'MCQ':
                return {
                    ...baseData,
                    answer: receivedQuestionData.correctAnswer || "",
                    options: receivedQuestionData.options || []
                };

            case 'Dropdown':
                return {
                    ...baseData,
                    tabs: receivedQuestionData.tabs || [
                        {
                            "tabKey": "Triage Note",
                            "tabValue": "The patient presents with chest pain and shortness of breath..."
                        },
                        {
                            "tabKey": "Vital Signs",
                            "tabValue": "BP: 110/70, HR: 98 bpm, SpO2: 92% on room air."
                        }
                    ],
                    dropdowns: receivedQuestionData.dropdowns || [
                        {
                            "dropdownField": "tachypnea",
                            "dropDownValue": [
                                "asthma",
                                "pneumonia",
                                "hemothorax"
                            ]
                        },
                        {
                            "dropdownField": "dull percussion",
                            "dropDownValue": [
                                "pneumothorax",
                                "hemothorax",
                                "pleural effusion"
                            ]
                        }
                    ],
                    answers: receivedQuestionData.answers || [
                        {
                            "dropdownField": "tachypnea",
                            "dropdownValue": "asthma"
                        },
                        {
                            "dropdownField": "dull percussion",
                            "dropdownValue": "hemothorax"
                        }
                    ]
                };

            case 'Sorting':
            case 'Sort':
                return {
                    ...baseData,
                    sortItems: receivedQuestionData.sortItems || [
                        {
                            "sortItem": "Turn on the suction device and set appropriate pressure.",
                            "itemOrder": 1
                        },
                        {
                            "sortItem": "Don sterile gloves and prepare catheter.",
                            "itemOrder": 2
                        },
                        {
                            "sortItem": "Insert catheter without applying suction.",
                            "itemOrder": 3
                        },
                        {
                            "sortItem": "Apply suction while withdrawing the catheter slowly.",
                            "itemOrder": 4
                        },
                        {
                            "sortItem": "Reassess client's respiratory status.",
                            "itemOrder": 5
                        }
                    ]
                };

            case 'Fill in the Blanks':
            case 'Fill in Blanks':
                return {
                    ...baseData,
                    answer: receivedQuestionData.answer || " the nurse know the client is at the risk of developing some disease and symptoms if the condition is not managed",
                    question_content: receivedQuestionData.question_content || [
                        {
                            "question_text": "Turn on the suction device and set appropriate pressure.",
                            "fill_blanks_answer": "some disease",
                            "blank_or_not": "true"
                        },
                        {
                            "question_text": "and",
                            "fill_blanks_answer": "symptoms",
                            "blank_or_not": "true"
                        },
                        {
                            "question_text": "if the condition is not managed",
                            "fill_blanks_answer": "",
                            "blank_or_not": "false"
                        }
                    ],
                    options: receivedQuestionData.options || [
                        {
                            "option_heading": "Fill in the Blanks Option Heading",
                            "option_value": ["some disease", "fever", "Option Heading", "symptoms"]
                        }
                    ]
                };

            case 'Multiple Radio':
                return {
                    ...baseData,
                    tabs: receivedQuestionData.tabs || [
                        {
                            "tabKey": "Triage Note",
                            "tabValue": "1840: Client presents with dyspnea and right-sided chest pain that is worse when he takes a deep breath and coughs. Pain rated 7 on a scale of 0 (no pain) to 10 (severe pain). The client arrived with his friends after playing baseball outdoors and was struck by a baseball bat on the right side of his chest. Immediately after he sustained the injury, he reported sharp chest pain. Vital signs: T 99° F (37.2° C) P 94, RR 25, BP 127/76, pulse oximetry reading 89% on room air. He has a medical history of hemophilia A and asthma. On assessment, the client is alert and oriented and anxious. The client has labored breathing using his accessory muscles, and lung sounds are absent in the right-sided bases."
                        }
                    ],
                    question_content: receivedQuestionData.question_content || [
                        {
                            "question_text": "tachypnea",
                            "question_answer": "hemothorax"
                        },
                        {
                            "question_text": "reduced (or absent) breath sounds of the affected side",
                            "question_answer": "asthma exacerbation"
                        },
                        {
                            "question_text": "percussion on the involved side produces a dull sound",
                            "question_answer": "hemothorax"
                        },
                        {
                            "question_text": "chest wall tenderness",
                            "question_answer": "asthma exacerbation"
                        }
                    ],
                    radio_options: receivedQuestionData.radio_options || [
                        {
                            "option_value": "hemothorax"
                        },
                        {
                            "option_value": "asthma exacerbation"
                        }
                    ]
                };

            case 'Drag Drop':
            case 'Drag and Drop':
                return {
                    ...baseData,
                    drag_drop_content: receivedQuestionData.drag_drop_content || "Most likely experiencing",
                    tabs: receivedQuestionData.tabs || [
                        {
                            "tabKey": "Triage Note",
                            "tabValue": "1840: Client presents with dyspnea and right-sided chest pain that is worse when he takes a deep breath and coughs. Pain rated 7 on a scale of 0 (no pain) to 10 (severe pain). The client arrived with his friends after playing baseball outdoors and was struck by a baseball bat on the right side of his chest. Immediately after he sustained the injury, he reported sharp chest pain. Vital signs: T 99° F (37.2° C) P 94, RR 25, BP 127/76, pulse oximetry reading 89% on room air. He has a medical history of hemophilia A and asthma. On assessment, the client is alert and oriented and anxious. The client has labored breathing using his accessory muscles, and lung sounds are absent in the right-sided bases."
                        },
                        {
                            "tabKey": "Vital sign",
                            "tabValue": "0800: Upon assessment, the client is visibly anxious and struggling to breathe, with pink frothy sputum noted during coughing.The client is experiencing sudden shortness of breath and chest tightness. Physical examination reveals bilateral crackles in all lung fields, jugular venous distension (JVD), and peripheral cyanosis. An ECG shows sinus tachycardia with no ischemic changes, and a chest X-ray reveals pulmonary vascular congestion. The client reports a history of chronic heart failure."
                        }
                    ],
                    drag_and_drop: receivedQuestionData.drag_and_drop || [
                        {
                            "option_heading": "Action to take",
                            "question_answer": "Option 3",
                            "option_value": ["option", "option 2", "option 3", "option 4"]
                        },
                        {
                            "option_heading": "Parameter to Monitor",
                            "question_answer": "Option 2",
                            "option_value": ["option", "option 2", "option 3", "option 4"]
                        },
                        {
                            "option_heading": "Action to  another action",
                            "question_answer": "Option 1",
                            "option_value": ["option", "option 2", "option 3", "option 4"]
                        }
                    ]
                };

            case 'Sentence Highlight':
                return {
                    ...baseData,
                    passage: receivedQuestionData.passage || "",
                    correctHighlights: receivedQuestionData.correctHighlights || [],
                    highlightInstructions: receivedQuestionData.highlightInstructions || "",
                    tabs: receivedQuestionData.tabs || []
                };

            default:
                // Default to MCQ format
                console.warn(`Unknown question type: ${questionType}. Defaulting to MCQ format.`);
                return {
                    ...baseData,
                    answer: receivedQuestionData.correctAnswer || "",
                    options: receivedQuestionData.options || []
                };
        }
    };

    const handleSubmit = async () => {
        // Show loading toast
        const loadingToastId = toast.loading('📝 Adding question to Q-Bank...', {
            position: "top-right",
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });

        // ✅ Construct complete question data based on question type
        const completeQuestionData = constructQuestionData();

        console.log('🚀 Submitting question data:', completeQuestionData);
        console.log('📋 Question Type:', completeQuestionData.questionType);
        console.log('🏷️ Question Type ID:', completeQuestionData.question_type_id);
        console.log('📄 Complete JSON Structure:', JSON.stringify(completeQuestionData, null, 2));

        try {
            await dispatch(submitQuestion(completeQuestionData)).unwrap();
            toast.dismiss(loadingToastId);
        } catch (err) {
            toast.dismiss(loadingToastId);
            console.error('Failed to submit question:', err);
        }
    };

    const onBack = () => {
        // Preserve current meta data when going back
        const currentMetaData = {
            difficulty: form.difficulty,
            subject: form.subject,
            lesson: form.lesson,
            clientNeedArea: form.clientNeedArea,
            clientNeedTopic: form.clientNeedTopic
        };

        const dataToSendBack = {
            ...receivedQuestionData,
            ...currentMetaData,
            updatedAt: new Date().toISOString()
        };

        toast.info('⬅️ Navigating back to explanation step', {
            position: "top-right",
            autoClose: 2000,
            theme: "colored",
        });

        dispatch(resetStatus());
        navigate('/admin/answer-explain', {
            state: {
                questionData: dataToSendBack,
                fromStep: 'meta-info'
            }
        });
    };

    // Validation function
    const isFormValid = () => {
        return form.difficulty && form.subject && form.lesson && form.clientNeedArea && form.clientNeedTopic;
    };

    // Show warning if trying to submit incomplete form
    const handleIncompleteSubmit = () => {
        toast.warning('⚠️ Please fill in all required fields before submitting', {
            position: "top-right",
            autoClose: 4000,
            theme: "colored",
        });
    };

    // Options data
    const subjectOptions = [
        { value: 1, label: "Fundamentals" },
        { value: 2, label: "Pharmacology" },
        { value: 3, label: "Adult Health" },
        { value: 4, label: "Medical Surgical" },
        { value: 5, label: "Critical Care" }
    ];

    const lessonOptions = [
        { value: 1, label: "Skills / Procedures" },
        { value: 2, label: "Dosage Calculation" },
        { value: 3, label: "Patient Assessment" },
        { value: 4, label: "Emergency Procedures" }
    ];

    const clientNeedAreaOptions = [
        { value: 1, label: "Safety & Infection Control" },
        { value: 2, label: "Physiological Integrity" },
        { value: 3, label: "Pharmacological Therapies" },
        { value: 4, label: "Management of Care" }
    ];

    const clientNeedTopicOptions = [
        { value: 1, label: "Complications of Diagnostic Procedures" },
        { value: 2, label: "Infection Prevention" },
        { value: 3, label: "Dosage Admin" },
        { value: 4, label: "Priority Setting" },
        { value: 5, label: "Reduction of Risk" }
    ];

    return (
        <Box p={3} maxWidth="800px" mx="auto">
            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                style={{ zIndex: 9999 }}
            />

            {/* Breadcrumb */}
            <Typography variant="caption" color="textSecondary" mb={2} display="block">
                Test type &gt; Question Type &gt; Question Content &gt; Explanation &gt; <strong>Add Tags</strong>
            </Typography>

            {/* ✅ Display Question Summary */}
            {receivedQuestionData && (
                <Card sx={{ mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            📋 Final Question Summary
                        </Typography>
                        <Typography variant="body2">
                            <strong>Type:</strong> {receivedQuestionData.questionType || 'MCQ'} (ID: {getQuestionTypeId(receivedQuestionData.questionType)})
                        </Typography>
                        <Typography variant="body2">
                            <strong>Question:</strong> {receivedQuestionData.question ?
                                `${receivedQuestionData.question.substring(0, 100)}...` : 'Not provided'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Explanation:</strong> {receivedQuestionData.explanationText ? '✅ Complete' : '❌ Missing'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Files:</strong> {receivedQuestionData.exhibit ? 'Question exhibit, ' : ''}
                            {receivedQuestionData.infoImage ? 'Info image' : 'No files'}
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {/* Heading */}
            <Typography variant="h5" mt={2} mb={1}>
                Add Tags & Meta Information
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
                Label your {receivedQuestionData.questionType || 'MCQ'} question with relevant categories for better organization and performance insights.
            </Typography>

            {/* Select Fields */}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                        <InputLabel>Difficulty *</InputLabel>
                        <Select
                            value={form.difficulty}
                            onChange={handleChange("difficulty")}
                            label="Difficulty *"
                            disabled={loading}
                        >
                            <MenuItem value="Easy">Easy</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Hard">Hard</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                        <InputLabel>Subject *</InputLabel>
                        <Select
                            value={form.subject}
                            onChange={handleChange("subject")}
                            label="Subject *"
                            disabled={loading}
                        >
                            {subjectOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                        <InputLabel>Lesson *</InputLabel>
                        <Select
                            value={form.lesson}
                            onChange={handleChange("lesson")}
                            label="Lesson *"
                            disabled={loading}
                        >
                            {lessonOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel>Client Need Area *</InputLabel>
                        <Select
                            value={form.clientNeedArea}
                            onChange={handleChange("clientNeedArea")}
                            label="Client Need Area *"
                            disabled={loading}
                        >
                            {clientNeedAreaOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel>Client Need Topic *</InputLabel>
                        <Select
                            value={form.clientNeedTopic}
                            onChange={handleChange("clientNeedTopic")}
                            label="Client Need Topic *"
                            disabled={loading}
                        >
                            {clientNeedTopicOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* ✅ Final Data Preview */}
            <Card sx={{ mt: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
                <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                        🎯 Ready to Submit:
                    </Typography>
                    <Typography variant="body2">
                        • Question Type: {receivedQuestionData.questionType || 'MCQ'} (ID: {getQuestionTypeId(receivedQuestionData.questionType)})
                    </Typography>
                    <Typography variant="body2">
                        • Difficulty: {form.difficulty || '❌ Required'}
                    </Typography>
                    <Typography variant="body2">
                        • Subject: {form.subject ? subjectOptions.find(s => s.value == form.subject)?.label : '❌ Required'}
                    </Typography>
                    <Typography variant="body2">
                        • Lesson: {form.lesson ? lessonOptions.find(l => l.value == form.lesson)?.label : '❌ Required'}
                    </Typography>
                    <Typography variant="body2">
                        • Client Need Area: {form.clientNeedArea ? clientNeedAreaOptions.find(c => c.value == form.clientNeedArea)?.label : '❌ Required'}
                    </Typography>
                    <Typography variant="body2">
                        • Client Need Topic: {form.clientNeedTopic ? clientNeedTopicOptions.find(t => t.value == form.clientNeedTopic)?.label : '❌ Required'}
                    </Typography>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <Box mt={4} display="flex" justifyContent="space-between">
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={onBack}
                    disabled={loading}
                    variant="outlined"
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LibraryAddCheckIcon />}
                    onClick={isFormValid() ? handleSubmit : handleIncompleteSubmit}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : `Add ${receivedQuestionData.questionType || 'MCQ'} to Q-Bank`}
                </Button>
            </Box>
        </Box>
    );
};

export default MetaInfoComponent;
