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
  Checkbox,
  Button,
} from "@mui/material";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../../styles/DashboardStyles/MultiRadioQuestionComponent.css";
import RevealAnswerComponent from "./RevealAnswerComponent";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { submitMockTestQuestionResponseThunk } from "../../features/exam/examSlice";
import { sanitizeExamHtml } from "../../utils/examHtml";



const MultiRadioQuestionComponent = ({ question, onSubmit, submittedResult }) => {

  const {
    id: questionId,
    question: questionText,
    multiradioHeading,
    tabsInfo = [],
    questionContent = [],
    radioOption = [],
    explanation = [],
    additionalInfo = [],
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

    const finding = questionContent[findingIndex];
    const expected = finding?.answer;
    const isMultiple = Array.isArray(expected) || (typeof expected === 'string' && expected.includes(','));

    setAnswers((prev) => {
      const current = prev[findingIndex];
      if (isMultiple) {
        let currentArray = [];
        if (Array.isArray(current)) {
          currentArray = current;
        } else if (typeof current === 'string') {
          currentArray = current.split(',').map(s => s.trim()).filter(Boolean);
        }

        if (currentArray.includes(selectedValue)) {
          return { ...prev, [findingIndex]: currentArray.filter(v => v !== selectedValue) };
        } else {
          return { ...prev, [findingIndex]: [...currentArray, selectedValue] };
        }
      } else {
        return { ...prev, [findingIndex]: selectedValue };
      }
    });
  };

  useEffect(() => {
    sessionStorage.setItem("hasAnswered", "false");
    sessionStorage.setItem("isRevealed", "false");
  }, [questionId])



  useEffect(() => {
    if (submittedResult?.result && submittedResult.answers?.length > 0) {
      try {


        const parsedAnswers = {};

        submittedResult.answers.forEach((ans) => {
          // Match backend "clientfindings" to frontend "client_findings"
          const matchedIndex = questionContent.findIndex(qc =>
            String(qc.client_findings).trim() === String(ans.clientfindings).trim()
          );

          if (matchedIndex !== -1 && ans.answer) {
            parsedAnswers[matchedIndex] = ans.answer;
          }
        });



        setAnswers(parsedAnswers);

        // Calculate overall correctness
        const normalize = (val) => {
          if (!val) return [];
          if (Array.isArray(val)) return val.map(v => String(v).trim()).sort();
          if (typeof val === 'string' && val.includes(',')) return val.split(',').map(v => String(v).trim()).sort();
          return [String(val).trim()];
        };

        const isFindingCorrect = (userAns, correctAns) => {
          const u = normalize(userAns);
          const c = normalize(correctAns);
          return u.length === c.length && u.every((v, i) => v === c[i]);
        };

        const correctStatus = questionContent.every((finding, idx) =>
          isFindingCorrect(parsedAnswers[idx], finding.answer)
        );

        setIsCorrect(correctStatus);
        setShowAnswer(true);

        sessionStorage.setItem("hasAnswered", "true");
        sessionStorage.setItem("isRevealed", "true");
      } catch (error) {
        console.error("Could not parse previous multi-radio answers:", error);
      }
    }
  }, [submittedResult, questionContent]);



  const handleReveal = () => {

    if (submittedResult?.result) return; // Already answered, block reveal/modal
    
    // Check that every question content row has an answer selected
    if (Object.keys(answers).length !== questionContent.length) {
      setShowNotAnsweredModal(true);
      return;
    }

    // Existing reveal logic below...
    const normalize = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val.map(v => String(v).trim()).sort();
      if (typeof val === 'string' && val.includes(',')) return val.split(',').map(v => String(v).trim()).sort();
      return [String(val).trim()];
    };

    const isFindingCorrect = (userAns, correctAns) => {
      const u = normalize(userAns);
      const c = normalize(correctAns);
      return u.length === c.length && u.every((v, i) => v === c[i]);
    };

    const correctStatus = questionContent.every(
      (finding, idx) => isFindingCorrect(answers[idx], finding.answer)
    );

    const mark = correctStatus ? question?.marks || 5 : 0;

    onSubmit?.(questionId, correctStatus, mark);

    setIsCorrect(correctStatus);
    setShowAnswer(true);

    const pathname = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const testId = searchParams.get('testId');

    if (pathname === "/student/exam" && (testId || searchParams.get('mode') === 'question-bank')) {


      const question_content_answers = questionContent.map((item, idx) => {
        const userAns = answers[idx];
        return {
          question_text: item.client_findings || `Question ${idx + 1}`,
          selected: Array.isArray(userAns) ? userAns.join(',') : (userAns || "")
        };
      });

      const payload = {
        questionId: question.id,
        questionType: question.question_type,
        exam_type: question.exam_type.toLowerCase(),
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
        px: { xs: 3, md: 5 },
        py: 5
      }}
    >

      <Typography
        component="div"
        className="q-stem q-html"
        fontWeight={700}
        sx={{
          textAlign: "left",
          alignItems: "center",
          mb: 5,
        }}
        dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(questionText) }}
      />

      {/* Tabs for Contextual Information */}
      {tabsInfo.length > 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
              textAlign: "left",
              position: "relative",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{
                sx: { display: "none" },
              }}
              sx={{
                minHeight: 42,
                "& .MuiTabs-flexContainer": {
                  gap: 1,
                },
                "& .MuiTab-root": {
                  minHeight: 42,
                  minWidth: 110,
                  borderRadius: "999px",
                  textTransform: "none",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  fontWeight: 500,
                  color: "#475569",
                  border: "1px solid #e6eaef",
                  padding: { xs: "7px 18px", md: "8px 24px" },
                  transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    backgroundColor: "#f8fafc",
                    borderColor: "#e6eaef",
                  },
                  "&.Mui-selected": {
                    color: "#fff",
                    fontWeight: 600,
                    backgroundColor: "#2e3760",
                    border: "1px solid #2e3760",
                    boxShadow: "0 6px 18px rgba(15,23,42,0.12)",
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
              backgroundColor: "rgba(34, 211, 238, 0.08)",
              borderRadius: "10px",
              py: { xs: 2 },
              px: { xs: 3 },

              minHeight: "100px",
            }}
          >
            <Typography
              component="div"
              variant="body1"
              className="q-html"
              sx={{
                color: "var(--sf-text-soft)",
                '& p': { margin: 0, marginBottom: '0.5em' },
                '& p:last-child': { marginBottom: 0 },
                '& *': { lineHeight: 1.6 },
              }}
              dangerouslySetInnerHTML={{
                __html: sanitizeExamHtml(
                  tabsInfo.find((tab) => tab.tabKey === activeTab)?.tabValue ||
                  "No content available"
                )
              }}
            />
            {(() => {
              const currentTab = tabsInfo.find((tab) => tab.tabKey === activeTab);
              return currentTab?.tabImage ? (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <img
                    src={
                      currentTab.tabImage.startsWith("http")
                        ? currentTab.tabImage
                        : `${process.env.REACT_APP_API_URL.replace('/davidsacademy', '')}/${currentTab.tabImage}`
                    }
                    alt="tab"
                    style={{
                      maxWidth: "100%",
                      borderRadius: 8,
                      height: "auto",
                    }}
                  />
                </Box>
              ) : null;
            })()}
          </Box>
        </>
      )}

      {/* Instructions */}
      {!!instructions && (
        <Box sx={{ pb: 2, py: 3 }}>
          <Typography variant="h6" component="h2" className="q-instructions-label" align="left" sx={{ mb: 1, fontWeight: 600 }}>
            Instructions
          </Typography>
          <Typography component="div" variant="body1" className="q-instructions q-html" sx={{ textAlign: "left" }} dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(instructions) }} />
        </Box>
      )}

      {/* Radio Table */}
      <Box sx={{ maxWidth: "950px", margin: "0 auto", mb: 4, mt: 3, overflowX: "auto" }}>
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
                <div dangerouslySetInnerHTML={{ __html: multiradioHeading || "" }} />
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
                  <div dangerouslySetInnerHTML={{ __html: answer || "" }} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {questionContent.map((finding, rowIdx) => (
              <TableRow key={rowIdx}>
                <TableCell sx={{ fontSize: "15px", color: "#333" }} >
                  <div dangerouslySetInnerHTML={{ __html: finding.client_findings || "" }} />
                </TableCell>
                {uniqueAnswers.map((answer, colIdx) => {
                  const expected = finding.answer;
                  const isMultiple = Array.isArray(expected) || (typeof expected === 'string' && expected.includes(','));
                  
                  const isSelected = isMultiple ? 
                    (Array.isArray(answers[rowIdx]) ? answers[rowIdx].includes(answer) : (typeof answers[rowIdx] === 'string' ? answers[rowIdx].split(',').includes(answer) : answers[rowIdx] === answer)) : 
                    (answers[rowIdx] === answer);

                  const normalizeAnswer = (a) => {
                    if (Array.isArray(a)) return a;
                    if (typeof a === 'string' && a.includes(',')) return a.split(',').map(s => s.trim());
                    return [a];
                  };
                  
                  const isCorrectAnswer = normalizeAnswer(finding.answer).includes(answer);

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
                        {isMultiple ? (
                          <Checkbox
                            checked={isSelected}
                            onChange={handleSelect(rowIdx, answer)}
                            disabled={showAnswer}
                            sx={{
                              "&.Mui-checked": { color: "#2F3B6C" },
                            }}
                          />
                        ) : (
                          <Radio
                            name={`row-${rowIdx}`}
                            checked={isSelected}
                            onChange={handleSelect(rowIdx, answer)}
                            disabled={showAnswer}
                            value={answer}
                            sx={{
                              "&.Mui-checked": { color: "#2F3B6C" },
                            }}
                          />
                        )}
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

        {showNotAnsweredModal && !submittedResult?.result && (
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
          <RevealAnswerComponent
            questionText={questionText}
            explanationHeading={explanation[0]?.heading || "Explanation"}
            explanationParagraphs={explanation.map((exp) => exp.explanation) || []}
            additionalInfoHeading="Additional Info"
            additionalInfoParagraphs={additionalInfo.map((info) => info.info) || []}
            additionalInfoImage={
              question.additionalInfo?.[0]?.image
                ? `${process.env.REACT_APP_API_URL.replace('/davidsacademy', '')}/${question.additionalInfo[0].image}`
                : null
            }
            isAnswerCorrect={isCorrect}
            //for preventing result modal to display again if answered
            submittedResult={submittedResult}
          />
        </Box>
      )}
    </Box>
  );
};

export default MultiRadioQuestionComponent;
