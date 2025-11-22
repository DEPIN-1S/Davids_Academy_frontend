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

const TableDropdownQuestionComponent = ({ question, onSubmit }) => {
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
  const [activeTab, setActiveTab] = useState(() =>
    tabsInfo && tabsInfo.length ? tabsInfo[0].tabKey : ""
  );

  useEffect(() => {
    if (tabsInfo && tabsInfo.length) setActiveTab(tabsInfo[0].tabKey);
  }, [tabsInfo]);

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
    // Build a map of correct answers keyed by rowLabel
    const answersMap = tableDropdownAnswers.reduce((acc, ans) => {
      acc[ans.rowLabel] = ans.answer;
      return acc;
    }, {});

    // Determine correctness: every field's selected value must match the correct answer
    const correctStatus = tableDropdownFields.every((field) => {
      const userValue = dropdownValues[field.id];
      const correctValue = answersMap[field.fieldLabel];
      return userValue === correctValue;
    });

    // Build a human-readable user answer string for submission/logging
    const userAnswerStr = tableDropdownFields
      .map(
        (field) =>
          `${field.fieldLabel}: ${dropdownValues[field.id] || "Not selected"}`
      )
      .join(", ");

    const mark = correctStatus ? marks || 5 : 0;

    // Call onSubmit from parent
    if (typeof onSubmit === "function") {
      onSubmit(questionId, correctStatus, mark, userAnswerStr);
    }

    setIsCorrect(correctStatus);
    setShowReveal(true);
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
    <Box sx={{ width: "100%", px: 8, }}>
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
            Question Type : Table Dropdown
          </Typography>
        </Box>
      </Box>

      {/* Question Text */}
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{
          textAlign: "left",
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
            textAlign: "left",
            color: "#4b5563",
            mb: 4,
            fontSize: { xs: "0.9rem", md: "1rem" },
          }}
        >
          {instructions}
        </Typography>
      )}

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
                // Clean spacing for Quill-generated <p> tags
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
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    borderBottom: "1px solid #e2e8f0",
                  }}
                  width="60%"
                >
                  {tableHeaders.leftHeader || "Category"}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#475569",
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    borderBottom: "1px solid #e2e8f0",
                  }}
                  width="40%"
                >
                  {tableHeaders.rightHeader || "Anticipated Order"}
                </TableCell>
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
                      }}
                      width="60%"
                    >
                      {field.fieldLabel}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #e2e8f0",
                      }}
                      width="40%"
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
                          },
                          "&.Mui-focused": {
                            borderColor: "#3b82f6",
                            boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                          },
                        }}
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        {field.dropdownOptions.map((option, optIndex) => (
                          <MenuItem
                            key={option || optIndex}
                            value={option}
                            sx={{
                              fontSize: { xs: "0.9rem", md: "1rem" },
                              color: "#475569",
                            }}
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
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
                    primary={`${field.fieldLabel}: ${userValue}`}
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
                  primary={`${answer.rowLabel}: ${answer.answer}`}
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

export default TableDropdownQuestionComponent;
