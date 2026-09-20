import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import RevealAnswerComponent from "./RevealAnswerComponent";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { submitMockTestQuestionResponseThunk } from "../../features/exam/examSlice";
import { sanitizeExamHtml } from "../../utils/examHtml";


const TableHighlightSelectComponent = ({ question, onSubmit, submittedResult }) => {
  // Extract data from question prop
  const {
    id: questionId,
    question: questionText,
    tableHeaders = {},
    tableFields = [],
    answer = [],
    explanation = [],
    additionalInfo = [],
    tabsInfo = [],
    instructions,
    marks,
  } = question || {};

  // State for selected right column items
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showReveal, setShowReveal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showNotAnsweredModal, setShowNotAnsweredModal] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();



  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setActiveTab(0);
    setShowReveal(false);
    sessionStorage.setItem("hasAnswered", "false");
    sessionStorage.setItem("isRevealed", "false");
  }, [questionId]);

  useEffect(() => {
    if (!tabsInfo || !tabsInfo.length) {
      setActiveTab(0);
      return;
    }
    setActiveTab((prev) => Math.min(prev, tabsInfo.length - 1));
  }, [tabsInfo]);

  useEffect(() => {
    if (!submittedResult?.result || !Array.isArray(submittedResult.answers)) return;
    try {
      const restored = new Set();

      // submittedResult.answers format: [{ leftColumn, rightColumn }]
      submittedResult.answers.forEach((ans) => {
        if (ans.rightColumn) {
          restored.add(ans.rightColumn);
        }
      });

      if (restored.size > 0) {
        setSelectedItems(restored);

        const selectedArray = Array.from(restored);
        const correctAnswers = answer || [];

        const allCorrect =
          selectedArray.length === correctAnswers.length &&
          selectedArray.every((item) => correctAnswers.includes(item)) &&
          correctAnswers.every((item) => selectedArray.includes(item));

        setIsCorrect(allCorrect);
        setShowReveal(true);
        sessionStorage.setItem("hasAnswered", "true");
        sessionStorage.setItem("isRevealed", "true");
        setShowNotAnsweredModal(false);
      }
    } catch (e) {
      console.error("Could not restore table highlight answers:", e);
    }
  }, [submittedResult, answer]);


  const handleTabChange = (_e, newVal) => setActiveTab(newVal);

  // Handle clicking right column items
  const handleRightColumnClick = (rightColumnValue) => {
    if (showReveal) return; // Prevent changes after reveal

    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rightColumnValue)) {
        newSet.delete(rightColumnValue);
      } else {
        newSet.add(rightColumnValue);
      }
      return newSet;
    });
  };

  // Handle reveal (submission and show answers)
  const handleReveal = () => {

    if (selectedItems.size === 0) {
      setShowNotAnsweredModal(true);
      return;
    }

    const selectedArray = Array.from(selectedItems);
    const correctAnswers = answer || [];

    // Check if selected items match the correct answers
    const allCorrect =
      selectedArray.length === correctAnswers.length &&
      selectedArray.every((item) => correctAnswers.includes(item)) &&
      correctAnswers.every((item) => selectedArray.includes(item));

    const userAnswerStr =
      selectedArray.length > 0 ? selectedArray.join(", ") : "No items selected";

    const mark = allCorrect ? Math.abs(marks) || 0 : 0;
    if (typeof onSubmit === "function")
      onSubmit(questionId, allCorrect, mark, userAnswerStr);

    setIsCorrect(allCorrect);
    setShowReveal(true);

    // ✅ API CALL - ONLY ON /student/exam?testId=XXX
    const pathname = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const testId = searchParams.get('testId');

    if (pathname === "/student/exam" && (testId || searchParams.get('mode') === 'question-bank')) {


      const answers = Array.from(selectedItems).map((rightColumnValue) => {
        const field = tableFields.find(f => f.rightColumn === rightColumnValue);
        return {
          leftColumn: field ? field.leftColumn : "",
          rightColumn: rightColumnValue
        };
      });

      const payload = {
        questionId: question.id,
        questionType: question.question_type,
        exam_type: question.exam_type.toLowerCase(),
        test_id: testId,
        answers,
      };

      dispatch(submitMockTestQuestionResponseThunk(payload));
    }


    sessionStorage.setItem("hasAnswered", "true");
    sessionStorage.setItem("isRevealed", "true");
  };

  // Loading or no data state
  if (!question || !tableFields || !tableFields.length || !tableHeaders) {
    return (
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography>No table data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      px: { xs: 3, md: 5 },
      py: { xs: 3, md: 5 }
    }} >

      {/* Header row */}
      {/* <Box sx={{ width: "100%", px: { xs: 2, md: 6 }, pt: 2, mb: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#6b7280",
          }}
        >
          <Typography>Mark : {marks || ""}</Typography>
          <Typography sx={{ textAlign: "center" }}>
            Difficulty : {difficulty || ""}
          </Typography>
          <Typography sx={{ textAlign: "right" }}>
            Question Type : Table Highlight
          </Typography>
        </Box>
      </Box> */}

      {/* Question Text */}
      <Typography
        component="div"
        variant="h6"
        fontWeight={700}
        className="q-stem q-html"
        sx={{
          textAlign: "left",
          alignItems: "center",
          pt: 3,
          mb: 1,
        }}
       dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(questionText) }} />

      {/* Instructions */}
      {instructions && (
        <Box sx={{ pb: 2, mb: 2, mt: 3 }}>
          <Typography
            variant="h6"
            component="h2"
            className="q-instructions-label"
            align="left"
            sx={{ mb: 1, fontWeight: 600 }}
          >
            Instructions
          </Typography>
          <Typography
            component="div"
            variant="body1"
            className="q-instructions q-html"
            sx={{
              textAlign: "left",
            }}
           dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(instructions) }} />
        </Box>
      )}

      {/* Tabs for Contextual Information */}
      {tabsInfo && tabsInfo.length > 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
              px: 1,
              position: "relative",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{ sx: { display: "none" } }}
              sx={{
                minHeight: 42,
                "& .MuiTabs-flexContainer": {
                  gap: 2,
                  alignItems: "center",
                },
                "& .MuiTab-root": {
                  minHeight: 42,
                  minWidth: 120,
                  borderRadius: "999px",
                  textTransform: "none",
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  fontWeight: 500,
                  color: "#334155",
                  backgroundColor: "#fff",
                  border: "1px solid #e6eaef",
                  padding: { xs: "8px 20px", md: "10px 26px" },
                  transition: "all 200ms cubic-bezier(0.4,0,0.2,1)",
                  "&:hover": {
                    backgroundColor: "#fafbfd",
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
              {tabsInfo.map((tab, idx) => (
                <Tab
                  label={tab.tabKey}
                  value={idx}
                  key={tab.id || idx}
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
                '& *': { lineHeight: 1.6 , wordBreak: "break-word", overflowWrap: "anywhere" },
              }}
              dangerouslySetInnerHTML={{
                __html: sanitizeExamHtml(tabsInfo[Math.min(activeTab, tabsInfo.length - 1)]?.tabValue || '')
              }}
            />
            {tabsInfo[Math.min(activeTab, tabsInfo.length - 1)]?.tabImage && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <img
                  src={
                    tabsInfo[Math.min(activeTab, tabsInfo.length - 1)].tabImage.startsWith("http")
                      ? tabsInfo[Math.min(activeTab, tabsInfo.length - 1)].tabImage
                      : `${process.env.REACT_APP_API_URL.replace('/davidsacademy', '')}/${tabsInfo[Math.min(activeTab, tabsInfo.length - 1)].tabImage}`
                  }
                  alt="tab"
                  style={{
                    maxWidth: "100%",
                    borderRadius: 8,
                    height: "auto",
                  }}
                />
              </Box>
            )}
          </Box>
        </>
      )}

      {/* Table Container */}
      <Box sx={{ mt: 4, mb: 4 }}>
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            borderRadius: "0.75rem",
            overflow: "hidden",
            maxWidth: { xs: "100%", md: 720 },
            margin: "0 auto",
            width: "100%",
          }}
        >
          <Table sx={{ width: "100%", tableLayout: { xs: "auto", md: "fixed" } }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#f1f5f9",
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#475569",
                    borderBottom: "1px solid #e2e8f0",
                    width: { xs: "auto", md: "50%" },
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: tableHeaders.leftHeader || "Category" }} />
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#475569",
                    borderBottom: "1px solid #e2e8f0",
                    width: { xs: "auto", md: "50%" },
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: tableHeaders.rightHeader || "Options" }} />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableFields.map((field, idx) => {
                const isSelected = selectedItems.has(field.rightColumn);
                const isCorrectAnswer =
                  showReveal && answer.includes(field.rightColumn);
                const isWrongSelection =
                  showReveal &&
                  isSelected &&
                  !answer.includes(field.rightColumn);

                return (
                  <TableRow
                    key={field.id || idx}
                    sx={{ backgroundColor: "transparent" }}
                  >
                    <TableCell
                      sx={{
                        color: "var(--sf-text-soft)",
                        borderBottom: "1px solid #e2e8f0",
                        padding: { xs: "12px", md: "16px" },
                        wordBreak: "break-word",
                      }}
                    >
                      <div className="q-html" dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(field.leftColumn) }} />
                    </TableCell>
                    <TableCell
                      onClick={() => handleRightColumnClick(field.rightColumn)}
                      sx={{
                        borderBottom: "1px solid #e2e8f0",
                        padding: { xs: "12px", md: "16px" },
                        cursor: showReveal ? "default" : "pointer",
                        backgroundColor: showReveal
                          ? isCorrectAnswer
                            ? "rgba(52, 211, 153, 0.18)"
                            : isWrongSelection
                              ? "rgba(251, 113, 133, 0.18)"
                              : "transparent"
                          : isSelected
                            ? "rgba(34, 211, 238, 0.18)"
                            : "transparent",
                        color: showReveal
                          ? isCorrectAnswer
                            ? "#34d399"
                            : isWrongSelection
                              ? "#fb7185"
                              : "var(--sf-text-soft)"
                          : isSelected
                            ? "#67e8f9"
                            : "var(--sf-text-soft)",
                        fontWeight: isSelected ? 600 : 400,
                        border:
                          isSelected && !showReveal
                            ? "2px solid #22d3ee"
                            : "none",
                        borderRadius: isSelected && !showReveal ? "8px" : "0",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": showReveal
                          ? {}
                          : {
                            backgroundColor: isSelected
                              ? "rgba(34, 211, 238, 0.28)"
                              : "rgba(34, 211, 238, 0.08)",
                            transform: "translateY(-1px)",
                          },
                      }}
                    >
                      <div className="q-html" dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(field.rightColumn) }} />
                      {isSelected && !showReveal && (
                        <Typography
                          component="span"
                          sx={{
                            ml: 1,
                            fontSize: "0.8rem",
                            color: "#67e8f9",
                            fontWeight: 500,
                          }}
                        >
                          ✓
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {showNotAnsweredModal && (
          <Box sx={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
            justifyContent: "center", alignItems: "center", zIndex: 9999,
          }}>
            <Box sx={{
              backgroundColor: "#fff", padding: 3, borderRadius: "12px",
              width: "90%", maxWidth: 400, textAlign: "center",
            }}>
              <Typography sx={{ mb: 3, fontWeight: 600, color: "#2e3760" }}>
                Please highlight at least one right column before revealing the answer.
              </Typography>
              <Button variant="contained" onClick={() => setShowNotAnsweredModal(false)} sx={{ backgroundColor: "#2e3760" }}>
                OK
              </Button>
            </Box>
          </Box>
        )}

      </Box>

      {/* Submit Button */}
      <Box textAlign="center" sx={{ mb: 4 }}>
        <Button
          variant="contained"
          onClick={handleReveal}
          sx={{
            backgroundColor: "#f4c300",
            color: "#000",
            fontWeight: 600,
            padding: { xs: "0.5rem 1.25rem", md: "0.6rem 2.5rem" },
            borderRadius: "10px",
            fontSize: { xs: "0.9rem", md: "1rem" },
            "&:hover": { backgroundColor: "#e0b000" },
          }}
        >
          Reveal Answer
        </Button>
      </Box>

      {/* Reveal Section */}
      {showReveal && (
        <Box sx={{ mt: 2, px: { xs: 2, md: 6 }, mb: 6 }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            mt={2}
            mb={1}
            color="#35b564ff"
          >
            Correct Answers
          </Typography>
          <List dense>
            {answer.length > 0 ? (
              answer.map((correctItem, idx) => (
                <ListItem key={idx} disablePadding sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={<div dangerouslySetInnerHTML={{ __html: correctItem || "" }} />}
                    primaryTypographyProps={{
                      sx: {
                        color: "green",
                        fontWeight: 500,
                      },
                    }}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem disablePadding sx={{ py: 0.5 }}>
                <ListItemText
                  primary="No correct answers available"
                  primaryTypographyProps={{
                    sx: { color: "#6b7280", fontStyle: "italic" },
                  }}
                />
              </ListItem>
            )}
          </List>

          <RevealAnswerComponent
            questionText={questionText}
            explanationHeading={explanation[0]?.heading || "Explanation"}
            explanationParagraphs={
              explanation.map((exp) => exp.explanation) || []
            }
            additionalInfoHeading="Additional Info"
            additionalInfoParagraphs={
              additionalInfo.map((info) => info.info) || []
            }
            additionalInfoImage={
              question.additionalInfo?.[0]?.image
                ? `${process.env.REACT_APP_API_URL.replace('/davidsacademy', '')}/${question.additionalInfo[0].image}`
                : null
            }
            isAnswerCorrect={isCorrect}
            submittedResult={submittedResult}
          />
        </Box>
      )}
    </Box>
  );
};

export default TableHighlightSelectComponent;
