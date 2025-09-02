import React, { useState } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
} from '@mui/material';

import '../styles/DashboardStyles/RadioButtonQuestionComponent.css';
import RevealAnswerComponent from '../components/StudentComponents/RevealAnswerComponent';

function McqQuestionView() {
  const [selectedOption, setSelectedOption] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  const exhibit = 'https://via.placeholder.com/600x250.png?text=Exhibit+Image';
  const questionText =
    'Which vitamin deficiency is most commonly associated with night blindness?';
  const mcqoptions = [
    { id: 1, option: 'Vitamin A' },
    { id: 2, option: 'Vitamin B12' },
    { id: 3, option: 'Vitamin C' },
    { id: 4, option: 'Vitamin D' },
  ];
  const answer = 'Vitamin A';
  const explanation = [
    {
      heading: 'Explanation',
      explanation:
        'Night blindness is primarily due to Vitamin A deficiency, which is essential for the production of rhodopsin in the retina.',
    },
  ];
  const additionalInfo = [
    {
      info: 'Vitamin A deficiency is also associated with xerophthalmia and corneal damage.',
    },
  ];

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleReveal = () => {
    setShowAnswer(true);
  };

  return (
    <Box
      className="radio-container"
     
    >
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
        {mcqoptions.map((optionObj) => (
          <FormControlLabel
            key={optionObj.id}
            value={optionObj.option}
            control={<Radio />}
            label={<span className="radio-label">{optionObj.option}</span>}
          />
        ))}
      </RadioGroup>
{/* 
      <Box className="reveal-btn-wrapper">
        <Button
          variant="contained"
          className="reveal-btn"
          onClick={handleReveal}
        >
          Reveal Answer
        </Button>
      </Box>

      {showAnswer && (
        <>
          <Typography className="correct-answer" sx={{ mt: 2 }}>
            ✅ Correct Answer: <strong>{answer}</strong>
          </Typography>

          <Typography className="explanation-text" sx={{ mt: 1 }}>
            <strong>{explanation[0].heading}:</strong>{' '}
            {explanation[0].explanation}
          </Typography>

          <Typography className="additional-info-text" sx={{ mt: 1 }}>
            <strong>Info:</strong> {additionalInfo[0].info}
          </Typography>

          <RevealAnswerComponent
            questionText={questionText}
            explanationHeading={explanation[0].heading}
            explanationParagraphs={explanation.map((exp) => exp.explanation)}
            additionalInfoHeading="Additional Info"
            additionalInfoParagraphs={additionalInfo.map((info) => info.info)}
            additionalInfoImage={null}
          />
        </>
      )} */}
    </Box>
  );
}

export default McqQuestionView;
