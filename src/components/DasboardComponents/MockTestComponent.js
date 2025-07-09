import React from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import QuizIcon from '@mui/icons-material/Quiz';
import '../../styles/MockTestComponent.css';

const MockTestComponent = () => {
  return (
    <div className="mocktest-wrapper">
      <h2 className="mocktest-title">Weekly Mock Test Challenge</h2>
      <p className="mocktest-subtitle">
        Test your progress with a realistic weekly mock exam
      </p>

      <div className="mocktest-card">
        <h3 className="mocktest-heading">DHA Mock Test</h3>

        <div className="mocktest-details">
          <div className="detail-item">
            <AccessTimeIcon />
            <span>15 minutes</span>
          </div>
          <div className="detail-item">
            <QuizIcon />
            <span>Number of questions<br />30</span>
          </div>
          <div className="detail-item">
            <RadioButtonCheckedIcon />
            <span>70%</span>
          </div>
        </div>

        <div className="mocktest-attempt">
          <label>Attempts: <span className="mocktest-attempt-value">1</span></label>
          <button className="mocktest-btn">Start Test</button>
        </div>

        <hr />
        <div className="mocktest-instructions">
          <p>• Your answers will be auto-submitted when the time runs out.</p>
          <p>• You can only attempt the test once.</p>
          <p>• You can only attempt the test once.</p>
          <p>• Your answers will be auto-submitted when the time runs out.</p>
        </div>
      </div>
    </div>
  );
};

export default MockTestComponent;
