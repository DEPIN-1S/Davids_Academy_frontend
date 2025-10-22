import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  FormControl,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import RevealAnswerComponent from "./RevealAnswerComponent";

const DragDropQuestionComponent = ({ question, onSubmit }) => {
  const {
    id: questionId,
    question: questionText = "",
    branches = [],
    explanation = [],
    additionalInfo = [],
    marks = 0,
    difficulty = "",
    instructions = "",
    tabsInfo = [],
  } = question || {};

  // Build state to track every dropdown selection (one per branch)
  const [dropdownValues, setDropdownValues] = useState(
    branches.map(() => "")
  );
  const [showReveal, setShowReveal] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleDropdownChange = (index, value) => {
    if (showReveal) return;
    setDropdownValues((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Reveal logic
  const handleReveal = () => {
    const userAns = branches
      .map(
        (b, idx) =>
          `${b.headings}: ${dropdownValues[idx] || "Not selected"}`
      )
      .join("; ");
    const correctAns = branches
      .map((b) => `${b.headings}: ${b.drag_drop_answer}`)
      .join("; ");
    const correctStatus = branches.every(
      (b, idx) =>
        String(dropdownValues[idx]) === String(b.drag_drop_answer)
    );

    const mark = correctStatus ? marks : 0;

    if (typeof onSubmit === "function") {
      onSubmit(questionId, correctStatus, mark, userAns);
    }

    setUserAnswer(userAns);
    setCorrectAnswer(correctAns);
    setIsCorrect(correctStatus);
    setShowReveal(true);
  };

  if (!question || !branches.length) {
    return (
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography>No drag-drop question data available</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, md: 3 },
      }}
    >
      {/* Question Header Info */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography sx={{ color: "#666", fontSize: { xs: "0.875rem", md: "1rem" } }}>
          Difficulty: {difficulty}
        </Typography>
        <Typography sx={{ color: "#666", fontSize: { xs: "0.875rem", md: "1rem" } }}>
          Marks: {marks}
        </Typography>
      </Box>

      {/* Question Title */}
      <Typography
        variant="h6"
        component="h1"
        sx={{
          color: "#2F3B6C",
          fontWeight: 600,
          mb: 3,
          textAlign: "center",
          fontSize: { xs: "1rem", md: "1.25rem" },
        }}
      >
        {questionText}
      </Typography>

      {/* Instructions */}
      {!!instructions && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            component="h2"
            align="left"
            sx={{
              mb: 1,
              color: "text.primary",
              fontSize: { xs: "1rem", md: "1.25rem" },
            }}
          >
            Instructions
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "left",
              color: "black",
              fontSize: { xs: "0.9rem", md: "1rem" },
              lineHeight: 1.6,
            }}
          >
            {instructions}
          </Typography>
        </Box>
      )}

      {/* Tabs from tabsInfo */}
      {tabsInfo && tabsInfo.length > 0 && (
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: "1.5rem",
            padding: { xs: 2, sm: 3, md: 4 },
            mb: 4,
            boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{ sx: { display: "none" } }}
              sx={{
                minHeight: 42,
                "& .MuiTabs-flexContainer": { gap: 1 },
                "& .MuiTab-root": {
                  minHeight: 42,
                  minWidth: { xs: 90, md: 110 },
                  borderRadius: "999px",
                  textTransform: "none",
                  fontSize: { xs: "0.85rem", md: "1rem" },
                  fontWeight: 500,
                  color: "#475569",
                  border: "1px solid #e6eaef",
                  padding: { xs: "6px 14px", md: "8px 24px" },
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
                  key={tab.id || idx}
                  label={tab.tabKey}
                  value={idx}
                  disableRipple
                />
              ))}
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box
            sx={{
              backgroundColor: "#f3f4f6",
              borderRadius: 2,
              p: { xs: 2, md: 2.5 },
              minHeight: { xs: "auto", md: 56 },
            }}
          >
            <Typography
              sx={{
                color: "#374151",
                textAlign: "left",
                whiteSpace: "pre-line",
                fontSize: { xs: "0.9rem", md: "1rem" },
                lineHeight: 1.6,
              }}
            >
              {tabsInfo[activeTab]?.tabValue || ""}
            </Typography>
            {tabsInfo[activeTab]?.tabImage && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <img
                  src={
                    tabsInfo[activeTab].tabImage.startsWith("http")
                      ? tabsInfo[activeTab].tabImage
                      : `${process.env.REACT_APP_API_URL}${tabsInfo[activeTab].tabImage}`
                  }
                  alt={tabsInfo[activeTab].tabKey}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: 8,
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Main Grid with Center Container and Surrounding Dropdowns */}
      <Box sx={{ mb: 4 }}>
        <Grid
          container
          spacing={3}
          sx={{
            position: "relative",
            minHeight: { xs: "auto", sm: "35vh" },
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          {/* Left Side Dropdowns */}
          <Grid item xs={12} sm={4} md={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                height: "100%",
                justifyContent: "center",
                gap: 3,
              }}
            >
              {(() => {
                const remainingBranches = branches.slice(1);
                const n = remainingBranches.length;
                const split = Math.ceil(n / 2);
                const left = remainingBranches.slice(0, split);
                return left.map((b, idx) => {
                  const actualIndex = idx + 1;
                  return (
                    <Box key={`left-${b.id || idx}`}>
                      <Typography
                        sx={{
                          color: "#0f172a",
                          fontSize: { xs: "0.9rem", md: "1rem" },
                          fontWeight: 500,
                          mb: 1,
                          lineHeight: 1.4,
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        {b.headings}
                      </Typography>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={dropdownValues[actualIndex] || ""}
                          onChange={(e) =>
                            handleDropdownChange(actualIndex, e.target.value)
                          }
                          displayEmpty
                          disabled={showReveal}
                          sx={{
                            borderRadius: "12px",
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            fontSize: { xs: "0.9rem", md: "1rem" },
                            minHeight: 40,
                          }}
                        >
                          <MenuItem value="" disabled>
                            <em>Select</em>
                          </MenuItem>
                          {b.dragdropoption?.map((opt) => (
                            <MenuItem key={opt.id} value={opt.options_value}>
                              {opt.options_value}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  );
                });
              })()}
            </Box>
          </Grid>

          {/* Center Dropdown */}
          <Grid item xs={12} sm={4} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                justifyContent: "center",
                height: "100%",
              }}
            >
              {branches.length > 0 && (
                <Box>
                  <Typography
                    sx={{
                      color: "#0f172a",
                      fontSize: { xs: "0.9rem", md: "1rem" },
                      fontWeight: 500,
                      mb: 1,
                      textAlign: "center",
                      lineHeight: 1.4,
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {branches[0].headings}
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <Select
                      value={dropdownValues[0] || ""}
                      onChange={(e) => handleDropdownChange(0, e.target.value)}
                      displayEmpty
                      disabled={showReveal}
                      sx={{
                        borderRadius: "12px",
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        fontSize: { xs: "0.9rem", md: "1rem" },
                        minHeight: 40,
                      }}
                    >
                      <MenuItem value="" disabled>
                        <em>Select</em>
                      </MenuItem>
                      {branches[0].dragdropoption?.map((opt) => (
                        <MenuItem key={opt.id} value={opt.options_value}>
                          {opt.options_value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Right Side Dropdowns */}
          <Grid item xs={12} sm={4} md={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                height: "100%",
                justifyContent: "center",
                gap: 3,
              }}
            >
              {(() => {
                const remainingBranches = branches.slice(1);
                const n = remainingBranches.length;
                const split = Math.ceil(n / 2);
                const right = remainingBranches.slice(split);
                return right.map((b, idx) => {
                  const actualIndex = split + idx + 1;
                  return (
                    <Box key={`right-${b.id || idx}`}>
                      <Typography
                        sx={{
                          color: "#0f172a",
                          fontSize: { xs: "0.9rem", md: "1rem" },
                          fontWeight: 500,
                          mb: 1,
                          lineHeight: 1.4,
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        {b.headings}
                      </Typography>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={dropdownValues[actualIndex] || ""}
                          onChange={(e) =>
                            handleDropdownChange(actualIndex, e.target.value)
                          }
                          displayEmpty
                          disabled={showReveal}
                          sx={{
                            borderRadius: "12px",
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            fontSize: { xs: "0.9rem", md: "1rem" },
                            minHeight: 40,
                          }}
                        >
                          <MenuItem value="" disabled>
                            <em>Select</em>
                          </MenuItem>
                          {b.dragdropoption?.map((opt) => (
                            <MenuItem key={opt.id} value={opt.options_value}>
                              {opt.options_value}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  );
                });
              })()}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Reveal Answer Button */}
      <Box textAlign="center" mb={4}>
        <Button
          variant="contained"
          onClick={handleReveal}
          disabled={showReveal}
          sx={{
            backgroundColor: "#f4c300",
            color: "#000",
            fontWeight: 600,
            padding: { xs: "0.5rem 2rem", md: "0.6rem 2.5rem" },
            borderRadius: "10px",
            fontSize: { xs: "0.9rem", md: "1rem" },
            "&:hover": { backgroundColor: "#e0b000" },
            "&:disabled": {
              backgroundColor: "#e0e0e0",
              color: "#9e9e9e",
            },
          }}
        >
          Reveal Answer
        </Button>
      </Box>

      {/* Reveal Section */}
      {showReveal && (
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="subtitle1"
            component="h3"
            fontWeight={600}
            mb={1.5}
            color="#2E3760"
            sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}
          >
            Your Answer:
          </Typography>
          <Box
            sx={{
              backgroundColor: "#f9fafb",
              borderRadius: 2,
              p: 2,
              mb: 3,
            }}
          >
            {branches.map((b, idx) => {
              const selected = dropdownValues[idx] || "Not selected";
              const correct = String(b.drag_drop_answer || "");
              const isMatch = String(selected) === correct;
              return (
                <Box
                  key={b.id || idx}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    mb: 2,
                    pb: 2,
                    borderBottom:
                      idx < branches.length - 1
                        ? "1px solid #e5e7eb"
                        : "none",
                    gap: 2,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#333",
                      fontWeight: 500,
                      flex: "0 0 auto",
                      minWidth: { xs: "120px", sm: "150px" },
                      fontSize: { xs: "0.9rem", md: "1rem" },
                    }}
                  >
                    {b.headings}:
                  </Typography>
                  <Typography
                    sx={{
                      color: isMatch ? "green" : "red",
                      fontWeight: 600,
                      flex: 1,
                      fontSize: { xs: "0.9rem", md: "1rem" },
                    }}
                  >
                    {selected}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          <Typography
            variant="subtitle1"
            component="h3"
            fontWeight={600}
            mb={1.5}
            color="#24a129"
            sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}
          >
            Correct Answer:
          </Typography>
          <Box
            sx={{
              backgroundColor: "#f0fdf4",
              borderRadius: 2,
              p: 2,
              mb: 3,
            }}
          >
            {branches.map((b, idx) => (
              <Box
                key={b.id || idx}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  mb: 2,
                  pb: 2,
                  borderBottom:
                    idx < branches.length - 1 ? "1px solid #e5e7eb" : "none",
                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "#333",
                    fontWeight: 500,
                    flex: "0 0 auto",
                    minWidth: { xs: "120px", sm: "150px" },
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                >
                  {b.headings}:
                </Typography>
                <Typography
                  sx={{
                    color: "#16a34a",
                    fontWeight: 600,
                    flex: 1,
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                >
                  {b.drag_drop_answer}
                </Typography>
              </Box>
            ))}
          </Box>

          <Typography
            variant="subtitle1"
            component="h3"
            fontWeight={600}
            mb={2}
            color={isCorrect ? "green" : "red"}
            sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}
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
            additionalInfoImage={additionalInfo[0]?.image || null}
          />
        </Box>
      )}
    </Box>
  );
};

export default DragDropQuestionComponent;
