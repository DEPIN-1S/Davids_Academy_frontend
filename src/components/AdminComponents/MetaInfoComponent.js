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
    CircularProgress
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import { useNavigate } from 'react-router-dom';
import { submitQuestion, resetStatus } from "../../features/exam/examSlice";

const MetaInfoComponent = ({ questionData }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, success, error } = useSelector(state => state.exam);

    const [form, setForm] = useState({
        difficulty: "",
        subject: "",
        lesson: "",
        clientNeedArea: "",
        clientNeedTopic: ""
    });

    // Handle toast notifications based on Redux state
    useEffect(() => {
        if (success) {
            toast.success(' Question successfully added to Q-Bank!', {
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
            toast.error(` Failed to add question: ${error}`, {
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

    const handleSubmit = async () => {
        // Show loading toast
        const loadingToastId = toast.loading(' Adding question to Q-Bank...', {
            position: "top-right",
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });

        // Prepare the complete question data
        const completeQuestionData = {
            "questionType": "test",
            "question_type_id": 13,
            "question": "Arrange the steps in the correct order for performing tracheostomy suctioning.",
            "difficulty": "Medium",
            "subject": 1,
            "lesson": 3,
            "clientNeedArea": 2,
            "clientNeedTopic": 5,
            "sortItems": [
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
            ],
            "explanationHeading": "Explanation",
            "explanationText": "Proper tracheostomy suctioning follows a systematic approach to ensure patient safety and effectiveness. The correct sequence maintains sterility, prevents hypoxia, and ensures adequate airway clearance.",
            "info": "Tracheostomy suctioning should be performed using sterile technique with appropriate pressure settings (80-120 mmHg for adults) to prevent tissue trauma.",
            "infoImage": "https://example.com/images/tracheostomy-suctioning.png"
        }
            ;

        try {
            await dispatch(submitQuestion(completeQuestionData)).unwrap();
            toast.dismiss(loadingToastId); // Dismiss loading toast
        } catch (err) {
            toast.dismiss(loadingToastId); // Dismiss loading toast
            console.error('Failed to submit question:', err);
        }
    };

    const onBack = () => {
        // Show info toast for navigation
        toast.info('⬅️ Navigating back to explanation step', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });

        dispatch(resetStatus());
        navigate('/admin/answer-explain');
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
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    };

    // Subject/Lesson mapping
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
        <Box p={3}>
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
            <Typography variant="caption" color="textSecondary" mb={2}>
                Test type &gt; Question Type &gt; Question Content &gt; Explanation &gt; <strong>Add Tags</strong>
            </Typography>

            {/* Heading */}
            <Typography variant="h5" mt={2} mb={1}>
                Add Tags & Meta Information
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
                Label your question with relevant categories for better organization and performance insights.
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
                    {loading ? 'Adding...' : 'Add to Q-Bank'}
                </Button>
            </Box>
        </Box>
    );
};

export default MetaInfoComponent;
