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
import { useFileContext } from '../../context/FileContext'; // 

const MetaInfoComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Use File Context instead of receiving files through navigation
    const {
        questionFile,
        explanationFile,
        hasQuestionFile,
        hasExplanationFile,
        createCompleteFormData,
        clearFiles
    } = useFileContext();

    // ✅ Receive only serializable question data
    const receivedQuestionData = location.state?.questionData || {};


    const { loading, success, error } = useSelector(state => state.exam);

    const [form, setForm] = useState({
        difficulty: receivedQuestionData.difficulty || "",
        subject: receivedQuestionData.subject || "",
        lesson: receivedQuestionData.lesson || "",
        clientNeedArea: receivedQuestionData.clientNeedArea || "",
        clientNeedTopic: receivedQuestionData.clientNeedTopic || ""
    });

    // ✅ Debug: Log context status
    useEffect(() => {
        console.log('✅ Context Status in MetaInfo:');
        console.log('📎 Question file in context:', hasQuestionFile ? questionFile?.name : 'None');
        console.log('📎 Explanation file in context:', hasExplanationFile ? explanationFile?.name : 'None');
        console.log('📄 Received question data:', receivedQuestionData);
    }, [hasQuestionFile, hasExplanationFile, questionFile, explanationFile, receivedQuestionData]);

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

            // Clear files from context after successful submission
            clearFiles();

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
    }, [success, error, dispatch, navigate, clearFiles]);

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

    // ✅ Submit using Context FormData for multipart support
    // Updated handleSubmitWithContextFormData function
    const handleSubmitWithContextFormData = async () => {
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
            // ✅ Prepare complete question data matching your required structure
            const completeQuestionData = {
                // Basic fields
                cs_id: receivedQuestionData.cs_id,
                questionType: receivedQuestionData.questionType,
                question_type_id: getQuestionTypeId(receivedQuestionData.questionType),
                question: receivedQuestionData.question,
                difficulty: form.difficulty,
                subject: parseInt(form.subject),
                lesson: parseInt(form.lesson),
                clientNeedArea: parseInt(form.clientNeedArea),
                clientNeedTopic: parseInt(form.clientNeedTopic),

                // Explanation fields
                explanationHeading: receivedQuestionData.explanationHeading,
                explanationText: receivedQuestionData.explanationText,
                additionalInfo: receivedQuestionData.additionalInfo,

                // ✅ Question type specific data
                ...getQuestionTypeSpecificData(receivedQuestionData)
            };

            // ✅ Create FormData using Context
            const completeFormData = createCompleteFormData(completeQuestionData);
            console.log('🚀 Submitting with Context FormData (multipart/form-data)');
            console.log('📦 FormData created from Context:');
            for (let [key, value] of completeFormData.entries()) {
                console.log(key, value);
            }

            // ✅ Submit to your multipart endpoint
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/questions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    // Don't set Content-Type - let browser set multipart boundary
                },
                body: completeFormData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Question submitted successfully:', result);

            toast.dismiss(loadingToastId);
            toast.success('🎉 Question successfully added to Q-Bank!', {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });

            // Clean up context and navigate
            setTimeout(() => {
                clearFiles();
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

    // ✅ Helper function to get question type specific data
    const getQuestionTypeSpecificData = (questionData) => {
        const questionType = questionData.questionType;

        switch (questionType) {
            case 'MCQ':
                return {
                    correctAnswer: questionData.correctAnswer,
                    options: questionData.options
                };

            case 'Dropdown':
                return {
                    tabs: questionData.tabs || [],
                    dropdowns: questionData.dropdowns || []
                };

            case 'Sorting':
            case 'Sort':
                return {
                    sortItems: questionData.sortItems || []
                };

            case 'Fill in the Blanks':
            case 'Fill in Blanks':
                return {
                    answer: questionData.answer || '',
                    question_content: questionData.question_content || [],
                    options: questionData.options || []
                };

            case 'Multiple Radio':
                return {
                    tabs: questionData.tabs || [],
                    question_content: questionData.question_content || [],
                    radio_options: questionData.radio_options || []
                };

            case 'Drag Drop':
            case 'Drag and Drop':
                return {
                    drag_drop_content: questionData.drag_drop_content || '',
                    tabs: questionData.tabs || [],
                    drag_and_drop: questionData.drag_and_drop || []
                };

            default:
                return {
                    correctAnswer: questionData.correctAnswer,
                    options: questionData.options
                };
        }
    };
    // ✅ Fallback: Submit using JSON (if no files in Context)
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

    // ✅ Main submit handler - choose method based on Context file availability
    const handleSubmit = async () => {
        console.log("hasQuestionFile:", hasQuestionFile);
        console.log("hasExplanationFile:", hasExplanationFile);
        if (hasQuestionFile || hasExplanationFile) {
            // Use Context FormData for multipart submission (supports files)
            await handleSubmitWithContextFormData();
        } else {
            // Fallback to JSON submission
            await handleSubmitWithJSON();
        }
    };

    // ✅ Construct question data for JSON fallback
    const constructQuestionData = () => {
        const questionType = receivedQuestionData.questionType || 'MCQ';
        const exam_type = receivedQuestionData.exam_type;
        const cs_id = receivedQuestionData.cs_id;
        // Base data common to all question types
        const baseData = {
            questionType: questionType,
            courseId: cs_id,
            question_type_id: getQuestionTypeId(questionType),
            question: receivedQuestionData.question || "",
            exam_type: exam_type,
            exhibit: null, // No files in JSON mode
            difficulty: form.difficulty,
            subject: parseInt(form.subject),
            explanationHeading: receivedQuestionData.explanationHeading || "",
            explanationText: receivedQuestionData.explanationText || "",
            info: receivedQuestionData.additionalInfo || "",
            infoImage: null // No files in JSON mode
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
        // ✅ Preserve current meta data when going back (all serializable)
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

        // ✅ Navigate with only serializable data - files are in Context
        navigate('/admin/answer-explain', {
            state: {
                questionData: dataToSendBack,
                // ✅ Only pass file metadata for UI display, actual files are in Context
                hasQuestionFile: hasQuestionFile,
                hasExplanationFile: hasExplanationFile,
                questionFileInfo: hasQuestionFile ? {
                    name: questionFile?.name,
                    type: questionFile?.type,
                    size: questionFile?.size
                } : null,
                explanationFileInfo: hasExplanationFile ? {
                    name: explanationFile?.name,
                    type: explanationFile?.type,
                    size: explanationFile?.size
                } : null,
                fromStep: 'meta-info'
            }
        });
    };

    // Validation function
    const isFormValid = () => {
        return form.difficulty ;
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

            {/* ✅ Context Status Display */}
            <Card sx={{ mb: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        🗂️ React Context File Management
                    </Typography>
                    <Typography variant="body2">
                        • Submission method: <strong>{hasQuestionFile || hasExplanationFile ? 'Multipart/Form-Data' : 'JSON'}</strong>
                    </Typography>
                    <Typography variant="body2">
                        • Question file: {hasQuestionFile ? `✅ ${questionFile?.name}` : '➖ None'}
                    </Typography>
                    <Typography variant="body2">
                        • Explanation file: {hasExplanationFile ? `✅ ${explanationFile?.name}` : '➖ None'}
                    </Typography>
                    <Typography variant="body2">
                        • Navigation safety: ✅ No FormData objects in navigation state
                    </Typography>
                </CardContent>
            </Card>

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
                            <strong>Files in Context:</strong>
                            {hasQuestionFile && <Chip label="Question exhibit" size="small" color="primary" sx={{ ml: 1, mr: 0.5 }} />}
                            {hasExplanationFile && <Chip label="Explanation file" size="small" color="secondary" sx={{ mr: 0.5 }} />}
                            {!hasQuestionFile && !hasExplanationFile && ' No files in context'}
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

              
            </Grid>

            {/* ✅ Enhanced Final Data Preview with Context information */}
            <Card sx={{
                mt: 3, bgcolor: hasQuestionFile || hasExplanationFile ? 'success.light' : 'warning.light',
                color: hasQuestionFile || hasExplanationFile ? 'success.contrastText' : 'warning.contrastText'
            }}>
                <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                        🎯 Ready to Submit:
                    </Typography>
                    <Typography variant="body2">
                        • Submission Method: {hasQuestionFile || hasExplanationFile ? '📦 Context FormData (Multipart)' : '📄 JSON'}
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
                    <Typography variant="body2">
                        • Files in Context: {(hasQuestionFile ? 1 : 0) + (hasExplanationFile ? 1 : 0)} file(s)
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
