import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, Tabs, Tab, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import RevealAnswerComponent from './RevealAnswerComponent';

const DropdownQuestionComponent = ({ question, onSubmit }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeTab, setActiveTab] = useState(0);
  const [dropdownValues, setDropdownValues] = useState({});
  const [showReveal, setShowReveal] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  // Extract data from question prop
  const {
    id: questionId,
    question: questionText,
    dropdownquestiontext = [],
    tabsInfo = [],
    explanation = [],
  } = question || {};

  // Initialize dropdown values
  useEffect(() => {
    if (!dropdownquestiontext.length) return;
    const initialValues = {};
    dropdownquestiontext.forEach((dt) => {
      if (dt?.id) {
        initialValues[dt.id] = '';
      }
    });
    setDropdownValues(initialValues);
  }, [dropdownquestiontext]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle dropdown selection
  const handleDropdownChange = (id) => (event) => {
    setDropdownValues((prev) => ({
      ...prev,
      [id]: event.target.value,
    }));
  };

  // Handle reveal (submission and show answers)
  const handleReveal = () => {
    // User answer: joined selected values
    const userAnswerStr = dropdownquestiontext
      .map((dt) => {
        const dropdownId = dt.id;
        return `${dt.dropdownField || 'Option'}: ${dropdownValues[dropdownId] || 'Not selected'}`;
      })
      .join(', ');

    // Correct answer: assuming from drag_drop_answer or first option (customize based on data)
    const correctAnswerStr = dropdownquestiontext
      .map((dt) => {
        const correctOpt = dt.dropdownoption?.find(opt => opt.is_correct) || dt.dropdownoption[0]; 
        return `${dt.dropdownField || 'Option'}: ${correctOpt?.dropdownValue || 'Not available'}`;
      })
      .join(', ');

    // Check correctness (exact match for all dropdowns)
    const correctStatus = dropdownquestiontext.every((dt) => {
      const dropdownId = dt.id;
      const correctVal = dt.dropdownoption?.find(opt => opt.is_correct)?.dropdownValue || dt.dropdownoption[0]?.dropdownValue;
      return dropdownValues[dropdownId] === correctVal;
    });
    const mark = correctStatus ? (question?.marks || 5) : 0;

    // Call onSubmit from ExamContainer
    onSubmit(questionId, correctStatus, mark, userAnswerStr);

    // Set states for reveal
    setUserAnswer(userAnswerStr);
    setCorrectAnswer(correctAnswerStr);
    setIsCorrect(correctStatus);
    setShowReveal(true);
  };

  // Loading or no data state
  if (!question || !dropdownquestiontext.length) {
    return (
      <Box sx={{ padding: 2, textAlign: 'center' }}>
        <Typography>No dropdown question data available</Typography>
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
      <Typography
        variant="h6"
        fontWeight={700}
        mb={2}
        sx={{ textAlign: 'center', color: '#2e3760' }}
      >
        {questionText}
      </Typography>


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

      {/* Dropdown */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '1rem',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
        }}
      >
        {dropdownquestiontext.map((dt, index) => {
          if (!dt) return null;
          const dropdownId = dt.id || index;
          const dropdownOptions = dt.dropdownoption || [];
          const dropdownLabel = dt.dropdownField || `Option ${index + 1}`;

          return (
            <FormControl sx={{ minWidth: 160 }} size="small" key={dropdownId}>
              <InputLabel>{dropdownLabel}</InputLabel>
              <Select
                value={dropdownValues[dropdownId] || ''}
                label={dropdownLabel}
                onChange={handleDropdownChange(dropdownId)}
              >
                <MenuItem value="">
                  <em>Select an option</em>
                </MenuItem>
                {dropdownOptions.map((opt, optIndex) => (
                  <MenuItem
                    key={opt.id || optIndex}
                    value={opt.dropdownValue || `Option ${optIndex + 1}`}
                  >
                    {opt.dropdownValue || `Option ${optIndex + 1}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        })}
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
      {showReveal && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} mb={1} color="#2E3760">
            Your Answer:
          </Typography>
          <List dense>
            {userAnswer.split(', ').map((item, idx) => (
              <ListItem key={idx} disablePadding>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>

          <Typography variant="subtitle1" fontWeight={600} mt={2} mb={1} color="#2E3760">
            Correct Answer:
          </Typography>
          <List dense>
            {correctAnswer.split(', ').map((item, idx) => (
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
            additionalInfoParagraphs={[]}
            additionalInfoImage={null}
          />
        </Box>
      )}
    </Box>
  );
};

export default DropdownQuestionComponent;
