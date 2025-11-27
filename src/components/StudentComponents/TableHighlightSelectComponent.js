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


const TableHighlightSelectComponent = ({ question, onSubmit }) => {
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
    difficulty,
  } = question || {};

  // State for selected right column items
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showReveal, setShowReveal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showNotAnsweredModal, setShowNotAnsweredModal] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();



  // Tabs state
  const [activeTab, setActiveTab] = useState(() =>
    tabsInfo && tabsInfo.length ? tabsInfo[0].tabKey : ""
  );

  useEffect(() => {
    sessionStorage.setItem("hasAnswered", "false");
    sessionStorage.setItem("isRevealed", "false");
  }, [questionId])

  useEffect(() => {
    if (tabsInfo && tabsInfo.length) setActiveTab(tabsInfo[0].tabKey);
  }, [tabsInfo]);

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

    if (pathname === "/student/exam" && (testId || searchParams.get('mode') === 'question-bank'))  {
      console.log("inside table highlight mock test response submitting");

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
        exam_type: question.exam_type,
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
    <Box sx={{ width: "100%" }}>
      {/* Header row */}
      <Box sx={{ width: "100%", px: { xs: 2, md: 6 }, pt: 2, mb: 1 }}>
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
      </Box>

      {/* Question Text */}
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{
          textAlign: "center",
          color: "#2e3760",
          pt: 3,
          fontSize: { xs: "1rem", md: "1.25rem" },
          mb: 1,
        }}
      >
        {questionText}
      </Typography>

      {/* Instructions */}
      {instructions && (
        <Typography
          sx={{
            textAlign: "center",
            color: "#4b5563",
            mb: 4,
            fontSize: { xs: "0.9rem", md: "1rem" },
          }}
        >
          {instructions}
        </Typography>
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
              py: { xs: 2 },
              px: { xs: 3 },
              m: 2,
              minHeight: "100px",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "#333",
                // Fix spacing for <p> tags from Quill
                '& p': { margin: 0, marginBottom: '0.5em' },
                '& p:last-child': { marginBottom: 0 },
                '& *': { lineHeight: 1.6 },
              }}
              dangerouslySetInnerHTML={{
                __html: tabsInfo.find((tab) => tab.tabKey === activeTab)?.tabValue || ''
              }}
            />
            {tabsInfo[activeTab]?.tabImage && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <img
                  src={
                    tabsInfo[activeTab].tabImage.startsWith("http")
                      ? tabsInfo[activeTab].tabImage
                      : `${'https://lunarsenterprises.com:6040/'}${tabsInfo[activeTab].tabImage}`
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
      <Box sx={{ px: { xs: 2, md: 6 }, mb: 4 }}>
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
          <Table sx={{ width: "100%", tableLayout: "fixed" }}>
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
                    width: "50%",
                  }}
                >
                  {tableHeaders.leftHeader || "Category"}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#475569",
                    borderBottom: "1px solid #e2e8f0",
                    width: "50%",
                  }}
                >
                  {tableHeaders.rightHeader || "Options"}
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
                    sx={{ backgroundColor: "white" }}
                  >
                    <TableCell
                      sx={{
                        color: "#1f2937",
                        borderBottom: "1px solid #e2e8f0",
                        padding: "16px",
                      }}
                    >
                      {field.leftColumn}
                    </TableCell>
                    <TableCell
                      onClick={() => handleRightColumnClick(field.rightColumn)}
                      sx={{
                        borderBottom: "1px solid #e2e8f0",
                        padding: "16px",
                        cursor: showReveal ? "default" : "pointer",
                        backgroundColor: showReveal
                          ? isCorrectAnswer
                            ? "#e6f4ea"
                            : isWrongSelection
                              ? "#ffecec"
                              : "white"
                          : isSelected
                            ? "#e3f2fd"
                            : "white",
                        color: showReveal
                          ? isCorrectAnswer
                            ? "#1b7a3b"
                            : isWrongSelection
                              ? "#c0392b"
                              : "#475569"
                          : isSelected
                            ? "#1565c0"
                            : "#475569",
                        fontWeight: isSelected ? 600 : 400,
                        border:
                          isSelected && !showReveal
                            ? "2px solid #1976d2"
                            : "none",
                        borderRadius: isSelected && !showReveal ? "8px" : "0",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": showReveal
                          ? {}
                          : {
                            backgroundColor: isSelected
                              ? "#bbdefb"
                              : "#f5f5f5",
                            transform: "translateY(-1px)",
                          },
                      }}
                    >
                      {field.rightColumn}
                      {isSelected && !showReveal && (
                        <Typography
                          component="span"
                          sx={{
                            ml: 1,
                            fontSize: "0.8rem",
                            color: "#1976d2",
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
                    primary={correctItem}
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
            explanationParagraphs={
              explanation.map((exp) => exp.explanation) || []
            }
            additionalInfoHeading="Additional Info"
            additionalInfoParagraphs={
              additionalInfo.map((info) => info.info) || []
            }
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

export default TableHighlightSelectComponent;
