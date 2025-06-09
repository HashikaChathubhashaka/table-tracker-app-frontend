import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from './AuthContext';

interface Props {
    children: React.ReactNode;
  }
  
const PrivateRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
