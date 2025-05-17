
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info, FileText, Tag, LinkIcon, LineChart } from "lucide-react";
import SeoAnalysisForm from '@/components/seo/analysis/SeoAnalysisForm';
import ResultsDisplay from '@/components/seo/analysis/ResultsDisplay';
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';
import KeywordSuggestions from '@/components/seo/analysis/KeywordSuggestions';
import '@/styles/explorer-scrollbar.css';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import AnalysisSettings from '@/components/settings/AnalysisSettings';
import { Button } from '@/components/ui/button';

console.log("🚀 Index Page - Rendering started");

const IndexPage = () => {
  const {
    url,
    setUrl,
    isLoading,
    showCorsWarning,
    seoAnalysis,
    analyzeSite,
    error,
    handleActivateProxy
  } = useSiteAnalyzer();

  useEffect(() => {
    console.log("🔍 IndexPage - Component Mounted");
  }, []);

  return (
    <UnifiedDashboard>
      <div className="mb-8">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Analysez votre site</h2>
          <SeoAnalysisForm 
            url={url}
            setUrl={setUrl}
            isLoading={isLoading}
            showCorsWarning={showCorsWarning}
            analyzeSite={analyzeSite}
            error={error}
            handleActivateProxy={handleActivateProxy}
          />
        </Card>
      </div>
      
      {!seoAnalysis && !isLoading && (
        <div className="mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Outils SEO disponibles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link to="/keyword-meta">
                <Card className="p-4 bg-blue-50 hover:bg-blue-100 transition-colors h-full flex flex-col">
                  <div className="flex items-center mb-3">
                    <Tag className="h-5 w-5 mr-2 text-blue-600" />
                    <h3 className="font-medium">Title & Meta</h3>
                  </div>
                  <p className="text-sm text-gray-600">Optimisez vos balises title et meta pour un meilleur référencement.</p>
                </Card>
              </Link>
              
              <Link to="/internal-linking">
                <Card className="p-4 bg-purple-50 hover:bg-purple-100 transition-colors h-full flex flex-col">
                  <div className="flex items-center mb-3">
                    <LinkIcon className="h-5 w-5 mr-2 text-purple-600" />
                    <h3 className="font-medium">Liens Internes</h3>
                  </div>
                  <p className="text-sm text-gray-600">Améliorez votre structure de liens internes pour optimiser le maillage.</p>
                </Card>
              </Link>
              
              <Link to="/tracking">
                <Card className="p-4 bg-green-50 hover:bg-green-100 transition-colors h-full flex flex-col">
                  <div className="flex items-center mb-3">
                    <LineChart className="h-5 w-5 mr-2 text-green-600" />
                    <h3 className="font-medium">Suivi Positions</h3>
                  </div>
                  <p className="text-sm text-gray-600">Suivez l'évolution de vos positions dans les moteurs de recherche.</p>
                </Card>
              </Link>
            </div>
          </Card>
        </div>
      )}
      
      {!seoAnalysis && !isLoading && (
        <div className="mb-8">
          <AnalysisSettings />
        </div>
      )}
      
      {seoAnalysis && seoAnalysis.keywordSuggestions && seoAnalysis.keywordSuggestions.length > 0 && (
        <div className="mb-6">
          <KeywordSuggestions 
            generatedKeywords={seoAnalysis.keywordSuggestions} 
            onGenerateClick={() => analyzeSite()}
          />
        </div>
      )}
      
      {seoAnalysis && (
        <div className="mb-8 results-display">
          <ResultsDisplay seoAnalysis={seoAnalysis} />
        </div>
      )}
      
      {!seoAnalysis && !isLoading && (
        <div className="mb-8">
          <Card className="p-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Bienvenue dans votre tableau de bord SEO</AlertTitle>
              <AlertDescription>
                Utilisez l'outil d'analyse ci-dessus pour évaluer les performances SEO de votre site web.
                Vous pouvez également accéder à différents outils via les onglets du tableau de bord.
              </AlertDescription>
            </Alert>
            
            <div className="mt-6 flex justify-center">
              <Link to="/keyword-meta">
                <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Accéder au générateur Title & Meta
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}
    </UnifiedDashboard>
  );
};

console.log("🚀 Index Page - Rendering complete");

export default IndexPage;
