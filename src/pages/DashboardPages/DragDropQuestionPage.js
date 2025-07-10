import React from 'react';
import DragDropQuestionComponent from '../../components/DasboardComponents/DragDropQuestionComponent';
import QuestionHeaderComponent from '../../components/DasboardComponents/QuestionHeaderComponent';
import QuestionFooterComponent from '../../components/DasboardComponents/QuestionFooterComponent';
const DropdownQuestionPage = () => {
  return (
      <>
       <QuestionHeaderComponent/>
        <DragDropQuestionComponent/>
       <QuestionFooterComponent/>
      </>
    
  );
};

export default DropdownQuestionPage;
