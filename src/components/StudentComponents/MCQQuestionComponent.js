import React, { useState, useEffect } from "react";
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
    marks,
    instructions
  } = question || {};

  const answerArray = Array.isArray(mcqAnswers)
    ? mcqAnswers.map((ans) => ans.mcqAnswer.trim())
    : [];

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
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

  const handleChange = (event) => {
    const value = event.target.value;
    if (selectedOptions.includes(value)) {
      setSelectedOptions(selectedOptions.filter((opt) => opt !== value));
    } else {
      if (selectedOptions.length < 3) {
        setSelectedOptions([...selectedOptions, value]);
      }
    }
  };

  const handleReveal = () => {
    const selectedArray = Array.from(selectedOptions || []);
    const correctAnswers = answerArray || [];

    // Normalize values for comparison
    const selectedNorm = selectedArray.map((s) => (s ?? "").trim());
    const correctNorm = correctAnswers.map((s) => (s ?? "").trim());

    // Check if selected items match the correct answers (order-insensitive)
    const allCorrect =
      selectedNorm.length === correctNorm.length &&
      selectedNorm.every((item) => correctNorm.includes(item)) &&
      correctNorm.every((item) => selectedNorm.includes(item));

    const userAnswerStr =
      selectedNorm.length > 0 ? selectedNorm.join(", ") : "No items selected";

    const mark = allCorrect ? Math.abs(marks) || 0 : 0;
    if (typeof onSubmit === "function")
      onSubmit(questionId, allCorrect, mark, userAnswerStr);

    setIsCorrect(allCorrect);
    setShowAnswer(true);
  };

  // Disable all checkboxes once answer revealed
  const isCheckboxDisabled = showAnswer;

  return (
    <Box className="radio-container">

      <Typography variant="body1" className="question-text" gutterBottom>
        {questionText}
      </Typography>
      {exhibit && (
        <img
          src={`https://lunarsenterprises.com:6040` + exhibit}
          alt="Exhibit"
          style={{ maxWidth: "100%", marginBottom: "1rem", borderRadius: 8 }}
        />
      )}
      {/* Instructions */}
      {instructions && (
        <>
          <Typography variant="h6" align="left" component="h2" sx={{ mb: 1, color: 'text.primary' }}>
            Instructions
          </Typography>
          <Typography
            sx={{
              textAlign: 'left',
              color: 'black',
              mb: 4,
              fontSize: { xs: '0.9rem', md: '1rem' },
            }}
          >
            {instructions}
          </Typography>
        </>
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
            <Typography align="left" variant="body1" sx={{ color: "#333" }}>
              {tabsInfo.find((tab) => tab.tabKey === activeTab)?.tabValue ||
                "No content available"}
            </Typography>
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
      <Box
        className="radio-options"
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
      >
        {mcqoptions.map((optionObj, index) => (
          <FormControlLabel
            key={optionObj.id || index}
            control={
              <Checkbox
                checked={selectedOptions.includes(optionObj.option)}
                onChange={handleChange}
                value={optionObj.option}
                disabled={
                  isCheckboxDisabled ||
                  (selectedOptions.length === 3 &&
                    !selectedOptions.includes(optionObj.option))
                }
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

      <Box display="flex" flexDirection="column" alignItems="flex-start" mt={2}>
        <Button
          variant="contained"
          className="reveal-btn"
          onClick={handleReveal}
        >
          Reveal Answer
        </Button>
      </Box>

      {showAnswer && (
        <Box
          sx={{ mt: 4 }}
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
        >
          <Typography
            variant="subtitle1"
            fontWeight={600}
            mb={1}
            color="#2E3760"
          >
            Your Answers:
          </Typography>
          <List dense>
            {selectedOptions.length > 0 ? (
              selectedOptions.map((opt, idx) => {
                const isOptionCorrect = answerArray.includes(opt.trim());
                return (
                  <ListItem key={idx} disablePadding>
                    <ListItemText
                      primary={opt}
                      style={{
                        color: isOptionCorrect ? "green" : "red",
                        fontWeight: 600,
                      }}
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

          <Typography
            variant="subtitle1"
            fontWeight={600}
            mt={2}
            mb={1}
            color={isCorrect ? "green" : "red"}
          >
            {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
          </Typography>

          <Typography
            variant="subtitle1"
            fontWeight={600}
            mt={2}
            mb={1}
            color="#35b564ff"
          >
            Correct Answers:
          </Typography>
          <List>
            {answerArray.length > 0 ? (
              answerArray.map((answerItem, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={answerItem}
                    style={{ fontWeight: 600, color: "green" }}
                  />
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
              additionalInfoImage={
                question.additionalInfo?.[0]?.image
                  ? `https://lunarsenterprises.com:6040/${question.additionalInfo[0].image}`
                  : null
              }

            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default MCQQuestionComponent;
