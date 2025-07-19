import React from 'react';
import DashboardNavbar from '../../components/StudentComponents/DashboardNavbar';
import RecordClassStats from '../../components/StudentComponents/RecordClassStats';
import NewVideoComponent from '../../components/StudentComponents/NewVideoComponent';
import ContinueWatchingComponent from '../../components/StudentComponents/ContinueWatchingComponent';
import PlaylistComponent from '../../components/StudentComponents/PlaylistComponent';
const RecordClassesPage = () => {
  return (
    <section className='record-class-section'>
      <DashboardNavbar />
      <RecordClassStats />
      <NewVideoComponent />
      <ContinueWatchingComponent />
      <PlaylistComponent />
    </section>
  );
};

export default RecordClassesPage;
