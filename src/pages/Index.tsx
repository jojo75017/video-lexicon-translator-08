
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, Search, Signature, BarChart, ChevronRight, Settings } from "lucide-react";
import { Github } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { MessageSquareText } from 'lucide-react';
import TabNavigation from '@/components/dashboard/TabNavigation';
import FeatureGrid from '@/components/dashboard/FeatureGrid';
import SeoAnalysisForm from '@/components/seo/analysis/SeoAnalysisForm';
import ResultsDisplay from '@/components/seo/analysis/ResultsDisplay';
import { toast } from "sonner";
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';
import PageHeader from '@/components/dashboard/PageHeader';
import LocalBusinessSection from '@/components/LocalBusinessSection';
import KeywordSuggestions from '@/components/seo/analysis/KeywordSuggestions';
import PageExplorer from '@/components/explorer/PageExplorer';
import '@/styles/explorer-scrollbar.css';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SeoActionButtons from '@/components/dashboard/SeoActionButtons';
import AnalysisSettings from '@/components/settings/AnalysisSettings';

console.log("🚀 Index Page - Rendering started");

const IndexPage = () => {
  const {
    url,
    setUrl,
    isLoading,
    showCorsWarning,
    seoAnalysis,
    resources,
    siteStructure,
    analyzeSite,
    error,
    handleActivateProxy
  } = useSiteAnalyzer();

  useEffect(() => {
    console.log("🔍 IndexPage - Component Mounted");
    console.log("Current URL state:", url);
    console.log("SEO Analysis:", seoAnalysis);
    console.log("Loading state:", isLoading);
    console.log("Error:", error);
  }, []);

  // Helper function to safely format heading level
  const formatHeadingLevel = (level: any) => {
    if (typeof level === 'string' && level.toUpperCase) {
      return level.toUpperCase();
    }
    if (typeof level === 'number') {
      return `H${level}`;
    }
    return String(level || '');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
        <div className="container flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Rocket className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl">SEO-GPT</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link to="/seo" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Outils SEO
            </Link>
            <Link to="/settings" className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
              <Settings className="h-4 w-4" />
              <span>Paramètres</span>
            </Link>
            <ModeToggle />
            <a href="https://github.com/your-github-repo" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm">
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </nav>
        </div>
      </header>
      
      <main className="container py-8 flex-grow">
        <PageHeader />
        
        <div className="mb-8">
          <DashboardHeader />
        </div>
        
        <div className="mb-8">
          <SeoActionButtons />
        </div>
        
        <div className="mb-8">
          <TabNavigation />
        </div>
        
        <div className="mb-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Search className="mr-2 h-6 w-6 text-indigo-600" />
              Analysez votre site
            </h2>
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
              onGenerateClick={() => {
                toast.info("Génération de nouvelles suggestions...");
                analyzeSite();
              }}
            />
          </div>
        )}
        
        {seoAnalysis && (
          <div className="mb-8 results-display">
            <ResultsDisplay seoAnalysis={seoAnalysis} />
          </div>
        )}
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <BarChart className="mr-2 h-6 w-6 text-indigo-600" />
            Outils d'analyse SEO
          </h2>
          <FeatureGrid />
        </div>
      </main>
    </div>
  );
};

const ModeToggle = () => {
  return (
    <Button variant="outline" size="icon">
      <span className="sr-only">Toggle theme</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
    </Button>
  );
};

console.log("🚀 Index Page - Rendering complete");

export default IndexPage;
