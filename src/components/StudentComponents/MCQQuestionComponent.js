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
import "../../styles/DashboardStyles/RadioButtonQuestionComponent.css";
import RevealAnswerComponent from "./RevealAnswerComponent";

const MCQQuestionComponent = ({ question }) => {
  const {
    question: questionText,
    mcqoptions = [],
    mcqAnswers = [],
    exhibit,
    explanation = [],
    additionalInfo = [],
  } = question || {};

  const answerArray = Array.isArray(mcqAnswers)
    ? mcqAnswers.map((ans) => ans.mcqAnswer.trim())
    : [];

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

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
    if (selectedOptions.length === 0) {
      alert("Please select at least one option before revealing the answer.");
      return;
    }
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
                    style={{ fontWeight: 600 }}
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
