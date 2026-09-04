import React from 'react';
import { useAuth } from '../context/AuthContext';
import { HomePage } from '../pages/HomePage';
import { SearchPage } from '../pages/SearchPage';
import { MerchantDashboardPage } from '../pages/MerchantDashboardPage';
import { NavigationHandler } from '../types';

interface DashboardRouterProps {
  onNavigate: NavigationHandler;
  searchQuery?: string;
}

export const DashboardRouter: React.FC<DashboardRouterProps> = ({ 
  onNavigate,
  searchQuery = 'I need a laptop under ₹60,000 for programming, 16GB RAM and good battery life.'
}) => {
  const { userRole, user } = useAuth();

  // Role-based rendering:
  // If userRole is 'merchant', render the Merchant Overview / Hub
  // If userRole is 'customer' or 'guest', render the standard customer shopping interface with AI search
  if (userRole === 'merchant' || user?.role === 'merchant') {
    return <MerchantDashboardPage onNavigate={onNavigate} />;
  }

  // Customer or Guest View: Customer Dashboard / Shopping Search Interface
  return <HomePage onNavigate={onNavigate} />;
};

export default DashboardRouter;
