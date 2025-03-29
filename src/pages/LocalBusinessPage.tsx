
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import LocalBusinessSection from '@/components/LocalBusinessSection';
import SectionEntreprisesLocales from '@/components/SectionEntreprisesLocales';

const LocalBusinessPage = () => {
  return (
    <PageLayout title="Entreprises Locales" description="Optimisez votre présence en ligne locale">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Solutions pour entreprises locales</h1>
        
        <LocalBusinessSection />
        
        <SectionEntreprisesLocales />
      </div>
    </PageLayout>
  );
};

export default LocalBusinessPage;
