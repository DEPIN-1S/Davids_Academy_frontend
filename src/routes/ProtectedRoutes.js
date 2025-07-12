// src/routes/ProtectedRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({ children, allowedRoles = [] }) => {
  const { token, user } = useSelector((state) => state.user);

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />; // or a 403 page
  }

  return children;
};

export default ProtectedRoutes;
