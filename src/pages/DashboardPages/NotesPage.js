import React from 'react';
import DashboardNavbar from '../../components/DasboardComponents/DashboardNavbar';
import NotesComponent from '../../components/DasboardComponents/NotesComponent';
const NotesPage = () => {
  return (
       <section className='record-class-section'>
        <DashboardNavbar/>
      <NotesComponent />
     </section>
  );
};

export default NotesPage;
