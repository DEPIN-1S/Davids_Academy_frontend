import React from 'react';
import DropSortQuestionComponent from '../../components/StudentComponents/DropSortQuestionComponent';
import QuestionHeaderComponent from '../../components/StudentComponents/QuestionHeaderComponent';
import QuestionFooterComponent from '../../components/StudentComponents/QuestionFooterComponent';
const DropSortQuestionPage = () => {
  return (
    <>
      <QuestionHeaderComponent />
      <DropSortQuestionComponent />
      <QuestionFooterComponent />
    </>

  );
};

export default DropSortQuestionPage;
