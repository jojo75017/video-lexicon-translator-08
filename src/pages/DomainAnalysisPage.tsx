
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import DomainAnalysis from '@/components/seo/DomainAnalysis';

const DomainAnalysisPage: React.FC = () => {
  return (
    <PageLayout
      title="Analyse de Domaine"
      description="Analysez n'importe quel domaine pour obtenir des insights concurrentiels complets"
    >
      <DomainAnalysis />
    </PageLayout>
  );
};

export default DomainAnalysisPage;
