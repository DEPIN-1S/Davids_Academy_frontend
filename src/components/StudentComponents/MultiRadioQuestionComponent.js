import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Radio,
  Button,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import '../../styles/DashboardStyles/MultiRadioQuestionComponent.css';
import RevealAnswerComponent from './RevealAnswerComponent';

const MultiRadioQuestionComponent = ({ question, onSubmit }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Extract data from question prop
  const {
    id: questionId,
    question: questionText,
    tabsInfo = [],
    clientfindings = [],
    radioOption = [],
    explanation = [],
    additionalInfo = [],
  } = question || {};

  const [activeTab, setActiveTab] = useState(tabsInfo[0]?.tabKey || '');
  const [answers, setAnswers] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle radio selection
  const handleSelect = (findingIndex, selectedValue) => () => {
    setAnswers((prev) => ({ ...prev, [findingIndex]: selectedValue }));
  };

  // Handle answer submission and reveal
  const handleReveal = () => {
    // Map correct answers by finding ID
    const correctAnswersMap = clientfindings.reduce((acc, finding, idx) => {
      acc[idx] = finding.answer; // Use the 'answer' from clientfindings as correct
      return acc;
    }, {});

    const userAnswerStr = clientfindings
      .map((finding, idx) => `${finding.client_findings}: ${answers[idx] || 'Not selected'}`)
      .join(', ');
    const correctAnswerStr = clientfindings
      .map((finding, idx) => `${finding.client_findings}: ${correctAnswersMap[idx] || 'Not available'}`)
      .join(', ');

    // Compare user selections with correct answers
    const correctStatus = clientfindings.every(
      (finding, idx) => answers[idx] === correctAnswersMap[idx]
    );
    const mark = correctStatus ? (question?.marks || 5) : 0;

    // Call onSubmit from ExamContainer
    onSubmit(questionId, correctStatus, mark, userAnswerStr);

    // Set states for reveal
    setUserAnswer(userAnswerStr);
    setCorrectAnswer(correctAnswerStr);
    setIsCorrect(correctStatus);
    setShowAnswer(true);
  };

  // Loading or no data state
  if (!question || !clientfindings.length || !radioOption.length) {
    return (
      <Box sx={{ padding: 2, textAlign: 'center' }}>
        <Typography>No multi-radio question data available</Typography>
      </Box>
    );
  }

  // Get unique answers for columns
  const uniqueAnswers = [...new Set(radioOption.map(opt => opt.answer))];

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
            value={activeTab}
            onChange={handleTabChange}
            centered={!isMobile}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons={isMobile ? 'auto' : false}
            sx={{ mb: 2 }}
          >
            {tabsInfo.map((tab) => (
              <Tab label={tab.tabKey} value={tab.tabKey} key={tab.id || tab.tabKey} />
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
              {tabsInfo.find((tab) => tab.tabKey === activeTab)?.tabValue || 'No content available'}
            </Typography>
          </Box>
        </>
      )}

      {/* Radio Table */}
      <Box sx={{ maxWidth: '800px', margin: '0 auto', mb: 4, overflowX: 'auto' }}>
        <Table sx={{ border: '1px solid #e0e0e0' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Client Findings</TableCell>
              {uniqueAnswers.map((answer, colIdx) => (
                <TableCell key={colIdx} sx={{ fontWeight: 600, textAlign: 'center' }}>
                  {answer}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {clientfindings.map((finding, rowIdx) => (
              <TableRow key={finding.id || rowIdx}>
                <TableCell>{finding.client_findings}</TableCell>
                {uniqueAnswers.map((answer, colIdx) => (
                  <TableCell key={colIdx} sx={{ textAlign: 'center' }}>
                    <Radio
                      checked={answers[rowIdx] === answer}
                      onChange={handleSelect(rowIdx, answer)}
                      value={answer}
                      name={`finding-${rowIdx}-${colIdx}`} 
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
          <Typography variant="subtitle1" fontWeight={600} mb={1} color="#24a129ff">
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

          {/* Common RevealAnswerComponent for explanation and additional info */}
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

export default MultiRadioQuestionComponent;
