
import React from 'react';
import SeoResults from '@/components/SeoResults';
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';
import { CrawlForm } from '@/components/CrawlForm';
import { Card } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';

const SeoPage = () => {
  const { seoAnalysis, isLoading } = useSiteAnalyzer();

  return (
    <UnifiedDashboard>
      <div className="space-y-6">
        {seoAnalysis ? (
          <SeoResults seoAnalysis={seoAnalysis} />
        ) : (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Analyse SEO</h2>
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Analysez un site web</AlertTitle>
              <AlertDescription>
                Utilisez l'outil d'analyse ci-dessous pour évaluer les performances SEO d'un site.
                Vous aurez accès aux métriques de performance et d'analytics une fois l'analyse terminée.
              </AlertDescription>
            </Alert>
            <CrawlForm />
          </Card>
        )}
      </div>
    </UnifiedDashboard>
  );
};

export default SeoPage;
