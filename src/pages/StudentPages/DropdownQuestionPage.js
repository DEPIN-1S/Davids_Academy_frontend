import React from 'react';
import DropdownQuestionComponent from '../../components/StudentComponents/DropdownQuestionComponent';
import QuestionHeaderComponent from '../../components/StudentComponents/QuestionHeaderComponent';
import QuestionFooterComponent from '../../components/StudentComponents/QuestionFooterComponent';
const DropdownQuestionPage = () => {
  return (
    <>
      <QuestionHeaderComponent />
      <DropdownQuestionComponent />
      <QuestionFooterComponent />
    </>

  );
};

export default DropdownQuestionPage;
