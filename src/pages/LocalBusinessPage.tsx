
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import LocalBusinessSection from '@/components/LocalBusinessSection';
import SectionEntreprisesLocales from '@/components/SectionEntreprisesLocales';

const LocalBusinessPage = () => {
  return (
    <PageLayout 
      title="Entreprises Locales" 
      description="Optimisez votre présence en ligne locale"
      currentTab="local-business"
    >
      <div data-section="local-business" className="py-6">
        <LocalBusinessSection />
        <div className="mt-8">
          <SectionEntreprisesLocales />
        </div>
      </div>
    </PageLayout>
  );
};

export default LocalBusinessPage;
