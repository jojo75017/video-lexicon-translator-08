
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
import { toast } from 'sonner';

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
  const desktopPerformanceData = seoAnalysis?.performance?.desktop || {
    ...defaultPerformanceData,
    score: 82,
    loadTime: 2000,
    firstContentfulPaint: 900,
    domLoadTime: 1500
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    toast.info(`Onglet ${value} activé`, {
      description: `Affichage des données ${value === 'performance' ? 'de performance' : 
                     value === 'analytics' ? 'd\'analytics' : 
                     value === 'keywords' ? 'de mots-clés' : 
                     'de l\'aperçu'}`,
      duration: 2000
    });
  };

  return (
    <UnifiedDashboard>
      <div className="space-y-6 p-4 md:p-6 rounded-lg shadow-inner animate-fade-in bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
        {seoAnalysis ? (
          <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                Résultats de l'analyse SEO
              </h1>
              
              <TabsList className="bg-white/70 backdrop-blur-sm shadow-lg border border-indigo-100">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all hover:bg-blue-50"
                >
                  Aperçu
                </TabsTrigger>
                <TabsTrigger 
                  value="performance"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white transition-all hover:bg-green-50"
                >
                  Performance
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white transition-all hover:bg-purple-50"
                >
                  Analytics
                </TabsTrigger>
                <TabsTrigger 
                  value="keywords"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white transition-all hover:bg-amber-50"
                >
                  Mots-clés
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="overview" className="mt-4 space-y-6 animate-fade-in">
              <Card className="p-6 border-t-4 border-blue-600 shadow-xl hover:shadow-2xl transition-all bg-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 z-0"></div>
                <div className="relative z-10">
                  <SeoResults seoAnalysis={seoAnalysis} />
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="performance" className="mt-4 space-y-6 animate-fade-in">
              <Card className="p-6 border-t-4 border-green-600 shadow-xl hover:shadow-2xl transition-all bg-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 z-0"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">Performance</h2>
                    <div className="flex space-x-2">
                      <button 
                        className={`px-5 py-2.5 rounded-md text-sm shadow-md transition-all ${
                          activeDevice === 'mobile' 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium scale-105' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setActiveDevice('mobile')}
                      >
                        Mobile
                      </button>
                      <button 
                        className={`px-5 py-2.5 rounded-md text-sm shadow-md transition-all ${
                          activeDevice === 'desktop' 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium scale-105' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setActiveDevice('desktop')}
                      >
                        Desktop
                      </button>
                    </div>
                  </div>
                  <PerformanceHighlights 
                    deviceData={activeDevice === 'mobile' ? performanceData : desktopPerformanceData}
                    activeDevice={activeDevice}
                  />
                  <div className="mt-8">
                    <Recommendations 
                      deviceData={activeDevice === 'mobile' ? performanceData : desktopPerformanceData}
                      activeDevice={activeDevice}
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-4 space-y-6 animate-fade-in">
              <Card className="p-6 border-t-4 border-purple-600 shadow-xl hover:shadow-2xl transition-all bg-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-fuchsia-50/50 z-0"></div>
                <div className="relative z-10">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-600">Analytics</h2>
                  </div>
                  <AnalyticsOverview />
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="keywords" className="mt-4 space-y-6 animate-fade-in">
              <Card className="p-6 border-t-4 border-amber-600 shadow-xl hover:shadow-2xl transition-all bg-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50 z-0"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Générateur de mots-clés</h2>
                  <KeywordGenerator />
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="p-6 bg-white shadow-xl border-l-4 border-indigo-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 z-0"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Analyse SEO</h2>
              <Alert className="mb-6 bg-blue-50 border border-blue-200">
                <Info className="h-5 w-5 text-blue-600" />
                <AlertTitle className="text-blue-700 font-bold">Analysez un site web</AlertTitle>
                <AlertDescription className="text-blue-600">
                  Utilisez l'outil d'analyse ci-dessous pour évaluer les performances SEO d'un site.
                  Vous aurez accès aux métriques de performance et d'analytics une fois l'analyse terminée.
                </AlertDescription>
              </Alert>
              <CrawlForm />
            </div>
          </Card>
        )}
      </div>
    </UnifiedDashboard>
  );
};

export default SeoPage;
