import React from 'react';
import DashboardNavbar from '../../components/StudentComponents/DashboardNavbar';
import MockTestComponent from '../../components/StudentComponents/MockTestComponent';
const MockTestPage = () => {
  return (
    <section className='record-class-section'>
      <DashboardNavbar />
      <MockTestComponent />
    </section>
  );
};

export default MockTestPage;
