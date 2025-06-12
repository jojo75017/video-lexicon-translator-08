
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import NewsletterGenerator from '@/components/newsletter/NewsletterGenerator';

const NewsletterPage = () => {
  return (
    <PageLayout 
      title="Générateur de Newsletter" 
      description="Créez des newsletters professionnelles pour n'importe quelle niche"
    >
      <NewsletterGenerator />
    </PageLayout>
  );
};

export default NewsletterPage;
