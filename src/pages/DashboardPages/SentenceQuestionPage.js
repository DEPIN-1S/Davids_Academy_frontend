import React from 'react';
import QuestionHeaderComponent from '../../components/StudentComponents/QuestionHeaderComponent';
import QuestionFooterComponent from '../../components/StudentComponents/QuestionFooterComponent';
import SentenceQuestionComponent from '../../components/StudentComponents/SentenceQuestionComponent';
const SentenceQuestionPage = () => {
  return (
    <>
      <QuestionHeaderComponent />
      <SentenceQuestionComponent />
      <QuestionFooterComponent />
    </>
  );
};

export default SentenceQuestionPage;
