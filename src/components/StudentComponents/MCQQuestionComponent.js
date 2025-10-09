import React, { useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  List,
  ListItem,
  ListItemText,
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
    marks,
  } = question || {};

  const answerArray = Array.isArray(mcqAnswers)
    ? mcqAnswers.map((ans) => ans.mcqAnswer.trim())
    : [];

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

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
      {exhibit && (
        <img
          src={"https://lunarsenterprises.com:8002" + exhibit}
          alt="Exhibit"
          style={{ maxWidth: "100%", marginBottom: "1rem", borderRadius: 8 }}
        />
      )}
      <Typography variant="body1" className="question-text" gutterBottom>
        {questionText}
      </Typography>

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
              additionalInfoImage={additionalInfo[0]?.image || null}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default MCQQuestionComponent;
