import React, { useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import '../../styles/DashboardStyles/RadioButtonQuestionComponent.css';
import RevealAnswerComponent from './RevealAnswerComponent';

const MCQQuestionComponent = ({ question }) => {
  const {
    question: questionText,
    mcqoptions = [],
    answer: propAnswer,
    exhibit,
    explanation = [],
    additionalInfo = [],
  } = question || {};

  // Always treat answer as array
  const answer = Array.isArray(propAnswer) ? propAnswer : [propAnswer];

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleChange = (event) => {
    const value = event.target.value;
    if (selectedOptions.includes(value)) {
      setSelectedOptions(selectedOptions.filter((opt) => opt !== value));
    } else {
      if (selectedOptions.length < 3) { // Max 3 options selectable
        setSelectedOptions([...selectedOptions, value]);
      }
      // else do nothing; extra checkboxes are not selectable
    }
  };

  const handleReveal = () => {
    if (selectedOptions.length === 0) {
      alert('Please select at least one option before revealing the answer.');
      return;
    }
    setShowAnswer(true);
  };

  // Checking logic
  const sortedSelected = [...selectedOptions].sort();
  const sortedAnswer = [...answer].sort();
  const isCorrect =
    sortedSelected.length === sortedAnswer.length &&
    sortedSelected.every((val, index) => val === sortedAnswer[index]);

  return (
    <Box className="radio-container">
      {exhibit && (
        <img
          src={exhibit}
          alt="Exhibit"
          style={{ maxWidth: '100%', marginBottom: '1rem', borderRadius: 8 }}
        />
      )}
      <Typography variant="body1" className="question-text" gutterBottom>
        {questionText}
      </Typography>
      <Box className="radio-options">
        {mcqoptions.map((optionObj, index) => (
          <FormControlLabel
            key={optionObj.id || index}
            control={
              <Checkbox
                checked={selectedOptions.includes(optionObj.option)}
                onChange={handleChange}
                value={optionObj.option}
                // Disable if already 3 selected and this one isn't checked
                disabled={
                  selectedOptions.length === 3 &&
                  !selectedOptions.includes(optionObj.option)
                }
              />
            }
            label={<span className="radio-label">{optionObj.option}</span>}
          />
        ))}
      </Box>
      <Box className="reveal-btn-wrapper">
        <Button variant="contained" className="reveal-btn" onClick={handleReveal}>
          Reveal Answer
        </Button>
      </Box>
      {showAnswer && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} mb={1} color="#2E3760">
            Your Answers:
          </Typography>
          <List dense>
            {selectedOptions.length > 0 ? (
              selectedOptions.map((opt, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemText primary={opt} />
                </ListItem>
              ))
            ) : (
              <ListItem disablePadding>
                <ListItemText primary="No options selected" />
              </ListItem>
            )}
          </List>
          <Typography variant="subtitle1" fontWeight={600} mt={2} mb={1} color="#35b564ff">
            Correct Answers:
          </Typography>
          <List dense>
            {answer.map((ans, index) => (
              <ListItem key={index} disablePadding>
                <ListItemText primary={ans} />
              </ListItem>
            ))}
          </List>
          <Typography variant="subtitle1" fontWeight={600} mt={2} mb={1} color={isCorrect ? 'green' : 'red'}>
            {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
          </Typography>
          <RevealAnswerComponent
            questionText={questionText}
            explanationHeading={explanation[0]?.heading || 'Explanation'}
            explanationParagraphs={explanation.map((exp) => exp.explanation)}
            additionalInfoHeading="Additional Info"
            additionalInfoParagraphs={additionalInfo.map((info) => info.info)}
            additionalInfoImage={additionalInfo[0]?.image || null}
          />
        </Box>
      )}
    </Box>
  );
};

export default MCQQuestionComponent;
