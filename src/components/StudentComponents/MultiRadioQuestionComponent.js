import React, { useState } from "react";
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
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import "../../styles/DashboardStyles/MultiRadioQuestionComponent.css";
import RevealAnswerComponent from "./RevealAnswerComponent";

const MultiRadioQuestionComponent = ({ question, onSubmit }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Extract data from question prop
  const {
    id: questionId,
    question: questionText,
    tabsInfo = [],
    clientfindings = [],
    radioOption = [],
    explanation = [],
    additionalInfo = [],
  } = question || {};

  const [activeTab, setActiveTab] = useState(tabsInfo[0]?.tabKey || "");
  const [answers, setAnswers] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle radio selection
  const handleSelect = (findingIndex, selectedValue) => () => {
    // Prevent changing answers after reveal
    if (showAnswer) return;
    setAnswers((prev) => ({ ...prev, [findingIndex]: selectedValue }));
  };

  // Handle answer submission and reveal
  const handleReveal = () => {
    // Map correct answers by finding ID
    const correctAnswersMap = clientfindings.reduce((acc, finding, idx) => {
      acc[idx] = finding.answer; // Use the 'answer' from clientfindings as correct
      return acc;
    }, {});

    const userAnswerStr = clientfindings
      .map(
        (finding, idx) =>
          `${finding.client_findings}: ${answers[idx] || "Not selected"}`
      )
      .join(", ");
    const correctAnswerStr = clientfindings
      .map(
        (finding, idx) =>
          `${finding.client_findings}: ${
            correctAnswersMap[idx] || "Not available"
          }`
      )
      .join(", ");

    // Compare user selections with correct answers
    const correctStatus = clientfindings.every(
      (finding, idx) => answers[idx] === correctAnswersMap[idx]
    );
    const mark = correctStatus ? question?.marks || 5 : 0;

    // Call onSubmit from ExamContainer
    onSubmit(questionId, correctStatus, mark, userAnswerStr);

    // Set states for reveal
    setUserAnswer(userAnswerStr);
    setCorrectAnswer(correctAnswerStr);
    setIsCorrect(correctStatus);
    setShowAnswer(true);
  };

  // Loading or no data state
  if (!question || !clientfindings.length || !radioOption.length) {
    return (
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography>No multi-radio question data available</Typography>
      </Box>
    );
  }

  // Get unique answers for columns
  const uniqueAnswers = [...new Set(radioOption.map((opt) => opt.answer))];

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
      <Typography variant="h6" fontWeight={700} textAlign="center" mb={2}>
        {questionText}
      </Typography>

      {/* Tabs for Contextual Information */}
      {tabsInfo.length > 0 && (
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
              backgroundColor: "#f8f9ff",
              borderRadius: "10px",
              padding: "1rem",
              mb: 4,
              minHeight: "100px",
            }}
          >
            <Typography variant="body1" sx={{ color: "#333" }}>
              {tabsInfo.find((tab) => tab.tabKey === activeTab)?.tabValue ||
                "No content available"}
            </Typography>
          </Box>
        </>
      )}

      {/* Radio Table */}
      <Box
        sx={{ maxWidth: "1000px", margin: "0 auto", mb: 4, overflowX: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  backgroundColor: "#2F3B6C",
                  color: "white",
                  fontSize: "16px",
                  padding: "16px 24px",
                  borderTopLeftRadius: "8px",
                }}
              >
                Client findings
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
                    padding: "16px 24px",
                    ...(colIdx === uniqueAnswers.length - 1 && {
                      borderTopRightRadius: "8px",
                    }),
                  }}
                >
                  {answer}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {clientfindings.map((finding, rowIdx) => (
              <TableRow
                key={finding.id || rowIdx}
                sx={{
                  backgroundColor: rowIdx % 2 === 0 ? "#f8f9fb" : "#ffffff",
                }}
              >
                <TableCell
                  sx={{
                    padding: "16px 24px",
                    fontSize: "15px",
                    color: "#333",
                  }}
                >
                  {finding.client_findings}
                </TableCell>
                {uniqueAnswers.map((answer, colIdx) => (
                  <TableCell
                    key={colIdx}
                    sx={{
                      textAlign: "center",
                      padding: "16px 24px",
                    }}
                  >
                    <Radio
                      checked={answers[rowIdx] === answer}
                      onChange={handleSelect(rowIdx, answer)}
                      disabled={showAnswer}
                      value={answer}
                      name={`finding-${rowIdx}-${colIdx}`}
                      sx={{
                        "&.Mui-checked": {
                          color: "#2F3B6C",
                        },
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Submit Button */}
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
            "&:hover": {
              backgroundColor: "#e0b000",
            },
          }}
        >
          Reveal Answer
        </Button>
      </Box>

      {/* Reveal Section */}
      {showAnswer && (
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            mt={2}
            mb={1}
            color="#2E3760"
          >
            Your Answer:
          </Typography>
          <List dense>
            {clientfindings.map((finding, idx) => {
              const userSelection = answers[idx] || "Not selected";
              const correctSelection = finding.answer;
              const isMatch = userSelection === correctSelection;
              return (
                <ListItem key={idx} disablePadding>
                  <ListItemText
                    primary={`${finding.client_findings}: ${userSelection}`}
                    sx={{
                      "& .MuiListItemText-primary": {
                        color: isMatch ? "green" : "red",
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
            mb={1}
            color="#24a129ff"
          >
            Correct Answer:
          </Typography>
          <List dense>
            {clientfindings.map((finding, idx) => (
              <ListItem key={idx} disablePadding>
                <ListItemText
                  primary={`${finding.client_findings}: ${finding.answer}`}
                  sx={{
                    "& .MuiListItemText-primary": {
                      color: "green",
                      fontWeight: 500,
                    },
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

          {/* Common RevealAnswerComponent for explanation and additional info */}
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
            additionalInfoImage={additionalInfo[0]?.image || null}
          />
        </Box>
      )}
    </Box>
  );
};

export default MultiRadioQuestionComponent;
