import React from 'react';
import QuestionHeaderComponent from '../../components/StudentComponents/QuestionHeaderComponent';
import QuestionFooterComponent from '../../components/StudentComponents/QuestionFooterComponent';
import RevealAnswerComponent from '../../components/StudentComponents/RevealAnswerComponent';
const RevealAnswerRadioPage = () => {
  return (
    <>
      <QuestionHeaderComponent />
      <RevealAnswerComponent />
      <QuestionFooterComponent />
    </>
  );
};

export default RevealAnswerRadioPage;
