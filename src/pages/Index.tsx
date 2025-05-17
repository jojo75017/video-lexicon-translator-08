
import React, { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import SeoAnalysisForm from '@/components/seo/analysis/SeoAnalysisForm';
import ResultsDisplay from '@/components/seo/analysis/ResultsDisplay';
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';
import KeywordSuggestions from '@/components/seo/analysis/KeywordSuggestions';
import '@/styles/explorer-scrollbar.css';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import AnalysisSettings from '@/components/settings/AnalysisSettings';

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
          </Card>
        </div>
      )}
    </UnifiedDashboard>
  );
};

console.log("🚀 Index Page - Rendering complete");

export default IndexPage;
