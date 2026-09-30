import React, { createContext, useState } from "react";

export const SampleQuestionnaireResultContext = createContext(null);

function ResultProvider({ children }) {
    const [sampleQuestionnaireResult, setSampleQuestionnaireResult] = useState({
        attemptedQuestion: 0,
        corrected: 0,
        wrong: 0
    });

    return (
        <SampleQuestionnaireResultContext.Provider
            value={{ sampleQuestionnaireResult, setSampleQuestionnaireResult }}
        >
            {children}
        </SampleQuestionnaireResultContext.Provider>
    );
}

export default ResultProvider;
