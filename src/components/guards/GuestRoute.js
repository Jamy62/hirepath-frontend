
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'src/contexts/AuthContext.js';

const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;
