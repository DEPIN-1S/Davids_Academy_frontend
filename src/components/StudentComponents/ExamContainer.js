import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
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
        } else {
          dispatch(getQBankQuestions());
        }
        setLoading(false);
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
  }, [dispatch, isTestMode, testId, isSampleMode]);

  // Sync QBank question IDs if not test or sample mode
  useEffect(() => {
    if (!isTestMode && !isSampleMode && qBankQuestionIds) {
      setQuestionIds(qBankQuestionIds);
    }
  }, [isTestMode, isSampleMode, qBankQuestionIds]);

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
          setLoading(true);
          if (isTestMode) {
            const data = await fetchTestQuestionData(testId, questionId, 0);
            setCurrentQuestion(data);
          } else if (isSampleMode) {
            const data = await fetchSampleQuestionData(questionId);
            setCurrentQuestion(data);
          } else {
            dispatch(getQBankQuestionData(questionId));
            return;
          }
          setLoading(false);
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
      if (!isTestMode && !isSampleMode) {
        dispatch(getQBankSubmittedResult(previousQuestionId))
          .unwrap()
          .then((resultData) => {  // ✅ resultData = API response
            console.log("✅ Previous API success:", resultData);
            setCurrentQuestionId(previousQuestionId);
            setCurrentIndex(currentIndex - 1);
          })
          .catch((error) => {
            console.error("❌ Previous API failed:", error);
            setCurrentIndex(currentIndex - 1); // Fallback
          });
      } else {
        setCurrentIndex(currentIndex - 1);
        setCurrentQuestionId(questionIds[currentIndex - 1]);
      }
    }
  }, [currentIndex, questionIds, isTestMode, isSampleMode, dispatch]);

  // Same fix for handleNext

  const handleNext = useCallback(() => {
    if (questionIds && currentIndex < questionIds.length - 1) {
      const nextQuestionId = questionIds[currentIndex + 1];

      if (!isTestMode && !isSampleMode) {
        // QBank mode: API call for next question
        dispatch(getQBankSubmittedResult(nextQuestionId))
          .unwrap()  // ✅ Proper thunk chaining
          .then((resultData) => {
            console.log("✅ Next API success:", resultData);
            setCurrentQuestionId(nextQuestionId);
            setCurrentIndex(currentIndex + 1);
          })
          .catch((error) => {
            console.error("❌ Next API failed:", error);
            // Fallback to normal navigation
            setCurrentIndex(currentIndex + 1);
            setCurrentQuestionId(nextQuestionId);
          });
      } else {
        // Test/Sample mode: Normal navigation
        setCurrentIndex(currentIndex + 1);
        setCurrentQuestionId(questionIds[currentIndex + 1]);
      }
    }
  }, [currentIndex, questionIds, isTestMode, isSampleMode, dispatch]);


  // Sync Redux result to currentQuestion
  const { qbankSubmittedResult } = useSelector((state) => state.exam);

  useEffect(() => {
    if (!isTestMode && !isSampleMode && qbankSubmittedResult) {
      setCurrentQuestion(qbankSubmittedResult);
    }
  }, [qbankSubmittedResult, isTestMode, isSampleMode]);

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

  const isQuestionsListLoading = isTestMode ? loading : qBankQuestionLoading;
  if (isQuestionsListLoading || !questionIds || questionIds.length === 0) {
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

  const showPrevious = isSampleMode || (!isTestMode && !isSampleMode);

  return (
    <>
      {/* Conditional Navbar - Hide for sample mode */}
      {!isSampleMode && <DashboardNavbar />}

      <QuestionHeaderComponent
        questionNumber={currentIndex + 1}
        totalQuestions={questionIds.length}
        qid={currentQuestion?.id || "N/A"}
        user={user?.name || "Guest"}
        time={formatTime(elapsedSeconds)}
      />
      <div style={{ marginTop: "2rem" }}>
        {(isTestMode ? loading : qBankQuestionDataLoading) ? (
          <p>Loading question...</p>
        ) : QuestionComponent ? (
          <QuestionComponent
            question={currentQuestion}
            submittedResult={qbankSubmittedResult}
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
        customButtonText={isTestMode ? "Submit & Exit" : "Back"}
        customOnClick={handleEnd}
        showPrevious={showPrevious}
      />
    </>
  );
};

export default ExamContainer;
