import React from 'react';
import QuestionHeaderComponent from '../../components/DasboardComponents/QuestionHeaderComponent';
import QuestionFooterComponent from '../../components/DasboardComponents/QuestionFooterComponent';
import MultiRadioQuestionComponent from '../../components/DasboardComponents/MultiRadioQuestionComponent';
const MultiRadioQuestionPage = () => {
  return (
      <>
        <QuestionHeaderComponent/>
        <MultiRadioQuestionComponent/>
        <QuestionFooterComponent />
    </>
  );
};

export default  MultiRadioQuestionPage;
