// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Box, Typography, Button } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';

// const QuestionBank = () => {
//   const navigate = useNavigate();

//   const handleStartTest = () => {
//     // Navigate to the exam container route (where questions are managed)
//     navigate('/student/exam'); // Adjust path as per your route setup
//   };

//   return (
//     <Box
//       sx={{
//         background: 'radial-gradient(circle at center, #fcebb3 0%, #f9f9fb 60%)',
//         borderRadius: '32px',
//         padding: { xs: '3rem 1.5rem', md: '4rem 2rem' },
//         textAlign: 'center',
//         maxWidth: '1000px',
//         margin: 'auto',
//       }}
//     >
//       <Typography
//         variant="h4"
//         fontWeight={700}
//         sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, mb: 2 }}
//       >
//         Practice & Master Your Exam Skills!
//       </Typography>

//       <Typography
//         variant="body1"
//         sx={{ color: '#333', maxWidth: '600px', margin: 'auto', mb: 3 }}
//       >
//         Access thousands of practice questions, track your performance, and build confidence for your healthcare exams.
//       </Typography>

//       <Button
//         variant="contained"
//         size="large"
//         sx={{
//           backgroundColor: '#2E3760',
//           borderRadius: '8px',
//           textTransform: 'none',
//           fontWeight: 600,
//           px: 4,
//           '&:hover': {
//             backgroundColor: '#1e264c',
//           },
//         }}
//         startIcon={<AddIcon />}
//         onClick={handleStartTest}
//       >
//         Start Test
//       </Button>
//     </Box>
//   );
// };

// export default QuestionBank;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';

const QuestionBank = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user); // adjust selector based on your redux slice

  const handleStartTest = () => {
    if (user?.isLoggedIn) {
      // User logged in: navigate to user's test or exam normally
      navigate('/student/exam'); // or append testId if needed
    } else {
      // Not logged in: navigate to sample mode for without-auth sample questions
      navigate('/student/exam?mode=sample');
    }
  };

  return (
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
        onClick={handleStartTest}
      >
        Start Test
      </Button>
    </Box>
  );
};

export default QuestionBank;
