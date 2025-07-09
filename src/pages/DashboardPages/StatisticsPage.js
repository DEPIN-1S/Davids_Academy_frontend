import React from 'react';
import DashboardNavbar from '../../components/DasboardComponents/DashboardNavbar';
import StatisticsComponent from '../../components/DasboardComponents/StatisticsComponent';
import SubjectLessonsStats from '../../components/DasboardComponents/SubjectLessonsStats';
import ClientNeedAreaStats from '../../components/DasboardComponents/ClientNeedAreaStats';

const StatisticsPage = () => {
  return (
    <>
    <DashboardNavbar/>
     <StatisticsComponent/>
     <SubjectLessonsStats/>
      <ClientNeedAreaStats/>
    </>
  );
};

export default StatisticsPage;
