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
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
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

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedOptions((prev) =>
      prev.includes(value)
        ? prev.filter((opt) => opt !== value)
        : [...prev, value]
    );
  };

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
    const selectedNorm = selectedOptions.map((s) => (s ?? "").trim());
    const correctNorm = answerArray.map((s) => (s ?? "").trim());

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

  // 🎨 Color Theme
  const colors = {
    correct: "#2E7D32",
    incorrect: "#C62828",
    heading: "#2E3760",
    neutral: "#475569",
  };

  return (
    <Box className="radio-container" sx={{ textAlign: "left", px: 8 }}>
      {/* Question */}
      <Typography
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

      {/* Exhibit */}
      {exhibit && (
        <img
          src={buildImageUrl(exhibit)}
          alt="Exhibit"
          style={{ maxWidth: "100%", marginBottom: "1rem", borderRadius: 8, alignItems: "center" }}
        />
      )}

      {/* Instructions */}
      {instructions && (
        <>
          <Typography
            variant="h6"
            sx={{ mb: 1, color: colors.heading, fontSize: "1rem" }}
          >
            Instructions
          </Typography>
          <Typography
            sx={{
              color: "black",
              mb: 2,
              fontSize: { xs: "0.9rem", md: "1rem" },
              lineHeight: 1.6,
            }}
          >
            {instructions}
          </Typography>
        </>
      )}

      {/* Tabs Section */}
      {tabsInfo.length > 0 && (
        <>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2, px: 1 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{ sx: { display: "none" } }}
              sx={{
                "& .MuiTabs-flexContainer": { gap: 1 },
                "& .MuiTab-root": {
                  minHeight: 40,
                  borderRadius: "999px",
                  textTransform: "none",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  fontWeight: 500,
                  color: colors.neutral,
                  border: "1px solid #e6eaef",
                  "&.Mui-selected": {
                    color: "#fff",
                    backgroundColor: colors.heading,
                  },
                },
              }}
            >
              {tabsInfo.map((tab) => (
                <Tab key={tab.id || tab.tabKey} label={tab.tabKey} value={tab.tabKey} />
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
                  py: 2,
                  px: 3,
                  m: 2,
                }}
              >
                <Typography sx={{ color: "#333", fontSize: "0.95rem" }}>
                  {active?.tabValue || "No content available"}
                </Typography>
                {active?.tabImage && (
                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <img
                      src={buildImageUrl(active.tabImage)}
                      alt="tab"
                      style={{ maxWidth: "100%", borderRadius: 8 }}
                    />
                  </Box>
                )}
              </Box>
            );
          })()}
        </>
      )}

      {/* Select All / Clear All */}
      <Box display="flex" gap={1} alignItems="center" mb={1} mt={3}>
        <Button
          variant="outlined"
          size="small"
          onClick={handleSelectAllToggle}
          disabled={showAnswer || mcqoptions.length === 0}
        >
          {allSelected ? "Clear All" : "Select All"}
        </Button>
        <Typography variant="caption" sx={{ color: "#6b7280", fontSize: "15px" }}>
          You can select any number of options.
        </Typography>
      </Box>

      {/* Options */}
      <Box display="flex" flexDirection="column" alignItems="flex-start" gap={0.8}>
        {mcqoptions.map((optionObj, index) => {
          const optionText = optionObj.option;
          const isSelected = selectedOptions.includes(optionText);
          const isCorrectAnswer = answerArray.includes((optionText ?? "").trim());
          const showFeedback = showAnswer;

          const feedbackColor =
            showFeedback && isCorrectAnswer
              ? colors.correct
              : showFeedback && isSelected && !isCorrectAnswer
                ? colors.incorrect
                : "inherit";

          const feedbackIcon =
            showFeedback && isCorrectAnswer ? (
              <FaCheckCircle color={colors.correct} size={18} />
            ) : showFeedback && isSelected && !isCorrectAnswer ? (
              <FaTimesCircle color={colors.incorrect} size={18} />
            ) : null;

          return (
            <FormControlLabel
              key={optionObj.id || index}
              control={
                <Checkbox
                  checked={isSelected}
                  onChange={handleChange}
                  value={optionText}
                  disabled={isCheckboxDisabled}
                  icon={
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "10px",
                        border: "1px solid #cfcfcf",
                      }}
                    />
                  }
                  checkedIcon={
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "10px",
                        backgroundColor: colors.heading,
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
              label={
                <span
                  style={{
                    color: feedbackColor,
                    fontWeight: showFeedback && isCorrectAnswer ? 600 : "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "0.95rem",
                  }}
                >
                  {optionText}
                  {feedbackIcon}
                </span>
              }
              sx={{ m: 0 }}
            />
          );
        })}
      </Box>

      {/* Reveal Button */}
      <Box display="flex" justifyContent="Center" mt={2}>
        <Button variant="contained" className="reveal-btn" onClick={handleReveal}>
          Reveal Answer
        </Button>
      </Box>

      {/* Reveal Results */}
      {showAnswer && (
        <Box sx={{ mt: 4 }}>


          {/* Summary */}
          <Typography
            variant="subtitle1"
            fontWeight={600}
            mt={2}
            mb={1}
            color={isCorrect ? colors.correct : colors.incorrect}
            display="flex"
            alignItems="center"
            gap={1}
          >
            {isCorrect ? (
              <>
                <FaCheckCircle color={colors.correct} size={20} /> Correct!
              </>
            ) : (
              <>
                <FaTimesCircle color={colors.incorrect} size={20} /> Incorrect
              </>
            )}
          </Typography>



          {/* Explanation */}
          {explanation.length > 0 && (
            <RevealAnswerComponent
              questionText={questionText}
              explanationHeading={explanation[0]?.heading || "Explanation"}
              explanationParagraphs={explanation.map((exp) => exp.explanation)}
              additionalInfoHeading="Additional Info"
              additionalInfoParagraphs={additionalInfo.map((info) => info.info)}
              additionalInfoImage={buildImageUrl(additionalInfo?.[0]?.image)}
              isAnswerCorrect={isCorrect}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default MCQQuestionComponent;
