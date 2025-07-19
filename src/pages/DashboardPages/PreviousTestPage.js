import React from 'react';
import DashboardNavbar from '../../components/StudentComponents/DashboardNavbar';
import PreviousTestComponent from '../../components/StudentComponents/PreviousTestComponent';
const PreviousTestPage = () => {
  return (
    <section className='record-class-section'>
      <DashboardNavbar />
      <PreviousTestComponent />
    </section>
  );
};

export default PreviousTestPage;
