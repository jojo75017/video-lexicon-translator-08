import React from 'react';
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ExternalLink, Search, FileSearch, Globe, AlertCircle } from "lucide-react";
import SiteStructureVisualizer from '@/components/SiteStructureVisualizer';
import ResourcesAnalyzer from '@/components/ResourcesAnalyzer';
import UrlInput from '@/components/UrlInput';
import SeoResults from '@/components/SeoResults';
import UrlShortener from '@/components/UrlShortener';
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const {
    url,
    setUrl,
    isLoading,
    showCorsWarning,
    seoAnalysis,
    resources,
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
            <Card className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </Card>
          </div>
        )}

        {url && !isLoading && !error && (
          <Tabs defaultValue="seo" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
              <TabsTrigger value="seo" className="space-x-2 data-[state=active]:bg-blue-50">
                <Search className="h-4 w-4" />
                <span>SEO</span>
              </TabsTrigger>
              <TabsTrigger value="resources" className="space-x-2 data-[state=active]:bg-blue-50">
                <FileSearch className="h-4 w-4" />
                <span>Ressources</span>
              </TabsTrigger>
              <TabsTrigger value="structure" className="space-x-2 data-[state=active]:bg-blue-50">
                <Globe className="h-4 w-4" />
                <span>Structure</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="seo" className="space-y-6">
              <Card className="p-6 shadow-md bg-white/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-semibold mb-4">Raccourcir l'URL</h2>
                <UrlShortener longUrl={url} />
              </Card>

              {seoAnalysis && (
                <SeoResults seoAnalysis={seoAnalysis} />
              )}
            </TabsContent>

            <TabsContent value="resources">
              {resources && resources.length > 0 && (
                <ResourcesAnalyzer resources={resources} />
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
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Index;