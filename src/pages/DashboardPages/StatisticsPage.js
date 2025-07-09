import React from 'react';
import StatisticsComponent from '../../components/DasboardComponents/StatisticsComponent';
import SubjectLessonsStats from '../../components/DasboardComponents/SubjectLessonsStats';
import ClientNeedAreaStats from '../../components/DasboardComponents/ClientNeedAreaStats';

const StatisticsPage = () => {
  return (
    <>
     <StatisticsComponent/>
     <SubjectLessonsStats/>
      <ClientNeedAreaStats/>
    </>
  );
};

export default StatisticsPage;
