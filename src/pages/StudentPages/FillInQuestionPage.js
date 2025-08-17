import React from 'react';
import FillInQuestionComponent from '../../components/StudentComponents/FillInQuestionComponent';
import QuestionHeaderComponent from '../../components/StudentComponents/QuestionHeaderComponent';
import QuestionFooterComponent from '../../components/StudentComponents/QuestionFooterComponent';
const FillInQuestionPage = () => {
  return (
    <>
      <QuestionHeaderComponent />
      <FillInQuestionComponent />
      <QuestionFooterComponent />
    </>

  );
};

export default FillInQuestionPage;
