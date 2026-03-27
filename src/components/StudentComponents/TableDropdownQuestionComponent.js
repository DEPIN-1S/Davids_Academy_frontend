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
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import RevealAnswerComponent from "./RevealAnswerComponent";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { submitMockTestQuestionResponseThunk } from "../../features/exam/examSlice";


const TableDropdownQuestionComponent = ({ question, onSubmit, submittedResult }) => {
  // Extract data from question prop
  const {
    id: questionId,
    question: questionText,
    tableHeaders = {},
    tableDropdownFields = [],
    tableDropdownAnswers = [],
    explanation = [],
    additionalInfo = [],
    tabsInfo = [],
    instructions,
    marks,
    difficulty,
  } = question || {};

  // Initialize dropdownValues state
  const [dropdownValues, setDropdownValues] = useState({});
  const [showReveal, setShowReveal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showNotAnsweredModal, setShowNotAnsweredModal] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();


  useEffect(() => {
    sessionStorage.setItem("hasAnswered", "false");
    sessionStorage.setItem("isRevealed", "false");
  }, [questionId])

  useEffect(() => {
    setActiveTab(0);
  }, [questionId]);


  useEffect(() => {
    if (!submittedResult?.result || !Array.isArray(submittedResult.answers)) return;
    const prev = submittedResult.answers; // [{rowlabel, answer}]
    const newDropdownValues = {};

    // For each field, find its saved answer by matching rowlabel ↔ fieldLabel
    tableDropdownFields.forEach((field) => {
      const match = prev.find(a => a.rowlabel === field.fieldLabel);
      if (match?.answer) {
        newDropdownValues[field.id] = match.answer;
      }
    });

    if (Object.keys(newDropdownValues).length > 0) {
      setDropdownValues(newDropdownValues);
      setShowReveal(true);

      // recompute correctness with same logic you already use
      const answersMap = tableDropdownAnswers.reduce((acc, ans) => {
        acc[ans.rowLabel] = ans.answer;
        return acc;
      }, {});
      const correctStatus = tableDropdownFields.every((field) => {
        const userValue = newDropdownValues[field.id];
        const correctValue = answersMap[field.fieldLabel];
        return userValue === correctValue;
      });
      setIsCorrect(correctStatus);

      sessionStorage.setItem("hasAnswered", "true");
      sessionStorage.setItem("isRevealed", "true");
      setShowNotAnsweredModal(false);
    }
  }, [submittedResult, tableDropdownFields, tableDropdownAnswers]);


  const handleTabChange = (_event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle dropdown change
  const handleDropdownChange = (fieldId) => (event) => {
    if (showReveal) return; // Prevent changes after reveal
    setDropdownValues((prev) => ({
      ...prev,
      [fieldId]: event.target.value,
    }));
  };

  // Handle reveal (submission and show answers) for table dropdown
  const handleReveal = () => {
    const allFilled =
      tableDropdownFields.length > 0 &&
      tableDropdownFields.every(
        (field) => dropdownValues[field.id] && dropdownValues[field.id] !== ""
      );

    if (!allFilled) {
      setShowNotAnsweredModal(true);
      return;
    }

    const answersMap = tableDropdownAnswers.reduce((acc, ans) => {
      acc[ans.rowLabel] = ans.answer;
      return acc;
    }, {});

    const correctStatus = tableDropdownFields.every((field) => {
      const userValue = dropdownValues[field.id];
      const correctValue = answersMap[field.fieldLabel];
      return userValue === correctValue;
    });

    const userAnswerStr = tableDropdownFields
      .map(
        (field) =>
          `${field.fieldLabel}: ${dropdownValues[field.id] || "Not selected"}`
      )
      .join(", ");

    const mark = correctStatus ? marks || 5 : 0;

    if (typeof onSubmit === "function") {
      onSubmit(questionId, correctStatus, mark, userAnswerStr);
    }

    setIsCorrect(correctStatus);
    setShowReveal(true);

    const pathname = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const testId = searchParams.get("testId");

    if (
      pathname === "/student/exam" &&
      (testId || searchParams.get("mode") === "question-bank")
    ) {


      // ✅ send in desired format: [{rowLabel, answer}]
      const tableDropdownAnswersPayload = tableDropdownFields.map((field) => ({
        rowLabel: field.fieldLabel,
        answer: dropdownValues[field.id] || "",
      }));

      const payload = {
        questionId: question.id,
        questionType: question.question_type,
        exam_type: question.exam_type.toLowerCase(),
        test_id: testId,
        tableDropdownAnswers: tableDropdownAnswersPayload,
      };

      dispatch(submitMockTestQuestionResponseThunk(payload));
    }

    sessionStorage.setItem("hasAnswered", "true");
    sessionStorage.setItem("isRevealed", "true");
  };


  // Loading or no data state
  if (!question || !tableDropdownFields.length) {
    return (
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography>No table dropdown question data available</Typography>
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
            Question Type : Table Dropdown
          </Typography>
        </Box>
      </Box> */}

      {/* Question Text */}
      <Typography
        variant="h6"
        sx={{
          color: "#2e3760",
          fontSize: { xs: "1rem", md: "1.25rem" },
          textAlign: "left",
          alignItems: "center",
        }} fontWeight={700} mb={5}
       dangerouslySetInnerHTML={{ __html: questionText || "" }} />

      {/* Instructions */}
      {instructions && (
        <Box sx={{ pb: 2, mb: 2 }}>
          <Typography
            variant="h6"
            component="h2"
            align="left"
            sx={{ mb: 1, color: "text.primary", fontWeight: 600, fontSize: { xs: "0.9rem", md: "1rem" }, }}
          >
            Instructions :
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "left",
              color: "black",
              fontSize: { xs: "0.9rem", md: "1rem" },
              lineHeight: 1.6,
            }}
           dangerouslySetInnerHTML={{ __html: instructions || "" }} />
        </Box>
      )}

      {/* Tabs for Contextual Information */}
      {tabsInfo.length > 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,

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
              backgroundColor: "#eff1ffff",
              borderRadius: "10px",
              py: { xs: 2 },
              px: { xs: 3 },

              minHeight: "100px",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "#333",
                // Clean spacing for Quill-generated <p> tags
                '& p': { margin: 0, marginBottom: '0.5em' },
                '& p:last-child': { marginBottom: 0 },
                '& *': { lineHeight: 1.6 , wordBreak: "break-word", overflowWrap: "anywhere" , wordBreak: "break-word", overflowWrap: "anywhere" },
              }}
              dangerouslySetInnerHTML={{
                __html:
                  tabsInfo[Math.min(activeTab, tabsInfo.length - 1)]?.tabValue ||
                  "No content available"
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
      <Box sx={{ mb: 4, mt: 4 }}>
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            borderRadius: "0.75rem",
            overflowX: "auto", overflowY: "hidden",
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
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    borderBottom: "1px solid #e2e8f0",
                    width: { xs: "auto", md: "60%" },
                    wordBreak: "break-word",
                      minWidth: { xs: "140px", sm: "auto" },
                  }}
                  dangerouslySetInnerHTML={{ __html: tableHeaders.leftHeader || "Category" }}
                />
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#475569",
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    borderBottom: "1px solid #e2e8f0",
                    width: { xs: "auto", md: "40%" },
                    wordBreak: "break-word",
                      minWidth: { xs: "140px", sm: "auto" },
                  }}
                  dangerouslySetInnerHTML={{ __html: tableHeaders.rightHeader || "Anticipated Order" }}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {tableDropdownFields.map((field, index) => {
                const userValue = dropdownValues[field.id];
                const correctAnswer = tableDropdownAnswers.find(
                  (a) => a.rowLabel === field.fieldLabel
                )?.answer;
                const isCorrectAnswer =
                  showReveal && userValue === correctAnswer;
                const isWrongAnswer =
                  showReveal && userValue && userValue !== correctAnswer;

                return (
                  <TableRow
                    key={field.id || index}
                    sx={{
                      "&:last-child td": { borderBottom: 0 },
                      backgroundColor: "white",
                    }}
                  >
                    <TableCell
                      sx={{
                        color: "#1f2937",
                        fontSize: { xs: "0.9rem", md: "1rem" },
                        borderBottom: "1px solid #e2e8f0",
                        wordBreak: "break-word",
                       minWidth: { xs: "140px", sm: "auto" }
                    }}
                    dangerouslySetInnerHTML={{ __html: field.fieldLabel || "" }}
                    />
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #e2e8f0",
                       minWidth: { xs: "140px", sm: "auto" }
                    }}
                    >
                      <Select
                        value={dropdownValues[field.id] || ""}
                        onChange={handleDropdownChange(field.id)}
                        disabled={showReveal}
                        displayEmpty
                        fullWidth
                        sx={{
                          fontSize: { xs: "0.9rem", md: "1rem" },
                          height: 40,
                          backgroundColor: showReveal
                            ? isCorrectAnswer
                              ? "#e6f4ea"
                              : isWrongAnswer
                                ? "#ffecec"
                                : "white"
                            : "white",
                          borderRadius: "12px",
                          border: "1px solid #e5e7eb",
                          ".MuiSelect-select": {
                            color: showReveal
                              ? isCorrectAnswer
                                ? "#1b7a3b"
                                : isWrongAnswer
                                  ? "#c0392b"
                                  : "#475569"
                              : "#475569",
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          },
                          "&.Mui-focused": {
                            borderColor: "#3b82f6",
                            boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                          },
                        }}
                      >
                        <MenuItem value="" sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                          <em>Select</em>
                        </MenuItem>
                        {field.dropdownOptions.map((option, optIndex) => (
                          <MenuItem
                            key={option || optIndex}
                            value={option}
                            sx={{
                              fontSize: { xs: "0.9rem", md: "1rem" },
                              color: "#475569",
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                            }}
                            dangerouslySetInnerHTML={{ __html: option || "" }}
                          />
                        ))}
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>


        {showNotAnsweredModal && (
          <Box sx={{
            position: "fixed",
            top: 0, left: 0,
            width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}>
            <Box sx={{
              backgroundColor: "#fff",
              padding: 3,
              borderRadius: "12px",
              width: "90%",
              maxWidth: 400,
              textAlign: "center",
            }}>
              <Typography sx={{ mb: 3, fontWeight: 600, color: "#2e3760" }}>
                Dropdown field must be filled before revealing the answer.
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
            mb={1}
            color="#2E3760"
          >
            Your Answer:
          </Typography>
          <List dense>
            {tableDropdownFields.map((field, idx) => {
              const userValue = dropdownValues[field.id] || "Not selected";
              const correctAnswer = tableDropdownAnswers.find(
                (a) => a.rowLabel === field.fieldLabel
              )?.answer;
              const isCorrect = userValue === correctAnswer;

              return (
                <ListItem key={field.id || idx} disablePadding>
                  <ListItemText
                    primary={<span dangerouslySetInnerHTML={{ __html: `${field.fieldLabel}: ${userValue}` }} />}
                    primaryTypographyProps={{
                      sx: {
                        color: isCorrect ? "green" : "red",
                        fontWeight: 500,
                      },
                    }}
                  />
                </ListItem>
              );
            })}
          </List>

          <Typography
            variant="subtitle1"
            fontWeight={600}
            mt={2}
            mb={1}
            color="#35b564ff"
          >
            Correct Answer:
          </Typography>
          <List dense>
            {tableDropdownAnswers.map((answer, idx) => (
              <ListItem key={idx} disablePadding>
                <ListItemText
                  primary={<span dangerouslySetInnerHTML={{ __html: `${answer.rowLabel}: ${answer.answer}` }} />}
                  primaryTypographyProps={{
                    sx: { color: "green", fontWeight: 500 },
                  }}
                />
              </ListItem>
            ))}
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

export default TableDropdownQuestionComponent;
