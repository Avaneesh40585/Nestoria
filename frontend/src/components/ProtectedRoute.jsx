import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireHost = false }) => {
  const { isAuthenticated, isHost, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireHost && !isHost) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
