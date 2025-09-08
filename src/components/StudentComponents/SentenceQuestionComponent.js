import React, { useState } from 'react';
import { Box, Typography, Button, Tabs, Tab, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import RevealAnswerComponent from './RevealAnswerComponent';

const SentenceQuestionComponent = ({ question, onSubmit }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Extract data from question prop
  const {
    id: questionId,
    question: questionText,
    tabsInfo = [],
    highlightOptions = [], // Updated to match Postman: highlightOptions instead of sentenceoptions
    answer: correctAnswerStr = '', // String like "12"
    explanation = [],
    additionalInfo = [],
  } = question || {};

  const [activeTab, setActiveTab] = useState(0);
  const [selectedSentences, setSelectedSentences] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle sentence selection
  const handleToggleSentence = (sentence) => {
    if (selectedSentences.includes(sentence)) {
      setSelectedSentences(selectedSentences.filter((s) => s !== sentence));
    } else {
      setSelectedSentences([...selectedSentences, sentence]);
    }
  };

  // Handle reveal (submission and show answers)
  const handleReveal = () => {
    // User’s selected sentences as a comma-separated string
    const userAnswerStr = selectedSentences.length > 0 ? selectedSentences.join(', ') : 'Not selected';

    // Assuming correctAnswerStr like "12" means indices 1 and 2 (0-based, so options[0] and options[1])
    const correctIndices = correctAnswerStr.split('').map(Number).map(i => i - 1); // e.g., "12" -> [0,1]
    const correctAnswerList = correctIndices.map(idx => highlightOptions[idx]?.options || 'Not available');
    const correctAnswerText = correctAnswerList.join(', ');

    // Compare user selections with correct answers
    const correctStatus =
      selectedSentences.length === correctAnswerList.length &&
      selectedSentences.every((sentence) => correctAnswerList.includes(sentence));
    const mark = correctStatus ? (question?.marks || 5) : 0;

    // Call onSubmit from ExamContainer
    onSubmit(questionId, correctStatus, mark, userAnswerStr);

    // Set states for reveal
    setUserAnswer(userAnswerStr);
    setCorrectAnswer(correctAnswerText);
    setIsCorrect(correctStatus);
    setShowAnswer(true);
  };

  // Loading or no data state
  if (!question || !highlightOptions.length) {
    return (
  <Box sx={{ padding: 2, textAlign: 'center' }}>
        <Typography>No sentence highlight question data available</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: '1.5rem',
        padding: '2rem',
        margin: '2rem auto',
        maxWidth: '950px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      }}
    >
      {/* Question Text */}
      <Typography variant="h6" fontWeight={700} textAlign="center" mb={2}>
        {questionText}
      </Typography>

      {/* Tabs for Contextual Information */}
      {tabsInfo.length > 0 && (
        <>
          <Tabs
            value={Math.min(activeTab, tabsInfo.length - 1)}
            onChange={handleTabChange}
            centered={!isMobile}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons={isMobile ? 'auto' : false}
            sx={{ mb: 2 }}
          >
            {tabsInfo.map((tab, i) => (
              <Tab label={tab?.tabKey || `Tab ${i + 1}`} key={tab?.id || i} />
            ))}
          </Tabs>
          <Box
            sx={{
              backgroundColor: '#f8f9ff',
              borderRadius: '10px',
              padding: '1rem',
              mb: 4,
              minHeight: '100px',
            }}
          >
            <Typography variant="body1" sx={{ color: '#333' }}>
              {tabsInfo[Math.min(activeTab, tabsInfo.length - 1)]?.tabValue || 'No content available'}
            </Typography>
          </Box>
        </>
      )}

      {/* Sentences for Highlighting */}
      <Typography variant="body1" fontWeight={500} textAlign="center" mb={2}>
        Click to highlight the findings that indicate the client is not meeting the treatment goals.
      </Typography>
      <Box
        sx={{
          maxWidth: '600px',
          margin: '0 auto',
          mb: 4,
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '1rem',
        }}
      >
        {highlightOptions.map((opt, idx) => (
          <Typography
            key={opt.id || idx}
            sx={{
              padding: '0.5rem',
              cursor: 'pointer',
              backgroundColor: selectedSentences.includes(opt.options)
                ? '#e0f7fa'
                : 'transparent',
              borderRadius: '4px',
              '&:hover': { backgroundColor: '#f0f0f0' },
            }}
            onClick={() => handleToggleSentence(opt.options)}
          >
            {opt.options}
          </Typography>
        ))}
      </Box>

      {/* Submit Button */}
      <Box textAlign="center">
        <Button
          variant="contained"
          onClick={handleReveal}
          sx={{
            backgroundColor: '#f4c300',
            color: '#000',
            fontWeight: 600,
            padding: '0.6rem 2.5rem',
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: '#e0b000',
            },
          }}
        >
          Reveal Answer
        </Button>
      </Box>

      {/* Reveal Section */}
      {showAnswer && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} mb={1} color="#32b05aff">
            Correct Answer:
          </Typography>
          <List dense>
            {correctAnswer.split(', ').map((item, idx) => (
              <ListItem key={idx} disablePadding>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>

          <Typography variant="subtitle1" fontWeight={600} mt={2} mb={1} color="#2E3760">
            Your Answer:
          </Typography>
          <List dense>
            {userAnswer.split(', ').map((item, idx) => (
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

export default SentenceQuestionComponent;
