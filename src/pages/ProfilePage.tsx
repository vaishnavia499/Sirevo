import React from 'react';
import { CustomerProfile } from '../components/CustomerProfile';
import { PageRoute } from '../types';

interface ProfilePageProps {
  onNavigate?: (page: PageRoute) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = () => {
  return (
    <div className="max-w-4xl mx-auto pb-12">
      <CustomerProfile />
    </div>
  );
};


