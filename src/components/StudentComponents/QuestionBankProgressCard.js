import React, { useEffect, useRef } from "react";
import "../../styles/QuestionBankProgressCard.css";
function QuestionBankProgressCard({ data }) {

    const logged = useRef(false);
    useEffect(() => {
        if (!logged.current) {
            console.log("data:::::::::::", data);
            logged.current = true;
        }
    }, [data]);

    const onClose = () => {
        console.log(":on close");
        window.location.href = "/student/question-bank";  // ✅ Hard redirect
    };


    return (
        <div className="progress-card-main">
            <div className="card-box">

                {/* Logo */}
                <img src="/images/logo.png" width={70} alt="logo" className="card-logo" />

                <h2 className="title">Question Bank Result</h2>

                <div className="result-row">
                    <span>Total Questions</span>
                    <strong>{data?.data?.total}</strong>
                </div>

                <div className="result-row">
                    <span>Attempted</span>
                    <strong>{data?.data?.attempted}</strong>
                </div>

                <div className="result-row">
                    <span>Correct</span>
                    <strong className="correct">{data?.data?.correct}</strong>
                </div>

                <div className="result-row">
                    <span>Wrong</span>
                    <strong className="wrong">{data?.data?.attempted - data?.data?.correct}</strong>
                </div>

                {/* BOTTOM BUTTON */}
                <button className="bottom-close-btn" onClick={onClose}  >
                    Close
                </button>

            </div>
        </div>
    );
}

export default QuestionBankProgressCard;
