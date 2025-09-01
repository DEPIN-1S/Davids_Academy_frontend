// import React, { useState, useEffect, useCallback } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import QuestionHeaderComponent from './QuestionHeaderComponent';
// import QuestionFooterComponent from './QuestionFooterComponent';

// // Import your question components
// import MCQ from './MCQQuestionComponent';
// import Dropdown from './DropdownQuestionComponent';
// import Sorting from './SortQuestionComponent';
// import FillIn from './FillInQuestionComponent';
// import DragDrop from './DragDropQuestionComponent';
// import SentenceHighlight from './SentenceQuestionComponent';
// import MultiRadio from './MultiRadioQuestionComponent';

// import {
//     getQBankQuestions,
//     getQBankQuestionData
// } from '../../features/exam/examSlice'; // update as per your path

// const questionTypeToComponent = {
//     'MCQ': MCQ,
//     'Dropdown': Dropdown,
//     'Sorting': Sorting,
//     'Fill in the Blanks': FillIn,
//     'Drag Drop': DragDrop,
//     'Sentence Highlight': SentenceHighlight,
//     'Multiple Radio': MultiRadio,
// };

// const ExamContainer = ({ user }) => {
//     const dispatch = useDispatch();

//     const { qBankQuestion: questionIds, qBankQuestionLoading } = useSelector(
//         (state) => state.exam // or state.exam depending on your slice
//     );
//     const {
//         qBankQuestionData: currentQuestion,
//         qBankQuestionDataLoading
//     } = useSelector((state) => state.exam); // or state.exam

//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [elapsedSeconds, setElapsedSeconds] = useState(0);

//     // On mount, fetch all question ids
//     useEffect(() => {
//         dispatch(getQBankQuestions());
//     }, [dispatch]);

//     // On change of questionIds or currentIndex, fetch new question data
//     useEffect(() => {
//         if (questionIds && questionIds.length > 0) {
//             dispatch(getQBankQuestionData(questionIds[currentIndex]));
//         }
//     }, [questionIds, currentIndex, dispatch]);

//     // Timer for tracking elapsed time (one timer for the whole exam!)
//     useEffect(() => {
//         const timer = setInterval(() => setElapsedSeconds((prev) => prev + 1), 1000);
//         return () => clearInterval(timer);
//     }, []);

//     // Handlers for next/previous
//     const handleNext = useCallback(() => {
//         if (questionIds && currentIndex < questionIds.length - 1) {
//             setCurrentIndex((idx) => idx + 1);
//         }
//     }, [questionIds, currentIndex]);

//     const handlePrevious = useCallback(() => {
//         if (currentIndex > 0) {
//             setCurrentIndex((idx) => idx - 1);
//         }
//     }, [currentIndex]);

//     const handlePause = () => {
//         // Implement pause logic (optional)
//     };

//     const handleEnd = () => {
//         // Implement exam submit/end logic
//     };

//     const formatTime = (secs) => {
//         const h = Math.floor(secs / 3600).toString().padStart(2, '0');
//         const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
//         const s = (secs % 60).toString().padStart(2, '0');
//         return h === '00' ? `${m}:${s}` : `${h}:${m}:${s}`;
//     };

//     // Dynamic render
//     const QuestionComponent =
//         currentQuestion && !qBankQuestionDataLoading
//             ? questionTypeToComponent[currentQuestion.question_type]
//             : null;

//     if (qBankQuestionLoading || (!questionIds || questionIds.length === 0)) {
//         return <div>Loading question list...</div>;
//     }

//     return (
//         <>
//             <QuestionHeaderComponent
//                 questionNumber={currentIndex + 1}
//                 totalQuestions={questionIds.length}
//                 qid={currentQuestion?.id || 'N/A'}
//                 user={user?.name || 'Guest'}
//                 time={formatTime(elapsedSeconds)}
//             />

//             <div style={{ marginTop: '2rem' }}>
//                 {qBankQuestionDataLoading ? (
//                     <p>Loading question...</p>
//                 ) : QuestionComponent ? (
//                     <QuestionComponent question={currentQuestion} />
//                 ) : (
//                     <p>No question to display.</p>
//                 )}
//             </div>

//             <QuestionFooterComponent
//                 onEnd={handleEnd}
//                 onPause={handlePause}
//                 onNext={handleNext}
//                 onPrevious={handlePrevious}
//                 disablePrevious={currentIndex === 0}
//                 disableNext={questionIds && currentIndex === questionIds.length - 1}
//                 questionNumber={currentIndex + 1}
//                 totalQuestions={questionIds.length}
//             />
//         </>
//     );
// };

// export default ExamContainer;






import React, { useState, useEffect, useCallback,useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import QuestionHeaderComponent from './QuestionHeaderComponent';
import QuestionFooterComponent from './QuestionFooterComponent';

// Import your question components
import MCQ from './MCQQuestionComponent';
import Dropdown from './DropdownQuestionComponent';
import Sorting from './SortQuestionComponent';
import FillIn from './FillInQuestionComponent';
import DragDrop from './DragDropQuestionComponent';
import SentenceHighlight from './SentenceQuestionComponent';
import MultiRadio from './MultiRadioQuestionComponent';

// Import Q-Bank Redux actions
import {
  getQBankQuestions,
  getQBankQuestionData
} from '../../features/exam/examSlice'; // update as per your path

// Import Test API functions (non-Redux, as per previous integrations)
import { fetchTestQuestions, fetchTestQuestionData, submitTestQuestion, submitTest } from '../../features/exam/examAPI';

const questionTypeToComponent = {
  'MCQ': MCQ,
  'Dropdown': Dropdown,
  'Sorting': Sorting,
  'Fill in the Blanks': FillIn,
  'Drag Drop': DragDrop,
  'Sentence Highlight': SentenceHighlight,
  'Multiple Radio': MultiRadio,
};

const ExamContainer = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse query params for test mode
  const queryParams = new URLSearchParams(location.search);
  const testId = queryParams.get('testId');
  const resume = queryParams.get('resume') === 'true';
  const isTestMode = !!testId;

  // Redux selectors for Q-Bank (only used if not in test mode)
  const { qBankQuestion: qBankQuestionIds, qBankQuestionLoading } = useSelector(
    (state) => state.exam
  );
  const {
    qBankQuestionData: qBankCurrentQuestion,
    qBankQuestionDataLoading
  } = useSelector((state) => state.exam);

  // States for both modes
  const [questionIds, setQuestionIds] = useState([]); // Unified question IDs
  const [currentQuestion, setCurrentQuestion] = useState(null); // Unified current question data
  const [currentIndex, setCurrentIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({}); // For test mode: track submitted answers

  // On mount: Fetch question list based on mode
//   useEffect(() => {
//     const loadQuestions = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         if (isTestMode) {
//           // Test mode: Use API to fetch test questions
//           const testQuestions = await fetchTestQuestions(testId);
//           const ids = testQuestions.map(q => q.questionId); // Assuming each has questionId
//           setQuestionIds(ids);

//           // For resume: Set starting index (placeholder; enhance with actual progress)
//           let startIndex = 0;
//           if (resume) {
//             console.log('Resuming test: Load progress here.');
//             // Example: startIndex = ... (fetch or calculate first unanswered)
//           }
//           setCurrentIndex(startIndex);
//         } else {
//           // Q-Bank mode: Use Redux to fetch Q-Bank questions
//           dispatch(getQBankQuestions());
//         }
//         setLoading(false);
//       } catch (err) {
//         setError(err.message || 'Failed to load questions.');
//         setLoading(false);
//       }
//     };

//     loadQuestions();
//   }, [dispatch, isTestMode, testId, resume]);

// Replace the loadQuestions useEffect with this corrected version:
// Replace the entire loadQuestions useEffect with this:
useEffect(() => {
    const loadQuestions = async () => {
        setLoading(true);
        setError(null);
        try {
            if (isTestMode) {
                // Test mode: Use API to fetch test questions
                console.log('Loading test questions for testId:', testId);
                const questionIds = await fetchTestQuestions(testId);
                console.log('Received question IDs directly:', questionIds);
                
                // Validate that we got question IDs
                if (!questionIds || questionIds.length === 0) {
                    throw new Error('No questions found for this test');
                }
                
                // IMPORTANT: Use the question IDs directly from the API
                setQuestionIds(questionIds); // This should be [78, 74, 73, 72, 71, 69]
                
                // For resume: Set starting index
                let startIndex = 0;
                if (resume) {
                    console.log('Resuming test: Load progress here.');
                }
                setCurrentIndex(startIndex);
            } else {
                // Q-Bank mode: Use Redux to fetch Q-Bank questions
                dispatch(getQBankQuestions());
            }
            setLoading(false);
        } catch (err) {
            console.error('Error loading questions:', err);
            setError(err.message || 'Failed to load questions.');
            setLoading(false);
        }
    };

    if (isTestMode && !testId) {
        setError('Test ID is required for test mode');
        setLoading(false);
        return;
    }

    loadQuestions();
}, [dispatch, isTestMode, testId, resume]);




  // Sync Q-Bank IDs from Redux to local state (for Q-Bank mode)
  useEffect(() => {
    if (!isTestMode && qBankQuestionIds) {
      setQuestionIds(qBankQuestionIds);
    }
  }, [isTestMode, qBankQuestionIds]);

  // Fetch question data on index change or IDs update
//   useEffect(() => {
//     const loadQuestionData = async () => {
//       if (questionIds && questionIds.length > 0 && currentIndex < questionIds.length) {
//         const id = questionIds[currentIndex];
//         try {
//           let data;
//           if (isTestMode) {
//             // Test mode: Use API
//             data = await fetchTestQuestionData(testId, id);
//           } else {
//             // Q-Bank mode: Use Redux
//             dispatch(getQBankQuestionData(id));
//             return; // Will set via Redux selector below
//           }
//           setCurrentQuestion(data);
//         } catch (err) {
//           setError(err.message || 'Failed to load question data.');
//         }
//       }
//     };

//     loadQuestionData();
//   }, [questionIds, currentIndex, dispatch, isTestMode, testId]);


// Replace the loadQuestionData useEffect with this corrected version:
// Replace your current loadQuestions useEffect with this simplified version:
// Replace your current loadQuestionData useEffect with this fixed version:
// Replace your loadQuestionData useEffect with this fixed version:
useEffect(() => {
    const loadQuestionData = async () => {
        if (questionIds && questionIds.length > 0 && currentIndex < questionIds.length) {
            const questionId = questionIds[currentIndex];
            console.log('Loading question data for question ID:', questionId);
            
            try {
                if (isTestMode) {
                    setLoading(true);
                    // Pass headings_id if needed (default to 0 or get from somewhere)
                    const data = await fetchTestQuestionData(testId, questionId, 0);
                    console.log('Received test question data:', data);
                    setCurrentQuestion(data);
                    setLoading(false);
                } else {
                    dispatch(getQBankQuestionData(questionId));
                    return;
                }
            } catch (err) {
                console.error('Error loading question data:', err);
                setError(err.message || 'Failed to load question data.');
                setLoading(false);
            }
        }
    };

    loadQuestionData();
}, [questionIds, currentIndex, dispatch, isTestMode, testId]);






  // Sync Q-Bank current question from Redux
  useEffect(() => {
    if (!isTestMode) {
      setCurrentQuestion(qBankCurrentQuestion);
    }
  }, [isTestMode, qBankCurrentQuestion]);

  // Timer for the whole exam
  useEffect(() => {
    const timer = setInterval(() => setElapsedSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handlers for next/previous (with test mode submission)
  const handleNext = useCallback(async () => {
    if (questionIds && currentIndex < questionIds.length - 1) {
      if (isTestMode) {
        // In test mode: Submit current answer before moving (assuming answer is ready)
        // Note: This assumes the question component has submitted via a callback; here it's placeholder
        // Integrate actual submission from child components
        console.log('Submit current question before next (test mode)');
        // Example: await submitCurrentAnswer(); // Implement as needed
      }
      setCurrentIndex((idx) => idx + 1);
    }
  }, [questionIds, currentIndex, isTestMode]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((idx) => idx - 1);
    }
  }, [currentIndex]);

  const handlePause = () => {
    // Implement pause logic (optional; for tests, might save progress)
  };

  const handleEnd = async () => {
    if (isTestMode) {
      // Test mode: Submit the entire test
      try {
        await submitTest(testId);
        navigate('/student/score');
      } catch (err) {
        setError(err.message || 'Failed to submit test.');
      }
    } else {
      // Q-Bank mode: Implement end logic (e.g., show summary)
      console.log('Ending Q-Bank session');
    }
  };

  // Callback for question components to submit answers (for test mode)
  // Pass this to child components
// Update your handleAnswerSubmit function to use the correct question ID:
const handleAnswerSubmit = async (questionId, is_correct, mark) => {
    if (isTestMode) {
        try {
            // Use the current question ID from the array, not the passed parameter
            const currentQuestionId = questionIds[currentIndex];
            await submitTestQuestion(testId, currentQuestionId, is_correct, mark);
            setAnswers((prev) => ({ ...prev, [currentQuestionId]: { is_correct, mark } }));
        } catch (err) {
            setError(err.message || 'Failed to submit answer.');
        }
    }
    // For Q-Bank, perhaps local handling only
};


  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return h === '00' ? `${m}:${s}` : `${h}:${m}:${s}`;
  };

  // Dynamic render
//   const QuestionComponent =
//     currentQuestion && !(isTestMode ? loading : qBankQuestionDataLoading)
//       ? questionTypeToComponent[currentQuestion.question_type]
//       : null;

 const QuestionComponent = useMemo(() => {
        const isQuestionDataLoading = isTestMode ? loading : qBankQuestionDataLoading;
        
        if (currentQuestion && !isQuestionDataLoading) {
            return questionTypeToComponent[currentQuestion.question_type];
        }
        return null;
    }, [currentQuestion, isTestMode, loading, qBankQuestionDataLoading]);

    // Loading states
    const isQuestionsListLoading = isTestMode ? loading : qBankQuestionLoading;

    if (isQuestionsListLoading || (!questionIds || questionIds.length === 0)) {
        return <div>Loading question list...</div>;
    }

    if (error) {
        return (
            <div>
                <h3>Error: {error}</h3>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }


// Update your DebugInfo component to show the actual question IDs:
const DebugInfo = () => (
    <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '12px' }}>
        <strong>Debug Info:</strong><br/>
        Test Mode: {isTestMode ? 'Yes' : 'No'}<br/>
        Test ID: {testId}<br/>
        Question IDs: {JSON.stringify(questionIds)}<br/>
        Current Index: {currentIndex}<br/>
        Current Question ID: {questionIds && questionIds[currentIndex]}<br/>
        Current Question: {currentQuestion ? 'Loaded' : 'Not loaded'}<br/>
        Loading: {loading ? 'Yes' : 'No'}<br/>
        Error: {error || 'None'}<br/>
        <strong>Expected Question ID:</strong> {questionIds && questionIds[currentIndex]} (should be 78, 74, 73, etc.)
    </div>
);



// Add this before the return statement in ExamContainer:
// Temporarily add <DebugInfo /> at the top of your JSX to see what's happening

return (
    <>
        <QuestionHeaderComponent
            questionNumber={currentIndex + 1}
            totalQuestions={questionIds.length}
            qid={currentQuestion?.id || 'N/A'}
            user={user?.name || 'Guest'}
            time={formatTime(elapsedSeconds)}
        />
        
        {/* TEMPORARY DEBUG INFO */}
        <DebugInfo />
        
        <div style={{ marginTop: '2rem' }}>
            {(isTestMode ? loading : qBankQuestionDataLoading) ? (
                <p>Loading question...</p>
            ) : QuestionComponent ? (
                <QuestionComponent
                    question={currentQuestion}
                    onSubmit={handleAnswerSubmit}
                />
            ) : currentQuestion ? (
                <div>
                    <p>Unsupported question type: {currentQuestion.question_type}</p>
                    <pre>{JSON.stringify(currentQuestion, null, 2)}</pre>
                </div>
            ) : (
                <p>No question data available</p>
            )}
        </div>
        
        <QuestionFooterComponent
            onEnd={handleEnd}
            onPause={handlePause}
            onNext={handleNext}
            onPrevious={handlePrevious}
            disablePrevious={currentIndex === 0}
            disableNext={questionIds && currentIndex === questionIds.length - 1}
            questionNumber={currentIndex + 1}
            totalQuestions={questionIds.length}
        />
    </>
);

};

export default ExamContainer;
