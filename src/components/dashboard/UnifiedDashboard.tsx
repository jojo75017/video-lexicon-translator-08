
import React, { ReactNode } from 'react';
import DashboardNavigation from './DashboardNavigation';

interface UnifiedDashboardProps {
  children: ReactNode;
}

const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavigation />
      <div className="container mx-auto p-4">
        {children}
      </div>
    </div>
  );
};

export default UnifiedDashboard;
