import React from 'react';
import QuestionHeaderComponent from '../../components/StudentComponents/QuestionHeaderComponent';
import QuestionFooterComponent from '../../components/StudentComponents/QuestionFooterComponent';
import RevealAnswerRadioComponent from '../../components/StudentComponents/RevealAnswerRadioComponent';
const RevealAnswerRadioPage = () => {
  return (
    <>
      <QuestionHeaderComponent />
      <RevealAnswerRadioComponent />
      <QuestionFooterComponent />
    </>
  );
};

export default RevealAnswerRadioPage;
