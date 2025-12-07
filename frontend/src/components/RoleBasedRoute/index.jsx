import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/use-role';
import LoadingSpinner from '@/components/layout/loading';

const RoleBasedRoute = ({ children, requiredRole, fallbackPath = '/home' }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasRole } = useRole();

  if (isLoading) {
    return <LoadingSpinner size="large" text="Carregando..." fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(requiredRole)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default RoleBasedRoute;
