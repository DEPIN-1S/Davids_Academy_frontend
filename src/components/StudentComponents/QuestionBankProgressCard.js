import React, { useEffect, useRef } from "react";
import "../../styles/QuestionBankProgressCard.css";
import ExamResultAnalysis from "./ExamResultAnalysis";
import { analyzeTopics, percentOf } from "../../utils/topicAnalysis";

function QuestionBankProgressCard({
  data,
  title = "Question Bank Result",
  examContext = "a Question Bank practice session",
  onClose,
}) {
  const logged = useRef(false);
  useEffect(() => {
    if (!logged.current) {
      logged.current = true;
    }
  }, [data]);

  const handleClose = () => {
    if (typeof onClose === "function") {
      onClose();
      return;
    }
    window.location.href = "/student/question-bank";
  };

  const result = data?.data || {};
  const attempted = Number(result.attempted) || 0;
  const correct = Number(result.correct) || 0;
  const overallPercent = percentOf(correct, attempted);
  const analysis = analyzeTopics(result.details || []);
  const resultReady = data?.result === true || data?.data != null;

  if (!resultReady) {
    return (
      <div className="progress-card-main">
        <div className="card-box">
          <img src="/images/logo.png" width={70} alt="logo" className="card-logo" />
          <h2 className="title">{title}</h2>
          <p>Loading result...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-card-main">
      <div className="card-box">
        <img src="/images/logo.png" width={70} alt="logo" className="card-logo" />

        <h2 className="title">{title}</h2>

        <div className="result-row">
          <span>Total Questions</span>
          <strong>{result.total ?? "—"}</strong>
        </div>

        <div className="result-row">
          <span>Attempted</span>
          <strong>{attempted}</strong>
        </div>

        <div className="result-row">
          <span>Correct</span>
          <strong className="correct">{correct}</strong>
        </div>

        <div className="result-row">
          <span>Wrong</span>
          <strong className="wrong">{Math.max(attempted - correct, 0)}</strong>
        </div>

        {overallPercent != null && (
          <div className="result-row">
            <span>Overall Score</span>
            <strong>{overallPercent}%</strong>
          </div>
        )}

        <ExamResultAnalysis analysis={analysis} examContext={examContext} />

        <button className="bottom-close-btn" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default QuestionBankProgressCard;
