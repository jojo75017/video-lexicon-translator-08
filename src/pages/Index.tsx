
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, Search, Signature, BarChart } from "lucide-react";
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

const ModeToggle = () => {
  return (
    <Button variant="outline" size="icon">
      <span className="sr-only">Toggle theme</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
    </Button>
  );
};

const IndexPage = () => {
  // Utiliser le hook useSiteAnalyzer pour gérer l'analyse
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

  // Hide all sections initially
  useEffect(() => {
    // Hide all tab content initially
    document.querySelectorAll('[data-tab-content]').forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
    
    console.log('IndexPage initialized - hiding all sections initially');
  }, []);

  // Show results when analysis is complete
  useEffect(() => {
    if (seoAnalysis) {
      console.log('SEO analysis complete, showing SEO section');
      
      // Show the results section
      setTimeout(() => {
        // Activate the SEO tab
        window.location.hash = 'seo';
        activateSection('seo');
        
        toast.success("Analyse SEO terminée", {
          description: "Consultez les résultats ci-dessous",
          duration: 3000
        });
        
        // Also make the specific results display visible
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
        {/* Dashboard header with overview info */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tableau de bord SEO</h1>
          <p className="text-gray-600">Analysez et optimisez vos sites web pour les moteurs de recherche</p>
        </div>
        
        {/* Analyze Form */}
        <SeoAnalysisForm 
          url={url}
          setUrl={setUrl}
          isLoading={isLoading}
          showCorsWarning={showCorsWarning}
          analyzeSite={analyzeSite}
          error={error}
          handleActivateProxy={handleActivateProxy}
        />
        
        {/* Results Display - Initially hidden */}
        {seoAnalysis && (
          <div className="mb-8 results-display" style={{ display: 'none' }}>
            <ResultsDisplay seoAnalysis={seoAnalysis} />
          </div>
        )}
        
        {/* Tab Navigation */}
        <div className="mb-8">
          <TabNavigation />
        </div>
        
        {/* Feature grid showing main tool options */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <BarChart className="mr-2 h-6 w-6 text-indigo-600" />
            Outils d'analyse SEO
          </h2>
          <FeatureGrid />
        </div>
        
        {/* Content Sections - These are now managed by TabNavigation */}
        <div id="seo" data-section="seo" data-tab-content="seo" className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100" style={{ display: 'none' }}>
          <h2 className="text-2xl font-bold mb-4">Analyse SEO</h2>
          <p className="text-gray-600">Consultez l'analyse détaillée des performances SEO de votre site.</p>
          
          {/* Add additional content specifically for SEO results */}
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
          <h2 className="text-2xl font-bold mb-4">Structure du Site</h2>
          <p className="text-gray-600">Visualisez l'architecture de votre site web et identifiez les améliorations possibles.</p>
          
          {/* Add structure visualization if data exists */}
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
        
        {/* Quora Button Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Nouveau : Assistant Quora</h2>
            <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
              Créez du contenu optimisé pour Quora avec notre générateur IA. Produisez des réponses détaillées de plus de 500 mots pour maximiser votre visibilité et votre autorité.
            </p>
            <Link to="/QuoraPage">
              <Button 
                className="bg-gradient-to-r from-[#b92b27] to-[#8B5CF6] hover:from-[#a72724] hover:to-[#7849e0] text-white"
              >
                <MessageSquareText className="mr-2 h-5 w-5" />
                Créer du Contenu Quora (500+ mots)
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Signature Button Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Signature Email Professionnelle</h2>
            <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
              Créez une signature email professionnelle personnalisée avec notre générateur interactif. Ajoutez votre logo, choisissez vos couleurs et téléchargez votre signature.
            </p>
            <Link to="/SignaturePage">
              <Button 
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white"
              >
                <Signature className="mr-2 h-5 w-5" />
                Créer ma Signature Email
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="px-4 py-8 border-t bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Rocket className="h-6 w-6 text-indigo-600 mr-2" />
              <span className="font-bold text-xl">SEO-GPT</span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-indigo-600">À propos</a>
              <a href="#" className="text-gray-600 hover:text-indigo-600">Confidentialité</a>
              <a href="#" className="text-gray-600 hover:text-indigo-600">Conditions</a>
              <a href="#" className="text-gray-600 hover:text-indigo-600">Contact</a>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>
              © {new Date().getFullYear()} SEO-GPT. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IndexPage;
