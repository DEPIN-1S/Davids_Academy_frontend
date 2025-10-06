import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
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

  // Extract data from question prop
  const {
    id: questionId,
    question: questionText,
    dropdownquestiontext = [],
    tabsInfo = [],
    explanation = [],
  } = question || {};

  // Initialize dropdown values
  useEffect(() => {
    if (!dropdownquestiontext.length) return;
    const initialValues = {};
    dropdownquestiontext.forEach((dt) => {
      if (dt?.id) {
        initialValues[dt.id] = "";
      }
    });
    setDropdownValues(initialValues);
  }, [dropdownquestiontext]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Keep activeTab within bounds when tabsInfo changes
  useEffect(() => {
    if (!tabsInfo || !tabsInfo.length) {
      setActiveTab(0);
      return;
    }
    setActiveTab((prev) => Math.min(prev, tabsInfo.length - 1));
  }, [tabsInfo]);

  // Handle dropdown selection
  const handleDropdownChange = (id) => (event) => {
    // Prevent changing answers after reveal
    if (showReveal) return;
    setDropdownValues((prev) => ({
      ...prev,
      [id]: event.target.value,
    }));
  };

  // Handle reveal (submission and show answers)
  const handleReveal = () => {
    // User answer: joined selected values
    const userAnswerStr = dropdownquestiontext
      .map((dt) => {
        const dropdownId = dt.id;
        return `${dt.dropdownField || "Option"}: ${
          dropdownValues[dropdownId] || "Not selected"
        }`;
      })
      .join(", ");

    // Correct answer: prefer backend-provided dt.dropdownanswer, fallback to an explicit option or first option
    const correctAnswerStr = dropdownquestiontext
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

    // Check correctness (compare selected value to backend dropdownanswer when available)
    const correctStatus = dropdownquestiontext.every((dt) => {
      const dropdownId = dt.id;
      const backendAnswer = dt.dropdownanswer;
      const fallbackVal =
        dt.dropdownoption?.find((opt) => opt.is_correct)?.dropdownValue ||
        dt.dropdownoption?.[0]?.dropdownValue;
      const correctVal = backendAnswer ?? fallbackVal;
      // compare as strings
      return String(dropdownValues[dropdownId]) === String(correctVal);
    });
    const mark = correctStatus ? question?.marks || 5 : 0;

    // Call onSubmit from ExamContainer if provided
    if (typeof onSubmit === "function") {
      onSubmit(questionId, correctStatus, mark, userAnswerStr);
    }

    // Set states for reveal
    setUserAnswer(userAnswerStr);
    setCorrectAnswer(correctAnswerStr);
    setIsCorrect(correctStatus);
    setShowReveal(true);
  };

  // Loading or no data state
  if (!question || !dropdownquestiontext.length) {
    return (
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography>No dropdown question data available</Typography>
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
          <Typography>Mark : {question?.marks || ""}</Typography>
          <Typography sx={{ textAlign: "center" }}>
            Difficulty : {question?.difficulty || ""}
          </Typography>
          <Typography sx={{ textAlign: "right" }}>
            Question Type : Dropdown
          </Typography>
        </Box>
      </Box>

      {/* Title */}
      <Typography
        variant="h6"
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

      {/* White card with centered pill tab and note box */}
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "1.5rem",
          padding: { xs: 3, md: 5 },
          margin: "1.5rem auto",
          maxWidth: 950,
          boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
        }}
      >
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
              color: "#6b7280",
              whiteSpace: "pre-line",
              fontSize: { xs: "0.95rem", md: "1rem" },
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
                    : `${"https://lunarsenterprises.com:8002"}${
                        tabsInfo[activeTab].tabImage
                      }`
                }
                alt="tab"
                style={{ maxWidth: "100%", borderRadius: 8 }}
              />
            </Box>
          )}
        </Box>
      </Box>

      {/* Big inline dropdown container like screenshot */}
      <Box sx={{ px: { xs: 2, md: 6 }, mb: 6 }}>
        <Box
          sx={{
            backgroundColor: "#f1f5f9",
            borderRadius: 2,
            p: { xs: 2, md: 3 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            gap: 2,
            minHeight: 64,
          }}
        >
          {/* Build inline content: label + select + spacer + label + select */}
          {dropdownquestiontext.map((dt, index) => {
            const id = dt.id || index;
            const label = dt.dropdownField || `Select ${index + 1}`;
            const options = dt.dropdownoption || [];

            return (
              <Box
                key={id}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { xs: "flex-start", md: "center" },
                  gap: 1,
                  width: { xs: "100%", md: "auto" },
                }}
              >
                <Typography sx={{ color: "#0f172a", mb: { xs: 1, md: 0 } }}>
                  {label}
                </Typography>
                <FormControl
                  size="small"
                  sx={{ width: { xs: "100%", md: "auto" } }}
                >
                  <Select
                    value={dropdownValues[id] || ""}
                    onChange={handleDropdownChange(id)}
                    disabled={showReveal}
                    displayEmpty
                    sx={{
                      minWidth: { xs: "100%", md: 140 },
                      width: { xs: "100%", md: "auto" },
                      height: 40,
                      borderRadius: "12px",
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      px: 1,
                      transition: "box-shadow 200ms",
                      "&.Mui-focused": {
                        boxShadow: "0 4px 12px rgba(47,59,108,0.08)",
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
            {dropdownquestiontext.map((dt, idx) => {
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
                <ListItem key={dropdownId ?? idx} disablePadding>
                  <ListItemText
                    primary={`${label}: ${userVal}`}
                    primaryTypographyProps={{
                      color: correct ? "green" : "red",
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
            color="#2E3760"
          >
            Correct Answer:
          </Typography>
          <List dense>
            {dropdownquestiontext.map((dt, idx) => {
              const dropdownId = dt.id;
              const label = dt.dropdownField || `Option ${idx + 1}`;
              const backendAnswer = dt.dropdownanswer;
              const fallbackVal =
                dt.dropdownoption?.find((opt) => opt.is_correct)
                  ?.dropdownValue || dt.dropdownoption?.[0]?.dropdownValue;
              const correctVal =
                backendAnswer ?? fallbackVal ?? "Not available";
              return (
                <ListItem key={dropdownId ?? idx} disablePadding>
                  <ListItemText primary={`${label}: ${correctVal}`} />
                </ListItem>
              );
            })}
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
