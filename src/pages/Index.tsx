import React from 'react';
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ExternalLink, Search, Globe, AlertCircle, Link2, ChartBar, Database } from "lucide-react";
import SiteStructureVisualizer from '@/components/SiteStructureVisualizer';
import ContentHierarchy from '@/components/ContentHierarchy';
import UrlInput from '@/components/UrlInput';
import SeoResults from '@/components/SeoResults';
import UrlShortener from '@/components/UrlShortener';
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BacklinksAnalysis from '@/components/seo/BacklinksAnalysis';
import { CrawlForm } from '@/components/CrawlForm';

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text mb-4">
              Analyseur de Site Web
            </h1>
            <p className="text-lg text-gray-600">
              Analysez et optimisez votre site web en quelques clics
            </p>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline"
              onClick={handleActivateProxy}
              className="bg-white hover:bg-blue-50 transition-all duration-300"
            >
              Activer le Proxy CORS <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {showCorsWarning && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-800">
              Pour utiliser cet outil, vous devez d'abord activer le proxy CORS en cliquant sur le bouton ci-dessus.
            </AlertDescription>
          </Alert>
        )}

        <Card className="p-6 shadow-lg bg-white/50 backdrop-blur-sm">
          <UrlInput 
            url={url}
            setUrl={setUrl}
            onAnalyze={analyzeSite}
            isLoading={isLoading}
          />
        </Card>

        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-800">
              Erreur lors de l'analyse : {error}
            </AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className="space-y-4">
            <Card className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </Card>
          </div>
        )}

        {url && !isLoading && !error && (
          <Tabs defaultValue="seo" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-white/50 backdrop-blur-sm">
              <TabsTrigger value="seo" className="space-x-2 data-[state=active]:bg-blue-50">
                <Search className="h-4 w-4" />
                <span>SEO</span>
              </TabsTrigger>
              <TabsTrigger value="structure" className="space-x-2 data-[state=active]:bg-blue-50">
                <Globe className="h-4 w-4" />
                <span>Structure</span>
              </TabsTrigger>
              <TabsTrigger value="hierarchy" className="space-x-2 data-[state=active]:bg-blue-50">
                <Database className="h-4 w-4" />
                <span>Hiérarchie</span>
              </TabsTrigger>
              <TabsTrigger value="backlinks" className="space-x-2 data-[state=active]:bg-blue-50">
                <Link2 className="h-4 w-4" />
                <span>Backlinks</span>
              </TabsTrigger>
              <TabsTrigger value="metrics" className="space-x-2 data-[state=active]:bg-blue-50">
                <ChartBar className="h-4 w-4" />
                <span>Métriques</span>
              </TabsTrigger>
              <TabsTrigger value="tools" className="space-x-2 data-[state=active]:bg-blue-50">
                <Globe className="h-4 w-4" />
                <span>Outils</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="seo" className="space-y-6">
              {seoAnalysis && (
                <SeoResults seoAnalysis={seoAnalysis} />
              )}
            </TabsContent>

            <TabsContent value="structure">
              {siteStructure && (
                <Card className="p-6 shadow-md bg-white/50 backdrop-blur-sm">
                  <h2 className="text-2xl font-semibold mb-4">Structure du Site</h2>
                  <SiteStructureVisualizer structure={siteStructure} />
                </Card>
              )}
            </TabsContent>

            <TabsContent value="hierarchy">
              {seoAnalysis && (
                <ContentHierarchy 
                  headings={seoAnalysis.headings || []} 
                  paragraphs={seoAnalysis.paragraphs || []} 
                />
              )}
            </TabsContent>

            <TabsContent value="backlinks">
              {seoAnalysis && (
                <BacklinksAnalysis 
                  backlinks={seoAnalysis.backlinks}
                  backlinkDetails={seoAnalysis.backlinkDetails}
                  topBacklinkDomains={seoAnalysis.topBacklinkDomains}
                  doFollowBacklinks={seoAnalysis.doFollowBacklinks}
                  noFollowBacklinks={seoAnalysis.noFollowBacklinks}
                />
              )}
            </TabsContent>

            <TabsContent value="metrics" className="space-y-6">
              <Card className="p-6 shadow-md bg-white/50 backdrop-blur-sm">
                <h2 className="text-2xl font-semibold mb-4">Métriques Détaillées</h2>
                {seoAnalysis && (
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Pages Indexées</p>
                      <p className="text-2xl font-bold text-blue-600">{seoAnalysis.indexability.indexablePages || 0}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Score de Performance</p>
                      <p className="text-2xl font-bold text-green-600">{seoAnalysis.performance.score || 0}/100</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600">Score Mobile</p>
                      <p className="text-2xl font-bold text-purple-600">{seoAnalysis.mobilePerformance.score || 0}/100</p>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="tools" className="space-y-6">
              <Card className="p-6 shadow-md bg-white/50 backdrop-blur-sm">
                <h2 className="text-2xl font-semibold mb-4">Outils SEO</h2>
                <div className="space-y-6">
                  <CrawlForm />
                  <UrlShortener longUrl={url} />
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Index;
