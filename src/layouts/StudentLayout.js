import React from 'react';
import useSecurityRestrictions from '../hooks/useSecurityRestrictions'; // Adjust path

const StudentLayout = ({ children }) => {
  // Call hook here - applies only when student routes render
  useSecurityRestrictions();

  return <>{children}</>; // Render the matched student component
};

export default StudentLayout;