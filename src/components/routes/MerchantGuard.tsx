import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface MerchantGuardProps {
  children?: React.ReactNode;
}

/**
 * MerchantGuard: Strict route guard for Merchant Portal.
 * If userRole !== 'merchant' (i.e. 'guest' or 'customer'), intercept the render
 * and immediately <Navigate replace to="/"/>.
 * Otherwise, render children or <Outlet />.
 */
export const MerchantGuard: React.FC<MerchantGuardProps> = ({ children }) => {
  const { userRole } = useAuth();

  // Strict isolation: only verified merchants can access merchant routes
  if (userRole !== 'merchant') {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default MerchantGuard;
