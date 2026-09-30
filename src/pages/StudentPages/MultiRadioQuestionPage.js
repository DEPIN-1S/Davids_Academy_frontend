import React from 'react';
import QuestionHeaderComponent from '../../components/StudentComponents/QuestionHeaderComponent';
import QuestionFooterComponent from '../../components/StudentComponents/QuestionFooterComponent';
import MultiRadioQuestionComponent from '../../components/StudentComponents/MultiRadioQuestionComponent';
const MultiRadioQuestionPage = () => {
  return (
    <>
      <QuestionHeaderComponent />
      <MultiRadioQuestionComponent />
      <QuestionFooterComponent />
    </>
  );
};

export default MultiRadioQuestionPage;
