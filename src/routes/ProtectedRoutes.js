import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({ children, allowedRoles = [] }) => {
  const { user } = useSelector((state) => state.user);

  // Only check if user's role is allowed, without checking accessToken or user presence
  if (allowedRoles.length > 0 && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/" />; // or optionally a 403 Forbidden page
  }

  return children;
};

export default ProtectedRoutes;
