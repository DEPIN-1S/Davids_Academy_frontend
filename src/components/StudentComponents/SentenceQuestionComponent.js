  import React, { useState } from 'react';
  import '../../styles/DashboardStyles/SentenceQuestionComponent.css';
const notesTabs = ['History and Physical', 'Laboratory Results','Physicians Orders','Progress Note'];
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
  const sentencesData = [
    'The client presents six weeks following the initiation of levothyroxine.',
    'The client reports that "she feels better but not 100%."',
    'She indicates that she is going outdoors more often and engaging with friends.',
    'She said she is still gaining weight and experiencing constipation.',
    'On exam, the client is alert and oriented. She reports that her mood is "good" and has a cheerful affect.',
    'Trace pedal edema was noted with 2+ peripheral pulses at a rate of 64/minute.',
    'Hypoactive bowel in all quadrants sounds with abdominal distention.',
  ];

  const SentenceQuestionComponent = () => {
    const [activeTab, setActiveTab] = useState('Triage Note');
      const [answers, setAnswers] = useState({});
    
    const [selectedSentences, setSelectedSentences] = useState([]);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleToggleSentence = (sentence) => {
      if (selectedSentences.includes(sentence)) {
        setSelectedSentences(selectedSentences.filter((s) => s !== sentence));
      } else {
        setSelectedSentences([...selectedSentences, sentence]);
      }
    };

    return (
    <>
      <div className="heading">
          <h4>
          Click to highlight the findings in the progress note that indicate that the client is not meeting the treatment goals.
          </h4>
        </div>
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
      <div className="highlight-question-wrapper">
        <p className="highlight-instruction">
          Click to highlight the findings in the progress note that indicate that the client is not meeting the treatment goals.
        </p>

        <div className="highlight-scroll-box">
          {sentencesData.map((sentence, idx) => (
            <p
              key={idx}
              className={`highlight-sentence ${selectedSentences.includes(sentence) ? 'highlighted' : ''}`}
              onClick={() => handleToggleSentence(sentence)}
            >
              {sentence}
            </p>
          ))}
        </div>

        {/* <div className="reveal-btn-wrap">
          <button className="reveal-btn" onClick={() => setShowExplanation(true)}>
            Reveal Answer
          </button>
        </div>

        {showExplanation && (
          <div className="highlight-explanation-box">
            
            <h3>Explanation</h3>
            <ul>
              <li>Still gaining weight and experiencing constipation indicates hypothyroidism persists.</li>
              <li>Hypoactive bowel sounds and abdominal distention reflect poor GI motility.</li>
              <li>Trace pedal edema and reduced activity tolerance are clinical concerns.</li>
            </ul>
          </div>
        )} */}

        
      </div>
      </>
    );
  };

  export default SentenceQuestionComponent;
