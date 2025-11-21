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
    Chip,
    TextField
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

    console.log("🔍 Context from MetaInfo:", {
        hasQuestionFile,
        hasExplanationFile,
        questionFile,
        explanationFile
    });

    // ✅ Receive only serializable question data
    const receivedQuestionData = location.state?.questionData || {};
    const { loading, success, error } = useSelector(state => state.exam);
    const [form, setForm] = useState({
        difficulty: receivedQuestionData.difficulty || "",
        subject: receivedQuestionData.subject || "",
        lesson: receivedQuestionData.lesson || "",
        clientNeedArea: receivedQuestionData.clientNeedArea || "",
        clientNeedTopic: receivedQuestionData.clientNeedTopic || "",
        marks: receivedQuestionData.marks || "",
    });

    // ✅ Debug: Log context status
    useEffect(() => {
        console.log('✅ Context Status in MetaInfo:');
        console.log('📎 Question file in context:', hasQuestionFile ? questionFile?.name : 'None');
        console.log('📎 Explanation file in context:', hasExplanationFile ? explanationFile?.name : 'None');
        console.log('📄 Received question data:', receivedQuestionData);
        console.log("question type id:::", receivedQuestionData.question_type_id);

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
            'Fill in Blanks': 7,
            'Table Dropdown': 14,
            'Multidropdown': 17,
            'Table Highlight': 15,

        };
        return typeMapping[questionType] || 1;
    };

    // ✅ Submit using Context FormData for multipart support
    // Updated handleSubmitWithContextFormData function
    const handleSubmitWithContextFormData = async () => {
        console.log("🔍 Context from MetaInfo:", {
            hasQuestionFile,
            hasExplanationFile,
            questionFile,
            explanationFile
        });
        const loadingToastId = toast.loading('📝 Adding question to Q-Bank...', {
            position: "top-right",
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        console.log("Full URL: ", `${process.env.REACT_APP_API_URL}/exam/question`);
        try {

            // data structure according to question type
            const completeQuestionData = constructQuestionFormData();
            // ✅ Create FormData using Context
            const completeFormData = createCompleteFormData(completeQuestionData);
            /*             console.log('🚀 Submitting with Context FormData (multipart/form-data)');
                        console.log('📦 FormData created from Context::::', completeQuestionData);
                        console.log("📁 Adding files inside createCompleteFormData:"); */
            console.log("Question type in final submission for formdata :: ", completeFormData.exam_type);
            console.log("Does exam_type exist? ", completeFormData.has('exam_type'));
            console.log("Value of exam_type: ", completeFormData.get('exam_type'));
            console.log("📦Final FormData entries:");
            for (let [key, value] of completeFormData.entries()) {
                console.log(key, value);
            }

            // ✅ Submit to your multipart endpoint
            console.log("URL :::::: ", process.env.REACT_APP_API_URL);
            console.log("completed form data ", completeFormData);
            const token = sessionStorage.getItem("accessToken");
            const response = await fetch(`${process.env.REACT_APP_API_URL}/exam/question`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
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
            console.error('Failed to submit questionssss:', err.message);
            toast.error(`❌ Failed to add question: ${err.message}`, {
                position: "top-right",
                autoClose: 5000,
                theme: "colored",
            });
        }
    };

    //Data sets for fileContext
    // ✅ MCQ base structure
    const getMCQFormData = () => ({
        questionType: receivedQuestionData.questionType,
        courseId: receivedQuestionData.cs_id,
        question_type_id: receivedQuestionData.question_type_id,
        question: receivedQuestionData.question || "",
        exam_type: receivedQuestionData.exam_type,
        instruction: receivedQuestionData.instruction || "",
        difficulty: form.difficulty,
        tabs: receivedQuestionData.tabs || [],
        explanationHeading: receivedQuestionData?.explanationHeading || "",
        explanationText: receivedQuestionData?.explanationText || "",
        info: receivedQuestionData.additionalInfo || "",
        answer: receivedQuestionData.correctAnswer || [],
        options: receivedQuestionData.options || [],
        marks: form.marks
    });


    // ✅ Dropdown question data
    const getDropdownFormData = () => ({
        questionType: receivedQuestionData.questionType,
        question_type_id: receivedQuestionData.question_type_id,
        courseId: receivedQuestionData.cs_id,
        question: receivedQuestionData.question || "",
        difficulty: form.difficulty,
        instruction: receivedQuestionData.instruction || "",
        exam_type: receivedQuestionData.exam_type,
        tabs: receivedQuestionData.tabs || [],
        dropdowns: receivedQuestionData.dropdowns || [],
        explanationHeading: receivedQuestionData.explanationHeading || "",
        explanationText: receivedQuestionData.explanationText || "",
        info: receivedQuestionData.additionalInfo || "",
        marks: form.marks,


    });

    const getDragDropFormData = () => ({
        questionType: receivedQuestionData.questionType,
        question_type_id: receivedQuestionData.question_type_id,
        courseId: receivedQuestionData.cs_id,
        exam_type: receivedQuestionData.exam_type,
        question: receivedQuestionData.question || "",
        instruction: receivedQuestionData.instruction || "",
        drag_drop_content: receivedQuestionData.drag_drop_content || "",
        difficulty: form.difficulty || "",
        tabs: receivedQuestionData.tabs || [],
        drag_and_drop: receivedQuestionData.drag_and_drop || [],
        explanationHeading: receivedQuestionData.explanationHeading || "",
        explanationText: receivedQuestionData.explanationText || "",
        info: receivedQuestionData.additionalInfo || "",
        marks: form.marks,

    });


    const getSortingFormData = () => ({
        questionType: receivedQuestionData.questionType, // type name if you store it
        question_type_id: receivedQuestionData.question_type_id,  // your helper for IDs
        courseId: receivedQuestionData.cs_id,
        exam_type: receivedQuestionData.exam_type,
        question: receivedQuestionData.question || "",
        sortItems: receivedQuestionData.sortitems || [],
        tabs: receivedQuestionData.tabs || [],
        instruction: receivedQuestionData.instruction || "",
        difficulty: form.difficulty || "",
        explanationHeading: receivedQuestionData.explanationHeading || "",
        explanationText: receivedQuestionData.explanationText || "",
        info: receivedQuestionData.additionalInfo || "",
        marks: form.marks

    });

    const getFillInTheBlanksFormData = () => ({
        courseId: receivedQuestionData.cs_id,
        questionType: receivedQuestionData.questionType,
        exam_type: receivedQuestionData.exam_type,
        question: receivedQuestionData?.question_content?.[0]?.question_text,
        question_type_id: receivedQuestionData.question_type_id,
        answer: receivedQuestionData?.question_content?.[0]?.fill_blanks_answer,
        difficulty: form.difficulty || "",
        instruction: receivedQuestionData.instruction || "",
        question_content: receivedQuestionData.question_content,
        options: receivedQuestionData.options,
        explanationHeading: receivedQuestionData.explanationHeading || "",
        explanationText: receivedQuestionData.explanationText || "",
        info: receivedQuestionData.additionalInfo || "",
        marks: form.marks
    });

    const getMultiRadioFormData = () => ({
        courseId: receivedQuestionData.cs_id,
        questionType: receivedQuestionData.questionType,
        question_type_id: receivedQuestionData.question_type_id,
        exam_type: receivedQuestionData.exam_type,
        question: receivedQuestionData.question || "",
        difficulty: form.difficulty || "",
        instruction: receivedQuestionData.instruction || "",
        tabs: receivedQuestionData.tabs || [],
        multiradioHeading: receivedQuestionData.multiradioHeading,
        /* question_content:receivedQuestionData.question_content, */
        question_content: receivedQuestionData.question_content,
        radio_options: receivedQuestionData.radio_options || [],
        explanationHeading: receivedQuestionData.explanationHeading || "",
        explanationText: receivedQuestionData.explanationText || "",
        info: receivedQuestionData.additionalInfo || "",
        marks: form.marks

    });

    const getSentenceHighlightFormData = () => ({
        courseId: receivedQuestionData.cs_id,
        questionType: receivedQuestionData.questionType,
        question_type_id: receivedQuestionData.question_type_id,
        exam_type: receivedQuestionData.exam_type,
        question: receivedQuestionData.question || "",
        difficulty: form.difficulty || "",
        tabs: receivedQuestionData.tabs || [],
        instruction: receivedQuestionData.instruction || "",
        highlightoptions: receivedQuestionData.correctHighlights,
        passage: receivedQuestionData.passage,
        explanationHeading: receivedQuestionData.explanationHeading || "",
        explanationText: receivedQuestionData.explanationText || "",
        info: receivedQuestionData.additionalInfo || "",
        answer: receivedQuestionData.answer || [],
        marks: form.marks
    });


    

    const getTableDropdownFormData = () => ({
        courseId: receivedQuestionData.cs_id,
        questionType: receivedQuestionData.questionType,
        question_type_id: receivedQuestionData.question_type_id,
        exam_type: receivedQuestionData.exam_type,
        question: receivedQuestionData.question || "",
        difficulty: form.difficulty || "",
        tabs: receivedQuestionData.tabs || [],
        instruction: receivedQuestionData.instruction || "",
        explanationHeading: receivedQuestionData.explanationHeading || "",
        explanationText: receivedQuestionData.explanationText || "",
        info: receivedQuestionData.additionalInfo || "",
        marks: form.marks,
        tableDropdownAnswers: receivedQuestionData.tableDropdownAnswers || [],
        tableHeaders: receivedQuestionData.tableHeaders || {},
        tableDropdownFields: receivedQuestionData.tableDropdownFields || [],

    })


    

    const multiDropDownFormData = () => ({
        courseId: receivedQuestionData.cs_id,
        questionType: receivedQuestionData.questionType,
        question_type_id: receivedQuestionData.question_type_id,
        exam_type: receivedQuestionData.exam_type,
        question: receivedQuestionData.question || "",
        difficulty: form.difficulty || "",
        tabs: receivedQuestionData.tabs || [],
        instruction: receivedQuestionData.instruction || "",
        explanationHeading: receivedQuestionData.explanationHeading || "",
        explanationText: receivedQuestionData.explanationText || "",
        info: receivedQuestionData.additionalInfo || "",
        marks: form.marks,
        rows: receivedQuestionData.rows || [],
        headers: receivedQuestionData.headers || [],
    })

    const tableHighlightFormData = () => ({
        courseId: receivedQuestionData.cs_id,
        questionType: receivedQuestionData.questionType,
        question_type_id: receivedQuestionData.question_type_id,
        exam_type: receivedQuestionData.exam_type,
        question: receivedQuestionData.question || "",
        difficulty: form.difficulty || "",
        tabs: receivedQuestionData.tabs || [],
        instruction: receivedQuestionData.instruction || "",
        explanationHeading: receivedQuestionData.explanationHeading || "",
        explanationText: receivedQuestionData.explanationText || "",
        info: receivedQuestionData.additionalInfo || "",
        marks: form.marks,
        answers: receivedQuestionData.answers || [],
        tableFields: receivedQuestionData.tableFields || [],
        tableHeaders: receivedQuestionData.tableHeaders || [],
    })



    const constructQuestionFormData = () => {
        console.log("🟢 Received questionType:", receivedQuestionData.questionType);
        const questionType = receivedQuestionData.questionType || 'MCQ';

        switch (questionType) {
            case 'MCQ':
                return getMCQFormData();
            case 'Dropdown':
                return getDropdownFormData();

            case 'Drag Drop':
                return getDragDropFormData();

            case 'Sorting':
                return getSortingFormData();

            case 'Multiple Radio':
                return getMultiRadioFormData();

            case 'Fill in the Blanks':
                return getFillInTheBlanksFormData();

            case 'Sentence Highlight':
                return getSentenceHighlightFormData();

            case 'Table Dropdown':
                return getTableDropdownFormData();

            case 'Multidropdown':
                return multiDropDownFormData();

            case 'Table Highlight':
                return tableHighlightFormData();

            default:
                return getMCQFormData(); // fallback to MCQ format
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

    // ✅ MCQ base structure
    const getMCQBaseData = () => ({
        questionType: receivedQuestionData.questionType,
        courseId: receivedQuestionData.cs_id,
        question_type_id: receivedQuestionData.question_type_id,
        question: receivedQuestionData.question || "",
        exam_type: receivedQuestionData.exam_type,
        exhibit: null,
        tabs: receivedQuestionData.tabs || [],
        difficulty: form.difficulty,
        instructions: receivedQuestionData.instruction || "",
        explanationHeading: receivedQuestionData.explanationHeading || "",
        explanationText: receivedQuestionData.explanationText || "",
        info: receivedQuestionData.additionalInfo || "",
        infoimage: null,
        answer: receivedQuestionData.correctAnswer || [],
        options: receivedQuestionData.options || [],
        marks: form.marks
    });


    // ✅ Dropdown question data
    const getDropdownBaseData = () => ({
        questionType: receivedQuestionData.questionType,
        question_type_id: receivedQuestionData.question_type_id,
        courseId: receivedQuestionData.cs_id,
        question: receivedQuestionData.question || "",
        difficulty: form.difficulty,
        exam_type: receivedQuestionData.exam_type,
        tabs: receivedQuestionData.tabs || [],
        instructions: receivedQuestionData.instruction || "",
        dropdowns: receivedQuestionData.dropdowns || [],
        explanationHeading: receivedQuestionData.explanationHeading || "",
        explanationText: receivedQuestionData.explanationText || "",
        info: receivedQuestionData.additionalInfo || "",
        infoimage: null, // or receivedQuestionData.infoImage if you want actual image link
        marks: form.marks
    });

    const getDragDropBaseData = () => ({
        questionType: receivedQuestionData.questionType,
        question_type_id: receivedQuestionData.question_type_id,
        courseId: receivedQuestionData.cs_id,
        exam_type: receivedQuestionData.exam_type,
        question: receivedQuestionData.question || "",
        drag_drop_content: receivedQuestionData.drag_drop_content || "",
        difficulty: form.difficulty || "",
        tabs: receivedQuestionData.tabs || [],
        instructions: receivedQuestionData.instruction || "",
        drag_and_drop: receivedQuestionData.drag_and_drop || [],
        explanationHeading: receivedQuestionData.explanationHeading || "",
        explanationText: receivedQuestionData.explanationText || "",
        info: receivedQuestionData.additionalInfo || "",
        infoimage: receivedQuestionData.infoImage || null,
        marks: form.marks
    });


    const getSortingBaseData = () => ({
        questionType: receivedQuestionData.questionType,
        question_type_id: receivedQuestionData.question_type_id,
        courseId: receivedQuestionData.cs_id,
        exam_type: receivedQuestionData.exam_type,
        question: receivedQuestionData.question || "",
        instructions: receivedQuestionData.instruction || "",
        sortItems: receivedQuestionData.sortitems || [],
        tabs: receivedQuestionData.tabs || [],
        difficulty: form.difficulty || "",
        explanationHeading: receivedQuestionData.explanationHeading || "",
        explanationText: receivedQuestionData.explanationText || "",
        info: receivedQuestionData.additionalInfo || "",
        infoimage: receivedQuestionData.infoImage || null,
        marks: form.marks
    });

    const getFillInTheBlanksBaseData = () => ({
        courseId: receivedQuestionData.cs_id,
        questionType: receivedQuestionData.questionType,
        exam_type: receivedQuestionData.exam_type,
        question: receivedQuestionData?.question_content?.[0]?.question_text,
        question_type_id: receivedQuestionData.question_type_id,
        answer: receivedQuestionData?.question_content?.[0]?.fill_blanks_answer,
        difficulty: form.difficulty || "",
        instructions: receivedQuestionData.instruction || "",
        question_content: receivedQuestionData.question_content,
        options: receivedQuestionData.options,
        explanationHeading: receivedQuestionData.explanationHeading || "",
        explanationText: receivedQuestionData.explanationText || "",
        info: receivedQuestionData.additionalInfo || "",
        infoimage: receivedQuestionData.infoImage || null,
        marks: form.marks
    });

    const getMultiRadioBaseData = () => ({
        courseId: receivedQuestionData.cs_id,
        questionType: receivedQuestionData.questionType,
        question_type_id: receivedQuestionData.question_type_id,
        exam_type: receivedQuestionData.exam_type,
        question: receivedQuestionData.question || "",
        difficulty: form.difficulty || "",
        instructions: receivedQuestionData.instruction || "",
        tabs: receivedQuestionData.tabs || [],
        question_content: receivedQuestionData.question_content,
        multiradioHeading: receivedQuestionData.multiradioHeading,
        radio_options: receivedQuestionData.radio_options || [],
        explanationHeading: receivedQuestionData.explanationHeading || "",
        explanationText: receivedQuestionData.explanationText || "",
        info: receivedQuestionData.additionalInfo || "",
        infoimage: receivedQuestionData.infoImage || null,
        marks: form.marks
    });

    const getSentenceHighlightBaseData = () => ({
        courseId: receivedQuestionData.cs_id,
        questionType: receivedQuestionData.questionType,
        question_type_id: receivedQuestionData.question_type_id,
        exam_type: receivedQuestionData.exam_type,
        question: receivedQuestionData.question || "",
        difficulty: form.difficulty || "",
        instructions: receivedQuestionData.instruction || "",
        tabs: receivedQuestionData.tabs || [],
        highlightoptions: receivedQuestionData.correctHighlights,
        passage: receivedQuestionData.passage,
        explanationHeading: receivedQuestionData.explanationHeading || "",
        explanationText: receivedQuestionData.explanationText || "",
        info: receivedQuestionData.additionalInfo || "",
        answers: receivedQuestionData.answer || [],
        infoimage: receivedQuestionData.infoImage || null,
        marks: form.marks
    });


    const getTableDropdownBaseData = () => ({
        courseId: receivedQuestionData.cs_id,
        questionType: receivedQuestionData.questionType,
        question_type_id: receivedQuestionData.question_type_id,
        exam_type: receivedQuestionData.exam_type,
        question: receivedQuestionData.question || "",
        difficulty: form.difficulty || "",
        tabs: receivedQuestionData.tabs || [],
        instructions: receivedQuestionData.instruction || "",
        explanationHeading: receivedQuestionData.explanationHeading || "",
        explanationText: receivedQuestionData.explanationText || "",
        info: receivedQuestionData.additionalInfo || "",
        infoimage: receivedQuestionData.infoImage || null,
        marks: form.marks,
        tableDropdownAnswers: receivedQuestionData.tableDropdownAnswers || [],
        tableHeaders: receivedQuestionData.tableHeaders || {},
        tableDropdownFields: receivedQuestionData.tableDropdownFields || [],
    })


    const getMultiDropDownBaseData = () => ({
        courseId: receivedQuestionData.cs_id,
        questionType: receivedQuestionData.questionType,
        question_type_id: receivedQuestionData.question_type_id,
        exam_type: receivedQuestionData.exam_type,
        question: receivedQuestionData.question || "",
        difficulty: form.difficulty || "",
        tabs: receivedQuestionData.tabs || [],
        instructions: receivedQuestionData.instruction || "",
        explanationHeading: receivedQuestionData.explanationHeading || "",
        explanationText: receivedQuestionData.explanationText || "",
        info: receivedQuestionData.additionalInfo || "",
        infoimage: receivedQuestionData.infoImage || null,
        marks: form.marks,
        rows: receivedQuestionData.rows || [],
        headers: receivedQuestionData.headers || [],
    })


    const getTableHighlightBaseData = () => ({
        courseId: receivedQuestionData.cs_id,
        questionType: receivedQuestionData.questionType,
        question_type_id: receivedQuestionData.question_type_id,
        exam_type: receivedQuestionData.exam_type,
        question: receivedQuestionData.question || "",
        difficulty: form.difficulty || "",
        tabs: receivedQuestionData.tabs || [],
        instructions: receivedQuestionData.instruction || "",
        explanationHeading: receivedQuestionData.explanationHeading || "",
        explanationText: receivedQuestionData.explanationText || "",
        info: receivedQuestionData.additionalInfo || "",
        infoimage: receivedQuestionData.infoImage || null,
        marks: form.marks,
        answers: receivedQuestionData.answers || [],
        tableFields: receivedQuestionData.tableFields || [],
        tableHeaders: receivedQuestionData.tableHeaders || [],

    })


    // ✅ Main function - still same pattern
    const constructQuestionData = () => {
        const questionType = receivedQuestionData.questionType || 'MCQ';

        switch (questionType) {
            case 'MCQ':
                return getMCQBaseData();
            case 'Dropdown':
                return getDropdownBaseData();

            case 'Drag Drop':
                return getDragDropBaseData();

            case 'Sorting':
                return getSortingBaseData();

            case 'Multiple Radio':
                return getMultiRadioBaseData();

            case 'Fill in the Blanks':
                return getFillInTheBlanksBaseData();

            case 'Sentence Highlight':
                return getSentenceHighlightBaseData();

            case 'Table Dropdown':
                return getTableDropdownBaseData();

            case 'Multidropdown':
                return getMultiDropDownBaseData();

            case 'Table Highlight':
                return getTableHighlightBaseData();

            default:
                console.warn(" Unknown questionType:", receivedQuestionData.questionType);
                break;
        }
    };

    const onBack = () => {
        // ✅ Preserve current meta data when going back (all serializable)
        const currentMetaData = {
            difficulty: form.difficulty,

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
        return form.difficulty;
    };

    // Show warning if trying to submit incomplete form
    const handleIncompleteSubmit = () => {
        toast.warning('⚠️ Please fill in all required fields before submitting', {
            position: "top-right",
            autoClose: 4000,
            theme: "colored",
        });
    };



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
                Add Tags & Information
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
                Label your {receivedQuestionData.questionType || 'MCQ'} question with relevant categories for better organization and performance insights.
            </Typography>

            {/* Select Fields */}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <FormControl style={{ width: 200 }}  >
                        <InputLabel>Difficulty</InputLabel>
                        <Select
                            value={form.Easy}
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
                <TextField style={{ width: 200 }}
                    fullWidth
                    id="marks"
                    name="marks"
                    label="Marks *"
                    type="number"
                    value={form.marks}
                    onChange={handleChange("marks")}
                    disabled={loading}
                />

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
                        • Marks: {form.marks || '❌ Required'}
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
