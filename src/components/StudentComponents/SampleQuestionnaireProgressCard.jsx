import React, { useEffect, useRef, useContext } from 'react'
import "../../styles/QuestionBankProgressCard.css";
import { SampleQuestionnaireResultContext } from '../../context/ResultProvider';


function SampleQuestionnaireProgressCard({ onClose }) {

    const { sampleQuestionnaireResult } = useContext(SampleQuestionnaireResultContext);

    const logged = useRef(false);
    useEffect(() => {
        if (!logged.current) {
            console.log("ProgressCard Context Data::::", sampleQuestionnaireResult);
            logged.current = true;
        }
    }, [sampleQuestionnaireResult]);

    return (
        <div className="progress-card-main">
            <div className="card-box">

                {/* Logo */}
                <img src="/images/logo.png" width={70} alt="logo" className="card-logo" />

                <h2 className="title">Question Bank Result</h2>

                <div className="result-row">
                    <span>Total Questions</span>
                    <strong>10</strong>
                </div>

                <div className="result-row">
                    <span>Attempted</span>
                    <strong>{sampleQuestionnaireResult?.attemptedQuestion}</strong>
                </div>

                <div className="result-row">
                    <span>Correct</span>
                    <strong className="correct">{sampleQuestionnaireResult?.corrected}</strong>
                </div>

                <div className="result-row">
                    <span>Wrong</span>
                    <strong className="wrong">
                        {sampleQuestionnaireResult?.attemptedQuestion - sampleQuestionnaireResult?.corrected}
                    </strong>
                </div>

                {/* BOTTOM BUTTON */}
                <button className="bottom-close-btn" onClick={onClose}>
                    Close
                </button>

            </div>
        </div>
    )
}

export default SampleQuestionnaireProgressCard;
