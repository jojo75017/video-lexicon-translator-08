
import React, { useEffect } from 'react';
import TabNavigation from '@/components/dashboard/TabNavigation';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  currentTab?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ 
  children,
  title,
  description,
  currentTab
}) => {
  useEffect(() => {
    // Activer l'onglet courant si spécifié
    if (currentTab) {
      console.log(`PageLayout activating section: ${currentTab}`);
      const section = document.querySelector(`[data-section="${currentTab}"]`);
      if (section) {
        (section as HTMLElement).style.display = 'block';
      }
    }
  }, [currentTab]);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white border-b border-gray-200 mb-6">
        <div className="container mx-auto px-4 py-4">
          <TabNavigation />
        </div>
      </header>
      
      <main className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && (
            <p className="text-gray-600 mt-2">
              {description}
            </p>
          )}
        </div>
        
        {children}
      </main>
    </div>
  );
};
