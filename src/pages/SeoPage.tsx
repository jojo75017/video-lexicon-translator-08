
import React, { useState } from 'react';
import SeoResults from '@/components/SeoResults';
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';
import { CrawlForm } from '@/components/CrawlForm';
import { Card } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PerformanceHighlights from '@/components/seo/performance/PerformanceHighlights';
import Recommendations from '@/components/seo/performance/Recommendations';
import KeywordGenerator from '@/components/seo/KeywordGenerator';
import AnalyticsOverview from '@/components/seo/AnalyticsOverview';

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
      <div className="space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-lg">
        {seoAnalysis ? (
          <Tabs defaultValue="overview" className="w-full">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Résultats de l'analyse SEO</h1>
              
              <TabsList className="bg-white/80 backdrop-blur-sm shadow-md">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  onClick={() => setActiveTab('overview')}
                >
                  Aperçu
                </TabsTrigger>
                <TabsTrigger 
                  value="performance"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                  onClick={() => setActiveTab('performance')}
                >
                  Performance
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  onClick={() => setActiveTab('analytics')}
                >
                  Analytics
                </TabsTrigger>
                <TabsTrigger 
                  value="keywords"
                  className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                  onClick={() => setActiveTab('keywords')}
                >
                  Mots-clés
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="overview" className="mt-4 space-y-6">
              <Card className="p-6 border-t-4 border-blue-600 shadow-lg hover:shadow-xl transition-shadow">
                <SeoResults seoAnalysis={seoAnalysis} />
              </Card>
            </TabsContent>
            
            <TabsContent value="performance" className="mt-4 space-y-6">
              <Card className="p-6 border-t-4 border-green-600 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-teal-600 text-transparent bg-clip-text">Performance</h2>
                  <div className="flex space-x-2">
                    <button 
                      className={`px-4 py-2 rounded-md text-sm ${activeDevice === 'mobile' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                      onClick={() => setActiveDevice('mobile')}
                    >
                      Mobile
                    </button>
                    <button 
                      className={`px-4 py-2 rounded-md text-sm ${activeDevice === 'desktop' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                      onClick={() => setActiveDevice('desktop')}
                    >
                      Desktop
                    </button>
                  </div>
                </div>
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
            
            <TabsContent value="analytics" className="mt-4 space-y-6">
              <Card className="p-6 border-t-4 border-purple-600 shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-6">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">Analytics</h2>
                </div>
                <AnalyticsOverview />
              </Card>
            </TabsContent>
            
            <TabsContent value="keywords" className="mt-4 space-y-6">
              <Card className="p-6 border-t-4 border-orange-600 shadow-lg hover:shadow-xl transition-shadow">
                <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-amber-600 text-transparent bg-clip-text">Générateur de mots-clés</h2>
                <KeywordGenerator />
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg border-l-4 border-blue-600">
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Analyse SEO</h2>
            <Alert className="mb-6 bg-blue-50 border border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-700">Analysez un site web</AlertTitle>
              <AlertDescription className="text-blue-600">
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
