import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStudentTests } from '../../features/exam/examAPI'; // Assuming the API functions are in src/api/examApi.js (from previous response)

const TestComponent = () => {
  const [testData, setTestData] = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const styles = {
    wrapper: {
      padding: '1.5rem',
      fontFamily: '"Inter", sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
      marginBottom: '1rem',
    },
    title: {
      fontSize: '22px',
      fontWeight: 700,
    },
    dropdown: {
      padding: '8px',
      fontSize: '14px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      minWidth: '150px',
      backgroundColor: '#fff',
      cursor: 'pointer',
    },
    testCount: {
      backgroundColor: '#f1f1f1',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: 500,
    },
    table: {
      borderRadius: '10px',
      overflow: 'hidden',
    },
    tableHeader: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr 1fr 1.5fr 1fr 1fr 2fr',
      padding: '0.8rem 1rem',
      backgroundColor: '#2e3760',
      color: 'white',
      fontWeight: 600,
      fontSize: '14px',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr 2fr 1fr',
      },
    },
    tableRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr 1fr 1.5fr 1fr 1fr 2fr',
      padding: '0.8rem 1rem',
      backgroundColor: '#f9f9f9',
      borderBottom: '1px solid #eee',
      fontSize: '14px',
      '&:nth-child(even)': {
        backgroundColor: '#f0f0f5',
      },
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr 2fr 1fr',
      },
    },
    hiddenOnMobile: {
      '@media (max-width: 768px)': {
        display: 'none',
      },
    },
    actionButton: {
      padding: '5px 10px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '13px',
      color: 'white',
    },
    startButton: {
      backgroundColor: '#2196F3',
    },
    resumeButton: {
      backgroundColor: '#4CAF50',
    },
    noTests: {
      padding: '1rem',
      textAlign: 'center',
      fontSize: '14px',
    },
    loading: {
      padding: '1rem',
      textAlign: 'center',
      fontSize: '16px',
    },
    error: {
      padding: '1rem',
      textAlign: 'center',
      color: '#d32f2f',
      fontSize: '16px',
    },
  };

  const fetchTestData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Integrated: Use fetchStudentTests from the API module (replaces axios call)
      // Note: This fetches with type='all' as per original logic; adjust if needed for dynamic types
      const data = await fetchStudentTests('all');

      // Data transformation remains the same as original
      const transformedData = data.map(item => {
        const toDate = new Date(item.toDate);
        const currentDate = new Date();
        const isInProgress = item.isInProgress || false;
        let action = '';
        let buttonText = '';

        if (toDate < currentDate) {
          action = 'Completed';
        } else if (isInProgress) {
          buttonText = 'Resume';
        } else {
          buttonText = 'Start Test';
        }

        return {
          id: item.id,
          name: item.testTitle,
          date: new Date(item.fromDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          totalQuestions: item.totalQuestions || 'N/A',
          score: item.score || 'N/A',
          status: toDate < currentDate ? 'Completed' : 'Pending',
          action,
          buttonText,
        };
      });

      setTestData(transformedData);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch test data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestData();
  }, []);

  const filteredTests = selectedType === 'All'
    ? testData
    : testData.filter(test => test.status === selectedType);

  // Navigation handler: On "Start Test" or "Resume" click, navigate to exam with testId
  // If "Resume", append &resume=true query param (as per original logic)
  // This is based on the test ID and buttonText condition
  const handleActionClick = (testId, buttonText) => {
    if (buttonText === 'Start Test') {
      navigate(`/student/exam?testId=${testId}`);
    } else if (buttonText === 'Resume') {
      navigate(`/student/exam?testId=${testId}&resume=true`);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading tests...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={styles.title}>Previous Tests</h2>
        <select
          style={styles.dropdown}
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </select>
        <div style={styles.testCount}>{filteredTests.length} Tests</div>
      </div>

      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <span>Test ID</span>
          <span>Test Title</span>
          <span>Date</span>
          <span style={styles.hiddenOnMobile}>Total Questions</span>
          <span style={styles.hiddenOnMobile}>Score</span>
          <span style={styles.hiddenOnMobile}>Status</span>
          <span style={styles.hiddenOnMobile}>Action</span>
        </div>

        {filteredTests.length === 0 ? (
          <div style={styles.noTests}>No tests available for the selected status.</div>
        ) : (
          filteredTests.map((test) => (
            <div style={styles.tableRow} key={test.id}>
              <span>{test.id}</span>
              <span>{test.name}</span>
              <span>{test.date}</span>
              <span style={styles.hiddenOnMobile}>{test.totalQuestions}</span>
              <span style={styles.hiddenOnMobile}>{test.score}</span>
              <span style={styles.hiddenOnMobile}>{test.status}</span>
              <span style={styles.hiddenOnMobile}>
                {test.action === 'Completed' ? (
                  <span>Completed</span>
                ) : test.buttonText ? (
                  <button
                    style={{
                      ...styles.actionButton,
                      ...(test.buttonText === 'Resume' ? styles.resumeButton : styles.startButton),
                    }}
                    onClick={() => handleActionClick(test.id, test.buttonText)}
                  >
                    {test.buttonText}
                  </button>
                ) : null}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TestComponent;
