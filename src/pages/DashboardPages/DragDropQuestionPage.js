import React from 'react';
import DragDropQuestionComponent from '../../components/StudentComponents/DragDropQuestionComponent';
import QuestionHeaderComponent from '../../components/StudentComponents/QuestionHeaderComponent';
import QuestionFooterComponent from '../../components/StudentComponents/QuestionFooterComponent';
const DropdownQuestionPage = () => {
  return (
    <>
      <QuestionHeaderComponent />
      <DragDropQuestionComponent />
      <QuestionFooterComponent />
    </>

  );
};

export default DropdownQuestionPage;
