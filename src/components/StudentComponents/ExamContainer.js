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
import "../../styles/DashboardStyles/StudentFuturistic.css";

const QBANK_SESSION_KEY = "qbank-session-v1";

const readQbankSession = (topics, count) => {
  try {
    const raw = sessionStorage.getItem(QBANK_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (String(parsed.topics || "") !== String(topics || "")) return null;
    if (String(parsed.count || "") !== String(count || "")) return null;
    if (!Array.isArray(parsed.ids) || parsed.ids.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
};

const writeQbankSession = ({ topics, count, ids, index, skipCount }) => {
  sessionStorage.setItem(
    QBANK_SESSION_KEY,
    JSON.stringify({
      topics: topics || "",
      count: count || "",
      ids,
      index: index || 0,
      skipCount: skipCount || 0,
    })
  );
};

const clearQbankSession = () => {
  sessionStorage.removeItem(QBANK_SESSION_KEY);
};

const isEmptyDropdownQuestion = (question) => {
  if (!question) return false;
  const type = String(question.question_type || "").toLowerCase();
  if (type === "dropdown") {
    return !Array.isArray(question.dropdowns) || question.dropdowns.length === 0;
  }
  if (type === "table dropdown") {
    return !Array.isArray(question.tableDropdownFields) || question.tableDropdownFields.length === 0;
  }
  if (type === "multidropdown") {
    return !Array.isArray(question.rows) || question.rows.length === 0
      || !Array.isArray(question.headers) || question.headers.length === 0;
  }
  return false;
};

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
  const [refreshKey, setRefreshKey] = useState(0);
  const [skipCount, setSkipCount] = useState(0);
  const hasFetchedQBank = useRef(false);
  const savedQbankSession = useRef(null);
  const questionId = questionIds[currentIndex];

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
          const saved = readQbankSession(topicsParam, countParam);
          // Keep only navigation state from the previous session. Question IDs
          // must always come from the server because an admin may have reset
          // this student's Q-Bank progress since the session was cached.
          savedQbankSession.current = saved;
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
           const saved = savedQbankSession.current;
           const savedCurrentId = saved?.ids?.[saved.index || 0];
           const restoredIndex = savedCurrentId == null
             ? 0
             : qBankQuestionIds.findIndex(
                 (id) => String(id) === String(savedCurrentId)
               );
           const nextIndex = restoredIndex >= 0 ? restoredIndex : 0;

           setQuestionIds(qBankQuestionIds);
           setCurrentIndex(nextIndex);
           setSkipCount(saved?.skipCount || 0);
           setError(null);
           writeQbankSession({
             topics: topicsParam,
             count: countParam,
             ids: qBankQuestionIds,
             index: nextIndex,
             skipCount: saved?.skipCount || 0,
           });
           savedQbankSession.current = null;
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
  }, [isTestMode, isSampleMode, qBankQuestionIds, qBankQuestionLoading, topicsParam, countParam]);

  useEffect(() => {
    if (!isTestMode && !isSampleMode && questionIds.length > 0) {
      writeQbankSession({
        topics: topicsParam,
        count: countParam,
        ids: questionIds,
        index: currentIndex,
        skipCount,
      });
    }
  }, [isTestMode, isSampleMode, questionIds, currentIndex, skipCount, topicsParam, countParam]);

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

  // Drop dropdown questions that were saved without fields so the student
  // never lands on the empty "No dropdown question data" screen.
  useEffect(() => {
    const questionStillLoading = isTestMode ? loading : qBankQuestionDataLoading;
    if (questionStillLoading || !isEmptyDropdownQuestion(currentQuestion)) return;
    const removedId = String(currentQuestion.id);
    const remaining = questionIds.filter((id) => String(id) !== removedId);
    if (remaining.length === questionIds.length) return;
    if (remaining.length === 0) {
      setError("This set has no dropdown questions with answer choices. Go back and start a new set.");
    }
    setQuestionIds(remaining);
  }, [currentQuestion, questionIds, isTestMode, loading, qBankQuestionDataLoading]);

  useEffect(() => {
    if (questionIds.length > 0 && currentIndex >= questionIds.length) {
      setCurrentIndex(questionIds.length - 1);
    }
  }, [questionIds, currentIndex]);

  // Fetch submitted result whenever current question changes
  useEffect(() => {
    if (questionId) {
      if (isTestMode) {
        dispatch(getMockTestSubmittedResult({ questionId, test_id: testId }));
      } else if (!isSampleMode) {
        dispatch(getQBankSubmittedResult(questionId));
      }
    }
  }, [questionId, isTestMode, isSampleMode, testId, dispatch]);

  // Timer for elapsed time
  useEffect(() => {
    const timer = setInterval(
      () => setElapsedSeconds((prev) => prev + 1),
      1000
    );
    return () => clearInterval(timer);
  }, []);

  // Navigation handlers

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((idx) => idx - 1);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (questionIds && currentIndex < questionIds.length - 1) {
      setCurrentIndex((idx) => idx + 1);
    }
  }, [currentIndex, questionIds]);

  const handleSkip = useCallback(() => {
    if (questionIds && currentIndex < questionIds.length) {
      sessionStorage.setItem("hasAnswered", "false");
      sessionStorage.setItem("isRevealed", "false");

      const skippedQuestionId = questionIds[currentIndex];

      // Append skipped question and advance the index natively.
      setQuestionIds((prevIds) => [...prevIds, skippedQuestionId]);
      setRefreshKey((k) => k + 1);
      setSkipCount((c) => c + 1);
      setCurrentIndex((idx) => idx + 1);
    }
  }, [currentIndex, questionIds]);

  const {
    qbankSubmittedResult,
    mockTestSubmittedResult,
  } = useSelector((state) => state.exam);

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
      clearQbankSession();
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
      // setAnswers((prev) => ({
      //   ...prev,
      //   [currentQuestionId]: { is_correct, mark },
      // }));
      // setAnsweredIndices((prev) => new Set([...prev, currentIndex]));
      // if (is_correct) {
      //   setCorrectCount((prev) => prev + 1);
      // } else {
      //   setIncorrectCount((prev) => prev + 1);
      // }
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
      <Box className="student-exam-session student-futuristic" sx={{ p: { xs: 2, md: 4 }, textAlign: 'center', mt: { xs: 5, md: 10 } }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'var(--sf-text)', fontFamily: '"Outfit", "Inter", sans-serif' }}>
          Notice
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: '600px', mx: 'auto', color: 'var(--sf-text-soft)', fontFamily: '"Inter", sans-serif' }}>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate("/student/question-bank")}
          sx={{ 
            background: 'linear-gradient(90deg, #f0c94a, #fbbf24)',
            color: '#04121f',
            borderRadius: '999px',
            px: 4,
            fontWeight: 800,
            textTransform: 'none',
            '&:hover': { background: 'linear-gradient(90deg, #fbbf24, #f0c94a)' } 
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
    <Box className="student-exam-session student-futuristic" sx={{
      display: 'flex',
      flexDirection: 'column',
      height: { xs: '100dvh', sm: '100dvh', md: 'auto' },
      overflow: { xs: 'hidden', sm: 'hidden', md: 'visible' }
    }}>
      <style>{`
        .student-exam-body .q-tabs-panel,
        .student-exam-body .q-tabs-panel *,
        .student-exam-body .q-html,
        .student-exam-body .q-html *,
        .student-exam-body ol,
        .student-exam-body ul,
        .student-exam-body li,
        .student-exam-body li::marker,
        .student-exam-body .q-tabs-panel [style*="background-color"],
        .student-exam-body .q-html [style*="background-color"] {
          color: var(--sf-text) !important;
          -webkit-text-fill-color: var(--sf-text) !important;
          font-weight: 500 !important;
        }
        .student-exam-body .q-correct,
        .student-exam-body .q-correct * { color: var(--sf-ok) !important; -webkit-text-fill-color: var(--sf-ok) !important; }
        .student-exam-body .q-wrong,
        .student-exam-body .q-wrong * { color: var(--sf-bad) !important; -webkit-text-fill-color: var(--sf-bad) !important; }
        .student-exam-body .q-sort-ok,
        .student-exam-body .q-sort-ok * { color: #14532d !important; -webkit-text-fill-color: #14532d !important; }
        .student-exam-body .q-sort-bad,
        .student-exam-body .q-sort-bad * { color: #7f1d1d !important; -webkit-text-fill-color: #7f1d1d !important; }
      `}</style>
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
      <Box className="student-exam-body" sx={{ 
        flexGrow: 1, 
        overflowY: { xs: 'auto', sm: 'auto', md: 'visible' },
        display: 'flex',
        flexDirection: 'column',
      }}>
        {(isTestMode ? loading : qBankQuestionDataLoading) ? (
          <p className="q-instructions">Loading question...</p>
        ) : QuestionComponent ? (
          <Box className="q-attempt-area" sx={{ flex: 1 }}>
            <QuestionComponent
              key={`${currentQuestion?.id || currentIndex}-${refreshKey}`}
              question={currentQuestion}
              submittedResult={submittedResultForCurrent}
              onSubmit={handleAnswerSubmit}
              testId={testId}
            />
          </Box>
        ) : currentQuestion ? (
          <div>
            <p>Unsupported question type: {currentQuestion.question_type}</p>
            <pre>{JSON.stringify(currentQuestion, null, 2)}</pre>
          </div>
        ) : (
          <p className="q-instructions">No question data available</p>
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
