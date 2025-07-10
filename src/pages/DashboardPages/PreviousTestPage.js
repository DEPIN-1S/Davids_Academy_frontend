import React from 'react';
import DashboardNavbar from '../../components/DasboardComponents/DashboardNavbar';
import PreviousTestComponent from '../../components/DasboardComponents/PreviousTestComponent';
const PreviousTestPage = () => {
  return (
       <section className='record-class-section'>
        <DashboardNavbar/>
      <PreviousTestComponent />
     </section>
  );
};

export default PreviousTestPage;
