
import React, { useEffect } from 'react';
import TabNavigation from '@/components/dashboard/TabNavigation';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  currentTab?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children,
  title,
  description,
  currentTab
}) => {
  useEffect(() => {
    // Activer l'onglet courant si spécifié
    if (currentTab) {
      console.log(`PageLayout activating section: ${currentTab}`);
      
      // Masquer toutes les sections d'abord
      const allSections = document.querySelectorAll('[data-section]');
      allSections.forEach((section) => {
        (section as HTMLElement).style.display = 'none';
      });
      
      // Puis afficher la section demandée
      const section = document.querySelector(`[data-section="${currentTab}"]`);
      if (section) {
        console.log(`Found section ${currentTab}, displaying it`);
        (section as HTMLElement).style.display = 'block';
      } else {
        console.warn(`Section ${currentTab} not found in DOM`);
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

export default PageLayout;
export { PageLayout };
