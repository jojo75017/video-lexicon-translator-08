import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, Search, Signature, BarChart, ChevronRight } from "lucide-react";
import { Github } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { MessageSquareText } from 'lucide-react';
import TabNavigation from '@/components/dashboard/TabNavigation';
import FeatureGrid from '@/components/dashboard/FeatureGrid';
import InfoCards from '@/components/seo/InfoCards';
import SeoAnalysisForm from '@/components/seo/analysis/SeoAnalysisForm';
import ResultsDisplay from '@/components/seo/analysis/ResultsDisplay';
import { toast } from "sonner";
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';
import { activateSection } from '@/utils/navigationHelpers';
import PageHeader from '@/components/dashboard/PageHeader';
import LocalBusinessSection from '@/components/LocalBusinessSection';
import KeywordSuggestions from '@/components/seo/analysis/KeywordSuggestions';
import PageExplorer from '@/components/explorer/PageExplorer';
import '@/styles/explorer-scrollbar.css';

const ModeToggle = () => {
  return (
    <Button variant="outline" size="icon">
      <span className="sr-only">Toggle theme</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
    </Button>
  );
};

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
    document.querySelectorAll('[data-tab-content]').forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
    
    console.log('IndexPage initialized - hiding all sections initially');
  }, []);

  useEffect(() => {
    if (seoAnalysis) {
      console.log('SEO analysis complete, showing SEO section');
      console.log('Keyword suggestions available:', seoAnalysis.keywordSuggestions?.length || 0);
      
      setTimeout(() => {
        window.location.hash = 'seo';
        activateSection('seo');
        
        toast.success("Analyse SEO terminée", {
          description: "Consultez les résultats ci-dessous",
          duration: 3000
        });
        
        const resultsDisplay = document.querySelector('.results-display');
        if (resultsDisplay) {
          (resultsDisplay as HTMLElement).style.display = 'block';
        }
      }, 100);
    }
  }, [seoAnalysis]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
        <div className="container flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Rocket className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl">SEO-GPT</span>
          </Link>
          <nav className="flex items-center space-x-4">
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
        
        <div className="mb-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Bienvenue sur votre plateforme SEO intelligente
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Optimisez votre présence en ligne grâce à nos outils d'analyse avancés et nos recommandations personnalisées.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-100">
                <div className="text-indigo-600 mb-2">
                  <Search className="h-8 w-8 mx-auto" />
                </div>
                <h3 className="font-semibold mb-2">Analyse complète</h3>
                <p className="text-sm text-gray-600">
                  Évaluez tous les aspects techniques et sémantiques de votre site
                </p>
              </div>
              <div className="bg-purple-50 p-5 rounded-lg border border-purple-100">
                <div className="text-purple-600 mb-2">
                  <BarChart className="h-8 w-8 mx-auto" />
                </div>
                <h3 className="font-semibold mb-2">Rapports détaillés</h3>
                <p className="text-sm text-gray-600">
                  Visualisez vos performances et suivez vos progrès
                </p>
              </div>
              <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                <div className="text-blue-600 mb-2">
                  <Sparkles className="h-8 w-8 mx-auto" />
                </div>
                <h3 className="font-semibold mb-2">IA intégrée</h3>
                <p className="text-sm text-gray-600">
                  Bénéficiez de recommandations intelligentes pour optimiser votre SEO
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <Card className="mb-6">
              <div className="p-6">
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
              </div>
            </Card>
            
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
          </div>
          
          <div className="md:col-span-1">
            <PageExplorer />
          </div>
        </div>
        
        {seoAnalysis && (
          <div className="mb-8 results-display" style={{ display: 'none' }}>
            <ResultsDisplay seoAnalysis={seoAnalysis} />
          </div>
        )}
        
        <div className="mb-8">
          <TabNavigation />
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <BarChart className="mr-2 h-6 w-6 text-indigo-600" />
            Outils d'analyse SEO
          </h2>
          <FeatureGrid />
        </div>
        
        <LocalBusinessSection />
        
        <div id="seo" data-section="seo" data-tab-content="seo" className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100" style={{ display: 'none' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="w-1 h-6 bg-indigo-600 rounded-full mr-3"></span>
            Analyse SEO
          </h2>
          <p className="text-gray-600">Consultez l'analyse détaillée des performances SEO de votre site.</p>
          
          {seoAnalysis && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium mb-2">Résultats de l'analyse pour {url}</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Titre: {seoAnalysis.title}</li>
                <li>Balises Meta: {seoAnalysis.metaTagsAnalysis.hasDescriptionTag ? 'Description présente' : 'Description manquante'}</li>
                <li>Titres H1: {seoAnalysis.h1Count}</li>
                <li>Titres H2: {seoAnalysis.h2Count}</li>
                <li>Images: {seoAnalysis.imgCount} (dont {seoAnalysis.imgWithoutAlt} sans attribut alt)</li>
              </ul>
            </div>
          )}
        </div>
        
        <div id="structure" data-section="structure" data-tab-content="structure" className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100" style={{ display: 'none' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="w-1 h-6 bg-indigo-600 rounded-full mr-3"></span>
            Structure du Site
          </h2>
          <p className="text-gray-600">Visualisez l'architecture de votre site web et identifiez les améliorations possibles.</p>
          
          {siteStructure && siteStructure.headings && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium mb-2">Hiérarchie des titres</h3>
              <div className="pl-4 border-l-2 border-blue-200 space-y-2">
                {siteStructure.headings.map((heading: any, index: number) => (
                  <div 
                    key={index} 
                    className={`py-1.5 px-3 rounded-md ${
                      heading.level === "h1" ? 'bg-blue-50 font-bold ml-0' : 
                      heading.level === "h2" ? 'bg-blue-50/60 font-semibold ml-4' : 
                      heading.level === "h3" ? 'bg-blue-50/30 ml-8' : 
                      'bg-gray-50 ml-12'
                    }`}
                  >
                    {`${heading.level.toUpperCase()}: ${heading.text}`}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div id="hierarchy" data-section="hierarchy" data-tab-content="hierarchy" className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100" style={{ display: 'none' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
            Hiérarchie de contenu
          </h2>
          <p className="text-gray-600">Analysez la structure et la hiérarchie de votre contenu pour améliorer son SEO.</p>
          
        </div>
        
        <div id="wordcount" data-section="wordcount" data-tab-content="wordcount" className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100" style={{ display: 'none' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="w-1 h-6 bg-green-600 rounded-full mr-3"></span>
            Analyse des mots-clés
          </h2>
          <p className="text-gray-600">Examinez la densité et la pertinence des mots-clés dans votre contenu.</p>
          
        </div>
        
        <div id="suggestions" data-section="suggestions" data-tab-content="suggestions" className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100" style={{ display: 'none' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="w-1 h-6 bg-amber-600 rounded-full mr-3"></span>
            Suggestions de contenu
          </h2>
          <p className="text-gray-600">Obtenez des suggestions personnalisées pour améliorer votre contenu et votre SEO.</p>
          
        </div>
        
        <div id="performance" data-section="performance" data-tab-content="performance" className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100" style={{ display: 'none' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="w-1 h-6 bg-amber-600 rounded-full mr-3"></span>
            Performance du site
          </h2>
          <p className="text-gray-600">Analysez les performances techniques de votre site web.</p>
          
        </div>
        
        <div id="analytics" data-section="analytics" data-tab-content="analytics" className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100" style={{ display: 'none' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="w-1 h-6 bg-emerald-600 rounded-full mr-3"></span>
            Analytics
          </h2>
          <p className="text-gray-600">Consultez les statistiques et analyses de trafic de votre site web.</p>
          
        </div>
        
        
      </main>
      
      
    </div>
  );
};

export default IndexPage;
