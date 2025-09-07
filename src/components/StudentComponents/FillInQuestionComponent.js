import React, { useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import RevealAnswerComponent from './RevealAnswerComponent';

const FillInQuestionComponent = ({ question, onSubmit }) => {
  const {
    id: questionId,
    question: questionText,
    explanation = [],
    additionalInfo = [],
  } = question || {};

  const [userAnswers, setUserAnswers] = useState({});
  const [showReveal, setShowReveal] = useState(false);
  const [userAnswerStr, setUserAnswerStr] = useState('');
  const [correctAnswerStr, setCorrectAnswerStr] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  // Identify blanks and prepare state
  const blanks = (questionText.match(/____/g) || []).map((_, idx) => `blank${idx}`);
  const correctAnswers = question?.answer?.split(',') || []; // Assume comma-separated correct answers

  const handleInputChange = (blankId) => (event) => {
    setUserAnswers((prev) => ({ ...prev, [blankId]: event.target.value }));
  };

  const handleReveal = () => {
    const userAns = blanks.map((blank, idx) => userAnswers[blank] || 'Not filled').join(', ');
    const correctAns = correctAnswers.join(', ');
    const correctStatus = blanks.every((blank, idx) => userAnswers[blank]?.trim() === correctAnswers[idx]?.trim());
    const mark = correctStatus ? (question?.marks || 5) : 0;

    onSubmit(questionId, correctStatus, mark, userAns);

    setUserAnswerStr(userAns);
    setCorrectAnswerStr(correctAns);
    setIsCorrect(correctStatus);
    setShowReveal(true);
  };

  if (!question || !questionText) {
    return <Typography>No fill-in question data available</Typography>;
  }

  return (
    <Box sx={{ padding: '2rem', maxWidth: '950px', margin: '2rem auto' }}>
      <Typography variant="h6" fontWeight={700} textAlign="center" mb={2}>
        {questionText.split('____').map((part, idx) => (
          <React.Fragment key={idx}>
            {part}
            {idx < blanks.length && (
              <TextField
                key={blanks[idx]}
                size="small"
                value={userAnswers[blanks[idx]] || ''}
                onChange={handleInputChange(blanks[idx])}
                sx={{ mx: 1, width: '150px' }}
                disabled={showReveal}
              />
            )}
          </React.Fragment>
        ))}
      </Typography>
      <Box textAlign="center" mt={4}>
        <Button
          variant="contained"
          onClick={handleReveal}
          sx={{ backgroundColor: '#f4c300', color: '#000', '&:hover': { backgroundColor: '#e0b000' } }}
          disabled={showReveal}
        >
          Reveal Answer
        </Button>
      </Box>

      {showReveal && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} mb={1} color="#2E3760">
            Your Answer:
          </Typography>
          <List dense>
            {userAnswerStr.split(', ').map((item, idx) => (
              <ListItem key={idx} disablePadding>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>

          <Typography variant="subtitle1" fontWeight={600} mt={2} mb={1} color="#2E3760">
            Correct Answer:
          </Typography>
          <List dense>
            {correctAnswerStr.split(', ').map((item, idx) => (
              <ListItem key={idx} disablePadding>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>

          <Typography variant="subtitle1" fontWeight={600} mt={2} mb={1} color={isCorrect ? 'green' : 'red'}>
            {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
          </Typography>

          
          <RevealAnswerComponent
            questionText={questionText}
            explanationHeading={explanation[0]?.heading || 'Explanation'}
            explanationParagraphs={explanation.map((exp) => exp.explanation) || []}
            additionalInfoHeading='Additional Info'
            additionalInfoParagraphs={additionalInfo.map((info) => info.info) || []}
            additionalInfoImage={additionalInfo[0]?.image || null}
          />
        </Box>
      )}
    </Box>
  );
};

export default FillInQuestionComponent;
