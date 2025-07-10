import React from 'react';
import QuestionHeaderComponent from '../../components/DasboardComponents/QuestionHeaderComponent';
import QuestionFooterComponent from '../../components/DasboardComponents/QuestionFooterComponent';
import RadioButtonQuestionComponent from '../../components/DasboardComponents/QuestionFooterComponent';
const QuestionBankPage = () => {
  return (
   <>
      <QuestionHeaderComponent />
      <RadioButtonQuestionComponent />
     <QuestionFooterComponent />
  </>
  );
};

export default QuestionBankPage;
