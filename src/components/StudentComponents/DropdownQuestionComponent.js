import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import RevealAnswerComponent from "./RevealAnswerComponent";

const DropdownQuestionComponent = ({ question, onSubmit }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeTab, setActiveTab] = useState(0);
  const [dropdownValues, setDropdownValues] = useState({});
  const [showReveal, setShowReveal] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  const {
    id: questionId,
    question: questionText,
    dropdowns = [],
    tabsInfo = [],
    explanation = [],
    instructions,
  } = question || {};

  useEffect(() => {
    if (!dropdowns.length) return;
    const initialValues = {};
    dropdowns.forEach((dt) => {
      if (dt?.id) {
        initialValues[dt.id] = "";
      }
    });
    setDropdownValues(initialValues);
  }, [dropdowns]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (!tabsInfo || !tabsInfo.length) {
      setActiveTab(0);
      return;
    }
    setActiveTab((prev) => Math.min(prev, tabsInfo.length - 1));
  }, [tabsInfo]);

  const handleDropdownChange = (id) => (event) => {
    if (showReveal) return;
    setDropdownValues((prev) => ({
      ...prev,
      [id]: event.target.value,
    }));
  };

  const handleReveal = () => {
    const userAnswerStr = dropdowns
      .map((dt) => {
        const dropdownId = dt.id;
        return `${dt.dropdownField || "Option"}: ${dropdownValues[dropdownId] || "Not selected"
          }`;
      })
      .join(", ");

    const correctAnswerStr = dropdowns
      .map((dt) => {
        const backendAnswer = dt.dropdownanswer;
        const fallbackOpt =
          dt.dropdownoption?.find((opt) => opt.is_correct) ||
          dt.dropdownoption?.[0];
        const correctDisplay =
          backendAnswer ?? fallbackOpt?.dropdownValue ?? "Not available";
        return `${dt.dropdownField || "Option"}: ${correctDisplay}`;
      })
      .join(", ");

    const correctStatus = dropdowns.every((dt) => {
      const dropdownId = dt.id;
      const backendAnswer = dt.dropdownanswer;
      const fallbackVal =
        dt.dropdownoption?.find((opt) => opt.is_correct)?.dropdownValue ||
        dt.dropdownoption?.[0]?.dropdownValue;
      const correctVal = backendAnswer ?? fallbackVal;
      return String(dropdownValues[dropdownId]) === String(correctVal);
    });
    const mark = correctStatus ? question?.marks || 5 : 0;

    if (typeof onSubmit === "function") {
      onSubmit(questionId, correctStatus, mark, userAnswerStr);
    }

    setUserAnswer(userAnswerStr);
    setCorrectAnswer(correctAnswerStr);
    setIsCorrect(correctStatus);
    setShowReveal(true);
  };

  if (!question || !dropdowns.length) {
    return (
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography>No dropdown question data available</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 950,
        margin: "0 auto",
        px: { xs: 2, sm: 3, md: 0 },
      }}
    >
      {/* Header row */}
      <Box sx={{ width: "100%", pt: 2, mb: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#6b7280",
          }}
        >
          <Typography sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
            Difficulty: {question?.difficulty || ""}
          </Typography>
        </Box>
      </Box>

      {/* Title */}
      <Typography
        variant="h6"
        component="h1"
        fontWeight={700}
        mb={2}
        sx={{
          textAlign: "center",
          color: "#2e3760",
          pt: 3,
          fontSize: { xs: "1rem", md: "1.25rem" },
        }}
      >
        {questionText}
      </Typography>

      {/* Instructions with left-aligned heading */}
      {!!instructions && (
        <Box sx={{ pb: 2, mb: 2 }}>
          <Typography
            variant="h6"
            component="h2"
            align="left"
            sx={{ mb: 1, color: "text.primary", fontSize: { xs: "1rem", md: "1.25rem" } }}
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

      {/* White card with tabs and content */}
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "1.5rem",
          padding: { xs: 2, sm: 3, md: 4 },
          mb: 3,
          boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
        }}
      >
        {/* Tabs */}
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
            {tabsInfo?.map((tab, idx) => (
              <Tab
                key={tab.id || idx}
                label={tab.tabKey}
                value={idx}
                disableRipple
              />
            ))}
          </Tabs>
        </Box>

        {/* Tab Content - Left aligned */}
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
                    : `${process.env.BASE_URL}${tabsInfo[activeTab].tabImage}`
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
      </Box>

      {/* Dropdown container - Responsive with proper text wrapping */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            backgroundColor: "#f1f5f9",
            borderRadius: 2,
            p: { xs: 2, md: 3 },
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            gap: { xs: 2, md: 2.5 },
            minHeight: { xs: "auto", md: 64 },
          }}
        >
          {dropdowns.map((dt, index) => {
            const id = dt.id || index;
            const label = dt.dropdownField || `Select ${index + 1}`;
            const options = dt.dropdownoption || [];

            return (
              <Box
                key={id}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "flex-start" },
                  gap: { xs: 0.5, sm: 1.5 },
                  width: { xs: "100%", sm: "auto" },
                  flex: { xs: "1 1 100%", sm: "1 1 auto" },
                  minWidth: 0,
                }}
              >
                <Typography
                  sx={{
                    color: "#0f172a",
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    fontWeight: 500,
                    lineHeight: 1.4,
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    hyphens: "auto",
                    flex: { sm: "0 0 auto" },
                    maxWidth: { xs: "100%", sm: "250px", md: "300px" },
                    alignSelf: { sm: "center" },
                  }}
                >
                  {label}
                </Typography>
                <FormControl
                  size="small"
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    minWidth: { xs: "100%", sm: 160, md: 180 },
                    flex: { sm: "0 0 auto" },
                  }}
                >
                  <Select
                    value={dropdownValues[id] || ""}
                    onChange={handleDropdownChange(id)}
                    disabled={showReveal}
                    displayEmpty
                    sx={{
                      height: 40,
                      borderRadius: "12px",
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      fontSize: { xs: "0.9rem", md: "1rem" },
                      transition: "box-shadow 200ms",
                      "&.Mui-focused": {
                        boxShadow: "0 4px 12px rgba(47,59,108,0.08)",
                      },
                      "& .MuiSelect-select": {
                        py: 1,
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    {options.map((opt, oi) => (
                      <MenuItem
                        key={opt.id || oi}
                        value={opt.dropdownValue || `Option ${oi + 1}`}
                      >
                        {opt.dropdownValue || `Option ${oi + 1}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            );
          })}
        </Box>
      </Box>


      {/* Reveal Button */}
      <Box textAlign="center" sx={{ mb: 4 }}>
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
        <Box sx={{ mt: 4, mb: 6 }}>
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
          <List
            dense
            sx={{
              backgroundColor: "#f9fafb",
              borderRadius: 2,
              p: 2,
              mb: 3,
            }}
          >
            {dropdowns.map((dt, idx) => {
              const dropdownId = dt.id;
              const label = dt.dropdownField || `Option ${idx + 1}`;
              const userVal = dropdownValues[dropdownId] || "Not selected";
              const backendAnswer = dt.dropdownanswer;
              const fallbackVal =
                dt.dropdownoption?.find((opt) => opt.is_correct)
                  ?.dropdownValue || dt.dropdownoption?.[0]?.dropdownValue;
              const correctVal =
                backendAnswer ?? fallbackVal ?? "Not available";
              const correct = String(userVal) === String(correctVal);
              return (
                <ListItem key={dropdownId ?? idx} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemText
                    primary={`${label}: ${userVal}`}
                    primaryTypographyProps={{
                      color: correct ? "green" : "red",
                      fontWeight: 500,
                      fontSize: { xs: "0.9rem", md: "1rem" },
                    }}
                    sx={{ textAlign: "left" }}
                  />
                </ListItem>
              );
            })}
          </List>

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
          <List
            dense
            sx={{
              backgroundColor: "#f0fdf4",
              borderRadius: 2,
              p: 2,
              mb: 3,
            }}
          >
            {dropdowns.map((dt, idx) => {
              const dropdownId = dt.id;
              const label = dt.dropdownField || `Option ${idx + 1}`;
              const backendAnswer = dt.dropdownanswer;
              const fallbackVal =
                dt.dropdownoption?.find((opt) => opt.is_correct)
                  ?.dropdownValue || dt.dropdownoption?.[0]?.dropdownValue;
              const correctVal =
                backendAnswer ?? fallbackVal ?? "Not available";
              return (
                <ListItem key={dropdownId ?? idx} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemText
                    primary={`${label}: ${correctVal}`}
                    primaryTypographyProps={{
                      color: "#16a34a",
                      fontWeight: 500,
                      fontSize: { xs: "0.9rem", md: "1rem" },
                    }}
                    sx={{ textAlign: "left" }}
                  />
                </ListItem>
              );
            })}
          </List>

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
              (question.additionalInfo || []).map((a) => a.info) || []
            }
            additionalInfoImage={question.additionalInfo?.[0]?.image || null}
          />
        </Box>
      )}
    </Box>
  );
};

export default DropdownQuestionComponent;
