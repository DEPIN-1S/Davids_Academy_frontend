
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { fetchStudentTests } from '../../features/exam/examAPI';

// const TestComponent = () => {
//   const [testData, setTestData] = useState([]);
//   const [selectedType, setSelectedType] = useState('All');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const styles = {
//     wrapper: {
//       padding: '1.5rem',
//       fontFamily: '"Inter", sans-serif',
//       maxWidth: '1200px',
//       margin: '0 auto',
//     },
//     header: {
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       flexWrap: 'wrap',
//       gap: '1rem',
//       marginBottom: '1rem',
//     },
//     title: {
//       fontSize: '22px',
//       fontWeight: 700,
//     },
//     dropdown: {
//       padding: '8px',
//       fontSize: '14px',
//       borderRadius: '4px',
//       border: '1px solid #ccc',
//       minWidth: '150px',
//       backgroundColor: '#fff',
//       cursor: 'pointer',
//     },
//     testCount: {
//       backgroundColor: '#f1f1f1',
//       padding: '6px 12px',
//       borderRadius: '20px',
//       fontSize: '14px',
//       fontWeight: 500,
//     },
//     table: {
//       borderRadius: '10px',
//       overflow: 'hidden',
//     },
//     tableHeader: {
//       display: 'grid',
//       gridTemplateColumns: '1fr 2fr 1fr 1.5fr 1fr 1fr 2fr',
//       padding: '0.8rem 1rem',
//       backgroundColor: '#2e3760',
//       color: 'white',
//       fontWeight: 600,
//       fontSize: '14px',
//     },
//     tableRow: {
//       display: 'grid',
//       gridTemplateColumns: '1fr 2fr 1fr 1.5fr 1fr 1fr 2fr',
//       padding: '0.8rem 1rem',
//       backgroundColor: '#f9f9f9',
//       borderBottom: '1px solid #eee',
//       fontSize: '14px',
//     },
//     hiddenOnMobile: {
//       display: 'block',
//     },
//     actionButton: {
//       padding: '5px 10px',
//       border: 'none',
//       borderRadius: '4px',
//       cursor: 'pointer',
//       fontSize: '13px',
//       color: 'white',
//     },
//     startButton: {
//       backgroundColor: '#2196F3',
//     },
//     resumeButton: {
//       backgroundColor: '#4CAF50',
//     },
//     noTests: {
//       padding: '1rem',
//       textAlign: 'center',
//       fontSize: '14px',
//     },
//     loading: {
//       padding: '1rem',
//       textAlign: 'center',
//       fontSize: '16px',
//     },
//     error: {
//       padding: '1rem',
//       textAlign: 'center',
//       color: '#d32f2f',
//       fontSize: '16px',
//     },
//   };

  
//   // const fetchTestData = async () => {
//   //   setLoading(true);
//   //   setError(null);
//   //   try {
//   //     const data = await fetchStudentTests('all');
     
//   //     const transformedData = data.map(item => {
//   //       const toDate = new Date(item.toDate);
//   //       const currentDate = new Date();
//   //       let status = 'Pending';

//   //       if (item.isCompleted) {
//   //         status = 'Completed';
//   //       } else if (toDate < currentDate) {
//   //         status = 'Expired';
//   //       }
//   //       let action = '';
//   //       let buttonText = '';
//   //       if (status === 'Completed' || status === 'Expired') {
//   //         action = status;
//   //       } else if (item.isInProgress) {
//   //         buttonText = 'Resume';
//   //       } else {
//   //         buttonText = 'Start Test';
//   //       }

//   //       return {
//   //         id: item.id,
//   //         name: item.testTitle,
//   //         date: new Date(item.fromDate).toLocaleDateString('en-US', {
//   //           month: 'short',
//   //           day: 'numeric',
//   //           year: 'numeric',
//   //         }),
//   //         totalQuestions: item.totalQuestions || 'N/A',
//   //         score: item.score || 'N/A',
//   //         status,
//   //         action,
//   //         buttonText,
//   //       };
//   //     });

//   //     setTestData(transformedData);
//   //     setLoading(false);
//   //   } catch (err) {
//   //     setError(err.message || 'Failed to fetch test data.');
//   //     setLoading(false);
//   //   }
//   // };

// const fetchTestData = async () => {
//   setLoading(true);
//   setError(null);
//   try {
//     const data = await fetchStudentTests('all');
   
//     const transformedData = data.map(item => {
//       const fromDate = item.fromDate ? new Date(item.fromDate) : null;
//       const toDate = item.toDate ? new Date(item.toDate) : null;
//       const currentDate = new Date();
//       let status = 'Pending';

//       // Prioritize new fields if available (from backend JOIN)
//       if (item.is_submitted === 1 || item.status === 'completed') {
//         status = 'Completed';
//       } else if (item.isCompleted) {
//         status = 'Completed';
//       } else if (toDate && toDate < currentDate) {
//         status = 'Expired';
//       }

//       let action = '';
//       let buttonText = '';
//       if (status === 'Completed' || status === 'Expired') {
//         action = status;
//       } else if (item.isInProgress) {
//         buttonText = 'Resume';
//       } else {
//         buttonText = 'Start Test';
//       }

//       return {
//         id: item.id,
//         name: item.testTitle || 'Untitled Test',  // Fallback for missing title
//         date: fromDate ? fromDate.toLocaleDateString('en-US', {
//           month: 'short',
//           day: 'numeric',
//           year: 'numeric',
//         }) : 'Invalid Date',  // Safe handling
//         totalQuestions: item.totalQuestions || 'N/A',
//         score: item.st_score || item.score || 'N/A',  // Prefer st_score if available
//         status,
//         action,
//         buttonText,
//         is_submitted: item.is_submitted || false,  // For future use
//       };
//     });

//     setTestData(transformedData);
//     setLoading(false);
//   } catch (err) {
//     setError(err.message || 'Failed to fetch test data.');
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     fetchTestData();
//   }, []);

//   const filteredTests = selectedType === 'All'
//     ? testData
//     : testData.filter(test => test.status === selectedType);

//   const handleActionClick = (testId, buttonText) => {
//     if (buttonText === 'Start Test') {
//       navigate(`/student/exam?testId=${testId}`);
//     } else if (buttonText === 'Resume') {
//       navigate(`/student/exam?testId=${testId}&resume=true`);
//     }
//   };

//   if (loading) {
//     return <div style={styles.loading}>Loading tests...</div>;
//   }

//   if (error) {
//     return <div style={styles.error}>Error: {error}</div>;
//   }

//   return (
//     <div style={styles.wrapper}>
//       <div style={styles.header}>
//         <h2 style={styles.title}>Previous Tests</h2>
//         <select
//           style={styles.dropdown}
//           value={selectedType}
//           onChange={(e) => setSelectedType(e.target.value)}
//         >
//           <option value="All">All</option>
//           <option value="Completed">Completed</option>
//           <option value="Pending">Pending</option>
//           <option value="Expired">Expired</option>
//         </select>
//         <div style={styles.testCount}>{filteredTests.length} Tests</div>
//       </div>

//       <div style={styles.table}>
//         <div style={styles.tableHeader}>
//           <span>Test ID</span>
//           <span>Test Title</span>
//           <span>Date</span>
//           <span style={styles.hiddenOnMobile}>Total Questions</span>
//           <span style={styles.hiddenOnMobile}>Score</span>
//           <span style={styles.hiddenOnMobile}>Status</span>
//           <span style={styles.hiddenOnMobile}>Action</span>
//         </div>

//         {filteredTests.length === 0 ? (
//           <div style={styles.noTests}>No tests available for the selected status.</div>
//         ) : (
//           filteredTests.map((test) => (
//             <div style={styles.tableRow} key={test.id}>
//               <span>{test.id}</span>
//               <span>{test.name}</span>
//               <span>{test.date}</span>
//               <span style={styles.hiddenOnMobile}>{test.totalQuestions}</span>
//               <span style={styles.hiddenOnMobile}>{test.score}</span>
//               <span style={styles.hiddenOnMobile}>{test.status}</span>
//               <span style={styles.hiddenOnMobile}>
//                 {test.action === 'Completed' || test.action === 'Expired' ? (
//                   <span>{test.action}</span>
//                 ) : test.buttonText ? (
//                   <button
//                     style={{
//                       ...styles.actionButton,
//                       ...(test.buttonText === 'Resume' ? styles.resumeButton : styles.startButton),
//                     }}
//                     onClick={() => handleActionClick(test.id, test.buttonText)}
//                   >
//                     {test.buttonText}
//                   </button>
//                 ) : null}
//               </span>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default TestComponent;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStudentTests } from '../../features/exam/examAPI';

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
    },
    tableRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr 1fr 1.5fr 1fr 1fr 2fr',
      padding: '0.8rem 1rem',
      backgroundColor: '#f9f9f9',
      borderBottom: '1px solid #eee',
      fontSize: '14px',
    },
    hiddenOnMobile: {
      display: 'block',
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
      const rawData = await fetchStudentTests('all');
      
      // De-duplicate: Group by id, prioritize completed (is_submitted=1), then highest st_score
      const uniqueTests = {};
      rawData.forEach(item => {
        const testId = item.id;
        if (!uniqueTests[testId]) {
          uniqueTests[testId] = item;
        } else {
          const existing = uniqueTests[testId];
          // Prioritize: completed > higher score > current
          if (item.is_submitted === 1 || 
              (item.st_score > existing.st_score && existing.is_submitted !== 1)) {
            uniqueTests[testId] = item;
          }
        }
      });

      const transformedData = Object.values(uniqueTests).map(item => {
        const fromDate = item.fromDate ? new Date(item.fromDate) : null;
        const toDate = item.toDate ? new Date(item.toDate) : null;
        const currentDate = new Date();
        let status = 'Pending';

        // Prioritize new fields for status
        if (item.is_submitted === 1 || item.status === 'completed') {
          status = 'Completed';
        } else if (toDate && toDate < currentDate) {
          status = 'Expired';
        }
        // Removed isInProgress check

        let action = '';
        let buttonText = '';
        if (status === 'Completed' || status === 'Expired') {
          action = status;
        } else {
          // Removed Resume - always Start Test for Pending
          buttonText = 'Start Test';
        }

        return {
          id: item.id,
          name: item.testTitle || 'Untitled Test',
          date: fromDate ? fromDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }) : 'N/A',
          totalQuestions: item.totalQuestions || 'N/A',
          score: item.st_score !== undefined ? item.st_score : (item.score || 'N/A'),
          status,
          action,
          buttonText,
          is_submitted: item.is_submitted || 0,
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

  const handleActionClick = (testId, buttonText) => {
    if (buttonText === 'Start Test') {
      navigate(`/student/exam?testId=${testId}`);  // Removed &resume=true
    }
    // Removed Resume handling
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
          <option value="Expired">Expired</option>
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
                {test.action ? (
                  <span>{test.action}</span>
                ) : test.buttonText ? (
                  <button
                    style={{
                      ...styles.actionButton,
                      ...styles.startButton,  // Always start button style
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