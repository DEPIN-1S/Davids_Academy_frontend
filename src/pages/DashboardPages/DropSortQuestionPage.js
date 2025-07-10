import React from 'react';
import DropSortQuestionComponent from '../../components/DasboardComponents/DropSortQuestionComponent';
import QuestionHeaderComponent from '../../components/DasboardComponents/QuestionHeaderComponent';
import QuestionFooterComponent from '../../components/DasboardComponents/QuestionFooterComponent';
const DropSortQuestionPage = () => {
  return (
      <>
       <QuestionHeaderComponent/>
        <DropSortQuestionComponent/>
       <QuestionFooterComponent/>
      </>
    
  );
};

export default DropSortQuestionPage;
