import React from 'react';
import DashboardNavbar from '../../components/StudentComponents/StudentNavbar';
import QuestionBank from '../../components/StudentComponents/QuestionBank';
import '../../styles/DashboardStyles/QuestionBankPage.css';
import { Box } from '@mui/material';
const QuestionBankPage = () => {
  return (
    <section className='question-bank-section'>
      <DashboardNavbar />
      <Box sx={{ pt: { xs: '2rem', md: '8rem' } }}>
        <QuestionBank />
      </Box>
    </section>
  );
};

export default QuestionBankPage;
