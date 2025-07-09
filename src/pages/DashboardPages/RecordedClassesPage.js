import React from 'react';
import DashboardNavbar from '../../components/DasboardComponents/DashboardNavbar';
import RecordClassStats from '../../components/DasboardComponents/RecordClassStats';
import NewVideoComponent from '../../components/DasboardComponents/NewVideoComponent';
import ContinueWatchingComponent from '../../components/DasboardComponents/ContinueWatchingComponent';
import PlaylistComponent from '../../components/DasboardComponents/PlaylistComponent';
const RecordClassesPage = () => {
  return (
       <section className='record-class-section'>
        <DashboardNavbar/>
      <RecordClassStats />
       <NewVideoComponent />
         <ContinueWatchingComponent />
         <PlaylistComponent />
     </section>
  );
};

export default RecordClassesPage;
