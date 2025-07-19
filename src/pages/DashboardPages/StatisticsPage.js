import React from 'react';
import DashboardNavbar from '../../components/StudentComponents/DashboardNavbar';
import StatisticsComponent from '../../components/StudentComponents/StatisticsComponent';
import SubjectLessonsStats from '../../components/StudentComponents/SubjectLessonsStats';
import ClientNeedAreaStats from '../../components/StudentComponents/ClientNeedAreaStats';

const StatisticsPage = () => {
  return (
    <>
      <DashboardNavbar />
      <StatisticsComponent />
      <SubjectLessonsStats />
      <ClientNeedAreaStats />
    </>
  );
};

export default StatisticsPage;
