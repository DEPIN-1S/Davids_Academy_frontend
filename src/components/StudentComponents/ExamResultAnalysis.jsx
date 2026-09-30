import React from "react";
import { useNavigate } from "react-router-dom";
import WhatsAppDMButton from "./WhatsAppDMButton";
import WhatsAppChannelButton from "./WhatsAppChannelButton";
import { WEAK_TOPIC_THRESHOLD } from "../../utils/topicAnalysis";

const TopicRow = ({ topic, onPractice }) => (
  <div className="exam-analysis-topic">
    <div className="exam-analysis-topic-meta">
      <span className="exam-analysis-topic-name">{topic.name}</span>
      <strong>{topic.percent}%</strong>
    </div>
    {topic.topicId != null && onPractice && (
      <button
        type="button"
        className="exam-analysis-practice-btn"
        onClick={() => onPractice(topic.topicId)}
      >
        Practice This Topic
      </button>
    )}
  </div>
);

const ExamResultAnalysis = ({
  analysis,
  examContext = "an exam",
  showPractice = true,
}) => {
  const navigate = useNavigate();
  const weak = analysis?.weak || [];
  const strong = analysis?.strong || [];

  const handlePractice = (topicId) => {
    navigate(`/student/exam?mode=question-bank&topics=${topicId}`);
  };

  return (
    <div className="exam-analysis">
      {weak.length > 0 && (
        <section className="exam-analysis-section">
          <h3 className="exam-analysis-heading">Areas to Improve</h3>
          <p className="exam-analysis-hint">
            Below {WEAK_TOPIC_THRESHOLD}% accuracy
          </p>
          {weak.map((topic) => (
            <TopicRow
              key={topic.topicId ?? topic.name}
              topic={topic}
              onPractice={showPractice ? handlePractice : undefined}
            />
          ))}
        </section>
      )}

      {strong.length > 0 && (
        <section className="exam-analysis-section">
          <h3 className="exam-analysis-heading">Strong Areas</h3>
          {strong.map((topic) => (
            <div
              className="exam-analysis-topic exam-analysis-topic-strong"
              key={topic.topicId ?? topic.name}
            >
              <div className="exam-analysis-topic-meta">
                <span className="exam-analysis-topic-name">{topic.name}</span>
                <strong>{topic.percent}%</strong>
              </div>
            </div>
          ))}
        </section>
      )}

      <div className="exam-analysis-help">
        <p className="exam-analysis-help-text">
          {weak.length > 0
            ? "Need help improving these areas?"
            : "Need help understanding your result?"}
        </p>
        <div className="exam-analysis-help-actions">
          <WhatsAppChannelButton message="Follow Channel" />
          <WhatsAppDMButton examContext={examContext} weakTopics={weak} />
        </div>
      </div>
    </div>
  );
};

export default ExamResultAnalysis;
