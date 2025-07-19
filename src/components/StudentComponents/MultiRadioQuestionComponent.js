import React, { useState } from 'react';
import '../../styles/DashboardStyles/MultiRadioQuestionComponent.css';

const notesTabs = ['Triage Note', 'Vital Signs'];
const answerGroups = ['hemothorax', 'asthma exacerbation'];
const findings = [
  'tachypnea',
  'reduced (or absent) breath sounds of the affected side',
  'percussion on the involved side produces a dull sound',
  'chest wall tenderness',
];

// Dynamic explanation/note content for each tab
const tabContent = {
  'Triage Note': `1840: Client presents with dyspnea and right-sided chest pain that is worse when he takes a deep breath and coughs.
The client is experiencing sudden shortness of breath and chest tightness. Physical exam reveals bilateral crackles, jugular venous distension (JVD), and peripheral cyanosis.
An ECG shows sinus tachycardia with no ischemic changes, and a chest X-ray reveals pulmonary vascular congestion. The client reports a history of chronic heart failure.`,
  
  'Vital Signs': `Vital Signs:
- Temperature: 100°F (37.8°C)
- Pulse: 104 bpm
- Respiratory Rate: 22
- Blood Pressure: 110/66 mmHg
- SpO2: 95% on room air
The client is lethargic, oriented to person and place only, and using accessory muscles to breathe.`,
};

const MultiRadioQuestionComponent = () => {
  const [activeTab, setActiveTab] = useState('Triage Note');
  const [answers, setAnswers] = useState({});

  const handleSelect = (findingIndex, group) => {
    setAnswers({ ...answers, [findingIndex]: group });
  };

  return (
    <div className="multi-radio-container">
      <div className="heading">
        <h4>
          The nurse in the emergency department (ED) is caring for a 19-year-old male client.
        </h4>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {notesTabs.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dynamic Note Content */}
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
            {findings.map((finding, idx) => (
              <tr key={idx}>
                <td>{finding}</td>
                {answerGroups.map((group) => (
                  <td key={group}>
                    <input
                      type="radio"
                      name={`finding-${idx}`}
                      value={group}
                      checked={answers[idx] === group}
                      onChange={() => handleSelect(idx, group)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="reveal-btn-wrap">
        <button className="reveal-btn">Reveal Answer</button>
      </div>
    </div>
  );
};

export default MultiRadioQuestionComponent;
