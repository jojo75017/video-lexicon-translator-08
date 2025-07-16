
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import NewsletterGenerator from '@/components/newsletter/NewsletterGenerator';
import DashboardNavigation from '@/components/dashboard/DashboardNavigation';

const NewsletterPage = () => {
  return (
    <div>
      <DashboardNavigation />
      <PageLayout 
        title="Générateur de Newsletter" 
        description="Créez des newsletters professionnelles pour n'importe quelle niche"
      >
        <NewsletterGenerator />
      </PageLayout>
    </div>
  );
};

export default NewsletterPage;
