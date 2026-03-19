import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import DashboardNavbar from "../../components/StudentComponents/StudentNavbar";
import QuestionHeaderComponent from "./QuestionHeaderComponent";
import QuestionFooterComponent from "./QuestionFooterComponent";
import MCQ from "./MCQQuestionComponent";
import Dropdown from "./DropdownQuestionComponent";
import Sorting from "./SortQuestionComponent";
import FillIn from "./FillInQuestionComponent";
import DragDrop from "./DragDropQuestionComponent";
import SentenceHighlight from "./SentenceQuestionComponent";
import MultiRadio from "./MultiRadioQuestionComponent";
import TableDropdownQuestionComponent from "./TableDropdownQuestionComponent";
import TableMultipleDropdownComponent from "./TableMultipleDropdownComponent";
import TableHighlightSelectComponent from "./TableHighlightSelectComponent";
import {
  getQBankQuestions,
  getQBankQuestionData,
  getQBankSubmittedResult,
  getMockTestSubmittedResult
} from "../../features/exam/examSlice";
import {
  fetchTestQuestions,
  fetchTestQuestionData,
  submitTestQuestion,
  submitTest,
  fetchSampleQuestionnaireIds,
  fetchSampleQuestionData,
} from "../../features/exam/examAPI";

const questionTypeToComponent = {
  "MCQ": MCQ,
  "Dropdown": Dropdown,
  "Sorting": Sorting,
  "Fill in the Blanks": FillIn,
  "Drag Drop": DragDrop,
  "Sentence Highlight": SentenceHighlight,
  "Multiple Radio": MultiRadio,
  "Table Dropdown": TableDropdownQuestionComponent,
  "Multidropdown": TableMultipleDropdownComponent,
  "Table Highlight": TableHighlightSelectComponent,
};

const ExamContainer = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const testId = queryParams.get("testId");
  const mode = queryParams.get("mode");
  const topicsParam = queryParams.get("topics");
  const countParam = queryParams.get("count");
  const isTestMode = !!testId;
  const isSampleMode = mode === "sample";
  const { qBankQuestion: qBankQuestionIds, qBankQuestionLoading } = useSelector(
    (state) => state.exam
  );
  const { qBankQuestionData: qBankCurrentQuestion, qBankQuestionDataLoading } =
    useSelector((state) => state.exam);

  // FIX: Get user from Redux for login check (adjust slice path if needed, e.g., state.auth)
  const reduxUser = useSelector((state) => state.user); // Assumes state.user has isLoggedIn or id
  const isLoggedIn = reduxUser?.isLoggedIn || !!reduxUser?.id || !!user?.id; // Flexible check (use prop or Redux)

  // Local state
  const [questionIds, setQuestionIds] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [answeredIndices, setAnsweredIndices] = useState(new Set());
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [skipCount, setSkipCount] = useState(0);
  const hasFetchedQBank = useRef(false);


  // Load question IDs based on mode
  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        if (isTestMode) {
          const questionIds = await fetchTestQuestions(testId);
          if (!questionIds || questionIds.length === 0) {
            throw new Error("No questions found for this test");
          }
          setQuestionIds(questionIds);
          setCurrentIndex(0);
          setLoading(false);
        } else if (isSampleMode) {
          const sampleQuestionIdsResponse = await fetchSampleQuestionnaireIds();
          if (
            !sampleQuestionIdsResponse ||
            sampleQuestionIdsResponse.length === 0
          ) {
            throw new Error("No sample questions found");
          }
          const ids = sampleQuestionIdsResponse.map((item) => item.id);
          setQuestionIds(ids);
          setCurrentIndex(0);
          setLoading(false);
        } else {
          // For Q-Bank mode, dispatch to Redux.
          // The local loading state will be synced with qBankQuestionLoading below.
          hasFetchedQBank.current = true;
          dispatch(getQBankQuestions({ topics: topicsParam, count: countParam }));
        }
      } catch (err) {
        setError(err.message || "Failed to load questions.");
        setLoading(false);
      }
    };
    if (isTestMode && !testId) {
      setError("Test ID is required for test mode");
      setLoading(false);
      return;
    }
    loadQuestions();
  }, [dispatch, isTestMode, testId, isSampleMode, topicsParam, countParam]);

  // Sync QBank question IDs if not test or sample mode
  useEffect(() => {
    if (!isTestMode && !isSampleMode && hasFetchedQBank.current) {
      if (!qBankQuestionLoading) {
        if (qBankQuestionIds && qBankQuestionIds.length > 0) {
           setQuestionIds(qBankQuestionIds);
           setCurrentIndex(0);
           setError(null);
        } else {
           setQuestionIds([]);
           setError("You have completed all available questions for the selected topics, or no questions matched your filter. Please reset your Q-Bank progress to practice again.");
        }
        setLoading(false);
      } else {
        setLoading(true);
        setError(null);
      }
    }
  }, [isTestMode, isSampleMode, qBankQuestionIds, qBankQuestionLoading]);

  // Load current question data
  useEffect(() => {
    const loadQuestionData = async () => {
      if (
        questionIds &&
        questionIds.length > 0 &&
        currentIndex < questionIds.length
      ) {
        const questionId = questionIds[currentIndex];
        try {
          if (isTestMode) {
            setLoading(true);
            const data = await fetchTestQuestionData(testId, questionId, 0);
            setCurrentQuestion(data);
            setLoading(false);
          } else if (isSampleMode) {
            setLoading(true);
            const data = await fetchSampleQuestionData(questionId);
            setCurrentQuestion(data);
            setLoading(false);
          } else {
            // Q-Bank mode: use Redux loading state (qBankQuestionDataLoading)
            dispatch(getQBankQuestionData(questionId));
            return;
          }
        } catch (err) {
          setError(err.message || "Failed to load question data.");
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
    const timer = setInterval(
      () => setElapsedSeconds((prev) => prev + 1),
      1000
    );
    return () => clearInterval(timer);
  }, []);

  // Navigation handlers


  const [currentQuestionId, setCurrentQuestionId] = useState(null);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      const previousQuestionId = questionIds[currentIndex - 1];

      if (isTestMode) {
        // 🔹 mock test
        dispatch(
          getMockTestSubmittedResult({ questionId: previousQuestionId, test_id: testId })
        )
          .unwrap()
          .then((res) => {
            console.log("✅ Mock previous API success:", res);
            setCurrentQuestionId(previousQuestionId);
            setCurrentIndex((idx) => idx - 1);
          })
          .catch((error) => {
            console.error("❌ Mock previous API failed:", error);
            setCurrentIndex((idx) => idx - 1);
            setCurrentQuestionId(previousQuestionId);
          });
      } else if (!isSampleMode) {
        // 🔹 QBank
        dispatch(getQBankSubmittedResult(previousQuestionId))
          .unwrap()
          .then((res) => {
            console.log("✅ QBank previous API success:", res);
            setCurrentQuestionId(previousQuestionId);
            setCurrentIndex((idx) => idx - 1);
          })
          .catch((error) => {
            console.error("❌ QBank previous API failed:", error);
            setCurrentIndex((idx) => idx - 1);
            setCurrentQuestionId(previousQuestionId);
          });
      } else {
        // 🔹 sample
        setCurrentIndex((idx) => idx - 1);
        setCurrentQuestionId(previousQuestionId);
      }
    }
  }, [currentIndex, questionIds, isTestMode, isSampleMode, dispatch, testId]);



  const handleNext = useCallback(() => {
    if (questionIds && currentIndex < questionIds.length - 1) {
      const nextQuestionId = questionIds[currentIndex + 1];

      if (isTestMode) {
        dispatch(
          getMockTestSubmittedResult({ questionId: nextQuestionId, test_id: testId })
        )
          .unwrap()
          .then((res) => {
            console.log("✅ Mock next API success:", res);
            setCurrentQuestionId(nextQuestionId);
            setCurrentIndex((idx) => idx + 1);
          })
          .catch((error) => {
            console.error("❌ Mock next API failed:", error);
            setCurrentIndex((idx) => idx + 1);
            setCurrentQuestionId(nextQuestionId);
          });
      } else if (!isSampleMode) {
        dispatch(getQBankSubmittedResult(nextQuestionId))
          .unwrap()
          .then((res) => {
            console.log("✅ QBank next API success:", res);
            setCurrentQuestionId(nextQuestionId);
            setCurrentIndex((idx) => idx + 1);
          })
          .catch((error) => {
            console.error("❌ QBank next API failed:", error);
            setCurrentIndex((idx) => idx + 1);
            setCurrentQuestionId(nextQuestionId);
          });
      } else {
        setCurrentIndex((idx) => idx + 1);
        setCurrentQuestionId(nextQuestionId);
      }
    }
  }, [currentIndex, questionIds, isTestMode, isSampleMode, dispatch, testId]);

  const handleSkip = useCallback(() => {
    if (questionIds && currentIndex < questionIds.length) {
      sessionStorage.setItem("hasAnswered", "false");
      sessionStorage.setItem("isRevealed", "false");

      const skippedQuestionId = questionIds[currentIndex];

      // Append skipped question and advance the index natively.
      const newQuestionIds = [...questionIds, skippedQuestionId];
      setQuestionIds(newQuestionIds);
      setRefreshKey((k) => k + 1);
      setSkipCount((c) => c + 1);

      // Navigate to the logically next question in the sequence
      const nextQuestionId = newQuestionIds[currentIndex + 1];

      if (isTestMode) {
        dispatch(
          getMockTestSubmittedResult({ questionId: nextQuestionId, test_id: testId })
        )
          .unwrap()
          .then(() => {
            setCurrentIndex((idx) => idx + 1);
            setCurrentQuestionId(nextQuestionId);
          })
          .catch(() => {
            setCurrentIndex((idx) => idx + 1);
            setCurrentQuestionId(nextQuestionId);
          });
      } else if (!isSampleMode) {
        dispatch(getQBankSubmittedResult(nextQuestionId))
          .unwrap()
          .then(() => {
            setCurrentIndex((idx) => idx + 1);
            setCurrentQuestionId(nextQuestionId);
          })
          .catch(() => {
            setCurrentIndex((idx) => idx + 1);
            setCurrentQuestionId(nextQuestionId);
          });
      } else {
        setCurrentIndex((idx) => idx + 1);
        setCurrentQuestionId(nextQuestionId);
      }
    }
  }, [currentIndex, questionIds, isTestMode, isSampleMode, dispatch, testId]);

  // Sync Redux result to currentQuestion
  const {
    qbankSubmittedResult,
    mockTestSubmittedResult,
  } = useSelector((state) => state.exam);


  useEffect(() => {
    if (!isTestMode && !isSampleMode && qbankSubmittedResult) {
      if (qbankSubmittedResult.result !== false) {
        setCurrentQuestion(qbankSubmittedResult.data || qbankSubmittedResult);
      }
    } else if (isTestMode && mockTestSubmittedResult) {
      if (mockTestSubmittedResult.result !== false) {
        setCurrentQuestion(mockTestSubmittedResult.data || mockTestSubmittedResult);
      }
    }
  }, [qbankSubmittedResult, mockTestSubmittedResult, isTestMode, isSampleMode]);


  const handlePause = () => {
    // Placeholder
  };

  // FIX: Conditional handleEnd with login check
  const handleEnd = async () => {
    if (isTestMode) {
      try {
        const res = await submitTest(testId);
        if (res?.result) {
          console.log("Test submitted successfully");
          navigate("/student/tests");
        } else {
          if (
            res?.message &&
            res.message.toLowerCase().includes("already submitted")
          ) {
            setError("Test already submitted. Cannot resubmit.");
          } else {
            setError(
              res?.message || "Something went wrong while submitting test."
            );
          }
        }
      } catch (err) {
        setError(err.message || "Failed to submit test.");
      }
    } else {
      // For sample/QBank: Conditional home based on login
      let homePath = "/student/question-bank"; // Default logged-in home (adjust if needed)
      if (isSampleMode && !isLoggedIn) {
        homePath = "/"; // Public home without login (landing/home screen)
        console.log("Sample mode without login: Navigating to public home");
      } else {
        // QBank or logged-in sample: Logged-in home
        console.log("QBank or logged-in sample: Navigating to student home");
      }
      navigate(homePath);
    }
  };



  const handleAnswerSubmit = async (
    questionId,
    is_correct,
    mark,
    _userAnswerStr,
    incomingTestId
  ) => {
    if (isSampleMode) {
      console.log("Sample mode - skipping answer submit.");
      return;
    }
    try {
      const currentQuestionId = questionIds[currentIndex];
      const testIdToUse = incomingTestId ?? testId;
      await submitTestQuestion(
        mode,
        testIdToUse,
        questionId,
        is_correct,
        mark,
        currentQuestionId
      );
      setAnswers((prev) => ({
        ...prev,
        [currentQuestionId]: { is_correct, mark },
      }));
      setAnsweredIndices((prev) => new Set([...prev, currentIndex]));
      if (is_correct) {
        setCorrectCount((prev) => prev + 1);
      } else {
        setIncorrectCount((prev) => prev + 1);
      }
    } catch (err) {
      setError(err.message || "Failed to submit answer.");
    }
    // }
  };

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600)
      .toString()
      .padStart(2, "00");
    const m = Math.floor((secs % 3600) / 60)
      .toString()
      .padStart(2, "00");
    const s = (secs % 60).toString().padStart(2, "00");
    return h === "00" ? `${m}:${s}` : `${h}:${m}:${s}`;
  };

  const QuestionComponent = useMemo(() => {
    const isQuestionDataLoading = isTestMode
      ? loading
      : qBankQuestionDataLoading;
    if (currentQuestion && !isQuestionDataLoading) {
      return questionTypeToComponent[currentQuestion.question_type];
    }
    return null;
  }, [currentQuestion, isTestMode, loading, qBankQuestionDataLoading]);

  if (error && !loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, textAlign: 'center', mt: { xs: 5, md: 10 } }}>
        <Typography variant="h5" color="error" gutterBottom sx={{ fontWeight: 600 }}>
          Notice
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: '600px', mx: 'auto', color: '#555' }}>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate("/student/question-bank")}
          sx={{ 
            backgroundColor: '#2e3760', 
            borderRadius: '20px',
            px: 4,
            textTransform: 'none',
            '&:hover': { backgroundColor: '#1a2038' } 
          }}
        >
          Back to Question Bank
        </Button>
      </Box>
    );
  }

  const isQuestionsListLoading = isTestMode ? loading : qBankQuestionLoading;
  if (isQuestionsListLoading || !questionIds || questionIds.length === 0) {
    return <div>Loading question list...</div>;
  }

  // Enforce boundary to the original length so users don't see growing counts (e.g. 939)
  const uniqueCount = new Set(questionIds).size;
  const displayQuestionNumber = Math.min(currentIndex + 1, uniqueCount);
  const displayTotalQuestions = uniqueCount;

  const showPrevious = isSampleMode || (!isTestMode && !isSampleMode);
  const submittedResultForCurrent = isTestMode
    ? mockTestSubmittedResult
    : qbankSubmittedResult;

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: { xs: '100dvh', sm: '100dvh', md: 'auto' },
      overflow: { xs: 'hidden', sm: 'hidden', md: 'visible' }
    }}>
      {/* Header section (fixed on mobile implicitly by being flex header and content being scrollable) */}
      <Box sx={{ flexShrink: 0 }}>
        {/* Conditional Navbar - Hide for sample mode */}
        {!isSampleMode && <DashboardNavbar />}

        <QuestionHeaderComponent
          questionNumber={displayQuestionNumber}
          totalQuestions={displayTotalQuestions}
          qid={currentQuestion?.id || "N/A"}
          user={user?.name || "Guest"}
          time={formatTime(elapsedSeconds)}
        />
      </Box>

      {/* Main Content Area */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: { xs: 'auto', sm: 'auto', md: 'visible' },
        display: 'flex',
        flexDirection: 'column',
      }}>
        {(isTestMode ? loading : qBankQuestionDataLoading) ? (
          <p>Loading question...</p>
        ) : QuestionComponent ? (
          <QuestionComponent
            key={`${currentQuestion?.id || currentIndex}-${refreshKey}`}
            question={currentQuestion}
            submittedResult={submittedResultForCurrent}
            onSubmit={handleAnswerSubmit}
            testId={testId}
          />
        ) : currentQuestion ? (
          <div>
            <p>Unsupported question type: {currentQuestion.question_type}</p>
            <pre>{JSON.stringify(currentQuestion, null, 2)}</pre>
          </div>
        ) : (
          <p>No question data available</p>
        )}
      </Box>

      <Box sx={{ flexShrink: 0 }}>
        <QuestionFooterComponent
          onEnd={handleEnd}
          onPause={handlePause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSkip={handleSkip}
          skipCount={skipCount}
          disablePrevious={currentIndex === 0}
          disableNext={questionIds && currentIndex === questionIds.length - 1}
          questionNumber={displayQuestionNumber}
          totalQuestions={displayTotalQuestions}
          customButtonText={isTestMode ? "Submit & Exit" : "Back"}
          customOnClick={handleEnd}
          showPrevious={showPrevious}
        />
      </Box>
    </Box>
  );
};

export default ExamContainer;
