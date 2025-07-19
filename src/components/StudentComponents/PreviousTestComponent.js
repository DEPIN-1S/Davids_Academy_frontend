import React from 'react';
import '../../styles/DashboardStyles/PreviousTestComponent.css';
import { MenuItem, Select } from '@mui/material';

const testData = [
  {
    id: 'MT1',
    name: 'DHA Weekly Mock Test 1',
    date: 'Mar 1',
    totalQuestions: 30,
    score: '68%',
    status: 'Completed',
    action: 'Score/Statistics',
  },
  {
    id: 'MT1',
    name: 'DHA Weekly Mock Test 1',
    date: 'Mar 1',
    totalQuestions: 30,
    score: '68%',
    status: 'Completed',
    action: 'Resume',
  },
  // Repeat or fetch real data
];

const PreviousTestComponent = () => {
  const [selectedType, setSelectedType] = React.useState('Mock Test');

  return (
    <div className="previous-tests-wrapper">
      <div className="previous-tests-header">
        <h2>Previous Tests</h2>
        <span className="test-count">5 Test | 3 Pending</span>
        <div className="dropdown-wrapper">
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            size="small"
          >
            <MenuItem value="Mock Test">Mock Test</MenuItem>
            <MenuItem value="Practice">Practice</MenuItem>
            <MenuItem value="Assessment">Assessment</MenuItem>
          </Select>
        </div>
      </div>

      <div className="test-table">
        <div className="test-table-header">
          <span>Test ID</span>
          <span>Test Name</span>
          <span>Date</span>
          <span>Total Questions</span>
          <span>Score</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {testData.map((test, index) => (
          <div className="test-table-row" key={index}>
            <span>{test.id}</span>
            <span>{test.name}</span>
            <span>{test.date}</span>
            <span>{test.totalQuestions}</span>
            <span>{test.score}</span>
            <span>{test.status}</span>
            <span>
              <button className={`action-btn ${test.action === 'Resume' ? 'resume' : 'stats'}`}>
                {test.action}
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviousTestComponent;
