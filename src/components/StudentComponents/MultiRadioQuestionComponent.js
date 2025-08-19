import React, { useState } from 'react';
import '../../styles/DashboardStyles/MultiRadioQuestionComponent.css';
import RevealAnswerComponent from './RevealAnswerComponent'; // Adjust path as needed

const MultiRadioQuestionComponent = ({ question }) => {
  const [activeTab, setActiveTab] = useState(question?.tabsInfo?.[0]?.tabKey || '');
  const [answers, setAnswers] = useState({});
  const [showReveal, setShowReveal] = useState(false);

  if (!question) return <p>Loading question...</p>;

  // Extract dynamic data
  const notesTabs = question.tabsInfo.map((tab) => tab.tabKey);
  const clientFindings = question.clientfindings || [];

  // Extract unique answer groups from radioOption's answers
  const answerGroups = Array.from(
    new Set(question.radioOption.map((opt) => opt.answer))
  );

  const tabContent = question.tabsInfo.reduce((acc, tab) => {
    acc[tab.tabKey] = tab.tabValue;
    return acc;
  }, {});

  const explanationHeading = question.explanation?.[0]?.heading || 'Explanation';
  const explanationParagraphs = question.explanation?.map((exp) => exp.explanation) || [];

  const additionalInfoParagraphs = question.additionalInfo?.map((info) => info.info) || [];
  const additionalInfoImage = question.additionalInfo?.[0]?.image || null;


  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSelect = (findingIndex, group) => {
    setAnswers((prev) => ({ ...prev, [findingIndex]: group }));
  };

  const handleReveal = () => {
    setShowReveal(true);
  };

  return (
    <div className="multi-radio-container">
      <div className="heading">
        <h4>{question.question}</h4>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {notesTabs.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="note-box">
        <p>{tabContent[activeTab]}</p>
      </div>

      {/* Radio Table */}
      <div className="table-wrapper">
        <table className="radio-table">
          <thead>
            <tr>
              <th>Client findings</th>
              {answerGroups.map((group) => (
                <th key={group}>{group}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clientFindings.map((finding, idx) => (
              <tr key={finding.id || idx}>
                <td>{finding.client_findings}</td>
                {answerGroups.map((group) => (
                  <td key={group}>
                    <input
                      type="radio"
                      name={`finding-${idx}`}
                      value={group}
                      checked={answers[idx] === group}
                      onChange={() => handleSelect(idx, group)}
                      disabled={showReveal}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reveal Answer Button */}
      {!showReveal && (
        <div className="reveal-btn-wrap">
          <button className="reveal-btn" onClick={handleReveal}>
            Reveal Answer
          </button>
        </div>
      )}

      {/* Reveal Answer Section */}
      {showReveal && (
        <RevealAnswerComponent
          questionText={question.question}
          explanationHeading={explanationHeading}
          explanationParagraphs={explanationParagraphs}
          additionalInfoHeading="Additional Info"
          additionalInfoParagraphs={additionalInfoParagraphs}
          additionalInfoImage={additionalInfoImage}
        />
      )}
    </div>
  );
};

export default MultiRadioQuestionComponent;
