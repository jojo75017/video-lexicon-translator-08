import React from 'react';
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import SiteStructureVisualizer from '@/components/SiteStructureVisualizer';
import ResourcesAnalyzer from '@/components/ResourcesAnalyzer';
import UrlInput from '@/components/UrlInput';
import SeoResults from '@/components/SeoResults';
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';

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

  const renderContent = () => {
    if (error) {
      return (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription>
            Erreur lors de l'analyse : {error}
          </AlertDescription>
        </Alert>
      );
    }

    if (isLoading) {
      return (
        <div className="space-y-4">
          <Card className="p-6">
            <Skeleton className="h-[200px] w-full" />
          </Card>
          <Card className="p-6">
            <Skeleton className="h-[200px] w-full" />
          </Card>
        </div>
      );
    }

    return (
      <>
        {seoAnalysis && (
          <SeoResults seoAnalysis={seoAnalysis} />
        )}

        {resources.length > 0 && (
          <ResourcesAnalyzer resources={resources} />
        )}

        {siteStructure && (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Structure du Site</h2>
            <SiteStructureVisualizer structure={siteStructure} />
          </Card>
        )}

        {!seoAnalysis && !resources.length && !siteStructure && !isLoading && url && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertDescription>
              Aucun résultat trouvé. Vérifiez que l'URL est correcte et réessayez.
            </AlertDescription>
          </Alert>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Générateur d'Architecture Web</h1>
          <p className="text-lg text-gray-600">Analysez et visualisez la structure de n'importe quel site web</p>
        </div>

        {showCorsWarning && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertDescription>
              Pour utiliser cet outil, vous devez d'abord activer le proxy CORS en visitant{' '}
              <a 
                href="https://cors-anywhere.herokuapp.com/corsdemo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium underline hover:text-blue-600"
              >
                https://cors-anywhere.herokuapp.com/corsdemo
              </a>
              {' '}et en cliquant sur le bouton d'activation.
            </AlertDescription>
          </Alert>
        )}

        <Card className="p-6">
          <UrlInput 
            url={url}
            setUrl={setUrl}
            onAnalyze={analyzeSite}
            isLoading={isLoading}
          />
        </Card>

        {renderContent()}
      </div>
    </div>
  );
};

export default Index;