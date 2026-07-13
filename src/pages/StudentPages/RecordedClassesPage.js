import React from 'react';
import DashboardNavbar from '../../components/StudentComponents/StudentNavbar';
import NewVideoComponent from '../../components/StudentComponents/NewVideoComponent';

const RecordClassesPage = () => {
  return (
    <section className='record-class-section'>
      <DashboardNavbar />
      <NewVideoComponent  />
      {/* <ContinueWatchingComponent /> */}
      {/* <PlaylistComponent /> */}
    </section>
  );
};

export default RecordClassesPage;
 