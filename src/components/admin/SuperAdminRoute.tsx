import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePlatformStore } from '../../lib/platformStore';

interface SuperAdminRouteProps {
  children: React.ReactNode;
}

export const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
  const { isSuperAdminAuthenticated } = usePlatformStore();
  const location = useLocation();

  if (!isSuperAdminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

