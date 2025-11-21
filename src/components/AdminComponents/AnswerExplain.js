import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    Card,
    CardContent,
    Chip,
    IconButton,
    Alert
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CloudUpload, Delete, Image, PictureAsPdf, Description } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFileContext } from '../../context/FileContext'; // ✅ Import the Context
import ReactQuill from "react-quill-new";





const AnswerExplain = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Use File Context instead of receiving files through navigation
    const {
        questionFile,
        explanationFile,
        addExplanationFile,
        hasQuestionFile,
        hasExplanationFile
    } = useFileContext();

    // ✅ Receive only serializable data
    const previousQuestionData = location.state?.questionData || {};

    // Component state
    const [explanationHeading, setExplanationHeading] = useState(
        previousQuestionData.explanationHeading || ""
    );
    const [explanationText, setExplanationText] = useState(
        previousQuestionData.explanationText || ""
    );
    const [additionalInfoHeading, setAdditionalInfoHeading] = useState(
        previousQuestionData.additionalInfoHeading || ""
    );
    const [additionalInfo, setAdditionalInfo] = useState(
        previousQuestionData.additionalInfo || ""
    );
    const [selectedFile, setSelectedFile] = useState(null); // ✅ Local state for UI, Context for persistence
    const [errors, setErrors] = useState({});

    const fileInputRef = useRef(null);

    // ✅ Initialize with existing file from context if available
    useEffect(() => {
        if (explanationFile) {
            setSelectedFile(explanationFile);
        }
    }, [explanationFile]);

    // ✅ Log context status
    useEffect(() => {
        console.log("previous question Data:::::", previousQuestionData);
        console.log('Context Status:');
        console.log('📎Question file in context:', hasQuestionFile ? questionFile?.name : 'None');
        console.log('📎 Explanation file in context:', hasExplanationFile ? explanationFile?.name : 'None');
    }, [hasQuestionFile, hasExplanationFile, questionFile, explanationFile]);

    // ✅ File upload handlers - Store in Context instead of passing through navigation
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, file: 'File size must be less than 10MB' }));
                return;
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, file: 'Only images and PDF files are allowed' }));
                return;
            }

            const fileData = {
                file: file,
                name: file.name,
                size: file.size,
                type: file.type,
                url: URL.createObjectURL(file),
                uploadedAt: new Date().toISOString()
            };

            // ✅ Store in both local state (for UI) and Context (for persistence)
            setSelectedFile(fileData);
            addExplanationFile(fileData); // Store in Context
            setErrors(prev => ({ ...prev, file: null }));

            console.log('File stored in Context:', fileData.name);
        }
        event.target.value = '';
    };


    const tabModules = {
        toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ 'color': [] },],
        ],
    };

    const tabFormats = [
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "link",
        'color',
    ];


    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveFile = () => {
        if (selectedFile) {
            URL.revokeObjectURL(selectedFile.url);
            setSelectedFile(null);
            addExplanationFile(null); // ✅ Remove from Context as well
            setErrors(prev => ({ ...prev, file: null }));
        }
    };

  

    // ✅ Navigation handlers - NO files in navigation state
    const handleNext = () => {
     
        // ✅ Create ONLY serializable data
        const mergedQuestionData = {
            // Previous step data
            cs_id: previousQuestionData.cs_id,
            exam_type: previousQuestionData.exam_type,
            question_type_id: previousQuestionData.question_type_id,
            questionType: previousQuestionData.questionType,
            question: previousQuestionData.question,
            options: previousQuestionData.options,
            correctAnswer: previousQuestionData.correctAnswer,
            createdAt: previousQuestionData.createdAt,
            questionId: previousQuestionData.questionId,
            instruction: previousQuestionData.instruction,

            //for dropdown data
            tabs: previousQuestionData.tabs || [],
            dropdowns: previousQuestionData.dropdowns || [],

            //for drag and drop
            drag_and_drop: previousQuestionData.drag_and_drop,
            drag_drop_content: previousQuestionData.drag_drop_content,

            //for sorting
            sortitems: previousQuestionData.sortItems,

            //for multiple radio
            question_content: previousQuestionData.question_content,
            radio_options: previousQuestionData.radio_options,
            multiradioHeading: previousQuestionData.multiradioHeading,

            //for table dropdown
            tableDropdownAnswers: previousQuestionData.tableDropdownAnswers,
            tableHeaders: previousQuestionData.tableHeaders,
            tableDropdownFields: previousQuestionData.tableDropdownFields,

            //for sentence highlight question
            passage: previousQuestionData.passage,
            highlightInstructions: previousQuestionData.highlightInstructions,
            correctHighlights: previousQuestionData.correctHighlights,
            answer: previousQuestionData.answer,

            //for multi-dropdown question
            rows: previousQuestionData.rows,
            headers: previousQuestionData.headers,

            //for Table Highlight
            answers: previousQuestionData.answers,
            tableFields: previousQuestionData.tableFields,
            tableHeaders: previousQuestionData.tableHeaders,

            // Current explanation data
            explanationHeading: explanationHeading.trim(),
            explanationText: explanationText.trim(),
            additionalInfoHeading: additionalInfoHeading.trim() || null,
            additionalInfo: additionalInfo.trim() || null,

            // File metadata (serializable only)
            questionFileMeta: hasQuestionFile ? {
                name: questionFile?.name,
                size: questionFile?.size,
                type: questionFile?.type
            } : null,
            explanationFileMeta: selectedFile ? {
                name: selectedFile.name,
                size: selectedFile.size,
                type: selectedFile.type,
                uploadedAt: selectedFile.uploadedAt
            } : null,

            // Metadata
            updatedAt: new Date().toISOString(),
            currentStep: 'explanation',
            completedSteps: ['exam-type', 'question-type', 'content', 'explanation']
        };

        console.log('✅ Navigating with serializable data only:', mergedQuestionData);
        console.log('✅ Files managed by Context:');
        console.log('📎 Question file:', hasQuestionFile ? 'Available' : 'None');
        console.log('📎 Explanation file:', hasExplanationFile ? 'Available' : 'None');

        // ✅ Navigate with ONLY serializable data - NO file objects
        navigate('/admin/meta-info', {
            state: {
                questionData: mergedQuestionData,
                // ✅ Only pass file metadata for UI display, actual files are in Context
                hasQuestionFile: hasQuestionFile,
                hasExplanationFile: hasExplanationFile,
                questionFileInfo: hasQuestionFile ? {
                    name: questionFile?.name,
                    type: questionFile?.type,
                    size: questionFile?.size
                } : null,
                explanationFileInfo: selectedFile ? {
                    name: selectedFile.name,
                    type: selectedFile.type,
                    size: selectedFile.size,
                    uploadedAt: selectedFile.uploadedAt
                } : null,
                bothFilesAvailable: hasQuestionFile && hasExplanationFile,
                fromStep: 'explanation'
            }
        });
    };


    const handleBack = () => {
        const dataToSendBack = {
            cs_id: previousQuestionData.cs_id,
            exam_type: previousQuestionData.exam_type,
            question_type_id: previousQuestionData.question_type_id,
            questionType: previousQuestionData.questionType,
            question: previousQuestionData.question,
            options: previousQuestionData.options,
            correctAnswer: previousQuestionData.correctAnswer,
            createdAt: previousQuestionData.createdAt,
            questionId: previousQuestionData.questionId,
            tableDropdownAnswers: previousQuestionData.tableDropdownAnswers,
            instruction: previousQuestionData.instruction,
            tableHeaders: previousQuestionData.tableHeaders,
            tableDropdownFields: previousQuestionData.tableDropdownFields,

            //for dropdown data
            tabs: previousQuestionData.tabs || [],
            dropdowns: previousQuestionData.dropdowns || [],

            //for drag and drop
            drag_and_drop: previousQuestionData.drag_and_drop,
            drag_drop_content: previousQuestionData.drag_drop_content,


            //for sorting
            sortitems: previousQuestionData.sortItems,

            //for multiple radio
            question_content: previousQuestionData.question_content,
            radio_options: previousQuestionData.radio_options,
            multiradioHeading: previousQuestionData.multiradioHeading,

            //for sentence highlight question
            passage: previousQuestionData.passage,
            highlightInstructions: previousQuestionData.highlightInstructions,
            correctHighlights: previousQuestionData.correctHighlights,
            answer: previousQuestionData.answer,

            //for table dropdown
            tableDropdownAnswers: previousQuestionData.tableDropdownAnswers,
            tableHeaders: previousQuestionData.tableHeaders,
            tableDropdownFields: previousQuestionData.tableDropdownFields,

            //for multi-dropdown question
            rows: previousQuestionData.rows,
            headers: previousQuestionData.headers,

            //for Table Highlight
            answers: previousQuestionData.answers,
            tableFields: previousQuestionData.tableFields,
            tableHeaders: previousQuestionData.tableHeaders,

            // Current explanation data
            explanationHeading: explanationHeading.trim(),
            explanationText: explanationText.trim(),
            additionalInfoHeading: additionalInfoHeading.trim(),
            additionalInfo: additionalInfo.trim(),

            // Metadata
            updatedAt: new Date().toISOString()
        };

        // ✅ Pick route based on questionType
        let route = "/admin/mcq-content"; // default
        switch (previousQuestionData.questionType) {
            case "MCQ":
                route = "/admin/mcq-content";
                break;
            case "Fill in the Blanks":
                route = "/admin/fill-content";
                break;
            case "Sentence Highlight":
                route = "/admin/sentence-content";
                break;
            case "Dropdown":
                route = "/admin/dropdown-content";
                break;

            case "Sorting":
                route = "/admin/sort-content";
                break;

            case "Multiple Radio":
                route = "/admin/multiradio-content";
                break;

            case "Drag Drop":
                route = "/admin/dragdrop-content";
                break;

            case "Table Dropdown":
                route = "/admin/table-dropDown";
                break

            case "Multidropdown":
                route = "/admin/multiDropDown";
                break;

            case "Table Highlight":
                route = "/admin/table-Highlight";
                break;

            // add more cases as needed
            default:
                route = "/admin/mcq-content";
        }

        // ✅ Navigate with preserved state
        navigate(route, {
            state: {
                exam_type: previousQuestionData.exam_type,
                question_type_id: previousQuestionData.question_type_id,
                questionType: previousQuestionData.questionType,
                cs_id: previousQuestionData.cs_id,
                questionData: dataToSendBack,
                hasFile: hasQuestionFile,
                fileInfo: hasQuestionFile
                    ? {
                        name: questionFile?.name,
                        type: questionFile?.type,
                        size: questionFile?.size
                    }
                    : null,
                fromStep: "explanation"
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

 

    // Cleanup on unmount
    useEffect(() => {
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
                Test type &gt; Exam Type ({previousQuestionData.exam_type}) &gt; Question Type ({previousQuestionData.questionType}) &gt; Question Content &gt; <strong>Explanation</strong>
            </Typography>

            {/* Question Preview with File Info */}


            {/* ✅ Enhanced Context Status Display */}
            <Card sx={{ mb: 3, bgcolor: 'success.light', color: '#FFFF' }}>
                <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                        🗂️ React Context File Management:
                    </Typography>
                    <Typography variant="body2">
                        • Question file in Context: {hasQuestionFile ? `✅ ${questionFile?.name}` : '➖ None'}
                    </Typography>
                    <Typography variant="body2">
                        • Explanation file in Context: {selectedFile ? `✅ ${selectedFile.name}` : '➖ None'}
                    </Typography>
                    <Typography variant="body2">
                        • Navigation safety: ✅ No FormData objects in navigation state
                    </Typography>
                    <Typography variant="body2">
                        • FormData creation: ✅ Available from Context when needed
                    </Typography>
                </CardContent>
            </Card>

            {/* Title */}
            <Typography variant="h5" mt={2} mb={1}>
                Answer Explanation
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
                Provide detailed explanations to help students understand the correct answer and learn from mistakes.
            </Typography>

            {/* Explanation Heading */}
            <Typography variant="h6" mb={1} color="primary">
                Explanation Heading 
            </Typography>
            <ReactQuill
                theme="snow"
                value={explanationHeading}
                onChange={(value) => {
                    setExplanationHeading(value);
                    setErrors(prev => ({ ...prev, explanationHeading: null }));
                }}
                modules={tabModules}
                formats={tabFormats}
                placeholder="e.g., Why this answer is correct"
                style={{ marginBottom: "24px", background: "#fff" }}
            />
            {errors.explanationHeading && (
                <Typography color="error" variant="body2">{errors.explanationHeading}</Typography>
            )}


            {/* Explanation Text Area */}
            <Typography variant="h6" mb={1} color="primary">
                Explanation Text 
            </Typography>
            <ReactQuill
                theme="snow"
                value={explanationText}
                onChange={(value) => {
                    setExplanationText(value);
                    setErrors(prev => ({ ...prev, explanationText: null }));
                }}
                modules={tabModules}
                formats={tabFormats}
                placeholder="Provide a comprehensive explanation..."
                style={{ marginBottom: "24px", background: "#fff" }}
            />
            {errors.explanationText && (
                <Typography color="error" variant="body2">{errors.explanationText}</Typography>
            )}



            {/* Additional Info Text Area */}
            <Typography variant="h6" mb={1} color="secondary">
                Additional Information
            </Typography>
            <ReactQuill
                theme="snow"
                value={additionalInfo}
                onChange={setAdditionalInfo}
                modules={tabModules}
                formats={tabFormats}
                placeholder="Any additional tips, warnings, or supplementary information..."
                style={{ marginBottom: "24px", background: "#fff" }}
            />


            {/* File Upload Section */}
            <Typography variant="h6" mb={1} color="primary">
                Supporting Image/Document
            </Typography>
            <Box display="flex" justifyContent="flex-start" mb={2}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*,.pdf"
                    style={{ display: 'none' }}
                />
                <Button
                    variant="outlined"
                    onClick={handleButtonClick}
                    startIcon={<CloudUpload />}
                    size="medium"
                >
                    {selectedFile ? 'Change Supporting File' : 'Add Supporting File'}
                </Button>
            </Box>


            {errors.file && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.file}
                </Alert>
            )}

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
                                <Box display="flex" gap={1} mt={0.5}>
                                    <Chip
                                        label={formatFileSize(selectedFile.size)}
                                        size="small"
                                        variant="outlined"
                                    />
                                    <Chip
                                        label={selectedFile.type.split('/')[1]?.toUpperCase() || 'FILE'}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                    <Chip
                                        label="Context Managed"
                                        size="small"
                                        color="success"
                                        variant="outlined"
                                    />
                                </Box>
                            </Box>

                            {/* Image Preview */}
                            {selectedFile.type.startsWith('image/') && (
                                <Box
                                    component="img"
                                    src={selectedFile.url}
                                    alt={selectedFile.name}
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        objectFit: 'cover',
                                        borderRadius: 1
                                    }}
                                />
                            )}

                            <IconButton
                                onClick={handleRemoveFile}
                                color="error"
                                size="small"
                                title="Remove file"
                            >
                                <Delete />
                            </IconButton>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* ✅ Enhanced Form Summary with Context information */}
            <Card sx={{ mt: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                        📊 Complete Form Status:
                    </Typography>
                    <Typography variant="body2">
                        • Question Content: {previousQuestionData.question ? '✅ Complete' : '❌ Missing'}
                    </Typography>
                    <Typography variant="body2">
                        • Question File (Context): {hasQuestionFile ? `✅ ${questionFile?.name}` : '➖ None'}
                    </Typography>
                    <Typography variant="body2">
                        • Explanation Heading: {explanationHeading ? '✅ Complete' : '❌ Missing'}
                    </Typography>
                    <Typography variant="body2">
                        • Explanation Text: {explanationText && explanationText.length >= 20 ? '✅ Complete' : '❌ Missing'}
                    </Typography>
                    <Typography variant="body2">
                        • Explanation File (Context): {selectedFile ? `✅ ${selectedFile.name}` : '➖ Optional'}
                    </Typography>
                    <Typography variant="body2">
                        • Total Files in Context: {(hasQuestionFile ? 1 : 0) + (selectedFile ? 1 : 0)}
                    </Typography>
                    <Typography variant="body2">
                        • Navigation: ✅ FormData-safe using React Context
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
                >
                    Next: Add Tags & Submit
                </Button>
            </Box>
        </Box>
    );
};

export default AnswerExplain;
