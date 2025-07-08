import React from 'react';
import '../styles/ClassesAvailable.css';

const ClassesAvailable = () => {
  return (
    <section className="classes-section">
      {/* Floating yellow circles */}
      <div className="circle yellow top-left" />
      <div className="circle yellow mid-left" />
      <div className="circle yellow bottom-right" />

      {/* Floating profile images */}
      <img src='/images/nurse.png' alt="nurse" className="circle-img top-right" />
      <img src='/images/grad1.png' alt="graduate 1" className="circle-img bottom-left" />
      <img src='/images/grad2.png' alt="graduate 2" className="circle-img bottom-mid" />

      {/* Main Content */}
      <div className="classes-content">
        <h2 className="classes-title">Online & Offline Classes Available</h2>
        <p className="classes-subtitle">
          On David Academy and prepare for international healthcare exams from anywhere or at our campus.
        </p>
        <a href="#join" className="join-link">Join Now →</a>
      </div>
    </section>
  );
};

export default ClassesAvailable;
