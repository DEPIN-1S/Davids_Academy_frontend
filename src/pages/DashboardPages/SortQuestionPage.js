import React from 'react';
import QuestionHeaderComponent from '../../components/DasboardComponents/QuestionHeaderComponent';
import QuestionFooterComponent from '../../components/DasboardComponents/QuestionFooterComponent';
import SortQuestionComponent from '../../components/DasboardComponents/SortQuestionComponent';
const SortQuestionPage = () => {
  return (
      <>
        <QuestionHeaderComponent/>
        <SortQuestionComponent/>
        <QuestionFooterComponent />
    </>
  );
};

export default  SortQuestionPage;
