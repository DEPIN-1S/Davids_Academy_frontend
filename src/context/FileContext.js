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
        formData.append('questionType', questionData.questionType || '');
        formData.append('courseId', questionData.courseId || '')
        formData.append('question_type_id', questionData.question_type_id || '');
        formData.append('question', questionData.question || '');
        formData.append('difficulty', questionData.difficulty || '');
        formData.append('exam_type', questionData.exam_type)
        formData.append('explanationHeading', questionData.explanationHeading || '');
        formData.append('explanationText', questionData.explanationText || '');
        formData.append('info', questionData.info || '');
        formData.append('dropdowns', questionData.dropdowns);
        formData.append('drag_and_drop', questionData.drag_and_drop)
        formData.append('sortItems', questionData.sortItems)
        formData.append('tabs', questionData.tabs || [])
        formData.append('options', questionData.options || [])
        formData.append('answer',questionData.answer)


        /*  formData.append('subject', questionData.subject?.toString() || '');
            formData.append('lesson', questionData.lesson?.toString() || '');
            formData.append('clientNeedArea', questionData.clientNeedArea?.toString() || '');
            formData.append('clientNeedTopic', questionData.clientNeedTopic?.toString() || ''); */
        /* 
        formData.append('',questionData.)
        formData.append('',questionData.)
         */

        if (questionFile?.file) {
            formData.append('exhibit', questionFile.file, questionFile.name);
        }

        if (explanationFile?.file) {
            formData.append('infoImage', explanationFile.file, explanationFile.name);
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
