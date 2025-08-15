import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Modal,
  Fade,
  Backdrop
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateTestComponent from './createTestComponent';

const QuestionBank = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Main Section */}
      <Box
        sx={{
          background: 'radial-gradient(circle at center, #fcebb3 0%, #f9f9fb 60%)',
          borderRadius: '32px',
          padding: { xs: '3rem 1.5rem', md: '4rem 2rem' },
          textAlign: 'center',
          maxWidth: '1000px',
          margin: 'auto',
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, mb: 2 }}
        >
          Practice & Master Your Exam Skills!
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: '#333', maxWidth: '600px', margin: 'auto', mb: 3 }}
        >
          Access thousands of practice questions, track your performance, and build confidence for your healthcare exams.
        </Typography>

        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: '#2E3760',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            '&:hover': {
              backgroundColor: '#1e264c',
            },
          }}
          startIcon={<AddIcon />}
          // onClick={() => setShowModal(true)}
        >
          Start Test
        </Button>
      </Box>


    </>
  );
};

export default QuestionBank;
