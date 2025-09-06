import React, { useState, useEffect, useCallback,useMemo } from 'react';
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


  const queryParams = new URLSearchParams(location.search);
  const testId = queryParams.get('testId');
  const resume = queryParams.get('resume') === 'true';
  const isTestMode = !!testId;

 
  const { qBankQuestion: qBankQuestionIds, qBankQuestionLoading } = useSelector(
    (state) => state.exam
  );
  const {
    qBankQuestionData: qBankCurrentQuestion,
    qBankQuestionDataLoading
  } = useSelector((state) => state.exam);


  const [questionIds, setQuestionIds] = useState([]); 
  const [currentQuestion, setCurrentQuestion] = useState(null); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({}); 


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
                    console.log('Resuming test: Load progress here.');
                }
                setCurrentIndex(startIndex);
            } else {
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




  
  useEffect(() => {
    if (!isTestMode && qBankQuestionIds) {
      setQuestionIds(qBankQuestionIds);
    }
  }, [isTestMode, qBankQuestionIds]);


useEffect(() => {
    const loadQuestionData = async () => {
        if (questionIds && questionIds.length > 0 && currentIndex < questionIds.length) {
            const questionId = questionIds[currentIndex];
            console.log('Loading question data for question ID:', questionId);
            
            try {
                if (isTestMode) {
                    setLoading(true);
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


  useEffect(() => {
    if (!isTestMode) {
      setCurrentQuestion(qBankCurrentQuestion);
    }
  }, [isTestMode, qBankCurrentQuestion]);

  useEffect(() => {
    const timer = setInterval(() => setElapsedSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  
  const handleNext = useCallback(async () => {
    if (questionIds && currentIndex < questionIds.length - 1) {
      if (isTestMode) {
        console.error('Submit current question before next (test mode)');
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

  };

  const handleEnd = async () => {
    if (isTestMode) {
      try {
        await submitTest(testId);
        navigate('/student/score');
      } catch (err) {
        setError(err.message || 'Failed to submit test.');
      }
    } else {
      console.log('Ending Q-Bank session');
    }
  };

const handleAnswerSubmit = async (questionId, is_correct, mark) => {
    if (isTestMode) {
        try {
            const currentQuestionId = questionIds[currentIndex];
            await submitTestQuestion(testId, currentQuestionId, is_correct, mark);
            setAnswers((prev) => ({ ...prev, [currentQuestionId]: { is_correct, mark } }));
        } catch (err) {
            setError(err.message || 'Failed to submit answer.');
        }
    }
   
};


  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return h === '00' ? `${m}:${s}` : `${h}:${m}:${s}`;
  };


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