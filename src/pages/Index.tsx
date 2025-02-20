
import React from 'react';
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import FeatureGrid from '@/components/dashboard/FeatureGrid';
import TabNavigation from '@/components/dashboard/TabNavigation';
import SiteStructureVisualizer from '@/components/SiteStructureVisualizer';
import ContentHierarchy from '@/components/ContentHierarchy';
import UrlInput from '@/components/UrlInput';
import SeoResults from '@/components/SeoResults';
import BacklinksAnalysis from '@/components/seo/BacklinksAnalysis';
import KeywordSuggestions from '@/components/seo/KeywordSuggestions';
import MobileAnalysis from '@/components/seo/MobileAnalysis';
import SeoSuggestions from '@/components/seo/SeoSuggestions';
import AdvancedOptimizations from '@/components/seo/AdvancedOptimizations';
import AnalyticsOverview from '@/components/seo/AnalyticsOverview';
import SignatureGenerator from '@/components/signature/SignatureGenerator';
import SiteComparison from '@/components/seo/SiteComparison';

const Index = () => {
  const {
    url,
    setUrl,
    isLoading,
    showCorsWarning,
    seoAnalysis,
    siteStructure,
    analyzeSite,
    error
  } = useSiteAnalyzer();

  const handleActivateProxy = () => {
    window.open('https://cors-anywhere.herokuapp.com/corsdemo', '_blank');
  };

  const [comparisonSite, setComparisonSite] = React.useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <DashboardHeader />

        <div className="mb-12">
          <FeatureGrid />

          <Card className="p-8 shadow-xl bg-gradient-to-br from-purple-50 to-blue-50 border-0">
            <UrlInput 
              url={url}
              setUrl={setUrl}
              onAnalyze={analyzeSite}
              isLoading={isLoading}
            />
            {showCorsWarning && (
              <div className="mt-6">
                <Alert className="bg-yellow-50 border-yellow-200 mb-4">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    Pour accéder aux sites web, vous devez d'abord activer le proxy CORS. Cliquez sur le bouton ci-dessous, puis sur "Request temporary access".
                  </AlertDescription>
                </Alert>
                <Button 
                  onClick={handleActivateProxy}
                  variant="outline"
                  className="w-full bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-400 text-yellow-700 font-medium h-auto py-4"
                >
                  <div className="flex flex-col items-center w-full">
                    <span className="flex items-center mb-1">
                      Étape 1: Activer le Proxy CORS
                      <AlertCircle className="ml-2 h-4 w-4" />
                    </span>
                    <span className="text-sm text-yellow-600">
                      Une fois activé, revenez ici pour analyser votre site
                    </span>
                  </div>
                </Button>
              </div>
            )}
          </Card>

          {error && (
            <Alert className="mt-4 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Tabs defaultValue="seo" className="space-y-6">
          <TabNavigation />

          <TabsContent value="seo">
            {isLoading ? (
              <Card className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </Card>
            ) : seoAnalysis ? (
              <div className="space-y-6">
                <SeoResults seoAnalysis={seoAnalysis} />
                <SiteComparison 
                  site1={{ url, analysis: seoAnalysis }}
                  site2={comparisonSite ? { url: comparisonSite, analysis: seoAnalysis } : undefined}
                  onCompare={setComparisonSite}
                />
                <KeywordSuggestions suggestions={seoAnalysis.keywordSuggestions || []} />
                <MobileAnalysis 
                  viewportMeta={seoAnalysis.mobileAnalysis?.viewportMeta || false}
                  responsiveImages={seoAnalysis.mobileAnalysis?.responsiveImages || false}
                  touchTargetSize={seoAnalysis.mobileAnalysis?.touchTargetSize || false}
                  fontScale={seoAnalysis.mobileAnalysis?.fontScale || false}
                  score={seoAnalysis.mobileAnalysis?.score || 0}
                />
                <SeoSuggestions suggestions={seoAnalysis.technicalSuggestions || []} />
              </div>
            ) : null}
          </TabsContent>

          <TabsContent value="structure">
            {isLoading ? (
              <Card className="p-6">
                <Skeleton className="h-[400px]" />
              </Card>
            ) : siteStructure ? (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Structure du Site</h2>
                <SiteStructureVisualizer structure={siteStructure} />
              </Card>
            ) : null}
          </TabsContent>

          <TabsContent value="hierarchy">
            {isLoading ? (
              <Card className="p-6">
                <Skeleton className="h-[300px]" />
              </Card>
            ) : seoAnalysis ? (
              <ContentHierarchy 
                headings={seoAnalysis.headings || []} 
                paragraphs={seoAnalysis.paragraphs || []} 
              />
            ) : null}
          </TabsContent>

          <TabsContent value="backlinks">
            {isLoading ? (
              <Card className="p-6">
                <Skeleton className="h-[300px]" />
              </Card>
            ) : seoAnalysis ? (
              <BacklinksAnalysis 
                backlinks={seoAnalysis.backlinks}
                backlinkDetails={seoAnalysis.backlinkDetails}
                topBacklinkDomains={seoAnalysis.topBacklinkDomains}
                doFollowBacklinks={seoAnalysis.doFollowBacklinks}
                noFollowBacklinks={seoAnalysis.noFollowBacklinks}
              />
            ) : null}
          </TabsContent>

          <TabsContent value="metrics">
            {isLoading ? (
              <Card className="p-6">
                <Skeleton className="h-[400px]" />
              </Card>
            ) : (
              <AnalyticsOverview />
            )}
          </TabsContent>

          <TabsContent value="advanced">
            {isLoading ? (
              <Card className="p-6">
                <Skeleton className="h-[300px]" />
              </Card>
            ) : seoAnalysis ? (
              <AdvancedOptimizations 
                content={seoAnalysis.paragraphs.map(p => p.text).join(' ')}
                links={seoAnalysis.backlinkDetails.map(b => b.url)}
              />
            ) : null}
          </TabsContent>

          <TabsContent value="integrations">
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Button
                  variant="outline"
                  className="p-6 h-auto flex flex-col items-center gap-4 text-center"
                  onClick={() => window.open('https://search.google.com/search-console', '_blank')}
                >
                  <AlertCircle className="h-8 w-8" />
                  <div>
                    <h3 className="font-semibold mb-2">Google Search Console</h3>
                    <p className="text-sm text-gray-600">Connectez-vous pour voir les données en temps réel</p>
                  </div>
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="signature">
            <Card className="p-6">
              <SignatureGenerator />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
