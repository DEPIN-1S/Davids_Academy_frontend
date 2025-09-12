// import React, { useState, useEffect, useCallback,useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import QuestionHeaderComponent from './QuestionHeaderComponent';
// import QuestionFooterComponent from './QuestionFooterComponent';


// import MCQ from './MCQQuestionComponent';
// import Dropdown from './DropdownQuestionComponent';
// import Sorting from './SortQuestionComponent';
// import FillIn from './FillInQuestionComponent';
// import DragDrop from './DragDropQuestionComponent';
// import SentenceHighlight from './SentenceQuestionComponent';
// import MultiRadio from './MultiRadioQuestionComponent';


// import {
//   getQBankQuestions,
//   getQBankQuestionData
// } from '../../features/exam/examSlice';


// import { fetchTestQuestions, fetchTestQuestionData, submitTestQuestion, submitTest } from '../../features/exam/examAPI';

// const questionTypeToComponent = {
//   'MCQ': MCQ,
//   'Dropdown': Dropdown,
//   'Sorting': Sorting,
//   'Fill in the Blanks': FillIn,
//   'Drag Drop': DragDrop,
//   'Sentence Highlight': SentenceHighlight,
//   'Multiple Radio': MultiRadio,
// };

// const ExamContainer = ({ user }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();


//   const queryParams = new URLSearchParams(location.search);
//   const testId = queryParams.get('testId');
//   const resume = queryParams.get('resume') === 'true';
//   const isTestMode = !!testId;
  

 
//   const { qBankQuestion: qBankQuestionIds, qBankQuestionLoading } = useSelector(
//     (state) => state.exam
//   );
//   const {
//     qBankQuestionData: qBankCurrentQuestion,
//     qBankQuestionDataLoading
//   } = useSelector((state) => state.exam);


//   const [questionIds, setQuestionIds] = useState([]); 
//   const [currentQuestion, setCurrentQuestion] = useState(null); 
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [elapsedSeconds, setElapsedSeconds] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [answers, setAnswers] = useState({}); 


// useEffect(() => {
//     const loadQuestions = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             if (isTestMode) {
               
//                 const questionIds = await fetchTestQuestions(testId);
                
                
              
//                 if (!questionIds || questionIds.length === 0) {
//                     throw new Error('No questions found for this test');
//                 }
                
                
//                 setQuestionIds(questionIds); 
                
//                 let startIndex = 0;
//                 if (resume) {
//                     console.log('Resuming test: Load progress here.');
//                 }
//                 setCurrentIndex(startIndex);
//             } else {
//                 dispatch(getQBankQuestions());
//             }
//             setLoading(false);
//         } catch (err) {
//             console.error('Error loading questions:', err);
//             setError(err.message || 'Failed to load questions.');
//             setLoading(false);
//         }
//     };

//     if (isTestMode && !testId) {
//         setError('Test ID is required for test mode');
//         setLoading(false);
//         return;
//     }

//     loadQuestions();
// }, [dispatch, isTestMode, testId, resume]);




  
//   useEffect(() => {
//     if (!isTestMode && qBankQuestionIds) {
//       setQuestionIds(qBankQuestionIds);
//     }
//   }, [isTestMode, qBankQuestionIds]);


// useEffect(() => {
//     const loadQuestionData = async () => {
//       console.log( 'Loading question data for :', loadQuestionData);
      
//         if (questionIds && questionIds.length > 0 && currentIndex < questionIds.length) {
//             const questionId = questionIds[currentIndex];
//             console.log('Loading question data for question ID:', questionId);
            
//             try {
//                 if (isTestMode) {
//                     setLoading(true);
//                     const data = await fetchTestQuestionData(testId, questionId, 0);
//                     console.log('Received test question data:', data);
//                     setCurrentQuestion(data);
//                     setLoading(false);
//                 } else {
//                     dispatch(getQBankQuestionData(questionId));
//                     return;
//                 }
//             } catch (err) {
//                 console.error('Error loading question data:', err);
//                 setError(err.message || 'Failed to load question data.');
//                 setLoading(false);
//             }
//         }
//     };

//     loadQuestionData();
// }, [questionIds, currentIndex, dispatch, isTestMode, testId]);


//   useEffect(() => {
//     if (!isTestMode) {
//       setCurrentQuestion(qBankCurrentQuestion);
//     }
//   }, [isTestMode, qBankCurrentQuestion]);

//   useEffect(() => {
//     const timer = setInterval(() => setElapsedSeconds((prev) => prev + 1), 1000);
//     return () => clearInterval(timer);
//   }, []);

  
//   const handleNext = useCallback(async () => {
//     if (questionIds && currentIndex < questionIds.length - 1) {
//       if (isTestMode) {
//         console.error('Submit current question before next (test mode)');
//       }
//       setCurrentIndex((idx) => idx + 1);
//     }
//   }, [questionIds, currentIndex, isTestMode]);

//   const handlePrevious = useCallback(() => {
//     if (currentIndex > 0) {
//       setCurrentIndex((idx) => idx - 1);
//     }
//   }, [currentIndex]);

//   const handlePause = () => {

//   };

//   // const handleEnd = async () => {
//   //   if (isTestMode) {
//   //     try {
//   //       await submitTest(testId);
//   //       navigate('/student/score');
//   //     } catch (err) {
//   //       setError(err.message || 'Failed to submit test.');
//   //     }
//   //   } else {
//   //     console.log('Ending Q-Bank session');
//   //   }
//   // };

//   const handleEnd = async () => {
//   if (isTestMode) {
//     try {
//       const res = await submitTest(testId);

//       if (res?.result) {
//         // ✅ success
//         navigate('/student/tests');
//       } else {
//         // ❌ backend responded but no success
//         setError(res?.message || 'Something went wrong while submitting test.');
//       }
//     } catch (err) {
//       // ❌ network or fetch error
//       setError(err.message || 'Failed to submit test.');
//     }
//   } else {
//     console.log('Ending Q-Bank session');
//   }
// };


// const handleAnswerSubmit = async (questionId, is_correct, mark) => {
//     if (isTestMode) {
//         try {
//             const currentQuestionId = questionIds[currentIndex];
//             await submitTestQuestion(testId, currentQuestionId, is_correct, mark);
//             setAnswers((prev) => ({ ...prev, [currentQuestionId]: { is_correct, mark } }));
//         } catch (err) {
//             setError(err.message || 'Failed to submit answer.');
//         }
//     }
   
// };


//   const formatTime = (secs) => {
//     const h = Math.floor(secs / 3600).toString().padStart(2, '0');
//     const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
//     const s = (secs % 60).toString().padStart(2, '0');
//     return h === '00' ? `${m}:${s}` : `${h}:${m}:${s}`;
//   };


//  const QuestionComponent = useMemo(() => {
//         const isQuestionDataLoading = isTestMode ? loading : qBankQuestionDataLoading;
        
//         if (currentQuestion && !isQuestionDataLoading) {
//             return questionTypeToComponent[currentQuestion.question_type];
//         }
//         return null;
//     }, [currentQuestion, isTestMode, loading, qBankQuestionDataLoading]);


//     const isQuestionsListLoading = isTestMode ? loading : qBankQuestionLoading;

//     if (isQuestionsListLoading || (!questionIds || questionIds.length === 0)) {
//         return <div>Loading question list...</div>;
//     }

//     if (error) {
//         return (
//             <div>
//                 <h3>Error: {error}</h3>
//                 <button onClick={() => window.location.reload()}>Retry</button>
//             </div>
//         );
//     }


// return (
//     <>
//         <QuestionHeaderComponent
//             questionNumber={currentIndex + 1}
//             totalQuestions={questionIds.length}
//             qid={currentQuestion?.id || 'N/A'}
//             user={user?.name || 'Guest'}
//             time={formatTime(elapsedSeconds)}
//         />
        
     
//         <div style={{ marginTop: '2rem' }}>
//             {(isTestMode ? loading : qBankQuestionDataLoading) ? (
//                 <p>Loading question...</p>
//             ) : QuestionComponent ? (
//                 <QuestionComponent
//                     question={currentQuestion}
//                     onSubmit={handleAnswerSubmit}
//                 />
//             ) : currentQuestion ? (
//                 <div>
//                     <p>Unsupported question type: {currentQuestion.question_type}</p>
//                     <pre>{JSON.stringify(currentQuestion, null, 2)}</pre>
//                 </div>
//             ) : (
//                 <p>No question data available</p>
//             )}
//         </div>
        
//         <QuestionFooterComponent
//             onEnd={handleEnd}
//             onPause={handlePause}
//             onNext={handleNext}
//             onPrevious={handlePrevious}
//             disablePrevious={currentIndex === 0}
//             disableNext={questionIds && currentIndex === questionIds.length - 1}
//             questionNumber={currentIndex + 1}
//             totalQuestions={questionIds.length}
//         />
//     </>
// );

// };

// export default ExamContainer;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import QuestionHeaderComponent from './QuestionHeaderComponent';
import QuestionFooterComponent from './QuestionFooterComponent';

import MCQ from './MCQQuestionComponent';
import Dropdown from './DropdownQuestionComponent';
import Sorting from './SortQuestionComponent';
import FillIn from './FillInQuestionComponent';
import DragDrop from './DragDropQuestionComponent';
import SentenceHighlight from './SentenceQuestionComponent';
import MultiRadio from './MultiRadioQuestionComponent';

import {
  getQBankQuestions,
  getQBankQuestionData
} from '../../features/exam/examSlice';

import {
  fetchTestQuestions,
  fetchTestQuestionData,
  submitTestQuestion,
  submitTest,
  fetchSampleQuestionnaireIds,
  fetchSampleQuestionData,
} from '../../features/exam/examAPI';

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

  const queryParams = new URLSearchParams(location.search);
  const testId = queryParams.get('testId');
  const resume = queryParams.get('resume') === 'true';
  const mode = queryParams.get('mode');
  const isTestMode = !!testId;
  const isSampleMode = mode === 'sample';

  const { qBankQuestion: qBankQuestionIds, qBankQuestionLoading } = useSelector(
    (state) => state.exam
  );
  const {
    qBankQuestionData: qBankCurrentQuestion,
    qBankQuestionDataLoading
  } = useSelector((state) => state.exam);

  // Local state
  const [questionIds, setQuestionIds] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({}); // Tracks answers keyed by question ID
  const [answeredIndices, setAnsweredIndices] = useState(new Set()); // Track answered question indices to restrict navigation
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  // Load question IDs based on mode
  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        if (isTestMode) {
          const questionIds = await fetchTestQuestions(testId);
          if (!questionIds || questionIds.length === 0) {
            throw new Error('No questions found for this test');
          }
          setQuestionIds(questionIds);
          let startIndex = 0;
          if (resume) {
            // TODO: implement progress restore using resume param (e.g., fetch last answered question index)
            console.log('Resuming test: feature not implemented');
          }
          setCurrentIndex(startIndex);
        } else if (isSampleMode) {
          const sampleQuestionIdsResponse = await fetchSampleQuestionnaireIds();
          if (!sampleQuestionIdsResponse || sampleQuestionIdsResponse.length === 0) {
            throw new Error('No sample questions found');
          }
          const ids = sampleQuestionIdsResponse.map(item => item.id);
          setQuestionIds(ids);
          setCurrentIndex(0);
        } else {
          dispatch(getQBankQuestions());
        }
        setLoading(false);
      } catch (err) {
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
  }, [dispatch, isTestMode, testId, resume, isSampleMode]);

  // Sync QBank question IDs if not test or sample mode
  useEffect(() => {
    if (!isTestMode && !isSampleMode && qBankQuestionIds) {
      setQuestionIds(qBankQuestionIds);
    }
  }, [isTestMode, isSampleMode, qBankQuestionIds]);

  // Load current question data
  useEffect(() => {
    const loadQuestionData = async () => {
      if (questionIds && questionIds.length > 0 && currentIndex < questionIds.length) {
        const questionId = questionIds[currentIndex];
        try {
          setLoading(true);
          if (isTestMode) {
            const data = await fetchTestQuestionData(testId, questionId, 0);
            setCurrentQuestion(data);
          } else if (isSampleMode) {
            const data = await fetchSampleQuestionData(questionId);
            setCurrentQuestion(data);
          } else {
            dispatch(getQBankQuestionData(questionId));
            // This updates qBankCurrentQuestion via redux store
            return;
          }
          setLoading(false);
        } catch (err) {
          setError(err.message || 'Failed to load question data.');
          setLoading(false);
        }
      }
    };

    loadQuestionData();
  }, [questionIds, currentIndex, dispatch, isTestMode, testId, isSampleMode]);

  // Sync current question for QBank mode
  useEffect(() => {
    if (!isTestMode && !isSampleMode) {
      setCurrentQuestion(qBankCurrentQuestion);
    }
  }, [isTestMode, isSampleMode, qBankCurrentQuestion]);

  // Timer for elapsed time
  useEffect(() => {
    const timer = setInterval(() => setElapsedSeconds(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (questionIds && currentIndex < questionIds.length - 1) {
      // In test mode, only allow proceeding if current question answered
      if (isTestMode && !answeredIndices.has(currentIndex)) {
        console.error('Answer the current question before proceeding');
        return;
      }
      setCurrentIndex(idx => idx + 1);
    }
  }, [questionIds, currentIndex, isTestMode, answeredIndices]);



  const handlePause = () => {
    // Implement pause logic if needed
  };

  // Finish the test properly
const handleEnd = async () => {
  if (isTestMode) {
    try {
      const res = await submitTest(testId);
      if (res?.result) {
        // Test is successfully completed
        navigate('/student/tests');
      } else if (res?.message === "Test already submitted") {
        // Test was already submitted before: show message or redirect
        setError("You have already submitted this test.");
        // Optionally, navigate the user away after a delay, or show info
        // navigate('/student/tests');
      } else {
        // Test did not complete—generic or specific error
        setError(res?.message || 'Something went wrong while submitting test.');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit test.');
    }
  } else {
    console.log('Ending Q-Bank or sample session');
  }
};


  // Handle answer submission (only for test mode)
  const handleAnswerSubmit = async (questionId, is_correct, mark) => {
    if (isTestMode) {
      try {
        const currentQuestionId = questionIds[currentIndex];
        await submitTestQuestion(testId, currentQuestionId, is_correct, mark);
        setAnswers(prev => ({ ...prev, [currentQuestionId]: { is_correct, mark } }));
        setAnsweredIndices(prev => new Set([...prev, currentIndex]));
        if (is_correct) {
          setCorrectCount(prev => prev + 1);
        } else {
          setIncorrectCount(prev => prev + 1);
        }
      } catch (err) {
        setError(err.message || 'Failed to submit answer.');
      }
    }
  };

  // Format time display helper
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return h === '00' ? `${m}:${s}` : `${h}:${m}:${s}`;
  };

  // Select component for question type
  const QuestionComponent = useMemo(() => {
    const isQuestionDataLoading = isTestMode ? loading : qBankQuestionDataLoading;
    if (currentQuestion && !isQuestionDataLoading) {
      return questionTypeToComponent[currentQuestion.question_type];
    }
    return null;
  }, [currentQuestion, isTestMode, loading, qBankQuestionDataLoading]);

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

  return (
    <>
      <QuestionHeaderComponent
        questionNumber={currentIndex + 1}
        totalQuestions={questionIds.length}
        qid={currentQuestion?.id || 'N/A'}
        user={user?.name || 'Guest'}
        time={formatTime(elapsedSeconds)}
      />

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
      
        onNext={handleNext}
   
        disablePrevious={currentIndex === 0 || answeredIndices.has(currentIndex - 1)}
        disableNext={questionIds && currentIndex === questionIds.length - 1}
        questionNumber={currentIndex + 1}
        totalQuestions={questionIds.length}
      />
    </>
  );
};

export default ExamContainer;
