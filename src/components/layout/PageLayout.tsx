
import React from 'react';
import TabNavigation from '@/components/dashboard/TabNavigation';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ 
  children,
  title,
  description
}) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white border-b border-gray-200 mb-6">
        <div className="container mx-auto px-4 py-4">
          <TabNavigation />
        </div>
      </header>
      
      <main className="container mx-auto">
        {children}
      </main>
    </div>
  );
};
