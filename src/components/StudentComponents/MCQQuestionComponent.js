import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../../styles/DashboardStyles/RadioButtonQuestionComponent.css";
import RevealAnswerComponent from "./RevealAnswerComponent";
import { submitMockTestQuestionResponseThunk } from "../../features/exam/examSlice";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const buildImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const clean = String(path).replace(/^\/+/, "");
  return `${process.env.REACT_APP_API_URL.replace('/davidsacademy', '')}/${clean}`;
};

const MCQQuestionComponent = ({ question, onSubmit, submittedResult }) => {
  const {
    id: questionId,
    question: questionText,
    mcqoptions = [],
    mcqAnswers = [],
    exhibit,
    explanation = [],
    additionalInfo = [],
    tabsInfo = [],
    marks = 0,
    instructions,
  } = question || {};
  const location = useLocation();
  const answerArray = Array.isArray(mcqAnswers)
    ? mcqAnswers.map((ans) => (ans.mcqAnswer ?? "").trim())
    : [];
  const [showNotAnsweredModal, setShowNotAnsweredModal] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [activeTab, setActiveTab] = useState(
    tabsInfo && tabsInfo.length ? tabsInfo[0].tabKey : ""
  );

  useEffect(() => {
    sessionStorage.setItem("hasAnswered", "false");
    sessionStorage.setItem("isRevealed", "false");
    setShowAnswer(false); // Reset local component state accordingly
    setIsCorrect(false);
  }, [questionId]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (tabsInfo && tabsInfo.length) setActiveTab(tabsInfo[0].tabKey);
  }, [tabsInfo]);

  useEffect(() => {
    console.log("🔍 submittedResult:", submittedResult);
    if (!submittedResult?.result) return;
    try {
      // Handle actual backend shape: { result: true, answers: [{ answer: "..." }] }
      let previousAnswer = null;

      if (submittedResult.answers && submittedResult.answers[0]?.answer) {
        previousAnswer = submittedResult.answers[0].answer;
      } else if (submittedResult.selectedOptions) {
        // Fallback for other question types
        previousAnswer = submittedResult.selectedOptions.join(", ");
      } else if (submittedResult.data?.answer) {
        previousAnswer = submittedResult.data.answer;
      }

      if (previousAnswer) {
        console.log("🔍 Restoring previous answer:", previousAnswer);

        const previousSelected = previousAnswer
          .split(/[,;]/)
          .map(ans => ans.trim())
          .filter(ans => ans.length > 0);

        setSelectedOptions(previousSelected);

        // Calculate correctness
        const selectedNorm = previousSelected.map(s => s.trim());
        const correctNorm = answerArray.map(s => s.trim());
        const allCorrect = selectedNorm.length === correctNorm.length &&
          selectedNorm.every(item => correctNorm.includes(item)) &&
          correctNorm.every(item => selectedNorm.includes(item));

        setIsCorrect(allCorrect);
        setShowAnswer(true);

        sessionStorage.setItem("hasAnswered", "true");
        sessionStorage.setItem("isRevealed", "true");
      }
    } catch (error) {
      console.error("❌ Could not restore previous answer:", error);
    }
  }, [submittedResult, answerArray, questionId]);


  const handleTabChange = (_event, newValue) => setActiveTab(newValue);
  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedOptions((prev) =>
      prev.includes(value)
        ? prev.filter((opt) => opt !== value)
        : [...prev, value]
    );
  };


  const allOptionValues = useMemo(() => mcqoptions.map((o) => o.option), [mcqoptions]);
  const allSelected =
    allOptionValues.length > 0 && selectedOptions.length === allOptionValues.length;

  const handleSelectAllToggle = () => {
    if (showAnswer) return;
    setSelectedOptions((prev) =>
      prev.length === allOptionValues.length ? [] : allOptionValues
    );
  };

  const handleReveal = () => {
    // ✅ BLOCK if already submitted
    if (selectedOptions.length === 0) {
      setShowNotAnsweredModal(true);
      return;
    }

    const selectedNorm = selectedOptions.map((s) => (s ?? "").trim());
    const correctNorm = answerArray.map((s) => (s ?? "").trim());

    const allCorrect =
      selectedNorm.length === correctNorm.length &&
      selectedNorm.every((item) => correctNorm.includes(item)) &&
      correctNorm.every((item) => selectedNorm.includes(item));

    const userAnswerStr =
      selectedNorm.length > 0 ? selectedNorm.join(", ") : "No items selected";

    const mark = allCorrect ? Math.abs(marks) || 0 : 0;
    onSubmit?.(questionId, allCorrect, mark, userAnswerStr);

    const pathname = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const testId = searchParams.get('testId');

    //api call for submit Mock Test Question Response
    if (pathname === "/student/exam" && (testId || searchParams.get('mode') === 'question-bank')) {

      console.log("inside mock test response submitting");

      const payload = {
        questionId: question.id,
        questionType: question.question_type.toLowerCase(),
        exam_type: question.exam_type,
        test_id: testId, // Use the actual testId from URL
        selectedOptions,
      };
      dispatch(submitMockTestQuestionResponseThunk(payload));
    }

    setIsCorrect(allCorrect);
    setShowAnswer(true);

    sessionStorage.setItem("hasAnswered", "true");
    sessionStorage.setItem("isRevealed", "true");
  };

  const isCheckboxDisabled = showAnswer;

  // 🎨 Color Theme
  const colors = {
    correct: "#2E7D32",
    incorrect: "#C62828",
    heading: "#2E3760",
    neutral: "#475569",
  };

  return (
    <Box className="radio-container" sx={{
      px: { xs: 3, md: 5 },
      py: { xs: 3, md: 5 }
    }} >
      {/* Question */}
      <Typography
        component="div"
        fontWeight={700}
        sx={{
          textAlign: "left",
          alignItems: "center",
          wordBreak: "break-word",
          color: "#2e3760",
          fontSize: { xs: "1rem", md: "1.25rem" },
          mb: 1,
        }}
       dangerouslySetInnerHTML={{ __html: questionText || "" }} />

      {/* Exhibit */}
      {exhibit && (
        <img
          src={buildImageUrl(exhibit)}
          alt="Exhibit"
          style={{ maxWidth: "100%", marginBottom: "1rem", marginTop:"20px", borderRadius: 8, alignItems: "center" }}
        />
      )}

      {/* Instructions */}
      {instructions && (
        <>
          <Typography
            variant="h6"
            align="left"
            sx={{ mb: 1,mt:3, color: "text.primary", fontWeight: 600, fontSize: { xs: "0.9rem", md: "1rem" }, }}
          >
            Instructions :
          </Typography>
          <Typography
            component="div"
            sx={{
              color: "black",
              mb: 2,
              fontSize: { xs: "0.9rem", md: "1rem" },
              lineHeight: 1.6,
              wordBreak: "break-word",
              textAlign: "left"
            }}
           dangerouslySetInnerHTML={{ __html: instructions || "" }} />
        </>
      )}

      {/* Tabs Section */}
      {tabsInfo.length > 0 && (
        <>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2, px: 1 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{ sx: { display: "none" } }}
              sx={{
                "& .MuiTabs-flexContainer": { gap: 1 },
                "& .MuiTab-root": {
                  minHeight: 40,
                  borderRadius: "999px",
                  textTransform: "none",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  fontWeight: 500,
                  color: colors.neutral,
                  border: "1px solid #e6eaef",
                  "&.Mui-selected": {
                    color: "#fff",
                    backgroundColor: colors.heading,
                  },
                },
              }}
            >
              {tabsInfo.map((tab) => (
                <Tab key={tab.id || tab.tabKey} label={tab.tabKey} value={tab.tabKey} />
              ))}
            </Tabs>
          </Box>

          {(() => {
            const active = tabsInfo.find((t) => t.tabKey === activeTab) || tabsInfo[0];
            return (
              <Box
                sx={{
                  backgroundColor: "#eff1ffff",
                  borderRadius: "10px",
                  py: 2,
                  px: 3,
                  textAlign: "left"
                }}
              >
                <Typography component="div" sx={{ color: "#333", fontSize: "0.95rem" , wordBreak: "break-word", overflowWrap: "anywhere"}} dangerouslySetInnerHTML={{ __html: active?.tabValue || "No content available" }} />
                {active?.tabImage && (
                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <img
                      src={buildImageUrl(active.tabImage)}
                      alt="tab"
                      style={{ maxWidth: "100%", borderRadius: 8 }}
                    />
                  </Box>
                )}
              </Box>
            );
          })()}
        </>
      )}

      {/* Select All / Clear All */}
      <Box display="flex" gap={1} alignItems="center" mb={1} mt={3}>
        {/* <Button
          variant="outlined"
          size="small"
          onClick={handleSelectAllToggle}
          disabled={showAnswer || mcqoptions.length === 0}
        >
          {allSelected ? "Clear All" : "Select All"}
        </Button> */}
        <Typography variant="caption" sx={{ color: "#6b7280", fontSize: "15px" }}>
          You can select any number of options.
        </Typography>
      </Box>

      {/* Options */}
      <Box display="flex" flexDirection="column" alignItems="flex-start" gap={0.8}>
        {mcqoptions.map((optionObj, index) => {
          const optionText = optionObj.option;
          const isSelected = selectedOptions.includes(optionText);
          const isCorrectAnswer = answerArray.includes((optionText ?? "").trim());
          const showFeedback = showAnswer;

          const feedbackColor =
            showFeedback && isCorrectAnswer
              ? colors.correct
              : showFeedback && isSelected && !isCorrectAnswer
                ? colors.incorrect
                : "inherit";

          const feedbackIcon =
            showFeedback && isCorrectAnswer ? (
              <FaCheckCircle color={colors.correct} size={18} />
            ) : showFeedback && isSelected && !isCorrectAnswer ? (
              <FaTimesCircle color={colors.incorrect} size={18} />
            ) : null;

          return (
            <FormControlLabel
              key={optionObj.id || index}
              control={
                <Checkbox
                  checked={isSelected}
                  onChange={handleChange}
                  value={optionText}
                  disabled={isCheckboxDisabled}
                  icon={
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "10px",
                        border: "1px solid #cfcfcf",
                      }}
                    />
                  }
                  checkedIcon={
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "10px",
                        backgroundColor: colors.heading,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckIcon sx={{ color: "#fff", fontSize: 16 }} />
                    </Box>
                  }
                />
              }
              label={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      color: feedbackColor,
                      fontWeight: showFeedback && isCorrectAnswer ? 600 : "normal",
                      textAlign: "left",
                      fontSize: "0.95rem",
                    }}
                    dangerouslySetInnerHTML={{ __html: optionText || "" }}
                  />
                  {feedbackIcon}
                </Box>
              }
              sx={{ m: 0 }}
            />
          );
        })}
      </Box>

      {/* Reveal Button */}
      <Box display="flex" justifyContent="Center" mt={5}>
        <Button variant="contained" className="reveal-btn" onClick={handleReveal}>
          Reveal Answer
        </Button>
      </Box>


      {showNotAnsweredModal && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          wordBreak: "break-word",
            zIndex: 9999,
          }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              padding: 3,
              borderRadius: "12px",
              width: "90%",
              maxWidth: 400,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                mb: 3,
                fontSize: "1rem",
                fontWeight: 600,
                color: "#2e3760",
              }}
            >
              Please select at least one option before revealing the answer.
            </Typography>

            <Button
              variant="contained"
              onClick={() => setShowNotAnsweredModal(false)}
              sx={{ backgroundColor: "#2e3760" }}
            >
              OK
            </Button>
          </Box>
        </Box>
      )}


      {/* Reveal Results */}
      {showAnswer && (
        <Box sx={{ mt: 4 }}>

          {/* Summary */}
          <Typography
            variant="subtitle1"
            fontWeight={600}
            mt={2}
            mb={1}
            color={isCorrect ? colors.correct : colors.incorrect}
            display="flex"
            alignItems="center"
            gap={1}
          >
            {isCorrect ? (
              <>
                <FaCheckCircle color={colors.correct} size={20} /> Correct!
              </>
            ) : (
              <>
                <FaTimesCircle color={colors.incorrect} size={20} /> Incorrect
              </>
            )}
          </Typography>

          {/* Explanation */}
          {explanation.length > 0 && (
            <RevealAnswerComponent
              questionText={questionText}
              explanationHeading={explanation[0]?.heading || "Explanation"}
              explanationParagraphs={explanation.map((exp) => exp.explanation)}
              additionalInfoHeading="Additional Info"
              additionalInfoParagraphs={additionalInfo.map((info) => info.info)}
              additionalInfoImage={buildImageUrl(additionalInfo?.[0]?.image)}
              isAnswerCorrect={isCorrect}
              //for preventing result modal to display again if answered
              submittedResult={submittedResult}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default MCQQuestionComponent;
