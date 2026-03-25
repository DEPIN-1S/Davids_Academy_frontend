import React, { useState } from 'react'
import { Box, Typography, Button, Tabs, Tab, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import { useParams } from 'react-router-dom';


function FillinTheBlanksQuestionView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { questionId } = useParams()
  // ✅ Static data
  const question = {
    id: 1,
    question: "A client is undergoing treatment for hypertension. Identify the findings that suggest the client is not meeting the treatment goals.",
    tabsInfo: [
      { id: 1, tabKey: "History", tabValue: "Patient has a history of high BP for 5 years." },
      { id: 2, tabKey: "Lab Results", tabValue: "Latest BP reading: 170/100 mmHg." },
      { id: 3, tabKey: "Progress Note", tabValue: "Complains of frequent headaches and dizziness." },
    ],
    highlightOptions: [
      { id: 1, options: "BP is consistently above 160/100 mmHg" },
      { id: 2, options: "Patient follows a low-salt diet" },
      { id: 3, options: "Reports no improvement in symptoms" },
      { id: 4, options: "Patient engages in regular exercise" },
    ],
    answer: "13", // means correct answers are options 1 and 3
    explanation: [
      {
        heading: "Explanation",
        explanation: "Uncontrolled BP and persistent symptoms show the treatment goals are not met.",
      },
    ],
    additionalInfo: [
      {
        info: "Lifestyle changes like diet and exercise are positive but not sufficient alone when BP remains uncontrolled.",
        image: null,
      },
    ],
    marks: 5,
  };

  const {
   
    question: questionText,
    tabsInfo = [],
    highlightOptions = [],
    answer: correctAnswerStr = '',
    explanation = [],
    additionalInfo = [],
  } = question || {};

  const [activeTab, setActiveTab] = useState(0);
  const [selectedSentences, setSelectedSentences] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleToggleSentence = (sentence) => {
    if (selectedSentences.includes(sentence)) {
      setSelectedSentences(selectedSentences.filter((s) => s !== sentence));
    } else {
      setSelectedSentences([...selectedSentences, sentence]);
    }
  };

  const handleReveal = () => {
    const userAnswerStr = selectedSentences.length > 0 ? selectedSentences.join(', ') : 'Not selected';

    const correctIndices = correctAnswerStr.split('').map(Number).map(i => i - 1);
    const correctAnswerList = correctIndices.map(idx => highlightOptions[idx]?.options || 'Not available');
    const correctAnswerText = correctAnswerList.join(', ');

    const correctStatus =
      selectedSentences.length === correctAnswerList.length &&
      selectedSentences.every((sentence) => correctAnswerList.includes(sentence));

    const mark = correctStatus ? (question?.marks || 5) : 0;

    setUserAnswer(userAnswerStr);
    setCorrectAnswer(correctAnswerText);
    setIsCorrect(correctStatus);
    setShowAnswer(true);
  };

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
      <Typography variant="h6" fontWeight={700} textAlign="center" mb={2} dangerouslySetInnerHTML={{ __html: questionText || "" }} />

      {/* Tabs */}
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
            <Typography variant="body1" sx={{ color: '#333' }} dangerouslySetInnerHTML={{ __html: tabsInfo[Math.min(activeTab, tabsInfo.length - 1)]?.tabValue || 'No content available' }} />
          </Box>
        </>
      )}

      {/* Highlight Options */}
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
            dangerouslySetInnerHTML={{ __html: opt.options || "" }}
          />
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

          {/* <RevealAnswerComponent
            questionText={questionText}
            explanationHeading={explanation[0]?.heading || 'Explanation'}
            explanationParagraphs={explanation.map((exp) => exp.explanation) || []}
            additionalInfoHeading="Additional Info"
            additionalInfoParagraphs={additionalInfo.map((info) => info.info) || []}
            additionalInfoImage={additionalInfo[0]?.image || null}
          /> */}
        </Box>
      )}
    </Box>
  )
}

export default FillinTheBlanksQuestionView
