import React from 'react';
import '../styles/CourseHeader.css';

const CourseHeader = () => {
  return (
       <div className="course-header-container">
        <p className="breadcrumb">Courses / <span>Home</span></p>
        <h2 className="header-title">Our Courses</h2>
      </div>
  
  );
};

export default CourseHeader;
