import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface CustomerGuardProps {
  children?: React.ReactNode;
}

/**
 * CustomerGuard: Strict route guard for Customer storefront.
 * If userRole === 'merchant', intercept the render and immediately <Navigate replace to="/merchant/dashboard"/>.
 * Otherwise, render children or <Outlet /> (allowing 'guest' and 'customer').
 */
export const CustomerGuard: React.FC<CustomerGuardProps> = ({ children }) => {
  const { userRole } = useAuth();

  // Strict isolation: merchants must never see the customer UI
  if (userRole === 'merchant') {
    return <Navigate to="/merchant/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default CustomerGuard;
