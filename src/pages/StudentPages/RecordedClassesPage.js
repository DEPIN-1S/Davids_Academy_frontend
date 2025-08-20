import React from 'react';
import DashboardNavbar from '../../components/StudentComponents/StudentNavbar';
import RecordClassStats from '../../components/StudentComponents/RecordClassStats';
import NewVideoComponent from '../../components/StudentComponents/NewVideoComponent';
import ContinueWatchingComponent from '../../components/StudentComponents/ContinueWatchingComponent';
import PlaylistComponent from '../../components/StudentComponents/PlaylistComponent';
const RecordClassesPage = () => {
  return (
    <section className='record-class-section'>
      <DashboardNavbar />
      <NewVideoComponent />
      <ContinueWatchingComponent />
      <PlaylistComponent />
    </section>
  );
};

export default RecordClassesPage;
