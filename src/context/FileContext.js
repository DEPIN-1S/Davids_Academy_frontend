// contexts/FileContext.js
import React, { createContext, useContext, useState } from 'react';

const FileContext = createContext();

export const FileProvider = ({ children }) => {
    const [questionFile, setQuestionFile] = useState(null);
    const [explanationFile, setExplanationFile] = useState(null);

    const addQuestionFile = (file) => {
        setQuestionFile(file);
    };

    const addExplanationFile = (file) => {
        setExplanationFile(file);
    };

    // ✅ Updated to match your required data structure
    const createCompleteFormData = (questionData) => {
        console.log("question data inside fileContext", questionData);
        const formData = new FormData();

        /*     
            formData.append('questionType', questionData.questionType || '');
            formData.append('question_type_id', questionData.question_type_id?.toString() || '');
            formData.append('question', questionData.question || '');
            formData.append('difficulty', questionData.difficulty || '');
            formData.append('subject', questionData.subject?.toString() || '');
            formData.append('lesson', questionData.lesson?.toString() || '');
            formData.append('clientNeedArea', questionData.clientNeedArea?.toString() || '');
            formData.append('clientNeedTopic', questionData.clientNeedTopic?.toString() || '');
            formData.append('explanationHeading', questionData.explanationHeading || '');
            formData.append('explanationText', questionData.explanationText || '');
            formData.append('info', questionData.additionalInfo || '');
      
            if (questionFile?.file) {
                formData.append('exhibit', questionFile.file, questionFile.name);
            }
            if (explanationFile?.file) {
                formData.append('infoImage', explanationFile.file, explanationFile.name);
            } */

        const questionType = questionData.questionType;

        switch (questionType) {
            case 'MCQ':
                formData.append('questionType', questionData.questionType || 'MCQ');
                formData.append('courseId', questionData.cs_id || '');
                formData.append('question_type_id', questionData.question_type_id?.toString() || '');
                formData.append('question', questionData.question || '');
                formData.append('answer', questionData.answer || '');
                formData.append('difficulty', questionData.difficulty || '');
                formData.append('exam_type', questionData.exam_type || '');
                if (questionFile?.file) {
                    formData.append('exhibit', questionFile.file, questionFile.name);
                } else {
                    formData.append('exhibit', questionData.exhibit || '');
                }

                formData.append('options', JSON.stringify(questionData.options || []));
                formData.append('explanationHeading', questionData.explanationHeading || '');
                formData.append('explanationText', questionData.explanationText || '');
                formData.append('info', questionData.info || '');

                if (explanationFile?.file) {
                    formData.append('infoImage', explanationFile.file, explanationFile.name);
                } else {
                    formData.append('infoImage', questionData.infoImage || '');
                }
                break;



            case 'Dropdown':
                formData.append('tabs', JSON.stringify(questionData.tabs || []));
                formData.append('dropdowns', JSON.stringify(questionData.dropdowns || []));
                break;

            case 'Sorting':
            case 'Sort':
                formData.append('sortItems', JSON.stringify(questionData.sortItems || []));
                break;

            case 'Fill in the Blanks':
            case 'Fill in Blanks':
                formData.append('answer', questionData.answer || '');
                formData.append('question_content', JSON.stringify(questionData.question_content || []));
                formData.append('options', JSON.stringify(questionData.options || []));
                break;

            case 'Multiple Radio':
                formData.append('tabs', JSON.stringify(questionData.tabs || []));
                formData.append('question_content', JSON.stringify(questionData.question_content || []));
                formData.append('radio_options', JSON.stringify(questionData.radio_options || []));
                break;

            case 'Drag Drop':
            case 'Drag and Drop':
                formData.append('drag_drop_content', questionData.drag_drop_content || '');
                formData.append('tabs', JSON.stringify(questionData.tabs || []));
                formData.append('drag_and_drop', JSON.stringify(questionData.drag_and_drop || []));
                break;

            default:
                // Default to MCQ format
                formData.append('answer', questionData.correctAnswer || '');
                formData.append('options', JSON.stringify(questionData.options || []));
                break;
        }

        return formData;
    };

    const clearFiles = () => {
        if (questionFile?.url) URL.revokeObjectURL(questionFile.url);
        if (explanationFile?.url) URL.revokeObjectURL(explanationFile.url);
        setQuestionFile(null);
        setExplanationFile(null);
    };

    return (
        <FileContext.Provider value={{
            questionFile,
            explanationFile,
            addQuestionFile,
            addExplanationFile,
            createCompleteFormData,
            clearFiles,
            hasQuestionFile: !!questionFile,
            hasExplanationFile: !!explanationFile
        }}>
            {children}
        </FileContext.Provider>
    );
};

export const useFileContext = () => {
    const context = useContext(FileContext);
    if (!context) {
        throw new Error('useFileContext must be used within a FileProvider');
    }
    return context;
};
