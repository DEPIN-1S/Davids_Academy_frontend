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

    const createCompleteFormData = (questionData) => {
        const formData = new FormData();

        console.log("explanation file in file context:::", explanationFile);
        console.log("question file in file context:::", questionFile);

        switch (questionData.questionType) {
            case "MCQ":
                formData.append("questionType", questionData.questionType);
                formData.append("courseId", questionData.courseId);
                formData.append("question_type_id", questionData.question_type_id);
                formData.append("question", questionData.question);
                formData.append("exam_type", questionData.exam_type);
                formData.append("difficulty", questionData.difficulty);
                formData.append("explanationHeading", questionData.explanationHeading);
                formData.append("explanationText", questionData.explanationText);
                formData.append("info", questionData.info);
                formData.append("answer", JSON.stringify(questionData.answer || []));
                formData.append("options", JSON.stringify(questionData.options || [])); // ✅ FIX
                formData.append("marks", questionData.marks)
                if (questionFile?.file) {
                    formData.append("exhibit", questionFile.file, questionFile.file.name);
                }

                break;

            case "Dropdown":
                formData.append("questionType", questionData.questionType);
                formData.append("question_type_id", questionData.question_type_id);
                formData.append("courseId", questionData.courseId);
                formData.append("question", questionData.question);
                formData.append("difficulty", questionData.difficulty);
                formData.append("instructions", questionData.instruction);
                formData.append("exam_type", questionData.exam_type);
                formData.append("tabs", JSON.stringify(questionData.tabs || []));
                formData.append("dropdowns", JSON.stringify(questionData.dropdowns || []));
                formData.append("explanationHeading", questionData.explanationHeading);
                formData.append("explanationText", questionData.explanationText);
                formData.append("info", questionData.info);
                formData.append("marks", questionData.marks)
                break;

            case "Drag Drop":
                formData.append("questionType", questionData.questionType);
                formData.append("question_type_id", questionData.question_type_id);
                formData.append("courseId", questionData.courseId);
                formData.append("exam_type", questionData.exam_type);
                formData.append("question", questionData.question);
                formData.append("drag_drop_content", questionData.drag_drop_content);
                formData.append("difficulty", questionData.difficulty);
                formData.append("instructions", questionData.instruction);
                formData.append("tabs", JSON.stringify(questionData.tabs || []));
                formData.append("drag_and_drop", JSON.stringify(questionData.drag_and_drop || []));
                formData.append("explanationHeading", questionData.explanationHeading);
                formData.append("explanationText", questionData.explanationText);
                formData.append("info", questionData.info);
                formData.append("marks", questionData.marks)
                break;

            case "Sorting":
                formData.append("questionType", questionData.questionType);
                formData.append("question_type_id", questionData.question_type_id);
                formData.append("courseId", questionData.courseId);
                formData.append("exam_type", questionData.exam_type);
                formData.append("question", questionData.question);

                formData.append("sortItems", JSON.stringify(questionData.sortItems || []));
                formData.append("difficulty", questionData.difficulty);
                formData.append("explanationHeading", questionData.explanationHeading);
                formData.append("explanationText", questionData.explanationText);
                formData.append("info", questionData.info);
                formData.append("marks", questionData.marks)
                break;

            case "Fill in the Blanks":
                formData.append("courseId", questionData.courseId);
                formData.append("questionType", questionData.questionType);
                formData.append("exam_type", questionData.exam_type);
                formData.append("question", questionData.question);
                formData.append("question_type_id", questionData.question_type_id);
                formData.append("answer", questionData.answer);
                formData.append("difficulty", questionData.difficulty);
                formData.append("question_content", JSON.stringify(questionData.question_content || []));
                formData.append("options", JSON.stringify(questionData.options || []));
                formData.append("explanationHeading", questionData.explanationHeading);
                formData.append("explanationText", questionData.explanationText);
                formData.append("info", questionData.info);
                formData.append("marks", questionData.marks)
                break;

            case "Multiple Radio":
                formData.append("courseId", questionData.courseId);
                formData.append("questionType", questionData.questionType);
                formData.append("question_type_id", questionData.question_type_id);
                formData.append("exam_type", questionData.exam_type);
                formData.append("question", questionData.question);
                formData.append("difficulty", questionData.difficulty);
                formData.append("instructions", questionData.instruction);
                formData.append("tabs", JSON.stringify(questionData.tabs || []));
                formData.append("question_content", JSON.stringify(questionData.question_content || []));
                formData.append("radio_options", JSON.stringify(questionData.radio_options || []));
                formData.append("explanationHeading", questionData.explanationHeading);
                formData.append("explanationText", questionData.explanationText);
                formData.append("info", questionData.info);
                formData.append("marks", questionData.marks)
                break;

            case "Sentence Highlight": // ✅ FIX case sensitivity
                formData.append("courseId", questionData.courseId ?? "");
                formData.append("questionType", questionData.questionType ?? "");
                formData.append("question_type_id", questionData.question_type_id ?? "");
                formData.append("exam_type", questionData.exam_type ?? "");
                formData.append("question", questionData.question ?? "");
                formData.append("difficulty", questionData.difficulty ?? "");
                formData.append("instructions", questionData.instruction);
                formData.append("tabs", JSON.stringify(questionData.tabs || []));
                formData.append("highlightoptions", JSON.stringify(questionData.highlightoptions || []));
                formData.append("answers", JSON.stringify(questionData.answer || []));
                formData.append("passage", questionData.passage ?? "");
                formData.append("explanationHeading", questionData.explanationHeading ?? "");
                formData.append("explanationText", questionData.explanationText ?? "");
                formData.append("info", questionData.info ?? "");
                formData.append("marks", questionData.marks)
                break;

            case "Table Dropdown":
                formData.append("courseId", questionData.courseId ?? "");
                formData.append("questionType", questionData.questionType ?? "");
                formData.append("question_type_id", questionData.question_type_id ?? "");
                formData.append("exam_type", questionData.exam_type ?? "");
                formData.append("question", questionData.question ?? "");
                formData.append("difficulty", questionData.difficulty ?? "");
                formData.append("instructions", questionData.instruction);
                formData.append("tabs", JSON.stringify(questionData.tabs || []));
                formData.append("tableDropdownAnswers", questionData.tableDropdownAnswers || []);
                formData.append("tableHeaders", questionData.tableHeaders || {});
                formData.append("tableDropdownFields", questionData.tableDropdownFields || []);
                formData.append("explanationHeading", questionData.explanationHeading ?? "");
                formData.append("explanationText", questionData.explanationText ?? "");
                formData.append("info", questionData.info ?? "");
                formData.append("marks", questionData.marks)

            case "Multidropdown":
                formData.append("courseId", questionData.courseId ?? "");
                formData.append("questionType", questionData.questionType ?? "");
                formData.append("question_type_id", questionData.question_type_id ?? "");
                formData.append("exam_type", questionData.exam_type ?? "");
                formData.append("question", questionData.question ?? "");
                formData.append("difficulty", questionData.difficulty ?? "");
                formData.append("instructions", questionData.instruction);
                formData.append("tabs", JSON.stringify(questionData.tabs || []));
                formData.append("rows", JSON.stringify(questionData.rows || []));
                formData.append("headers", JSON.stringify(questionData.headers || []));
                formData.append("explanationHeading", questionData.explanationHeading ?? "");
                formData.append("explanationText", questionData.explanationText ?? "");
                formData.append("info", questionData.info ?? "");
                formData.append("marks", questionData.marks)
                break;


            default:
                console.warn(" Unknown questionType:", questionData.questionType);
                break;
        }

        if (explanationFile?.file) {
            formData.append("infoimage", explanationFile.file, explanationFile.file.name);
        }

        for (let [key, value] of formData.entries()) {
            console.log("📦 FormData entry in file context :::", key, value);
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

