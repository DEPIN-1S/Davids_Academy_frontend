// contexts/FileContext.js
import React, { createContext, useContext, useState } from 'react';

const FileContext = createContext();

export const FileProvider = ({ children }) => {
    const [questionFile, setQuestionFile] = useState(null);
    const [explanationFile, setExplanationFile] = useState(null);
    const [formData, setFormData] = useState(null);

    const addQuestionFile = (file) => {
        setQuestionFile(file);
    };

    const addExplanationFile = (file) => {
        setExplanationFile(file);
    };

    const createCompleteFormData = (additionalData = {}) => {
        const formData = new FormData();

        // Add files
        if (questionFile?.file) {
            formData.append('exhibit', questionFile.file, questionFile.name);
        }
        if (explanationFile?.file) {
            formData.append('infoImage', explanationFile.file, explanationFile.name);
        }

        // Add other data
        Object.entries(additionalData).forEach(([key, value]) => {
            if (Array.isArray(value) || typeof value === 'object') {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value.toString());
            }
        });

        return formData;
    };

    const clearFiles = () => {
        if (questionFile?.url) URL.revokeObjectURL(questionFile.url);
        if (explanationFile?.url) URL.revokeObjectURL(explanationFile.url);
        setQuestionFile(null);
        setExplanationFile(null);
        setFormData(null);
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
