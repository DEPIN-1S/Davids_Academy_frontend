import React from 'react';
import RevealAnswerRadioComponent from '../../components/DasboardComponents/RevealAnswerRadioComponent';
import ScoreNavbar from '../../components/DasboardComponents/ScoreNavbar';
import ScoreStatisticsComponent from '../../components/DasboardComponents/ScoreStatisticsComponent';
import ScoreTableComponent from '../../components/DasboardComponents/ScoreTableComponent';
const ScorePage = () => {
  return (
   <>
     <ScoreNavbar />
     <ScoreStatisticsComponent/>
     <ScoreTableComponent/>
  </>
  );
};

export default ScorePage;
