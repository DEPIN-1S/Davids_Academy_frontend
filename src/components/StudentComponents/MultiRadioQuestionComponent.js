import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Radio,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../../styles/DashboardStyles/MultiRadioQuestionComponent.css";
import RevealAnswerComponent from "./RevealAnswerComponent";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { submitMockTestQuestionResponseThunk } from "../../features/exam/examSlice";



const MultiRadioQuestionComponent = ({ question, onSubmit }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    id: questionId,
    question: questionText,
    multiradioHeading,
    tabsInfo = [],
    questionContent = [],
    radioOption = [],
    explanation = [],
    additionalInfo = [],
    marks,
    instructions,
  } = question || {};

  const [activeTab, setActiveTab] = useState(tabsInfo[0]?.tabKey || "");
  const [answers, setAnswers] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showNotAnsweredModal, setShowNotAnsweredModal] = useState(false);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const dispatch = useDispatch();
  const location = useLocation();
  const handleSelect = (findingIndex, selectedValue) => () => {
    if (showAnswer) return;
    setAnswers((prev) => ({ ...prev, [findingIndex]: selectedValue }));
  };

  useEffect(() => {
    sessionStorage.setItem("hasAnswered", "false");
    sessionStorage.setItem("isRevealed", "false");
  }, [questionId])

  const handleReveal = () => {
    if (Object.keys(answers).length === 0) {
      setShowNotAnsweredModal(true);
      return;
    }

    // Existing reveal logic below...
    const correctAnswersMap = questionContent.reduce((acc, finding, idx) => {
      acc[idx] = finding.answer;
      return acc;
    }, {});

    const correctStatus = questionContent.every(
      (finding, idx) => answers[idx] === correctAnswersMap[idx]
    );

    const mark = correctStatus ? question?.marks || 5 : 0;

    onSubmit?.(questionId, correctStatus, mark);

    setIsCorrect(correctStatus);
    setShowAnswer(true);

    const pathname = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const testId = searchParams.get('testId');

    if (pathname === "/student/exam" && (testId || searchParams.get('mode') === 'question-bank'))  {
      console.log("inside question content mock test response submitting");

      const question_content_answers = questionContent.map((item, idx) => ({
        question_text: item.client_findings || `Question ${idx + 1}`,
        selected: answers[idx] || ""
      }));

      const payload = {
        questionId: question.id,
        questionType: question.question_type,
        exam_type: question.exam_type,
        test_id: testId,
        question_content_answers,
      };

      dispatch(submitMockTestQuestionResponseThunk(payload));
    }
    sessionStorage.setItem("hasAnswered", "true");
    sessionStorage.setItem("isRevealed", "true");
  };


  if (!question) {
    return (
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography>No multi-radio question data available</Typography>
      </Box>
    );
  }

  const uniqueAnswers = [...new Set(radioOption.map((opt) => opt.options))];

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "1.5rem",
        padding: "2rem",
        margin: "2rem auto",
        maxWidth: "950px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
      }}
    >
      {/* Question Text */}
      <Typography variant="h6" component="h1" fontWeight={700} textAlign="center" mb={2}>
        {questionText}
      </Typography>

      {/* Tabs */}
      {tabsInfo.length > 0 && (
        <>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Tabs
              value={activeTab || tabsInfo[0]?.tabKey || false}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{ sx: { display: "none" } }}
              sx={{
                "& .MuiTab-root": {
                  borderRadius: "999px",
                  textTransform: "none",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  fontWeight: 500,
                  color: "#475569",
                  border: "1px solid #e6eaef",
                  "&.Mui-selected": {
                    color: "#fff",
                    backgroundColor: "#2e3760",
                  },
                },
              }}
            >
              {tabsInfo.map((tab) => (
                <Tab
                  label={tab.tabKey}
                  value={tab.tabKey}
                  key={tab.id || tab.tabKey}
                  disableRipple
                />
              ))}
            </Tabs>
          </Box>

          <Box
            sx={{
              backgroundColor: "#f8f9ff",
              borderRadius: "10px",
              padding: "1rem",
              mb: 4,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "#333",
                textAlign: "left",
                "& p": { margin: 0, marginBottom: "0.5em" },
                "& p:last-child": { marginBottom: 0 },
                "& *": { lineHeight: 1.6 },
              }}
              dangerouslySetInnerHTML={{
                __html:
                  tabsInfo.find((tab) => tab.tabKey === activeTab)?.tabValue ||
                  "No content available",
              }}
            />
          </Box>
        </>
      )}

      {/* Instructions */}
      {!!instructions && (
        <Box sx={{ pb: 2, py: 3 }}>
          <Typography variant="h6" component="h2" align="left" sx={{ mb: 1, color: "text.primary" }}>
            Instructions
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "left", color: "black" }}>
            {instructions}
          </Typography>
        </Box>
      )}

      {/* Radio Table */}
      <Box sx={{ maxWidth: "1000px", margin: "0 auto", mb: 4, overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  backgroundColor: "#2F3B6C",
                  color: "white",
                  fontSize: "16px",
                }}
              >
                {multiradioHeading}
              </TableCell>
              {uniqueAnswers.map((answer, colIdx) => (
                <TableCell
                  key={colIdx}
                  sx={{
                    fontWeight: 600,
                    textAlign: "center",
                    backgroundColor: "#2F3B6C",
                    color: "white",
                    fontSize: "16px",
                  }}
                >
                  {answer}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {questionContent.map((finding, rowIdx) => (
              <TableRow key={rowIdx}>
                <TableCell sx={{ fontSize: "15px", color: "#333" }}>
                  {finding.client_findings}
                </TableCell>
                {uniqueAnswers.map((answer, colIdx) => {
                  const isSelected = answers[rowIdx] === answer;
                  const isCorrectAnswer = finding.answer === answer;

                  const showCorrect =
                    showAnswer && isSelected && isCorrectAnswer;
                  const showWrong =
                    showAnswer && isSelected && !isCorrectAnswer;
                  const showMissed =
                    showAnswer && !isSelected && isCorrectAnswer;

                  const bgColor = showWrong
                    ? "#ffecec"
                    : showCorrect
                      ? "#e9f9ee"
                      : showMissed
                        ? "#e9f9ee"
                        : "transparent";

                  return (
                    <TableCell
                      key={colIdx}
                      sx={{
                        textAlign: "center",
                        padding: "12px 18px",
                        backgroundColor: bgColor,
                        borderRadius: "8px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.5,
                        }}
                      >
                        <Radio
                          checked={answers[rowIdx] === answer}
                          onChange={handleSelect(rowIdx, answer)}
                          disabled={showAnswer}
                          value={answer}
                          sx={{
                            "&.Mui-checked": { color: "#2F3B6C" },
                          }}
                        />
                        {showAnswer && (
                          <>
                            {showCorrect && (
                              <FaCheckCircle color="#16a34a" size={18} />
                            )}
                            {showWrong && (
                              <FaTimesCircle color="#dc2626" size={18} />
                            )}
                            {showMissed && (
                              <FaCheckCircle color="#16a34a" size={18} />
                            )}
                          </>
                        )}
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
                Please select any of the options before revealing.
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

      </Box>

      {/* Reveal Button */}
      <Box textAlign="center">
        <Button
          variant="contained"
          onClick={handleReveal}
          sx={{
            backgroundColor: "#f4c300",
            color: "#000",
            fontWeight: 600,
            padding: "0.6rem 2.5rem",
            borderRadius: "10px",
            "&:hover": { backgroundColor: "#e0b000" },
          }}
        >
          Reveal Answer
        </Button>
      </Box>

      {/* Reveal Explanation */}
      {showAnswer && (
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            mt={2}
            mb={1}
            color={isCorrect ? "green" : "red"}
          >
            {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
          </Typography>

          <RevealAnswerComponent
            questionText={questionText}
            explanationHeading={explanation[0]?.heading || "Explanation"}
            explanationParagraphs={explanation.map((exp) => exp.explanation) || []}
            additionalInfoHeading="Additional Info"
            additionalInfoParagraphs={additionalInfo.map((info) => info.info) || []}
            additionalInfoImage={
              question.additionalInfo?.[0]?.image
                ? `https://lunarsenterprises.com:6040/${question.additionalInfo[0].image}`
                : null
            }
            isAnswerCorrect={isCorrect}
          />
        </Box>
      )}
    </Box>
  );
};

export default MultiRadioQuestionComponent;
