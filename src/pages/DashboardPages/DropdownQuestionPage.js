import React from 'react';
import DropdownQuestionComponent from '../../components/DasboardComponents/DropdownQuestionComponent';
import QuestionHeaderComponent from '../../components/DasboardComponents/QuestionHeaderComponent';
import QuestionFooterComponent from '../../components/DasboardComponents/QuestionFooterComponent';
const DropdownQuestionPage = () => {
  return (
      <>
       <QuestionHeaderComponent/>
        <DropdownQuestionComponent/>
       <QuestionFooterComponent/>
      </>
    
  );
};

export default DropdownQuestionPage;
