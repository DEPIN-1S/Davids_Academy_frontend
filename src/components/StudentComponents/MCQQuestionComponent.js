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
import RevealAnswerComponent from './RevealAnswerComponent';
const MCQQuestionComponent = ({ question }) => {
  // Pull question text, options, answer, explanation, additionalInfo:
  const {
    question: questionText,
    mcqoptions = [],
    answer,
    exhibit,
    explanation = [],
    additionalInfo = [],
  } = question || {};

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

      <RadioGroup
        value={selectedOption}
        onChange={handleChange}
        className="radio-options"
      >
        {mcqoptions.map((optionObj, index) => (
          <FormControlLabel
            key={optionObj.id || index}
            value={optionObj.option}
            control={<Radio />}
            label={<span className="radio-label">{optionObj.option}</span>}
          />
        ))}
      </RadioGroup>

      <Box className="reveal-btn-wrapper">
        <Button variant="contained" className="reveal-btn" onClick={handleReveal}>
          Reveal Answer
        </Button>
      </Box>

      {showAnswer && (
        <>
          <Typography className="correct-answer" sx={{ mt: 2 }}>
            ✅ Correct Answer: <strong>{answer}</strong>
          </Typography>
          {explanation.length > 0 && (
            <Typography className="explanation-text" sx={{ mt: 1 }}>
              <strong>{explanation[0].heading}:</strong> {explanation.explanation}
            </Typography>
          )}
          {additionalInfo.length > 0 && (
            <Typography className="additional-info-text" sx={{ mt: 1 }}>
              <strong>Info:</strong> {additionalInfo.info}
            </Typography>
          )}
          <RevealAnswerComponent
            questionText={question.question}
            explanationHeading={question.explanation[0]?.heading || 'Explanation'}
            explanationParagraphs={question.explanation.map((exp) => exp.explanation)}
            additionalInfoHeading="Additional Info"
            additionalInfoParagraphs={question.additionalInfo.map((info) => info.info)}
            additionalInfoImage={question.additionalInfo?.image}
          />

        </>

      )}
    </Box>
  );
};

export default MCQQuestionComponent;
