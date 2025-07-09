import React from 'react';
import DashboardNavbar from '../../components/DasboardComponents/DashboardNavbar';
import MockTestComponent from '../../components/DasboardComponents/MockTestComponent';
const MockTestPage = () => {
  return (
       <section className='record-class-section'>
        <DashboardNavbar/>
      <MockTestComponent />
     </section>
  );
};

export default MockTestPage;
