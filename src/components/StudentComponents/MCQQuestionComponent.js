import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import "../../styles/DashboardStyles/RadioButtonQuestionComponent.css";
import RevealAnswerComponent from "./RevealAnswerComponent";

const buildImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const clean = String(path).replace(/^\/+/, "");
  return `https://lunarsenterprises.com:6040/${clean}`;
};

const MCQQuestionComponent = ({ question, onSubmit }) => {
  const {
    id: questionId,
    question: questionText,
    mcqoptions = [],
    mcqAnswers = [],
    exhibit,
    explanation = [],
    additionalInfo = [],
    tabsInfo = [],
    marks = 0,
    instructions,
  } = question || {};

  const answerArray = Array.isArray(mcqAnswers)
    ? mcqAnswers.map((ans) => (ans.mcqAnswer ?? "").trim())
    : [];

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [activeTab, setActiveTab] = useState(
    tabsInfo && tabsInfo.length ? tabsInfo[0].tabKey : ""
  );

  useEffect(() => {
    if (tabsInfo && tabsInfo.length) setActiveTab(tabsInfo[0].tabKey);
  }, [tabsInfo]);

  const handleTabChange = (_event, newValue) => setActiveTab(newValue);

  // No cap: toggle freely
  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedOptions((prev) =>
      prev.includes(value) ? prev.filter((opt) => opt !== value) : [...prev, value]
    );
  };

  // Select All / Clear All
  const allOptionValues = useMemo(() => mcqoptions.map((o) => o.option), [mcqoptions]);
  const allSelected =
    allOptionValues.length > 0 && selectedOptions.length === allOptionValues.length;

  const handleSelectAllToggle = () => {
    if (showAnswer) return;
    setSelectedOptions((prev) =>
      prev.length === allOptionValues.length ? [] : allOptionValues
    );
  };

  const handleReveal = () => {
    const selectedArray = Array.from(selectedOptions || []);
    const correctAnswers = answerArray || [];

    const selectedNorm = selectedArray.map((s) => (s ?? "").trim());
    const correctNorm = correctAnswers.map((s) => (s ?? "").trim());

    const allCorrect =
      selectedNorm.length === correctNorm.length &&
      selectedNorm.every((item) => correctNorm.includes(item)) &&
      correctNorm.every((item) => selectedNorm.includes(item));

    const userAnswerStr =
      selectedNorm.length > 0 ? selectedNorm.join(", ") : "No items selected";

    const mark = allCorrect ? Math.abs(marks) || 0 : 0;
    onSubmit?.(questionId, allCorrect, mark, userAnswerStr);

    setIsCorrect(allCorrect);
    setShowAnswer(true);
  };

  const isCheckboxDisabled = showAnswer;

  return (
    <Box className="radio-container">
      {/* Question */}
      <Typography variant="body1" className="question-text" gutterBottom>
        {questionText}
      </Typography>

      {/* Exhibit */}
      {exhibit && (
        <img
          src={buildImageUrl(exhibit)}
          alt="Exhibit"
          style={{ maxWidth: "100%", marginBottom: "1rem", borderRadius: 8 }}
        />
      )}

      {/* Instructions */}
      {instructions && (
        <>
          <Typography variant="h6" align="left" component="h2" sx={{ mb: 1, color: "text.primary" }}>
            Instructions
          </Typography>
          <Typography
            sx={{
              textAlign: "left",
              color: "black",
              mb: 2,
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
            {instructions}
          </Typography>
        </>
      )}

      {/* Tabs */}
      {tabsInfo.length > 0 && (
        <>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2, px: 1, position: "relative" }}>
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
                  minWidth: 110,
                  borderRadius: "999px",
                  textTransform: "none",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  fontWeight: 500,
                  color: "#475569",
                  border: "1px solid #e6eaef",
                  padding: { xs: "7px 18px", md: "8px 24px" },
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
                <Tab key={tab.id || tab.tabKey} label={tab.tabKey} value={tab.tabKey} disableRipple />
              ))}
            </Tabs>
          </Box>

          {(() => {
            const active = tabsInfo.find((t) => t.tabKey === activeTab) || tabsInfo[0];
            return (
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
                <Typography align="left" variant="body1" sx={{ color: "#333" }}>
                  {active?.tabValue || "No content available"}
                </Typography>
                {active?.tabImage && (
                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <img
                      src={buildImageUrl(active.tabImage)}
                      alt="tab"
                      style={{ maxWidth: "100%", borderRadius: 8, height: "auto" }}
                    />
                  </Box>
                )}
              </Box>
            );
          })()}
        </>
      )}

      {/* Select All / Clear All */}
      <Box display="flex" gap={1} alignItems="center" mb={1}>
        <Button
          variant="outlined"
          size="small"
          onClick={handleSelectAllToggle}
          disabled={showAnswer || mcqoptions.length === 0}
        >
          {allSelected ? "Clear All" : "Select All"}
        </Button>
        <Typography variant="caption" sx={{ color: "#6b7280" }}>
          You can select any number of options.
        </Typography>
      </Box>

      {/* Options */}
      <Box className="radio-options" display="flex" flexDirection="column" alignItems="flex-start">
        {mcqoptions.map((optionObj, index) => (
          <FormControlLabel
            key={optionObj.id || index}
            control={
              <Checkbox
                checked={selectedOptions.includes(optionObj.option)}
                onChange={handleChange}
                value={optionObj.option}
                disabled={isCheckboxDisabled}
                icon={
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "10px",
                      border: "1px solid #cfcfcf",
                      boxSizing: "border-box",
                    }}
                  />
                }
                checkedIcon={
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "10px",
                      backgroundColor: "#2F3B6C",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckIcon sx={{ color: "#fff", fontSize: 16 }} />
                  </Box>
                }
              />
            }
            label={<span className="radio-label">{optionObj.option}</span>}
          />
        ))}
      </Box>

      {/* Reveal */}
      <Box display="flex" flexDirection="column" alignItems="flex-start" mt={2}>
        <Button variant="contained" className="reveal-btn" onClick={handleReveal}>
          Reveal Answer
        </Button>
      </Box>

      {showAnswer && (
        <Box sx={{ mt: 4 }} display="flex" flexDirection="column" alignItems="flex-start">
          <Typography variant="subtitle1" fontWeight={600} mb={1} color="#2E3760">
            Your Answers:
          </Typography>
          <List dense>
            {selectedOptions.length > 0 ? (
              selectedOptions.map((opt, idx) => {
                const isOptionCorrect = answerArray.includes((opt ?? "").trim());
                return (
                  <ListItem key={idx} disablePadding>
                    <ListItemText
                      primary={opt}
                      style={{ color: isOptionCorrect ? "green" : "red", fontWeight: 600 }}
                    />
                  </ListItem>
                );
              })
            ) : (
              <ListItem disablePadding>
                <ListItemText primary="No options selected" />
              </ListItem>
            )}
          </List>

          <Typography variant="subtitle1" fontWeight={600} mt={2} mb={1} color={isCorrect ? "green" : "red"}>
            {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
          </Typography>

          <Typography variant="subtitle1" fontWeight={600} mt={2} mb={1} color="#35b564ff">
            Correct Answers:
          </Typography>
          <List>
            {answerArray.length > 0 ? (
              answerArray.map((answerItem, index) => (
                <ListItem key={index}>
                  <ListItemText primary={answerItem} style={{ fontWeight: 600, color: "green" }} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="Answer not available" />
              </ListItem>
            )}
          </List>

          {explanation.length > 0 && (
            <RevealAnswerComponent
              questionText={questionText}
              explanationHeading={explanation[0]?.heading || "Explanation"}
              explanationParagraphs={explanation.map((exp) => exp.explanation)}
              additionalInfoHeading="Additional Info"
              additionalInfoParagraphs={additionalInfo.map((info) => info.info)}
              additionalInfoImage={buildImageUrl(additionalInfo?.[0]?.image)}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default MCQQuestionComponent;
