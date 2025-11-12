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
  const [userAnswer, setUserAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSelect = (findingIndex, selectedValue) => () => {
    if (showAnswer) return;
    setAnswers((prev) => ({ ...prev, [findingIndex]: selectedValue }));
  };

  const handleReveal = () => {
    const correctAnswersMap = questionContent.reduce((acc, finding, idx) => {
      acc[idx] = finding.answer;
      return acc;
    }, {});

    const userAnswerStr = questionContent
      .map(
        (finding, idx) =>
          `${finding.client_findings}: ${answers[idx] || "Not selected"}`
      )
      .join(", ");

    const correctAnswerStr = questionContent
      .map(
        (finding, idx) =>
          `${finding.client_findings}: ${correctAnswersMap[idx] || "Not available"}`
      )
      .join(", ");

    const correctStatus = questionContent.every(
      (finding, idx) => answers[idx] === correctAnswersMap[idx]
    );
    const mark = correctStatus ? question?.marks || 5 : 0;

    onSubmit?.(questionId, correctStatus, mark, userAnswerStr);

    setUserAnswer(userAnswerStr);
    setCorrectAnswer(correctAnswerStr);
    setIsCorrect(correctStatus);
    setShowAnswer(true);
  };

  if (!question) {
    return (
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography>No multi-radio question data available</Typography>
      </Box>
    );
  }

  // Use options for column headers (matches your data shape in the view)
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
              value={activeTab || tabsInfo[0]?.tabKey || false}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{ sx: { display: "none" } }}
              sx={{
                minHeight: 42,
                "& .MuiTabs-flexContainer": { gap: 1 },
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
                  "&:hover": { backgroundColor: "#f8fafc", borderColor: "#e6eaef" },
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
            <Typography
              variant="body1"
              sx={{
                color: "#333",
                textAlign: "left",
                // Fix Quill <p> spacing for clean line breaks
                '& p': { margin: 0, marginBottom: '0.5em' },
                '& p:last-child': { marginBottom: 0 },
                '& *': { lineHeight: 1.6 },
              }}
              dangerouslySetInnerHTML={{
                __html:
                  tabsInfo.find((tab) => tab.tabKey === activeTab)?.tabValue ||
                  "No content available"
              }}
            />

            {tabsInfo[activeTab]?.tabImage && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <img
                  src={
                    tabsInfo[activeTab].tabImage.startsWith("http")
                      ? tabsInfo[activeTab].tabImage
                      : `${'https://lunarsenterprises.com:8002/'}${tabsInfo[activeTab].tabImage}`
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

      {/* Instructions with left-aligned heading */}
      {!!instructions && (
        <Box sx={{ pb: 2, py: 3 }}>
          <Typography variant="h6" component="h2" align="left" sx={{ mb: 1, color: "text.primary" }}>
            Instructions
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "left",
              color: "black",
              mb: 4,
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
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
                  padding: "16px 24px",
                  borderTopLeftRadius: "8px",
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
            {questionContent.map((finding, rowIdx) => (
              <TableRow
                key={finding.id || rowIdx}
                sx={{ backgroundColor: rowIdx % 2 === 0 ? "#f8f9fb" : "#ffffff" }}
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
                    sx={{ textAlign: "center", padding: "16px 24px" }}
                  >
                    <Radio
                      checked={answers[rowIdx] === answer}
                      onChange={handleSelect(rowIdx, answer)}
                      disabled={showAnswer}
                      value={answer}
                      name={`finding-${rowIdx}-${colIdx}`}
                      sx={{ "&.Mui-checked": { color: "#2F3B6C" } }}
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
            "&:hover": { backgroundColor: "#e0b000" },
          }}
        >
          Reveal Answer
        </Button>
      </Box>

      {/* Reveal Section */}
      {showAnswer && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} mt={2} mb={1} color="#2E3760">
            Your Answer:
          </Typography>
          <List dense>
            {questionContent.map((finding, idx) => {
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

          <Typography variant="subtitle1" fontWeight={600} mb={1} color="#24a129ff">
            Correct Answer:
          </Typography>
          <List dense>
            {questionContent.map((finding, idx) => (
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

          <RevealAnswerComponent
            questionText={questionText}
            explanationHeading={explanation[0]?.heading || "Explanation"}
            explanationParagraphs={explanation.map((exp) => exp.explanation) || []}
            additionalInfoHeading="Additional Info"
            additionalInfoParagraphs={additionalInfo.map((info) => info.info) || []}
            additionalInfoImage={
              question.additionalInfo?.[0]?.image
                ? `https://lunarsenterprises.com:8002/${question.additionalInfo[0].image}`
                : null
            }

          />
        </Box>
      )}
    </Box>
  );
};

export default MultiRadioQuestionComponent;
