import React, { useState } from 'react';
import {
  Box, Typography, Button, Select, MenuItem, Tabs, Tab, Card, CardContent
} from '@mui/material';
import RevealAnswerComponent from './RevealAnswerComponent';
const FillInQuestionComponent = ({ question, onSubmit }) => {
  // Destructure question object
  const {
    question: questionHeading,
    question_content = [],
    answer = '',
    marks,
    options = [],
    tabs = [],
    actions = [],
    explanation = [],
    additionalInfo = []
  } = question || {};

  // Tab management
  const [tabIndex, setTabIndex] = useState(0);
  const [userBlanks, setUserBlanks] = useState({});
  const [selectedAction, setSelectedAction] = useState('');
  const [showReveal, setShowReveal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // For blanks answers and options
  // Only blanks where blank_or_not === true
  const blanks = question_content.filter(q => q.blank_or_not === 'true');
  const blankKeys = blanks.map((_, idx) => `blank${idx}`);
  // Allow single or multi options
  let allOptions = [];
  if (options && Array.isArray(options) && options.length) {
    allOptions = options[0]?.option_value || [];
  }

  // Collect correct answers from `question_content`
  const correctAnswers = blanks.map(x => x.fill_blanks_answer);

  const handleTabChange = (e, newValue) => setTabIndex(newValue);

  const handleBlankChange = (blankId) => (event) => {
    setUserBlanks(prev => ({ ...prev, [blankId]: event.target.value }));
  };

  const handleActionSelect = (action) => {
    setSelectedAction(action);
  };

  const handleReveal = () => {
    // Score only blanks (not action) if you want
    const correct = blanks.every((b, idx) => userBlanks[`blank${idx}`] === correctAnswers[idx]);
    setShowReveal(true);
    setIsCorrect(correct);
    if (onSubmit) {
      onSubmit(question.id, correct, marks, userBlanks);
    }
  };

  return (
    <Box sx={{ padding: '2rem', maxWidth: '900px', margin: '2rem auto', background: '#fcfcff', borderRadius: 3 }}>
      {/* Tabs at top */}
      {tabs.length > 0 && (
        <>
          <Tabs value={tabIndex} onChange={handleTabChange} centered>
            {tabs.map((tab, idx) => (
              <Tab key={tab.tabKey} label={tab.tabKey} />
            ))}
          </Tabs>
          <Box sx={{ background: '#fff', borderRadius: 2, my: 2, p: 2 }}>
            <Typography variant="body2">{tabs[tabIndex]?.tabValue}</Typography>

          </Box>
        </>
      )}

      {/* Question Heading */}
      <Typography variant="h6" fontWeight={600} my={2} textAlign="center">
        {questionHeading}
      </Typography>

      {/* Fill-in-the-blank composed sentence */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
        {question_content.map((part, idx) =>
          part.blank_or_not === 'true' ? (
            <Select
              key={`blank${idx}`}
              value={userBlanks[`blank${blankKeys.indexOf(`blank${idx}`)}`] || ''}
              onChange={handleBlankChange(`blank${blankKeys.indexOf(`blank${idx}`)}`)}
              displayEmpty
              disabled={showReveal}
              sx={{ minWidth: 150, mx: 1, bgcolor: 'white' }}
            >
              <MenuItem value="">Select</MenuItem>
              {allOptions.map(optVal =>
                <MenuItem key={optVal} value={optVal}>{optVal}</MenuItem>
              )}
            </Select>
          ) : (
            <Typography sx={{ mx: 0.5 }} key={idx} component="span">{part.question_text}</Typography>
          )
        )}
      </Box>

      {/* Actions to take */}
      <Box sx={{ mt: 4, mb: 0, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Box>
          <Typography variant="subtitle2" fontWeight={700} mb={1}>Action to take</Typography>
          {(actions?.length ? actions : [
            // fallback example
            { label: 'Administer high-flow oxygen via a non-rebreather mask.' }
          ]).map((a, idx) => (
            <Card
              key={a.label || idx}
              sx={{
                mb: 1,
                background: selectedAction === (a.value || a.label) ? '#ffebbd' : '#fff',
                border: selectedAction === (a.value || a.label) ? '2px solid #ffd700' : '1px solid #eee',
                boxShadow: 0,
                cursor: 'pointer'
              }}
              onClick={() => !showReveal && handleActionSelect(a.value || a.label)}
            >
              <CardContent sx={{ py: 1, px: 2 }}>
                <Typography variant="body2">{a.label || a.value}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Reveal answer button */}
      <Box textAlign="center" mt={4}>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#f4c300', color: '#000', '&:hover': { backgroundColor: '#e0b000' } }}
          onClick={handleReveal}
          disabled={showReveal}
        >
          Reveal Answer
        </Button>
      </Box>

      {/* Reveal section */}
      {showReveal && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} mb={1} color="#2E3760">
            Your Answers:
          </Typography>
          <ul>
            {blanks.map((b, idx) => (
              <li key={idx}>{userBlanks[`blank${idx}`] || 'Not selected'}</li>
            ))}
          </ul>
          <Typography variant="subtitle1" fontWeight={600} mt={2} mb={1} color="#2E3760">
            Correct Answers:
          </Typography>
          <ul>
            {correctAnswers.map((a, idx) => (
              <li key={idx}>{a}</li>
            ))}
          </ul>
          <Typography variant="subtitle1" fontWeight={600} mt={2} mb={1} color={isCorrect ? 'green' : 'red'}>
            {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
          </Typography>
          {/* Optional: Reveal explanation and additional info */}
          <RevealAnswerComponent
            questionText={questionHeading}
            explanationHeading={explanation[0]?.heading || 'Explanation'}
            explanationParagraphs={explanation.map((exp) => exp.explanation) || []}
            additionalInfoHeading="Additional Info"
            additionalInfoParagraphs={additionalInfo.map((info) => info.info) || []}
            additionalInfoImage={
              question.additionalInfo?.[0]?.image
                ? `https://lunarsenterprises.com:6040/${question.additionalInfo[0].image}`
                : null
            }

          />
        </Box>
      )}
    </Box>
  );
};

export default FillInQuestionComponent;
