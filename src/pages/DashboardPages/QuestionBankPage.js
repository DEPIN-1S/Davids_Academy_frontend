import React from 'react';
import DashboardNavbar from '../../components/StudentComponents/DashboardNavbar';
import QuestionBank from '../../components/StudentComponents/QuestionBank';
import '../../styles/DashboardStyles/QuestionBankPage.css';
const QuestionBankPage = () => {
  return (
    <section className='question-bank-section'>
      <DashboardNavbar />
      <QuestionBank />
    </section>
  );
};

export default QuestionBankPage;
