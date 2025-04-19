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
    console.log('IndexPage initialized');
  }, []);

  useEffect(() => {
    if (seoAnalysis) {
      console.log('SEO analysis complete');
      toast.success("Analyse SEO terminée", {
        description: "Consultez les résultats ci-dessous",
        duration: 3000
      });
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
            <Link to="/seo" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Outils SEO
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
          <div className="mb-8 results-display">
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
        
        <div id="hierarchy" data-section="hierarchy" className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
            Hiérarchie de contenu
          </h2>
          <p className="text-gray-600">Analysez la structure et la hiérarchie de votre contenu pour améliorer son SEO.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-3">Structure des titres</h3>
              <p className="text-gray-600 text-sm mb-4">Une hiérarchie de titres bien structurée améliore l'expérience utilisateur et le référencement.</p>
              
              <div className="space-y-2">
                <div className="bg-blue-50 p-3 rounded border border-blue-100">
                  <h4 className="font-medium text-sm mb-1">Bonnes pratiques</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li>Une seule balise H1 par page</li>
                    <li>Structure logique (H1 → H2 → H3...)</li>
                    <li>Mots-clés dans les titres principaux</li>
                    <li>Titres descriptifs et concis</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-3">Densité de contenu</h3>
              <p className="text-gray-600 text-sm mb-4">L'équilibre entre le texte et les autres éléments est crucial pour un bon SEO.</p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Texte / HTML</span>
                  <span className="text-sm font-medium">24%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '24%' }}></div>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm">Mots / Page</span>
                  <span className="text-sm font-medium">~850</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div id="wordcount" data-section="wordcount" className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="w-1 h-6 bg-green-600 rounded-full mr-3"></span>
            Analyse des mots-clés
          </h2>
          <p className="text-gray-600">Examinez la densité et la pertinence des mots-clés dans votre contenu.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-3">Mots-clés principaux</h3>
              <div className="flex flex-wrap gap-2">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">référencement</div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">SEO</div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">analyse</div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">optimisation</div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">contenu</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-3">Densité de mots-clés</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">SEO</span>
                  <span className="text-sm font-medium">2.3%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '57%' }}></div>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm">référencement</span>
                  <span className="text-sm font-medium">1.8%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div id="seo" data-section="seo" className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100">
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
        
        <div id="structure" data-section="structure" className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="w-1 h-6 bg-indigo-600 rounded-full mr-3"></span>
            Structure du Site
          </h2>
          <p className="text-gray-600 mb-4">Visualisez l'architecture de votre site web et identifiez les améliorations possibles.</p>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Architecture des pages</h3>
            <p className="text-gray-600 mb-4">Analysez comment les pages de votre site sont connectées entre elles et optimisez la navigation pour les utilisateurs et les moteurs de recherche.</p>
            
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
        </div>
        
        <div id="performance" data-section="performance" className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="w-1 h-6 bg-amber-600 rounded-full mr-3"></span>
            Performance du site
          </h2>
          <p className="text-gray-600 mb-6">Analysez les performances techniques de votre site web et identifiez les opportunités d'amélioration.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <h3 className="text-sm font-medium text-gray-500 mb-2">VITESSE DE CHARGEMENT</h3>
              <div className="text-3xl font-bold">3.2s</div>
              <p className="text-sm text-amber-600">Amélioration possible</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <h3 className="text-sm font-medium text-gray-500 mb-2">TAILLE DE PAGE</h3>
              <div className="text-3xl font-bold">1.8 MB</div>
              <p className="text-sm text-green-600">Bonne performance</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <h3 className="text-sm font-medium text-gray-500 mb-2">REQUÊTES HTTP</h3>
              <div className="text-3xl font-bold">42</div>
              <p className="text-sm text-amber-600">Réduction possible</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-3">Optimisations recommandées</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 text-lg">•</span>
                  <div>
                    <p className="font-medium">Compression des images</p>
                    <p className="text-sm text-gray-600">Réduisez le poids des images sans perdre en qualité</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 text-lg">•</span>
                  <div>
                    <p className="font-medium">Minification CSS/JS</p>
                    <p className="text-sm text-gray-600">Réduisez la taille des fichiers CSS et JavaScript</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 text-lg">•</span>
                  <div>
                    <p className="font-medium">Mise en cache navigateur</p>
                    <p className="text-sm text-gray-600">Configurez correctement les en-têtes de cache</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-3">Répartition des ressources</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Images</span>
                    <span className="text-sm font-medium">840 KB</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">JavaScript</span>
                    <span className="text-sm font-medium">520 KB</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CSS</span>
                    <span className="text-sm font-medium">240 KB</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">HTML</span>
                    <span className="text-sm font-medium">85 KB</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div id="analytics" data-section="analytics" className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="w-1 h-6 bg-emerald-600 rounded-full mr-3"></span>
            Analytics
          </h2>
          <p className="text-gray-600">Consultez les statistiques et analyses de trafic de votre site web.</p>
          
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-6 text-center mt-6">
            <h3 className="text-lg font-medium text-emerald-800 mb-3">Module Analytics en développement</h3>
            <p className="text-emerald-700 mb-4">Notre module d'analyse avancée sera bientôt disponible avec la version Premium.</p>
            <div className="inline-flex items-center justify-center px-4 py-2 border border-emerald-300 text-sm font-medium rounded-md text-emerald-700 bg-emerald-100">
              Bientôt disponible
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IndexPage;
