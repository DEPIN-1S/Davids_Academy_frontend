import React, { useState } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
} from '@mui/material';
import '../../styles/DashboardStyles/RadioButtonQuestionComponent.css';

const options = [
  'A. Trach kit',
  'B. Scissors',
  'C. Obturator',
  'D. Yankauer suctioning',
];

const RadioButtonComponent = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleReveal = () => {
    setShowAnswer(true);
  };

  return (
    <Box className="radio-container">
      <Typography variant="body1" className="question-text">
        The nurse is caring for a client with a Sengstaken-Blakemore tube.
        The nurse performs safety checks at the beginning of the shift and ensures
        which priority item is readily available at the bedside?
      </Typography>

      <RadioGroup
        value={selectedOption}
        onChange={handleChange}
        className="radio-options"
      >
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
            value={option}
            control={<Radio />}
            label={<span className="radio-label">{option}</span>}
          />
        ))}
      </RadioGroup>

      <Box className="reveal-btn-wrapper">
        <Button variant="contained" className="reveal-btn" onClick={handleReveal}>
          Reveal Answer
        </Button>
      </Box>

      {showAnswer && (
        <Typography className="correct-answer">
          ✅ Correct Answer: <strong>B. Scissors</strong>
        </Typography>
      )}
    </Box>
  );
};

export default RadioButtonComponent;
