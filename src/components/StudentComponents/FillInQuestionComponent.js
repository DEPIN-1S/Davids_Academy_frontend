import React, { useState } from 'react';
import {
  Box, Typography, Button, Select, MenuItem, Tabs, Tab, Card, CardContent
} from '@mui/material';
import RevealAnswerComponent from './RevealAnswerComponent';
import { sanitizeExamHtml } from '../../utils/examHtml';
const isTruthyBlank = (value) =>
  value === true || value === "true" || value === 1 || value === "1";

const FillInQuestionComponent = ({ question, onSubmit }) => {
  // Destructure question object — sample/Q-bank APIs send FTB* field names
  const {
    question: questionHeading,
    marks,
    actions = [],
    explanation = [],
    additionalInfo = []
  } = question || {};

  const question_content = (question?.question_content || question?.FTBquestion_content || []).map((part) => ({
    ...part,
    question_text: part.question_text || "",
    blank_or_not: isTruthyBlank(part.blank_or_not ?? part.blankOrNot) ? "true" : "false",
    fill_blanks_answer: part.fill_blanks_answer || part.answers || "",
  }));
  const tabs = question?.tabs?.length ? question.tabs : (question?.tabsInfo || []);
  let options = question?.options || [];
  if ((!options || !options.length) && question?.FTBoptions) {
    const ftbOpts = question.FTBoptions;
    const values = Array.isArray(ftbOpts.options)
      ? ftbOpts.options.map((o) =>
          typeof o === "string" ? o : o.option_value || o.option || o.value || ""
        )
      : [];
    options = [{ option_heading: ftbOpts.heading || "", option_value: values }];
  }

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
    <Box className="q-fillin-shell" sx={{ padding: '2rem', maxWidth: '900px', margin: '2rem auto', background: 'transparent', borderRadius: 3 }}>
      {/* Tabs at top */}
      {tabs.length > 0 && (
        <>
          <Tabs value={tabIndex} onChange={handleTabChange} centered>
            {tabs.map((tab, idx) => (
              <Tab key={tab.tabKey} label={tab.tabKey} />
            ))}
          </Tabs>
          <Box className="q-tabs-panel" sx={{ borderRadius: 2, my: 2, p: 2 }}>
            <Typography component="div" variant="body2" className="q-html" dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(tabs[tabIndex]?.tabValue) }} />

          </Box>
        </>
      )}

      {/* Question Heading */}
      <Typography component="div" className="q-stem q-html" variant="h6" fontWeight={600} my={2} textAlign="center" dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(questionHeading) }} />

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
              className={
                showReveal
                  ? (userBlanks[`blank${blankKeys.indexOf(`blank${idx}`)}`] === correctAnswers[blankKeys.indexOf(`blank${idx}`)]
                    ? "q-correct"
                    : "q-wrong")
                  : undefined
              }
              sx={{ minWidth: 150, mx: 1, fontWeight: 700, color: '#ffffff' }}
            >
              <MenuItem value="">Select</MenuItem>
              {allOptions.map((optVal, optIdx) => (
                <MenuItem key={optIdx} value={optVal}>
                  <div className="q-html" dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(optVal) }} />
                </MenuItem>
              ))}
            </Select>
          ) : (
            <Typography sx={{ mx: 0.5, color: '#ffffff', fontWeight: 700, fontSize: '1.05rem' }} key={idx} component="div" className="q-html" dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(part.question_text) }} />
          )
        )}
      </Box>

      {/* Actions to take */}
      {actions?.length > 0 && (
      <Box sx={{ mt: 4, mb: 0, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Box>
          <Typography variant="subtitle2" fontWeight={700} mb={1}>Action to take</Typography>
          {actions.map((a, idx) => (
            <Card
              key={a.label || idx}
              sx={{
                mb: 1,
                background: selectedAction === (a.value || a.label) ? 'rgba(240, 201, 74, 0.22)' : 'rgba(8, 16, 36, 0.45)',
                border: selectedAction === (a.value || a.label) ? '2px solid #f0c94a' : '1px solid rgba(94, 234, 212, 0.22)',
                boxShadow: 0,
                cursor: 'pointer'
              }}
              onClick={() => !showReveal && handleActionSelect(a.value || a.label)}
            >
              <CardContent sx={{ py: 1, px: 2 }}>
                <Typography component="div" variant="body2" className="q-html" dangerouslySetInnerHTML={{ __html: sanitizeExamHtml(a.label || a.value) }} />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
      )}

      {/* Reveal answer button */}
      <Box textAlign="center" mt={4}>
        <Button
          variant="contained"
          sx={{ background: 'linear-gradient(90deg, #f0c94a, #fbbf24)', color: '#04121f', fontWeight: 800, borderRadius: '999px', '&:hover': { background: 'linear-gradient(90deg, #fbbf24, #f0c94a)' } }}
          onClick={handleReveal}
          disabled={showReveal}
        >
          Reveal Answer
        </Button>
      </Box>

      {/* Reveal section */}
      {showReveal && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} mb={1} color="var(--sf-cyan)">
            Your Answers:
          </Typography>
          <ul>
            {blanks.map((b, idx) => {
              const userVal = userBlanks[`blank${idx}`] || 'Not selected';
              const ok = userVal === correctAnswers[idx];
              return (
              <li key={idx} className={ok ? 'q-correct' : 'q-wrong'} style={{ fontWeight: 800 }}>
                <div dangerouslySetInnerHTML={{ __html: userVal }} />
              </li>
              );
            })}
          </ul>
          <Typography variant="subtitle1" fontWeight={800} mt={2} mb={1} color="var(--sf-cyan)">
            Correct Answers:
          </Typography>
          <ul>
            {correctAnswers.map((a, idx) => (
              <li key={idx} className="q-correct" style={{ fontWeight: 800 }}>
                <div dangerouslySetInnerHTML={{ __html: a || "" }} />
              </li>
            ))}
          </ul>
          <RevealAnswerComponent
            questionText={questionHeading}
            explanationHeading={explanation[0]?.heading || 'Explanation'}
            explanationParagraphs={explanation.map((exp) => exp.explanation) || []}
            additionalInfoHeading="Additional Info"
            additionalInfoParagraphs={additionalInfo.map((info) => info.info) || []}
            additionalInfoImage={
              question.additionalInfo?.[0]?.image
                ? `${process.env.REACT_APP_API_URL.replace('/davidsacademy', '')}/${question.additionalInfo[0].image}`
                : null
            }
            isAnswerCorrect={isCorrect}
          />
        </Box>
      )}
    </Box>
  );
};

export default FillInQuestionComponent;
