
import React, { useState } from 'react';
import SeoResults from '@/components/SeoResults';
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';
import { CrawlForm } from '@/components/CrawlForm';
import { Card } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import PerformanceHighlights from '@/components/seo/performance/PerformanceHighlights';
import Recommendations from '@/components/seo/performance/Recommendations';
import KeywordGenerator from '@/components/seo/KeywordGenerator';

const SeoPage = () => {
  const { seoAnalysis, isLoading } = useSiteAnalyzer();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeDevice, setActiveDevice] = useState<'mobile' | 'desktop'>('mobile');

  // Example performance data in case the real data is missing
  const defaultPerformanceData = {
    score: 75,
    loadTime: 2500,
    firstContentfulPaint: 1200,
    domLoadTime: 1800,
    timeToInteractive: 3000,
    totalBlockingTime: 450,
    largestContentfulPaint: 2200,
    cumulativeLayoutShift: 0.25,
    totalSize: 1500000,
    scriptCount: 12,
    styleCount: 5,
    responseTime: 350,
    resourceBreakdown: {
      js: 850000,
      css: 150000,
      images: 450000,
      fonts: 50000,
      other: 50000
    }
  };

  // Get performance data from seoAnalysis if available, otherwise use default data
  const performanceData = seoAnalysis?.performance?.mobile || defaultPerformanceData;

  return (
    <UnifiedDashboard>
      <div className="space-y-6">
        {seoAnalysis ? (
          <Tabs defaultValue="overview" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">Résultats de l'analyse SEO</h1>
            </div>
            
            <TabsContent value="overview" className="mt-4 space-y-6">
              <SeoResults seoAnalysis={seoAnalysis} />
            </TabsContent>
            
            <TabsContent value="performance" className="mt-4 space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Performance</h2>
                <PerformanceHighlights 
                  deviceData={performanceData}
                  activeDevice={activeDevice}
                />
                <div className="mt-8">
                  <Recommendations 
                    deviceData={performanceData}
                    activeDevice={activeDevice}
                  />
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="keywords" className="mt-4 space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Générateur de mots-clés</h2>
                <KeywordGenerator />
              </Card>
            </TabsContent>
          </Tabs>
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
