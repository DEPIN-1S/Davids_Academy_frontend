import React, { useState } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';

const RevealAnswerRadioComponent = () => {
  const [selected, setSelected] = useState('');
  const [revealed, setRevealed] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const correctAnswer = 'B';
  const options = [
    { label: 'A. Trach kit', value: 'A', percent: '18%' },
    { label: 'B. Scissors', value: 'B', percent: '32%' },
    { label: 'C. Obturator', value: 'C', percent: '26%' },
    { label: 'D. Yankauer suctioning', value: 'D', percent: '24%' },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 4,
        padding: 4,
        backgroundColor: '#fafafa',
      }}
    >
      {/* Left - Question & Explanation */}
      <Box
        sx={{
          flex: 2,
          backgroundColor: '#fff',
          borderRadius: 3,
          padding: 3,
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        }}
      >
        {/* Question */}
        <Typography variant="h6" mb={3}>
          The nurse is caring for a client with a Sengstaken–Blakemore tube.
          The nurse performs safety checks at the beginning of the shift and
          ensures which priority item is readily available at the bedside?
        </Typography>

        {/* Options */}
        <RadioGroup value={selected} onChange={(e) => setSelected(e.target.value)}>
          {options.map((option) => {
            const isCorrect = revealed && option.value === correctAnswer;
            const isWrong = revealed && option.value === selected && selected !== correctAnswer;

            return (
              <Box
                key={option.value}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  backgroundColor: isCorrect
                    ? '#D4EDDA'
                    : isWrong
                    ? '#F8D7DA'
                    : '#f3f3f3',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  position: 'relative',
                }}
              >
                <FormControlLabel
                  value={option.value}
                  control={<Radio />}
                  label={<Typography>{option.label}</Typography>}
                />
                {revealed && (
                  <Typography
                    variant="body2"
                    sx={{ position: 'absolute', right: 16, color: '#777' }}
                  >
                    [{option.percent}]
                  </Typography>
                )}
              </Box>
            );
          })}
        </RadioGroup>

        {/* Reveal Button */}
        {!revealed && (
          <Box textAlign="center" mt={4}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#F4C542',
                color: '#000',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#e6b800' },
              }}
              onClick={() => setRevealed(true)}
            >
              Reveal Answer
            </Button>
          </Box>
        )}

        {/* Explanation */}
        {revealed && (
          <Box
            mt={6}
            p={3}
            sx={{
              bgcolor: '#f9f9f9',
              borderRadius: 3,
              maxHeight: isMobile ? '300px' : '200px',
              overflowY: 'auto',
              boxShadow: 'inset 0 0 6px rgba(0,0,0,0.1)',
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={1} color="#2E3760">
              Explanation
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Choice B is correct.</strong> Scissors should be available at the bedside when using a
              Sengstaken–Blakemore tube. In case of airway compromise or tube displacement, the tube may need
              to be cut quickly to prevent further complications.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Choice A is incorrect.</strong> A trach kit may be useful in airway management but is not
              the immediate safety item for a patient with a Sengstaken–Blakemore tube.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Choice C and D are incorrect.</strong> These do not have the same critical importance in
              the context of this clinical scenario.
            </Typography>
          </Box>
        )}
      </Box>

      {/* Right - Statistics */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: '#fff',
          borderRadius: 3,
          padding: 3,
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          height: 'fit-content',
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={2}>
          Statistics
        </Typography>

        <Box mb={1}>
          <Typography variant="subtitle2" color="#00acc1">
            Medium
          </Typography>
          <Typography variant="body2">Difficulty level</Typography>
        </Box>

        <Box mb={1}>
          <Typography variant="subtitle2" color="#f4c129">
            51%
          </Typography>
          <Typography variant="body2">of peers got it right</Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle2" color="green">
            5095 s
          </Typography>
          <Typography variant="body2">Time taken</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="body2" mb={0.5}><strong>Subject:</strong> Fundamentals</Typography>
          <Typography variant="body2" mb={0.5}><strong>Lesson:</strong> Skills/Procedures</Typography>
          <Typography variant="body2" mb={0.5}><strong>Client Need Area:</strong> Risk Reduction</Typography>
          <Typography variant="body2" mb={0.5}><strong>Topic:</strong> Diagnostic Procedures</Typography>
          <Typography variant="body2"><strong>Type:</strong> Knowledge/Comprehension</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RevealAnswerRadioComponent;
