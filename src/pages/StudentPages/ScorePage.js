import React from 'react';
import RevealAnswerRadioComponent from '../../components/StudentComponents/RevealAnswerRadioComponent';
import ScoreNavbar from '../../components/StudentComponents/ScoreNavbar';
import ScoreStatisticsComponent from '../../components/StudentComponents/ScoreStatisticsComponent';
import ScoreTableComponent from '../../components/StudentComponents/ScoreTableComponent';
const ScorePage = () => {
  return (
    <>
      <ScoreNavbar />
      <ScoreStatisticsComponent />
      <ScoreTableComponent />
    </>
  );
};

export default ScorePage;
