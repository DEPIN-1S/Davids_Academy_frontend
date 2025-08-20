import React from 'react';
import DashboardNavbar from '../../components/StudentComponents/StudentNavbar';
import PreviousTestComponent from '../../components/StudentComponents/TestComponent';
const PreviousTestPage = () => {
  return (
    <section className='record-class-section'>
      <DashboardNavbar />
      <PreviousTestComponent />
    </section>
  );
};

export default PreviousTestPage;
