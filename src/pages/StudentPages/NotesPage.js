import React from 'react';
import DashboardNavbar from '../../components/StudentComponents/StudentNavbar';
import NotesComponent from '../../components/StudentComponents/NotesComponent';
const NotesPage = () => {
  return (
    <section className='record-class-section'>
      <DashboardNavbar />
      <NotesComponent />
    </section>
  );
};

export default NotesPage;
