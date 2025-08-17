import React from 'react';
import QuestionHeaderComponent from '../../components/StudentComponents/QuestionHeaderComponent';
import QuestionFooterComponent from '../../components/StudentComponents/QuestionFooterComponent';
import RadioButtonQuestionComponent from '../../components/StudentComponents/MCQQuestionComponent';
const RadioButtonQuestionPage = () => {
  return (
    <>
      <QuestionHeaderComponent />
      <RadioButtonQuestionComponent />
      <QuestionFooterComponent />
    </>
  );
};

export default RadioButtonQuestionPage;
