import React from 'react';
import { MerchantProfile } from '../components/MerchantProfile';
import { PageRoute } from '../types';

interface MerchantProfilePageProps {
  onNavigate?: (page: PageRoute) => void;
  embedded?: boolean;
}

export const MerchantProfilePage: React.FC<MerchantProfilePageProps> = () => {
  return (
    <div id="merchant-profile-page-wrapper" className="space-y-6 max-w-6xl w-full mx-auto">
      <MerchantProfile />
    </div>
  );
};
