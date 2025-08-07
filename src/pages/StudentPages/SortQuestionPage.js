import React from 'react';
import QuestionHeaderComponent from '../../components/StudentComponents/QuestionHeaderComponent';
import QuestionFooterComponent from '../../components/StudentComponents/QuestionFooterComponent';
import SortQuestionComponent from '../../components/StudentComponents/SortQuestionComponent';
const SortQuestionPage = () => {
  return (
    <>
      <QuestionHeaderComponent />
      <SortQuestionComponent />
      <QuestionFooterComponent />
    </>
  );
};

export default SortQuestionPage;
