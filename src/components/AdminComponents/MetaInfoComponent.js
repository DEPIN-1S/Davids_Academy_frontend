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
    CardContent,
    Chip
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import { useNavigate, useLocation } from 'react-router-dom';
import { submitQuestion, resetStatus } from "../../features/exam/examSlice";

const MetaInfoComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Receive complete question data and FormData from previous component
    const receivedQuestionData = location.state?.questionData || {};
    const receivedFormData = location.state?.formData || null;
    const hasQuestionFile = location.state?.hasQuestionFile || false;
    const hasExplanationFile = location.state?.hasExplanationFile || false;
    const questionFileInfo = location.state?.questionFileInfo || null;
    const explanationFileInfo = location.state?.explanationFileInfo || null;

    const { loading, success, error } = useSelector(state => state.exam);

    const [form, setForm] = useState({
        difficulty: receivedQuestionData.difficulty || "",
        subject: receivedQuestionData.subject || "",
        lesson: receivedQuestionData.lesson || "",
        clientNeedArea: receivedQuestionData.clientNeedArea || "",
        clientNeedTopic: receivedQuestionData.clientNeedTopic || ""
    });

    // ✅ Helper function to finalize FormData with meta information
    const finalizeFormData = (baseFormData, metaData) => {
        const finalFormData = new FormData();
        
        // Copy all existing entries from base FormData
        if (baseFormData) {
            for (let [key, value] of baseFormData.entries()) {
                finalFormData.append(key, value);
            }
        }
        
        // Add meta information
        finalFormData.append('difficulty', metaData.difficulty);
        finalFormData.append('subject', metaData.subject.toString());
        finalFormData.append('lesson', metaData.lesson.toString());
        finalFormData.append('clientNeedArea', metaData.clientNeedArea.toString());
        finalFormData.append('clientNeedTopic', metaData.clientNeedTopic.toString());
        
        // Update metadata
        finalFormData.set('updatedAt', new Date().toISOString());
        finalFormData.set('currentStep', 'meta-info');
        
        // Update completed steps
        const currentSteps = JSON.parse(finalFormData.get('completedSteps') || '[]');
        if (!currentSteps.includes('meta-info')) {
            currentSteps.push('meta-info');
            finalFormData.set('completedSteps', JSON.stringify(currentSteps));
        }
        
        return finalFormData;
    };

    // ✅ Debug: Log received data
    useEffect(() => {
        console.log('Received question data:', receivedQuestionData);
        console.log('Received FormData:', receivedFormData);
        console.log('Has question file:', hasQuestionFile);
        console.log('Has explanation file:', hasExplanationFile);
        console.log('Question file info:', questionFileInfo);
        console.log('Explanation file info:', explanationFileInfo);
        
        if (receivedFormData) {
            console.log('FormData contents:');
            for (let [key, value] of receivedFormData.entries()) {
                console.log(key, value);
            }
        }
    }, [receivedQuestionData, receivedFormData]);

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

    // ✅ Submit using FormData for multipart support
    const handleSubmitWithFormData = async () => {
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

        try {
            // ✅ Finalize FormData with meta information
            const finalFormData = finalizeFormData(receivedFormData, form);
            
            console.log('🚀 Submitting with FormData (multipart/form-data)');
            console.log('📦 Final FormData contents:');
            for (let [key, value] of finalFormData.entries()) {
                console.log(key, value);
            }

            // ✅ Submit FormData using fetch with multipart/form-data
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/questions`, {
                method: 'POST',
                headers: {
                    // Don't set Content-Type - let browser set it with boundary
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: finalFormData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Question submitted successfully:', result);
            
            toast.dismiss(loadingToastId);
            dispatch(resetStatus()); // Reset to trigger success state
            
            // Trigger success toast
            toast.success('🎉 Question successfully added to Q-Bank!', {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });

            // Navigate to success page after delay
            setTimeout(() => {
                navigate('/admin/question-management');
            }, 2000);

        } catch (err) {
            toast.dismiss(loadingToastId);
            console.error('Failed to submit question:', err);
            
            toast.error(`❌ Failed to add question: ${err.message}`, {
                position: "top-right",
                autoClose: 5000,
                theme: "colored",
            });
        }
    };

    // ✅ Fallback: Submit using JSON (if no FormData available)
    const handleSubmitWithJSON = async () => {
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

        // Construct complete question data based on question type
        const completeQuestionData = constructQuestionData();

        console.log('🚀 Submitting question data (JSON):', completeQuestionData);

        try {
            await dispatch(submitQuestion(completeQuestionData)).unwrap();
            toast.dismiss(loadingToastId);
        } catch (err) {
            toast.dismiss(loadingToastId);
            console.error('Failed to submit question:', err);
        }
    };

    // ✅ Main submit handler - choose method based on FormData availability
    const handleSubmit = async () => {
        if (receivedFormData) {
            // Use FormData for multipart submission (supports files)
            await handleSubmitWithFormData();
        } else {
            // Fallback to JSON submission
            await handleSubmitWithJSON();
        }
    };

    // ✅ Construct question data for JSON fallback
    const constructQuestionData = () => {
        const questionType = receivedQuestionData.questionType || 'MCQ';
        const exam_type = receivedQuestionData.exam_type;
        
        // Base data common to all question types
        const baseData = {
            exam_type: exam_type,
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

        // Question type specific data construction
        switch (questionType) {
            case 'MCQ':
                return {
                    ...baseData,
                    answer: receivedQuestionData.correctAnswer || "",
                    options: receivedQuestionData.options || []
                };
            // ... other question types remain the same as original
            default:
                return {
                    ...baseData,
                    answer: receivedQuestionData.correctAnswer || "",
                    options: receivedQuestionData.options || []
                };
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
                formData: receivedFormData, // ✅ Preserve FormData
                hasQuestionFile: hasQuestionFile,
                hasExplanationFile: hasExplanationFile,
                questionFileInfo: questionFileInfo,
                explanationFileInfo: explanationFileInfo,
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

    // Options data (same as original)
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

            {/* ✅ FormData Status Display */}
            {receivedFormData && (
                <Card sx={{ mb: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            📦 FormData Ready for Submission
                        </Typography>
                        <Typography variant="body2">
                            • Submission method: <strong>Multipart/Form-Data</strong> (supports file uploads)
                        </Typography>
                        <Typography variant="body2">
                            • Question file: {hasQuestionFile ? `✅ ${questionFileInfo?.name}` : '➖ None'}
                        </Typography>
                        <Typography variant="body2">
                            • Explanation file: {hasExplanationFile ? `✅ ${explanationFileInfo?.name}` : '➖ None'}
                        </Typography>
                    </CardContent>
                </Card>
            )}

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
                            <strong>Files:</strong> 
                            {hasQuestionFile && <Chip label="Question exhibit" size="small" color="primary" sx={{ ml: 1, mr: 0.5 }} />}
                            {hasExplanationFile && <Chip label="Explanation file" size="small" color="secondary" sx={{ mr: 0.5 }} />}
                            {!hasQuestionFile && !hasExplanationFile && ' No files attached'}
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
            <Card sx={{ mt: 3, bgcolor: receivedFormData ? 'success.light' : 'warning.light', 
                        color: receivedFormData ? 'success.contrastText' : 'warning.contrastText' }}>
                <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                        🎯 Ready to Submit:
                    </Typography>
                    <Typography variant="body2">
                        • Submission Method: {receivedFormData ? '📦 FormData (Multipart)' : '📄 JSON'}
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
