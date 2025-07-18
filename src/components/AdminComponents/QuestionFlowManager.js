import React, { useState } from "react";
import TestCreateComponent from "./TestCreateComponent";
import QuestionTypeComponent from "./QuestionTypeComponent";

const QuestionFlowManager = () => {
    const [step, setStep] = useState("selectTest");
    const [testType, setTestType] = useState(null);

    // When Next is clicked in TestCreateComponent
    const handleTestTypeNext = (selected) => {
        setTestType(selected);
        if (selected === "classic") {
            setStep("selectType"); // ✅ Navigate to QuestionTypeComponent
        } else {
            alert("NGN feature coming soon!");
        }
    };

    const handleQuestionTypeNext = (selectedType) => {
        console.log("Selected Question Type:", selectedType);
        // You can navigate to the form component here
    };

    return (
        <>
            {step === "selectTest" && (
                <TestCreateComponent onNext={handleTestTypeNext} />
            )}

            {step === "selectType" && (
                <QuestionTypeComponent onNext={handleQuestionTypeNext} />
            )}
        </>
    );
};

export default QuestionFlowManager;
