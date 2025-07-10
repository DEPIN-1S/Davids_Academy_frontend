import React from 'react';
import QuestionHeaderComponent from '../../components/DasboardComponents/QuestionHeaderComponent';
import QuestionFooterComponent from '../../components/DasboardComponents/QuestionFooterComponent';
import SentenceQuestionComponent from '../../components/DasboardComponents/SentenceQuestionComponent';
const SentenceQuestionPage = () => {
  return (
      <>
        <QuestionHeaderComponent/>
        <SentenceQuestionComponent/>
        <QuestionFooterComponent />
    </>
  );
};

export default  SentenceQuestionPage;
