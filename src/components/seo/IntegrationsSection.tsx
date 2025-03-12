
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { GoogleSearchConsole } from '@/utils/googleSearchConsole';
import { analyzeSearchConsole } from '@/utils/seo/searchConsoleAnalyzer';

const IntegrationsSection: React.FC = () => {
  const [searchConsoleCode, setSearchConsoleCode] = useState('');
  const [analyticsCode, setAnalyticsCode] = useState('');
  const [domain, setDomain] = useState('');
  const [isSearchConsoleConnected, setIsSearchConsoleConnected] = useState(false);
  const [isAnalyticsConnected, setIsAnalyticsConnected] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalysisResults, setHasAnalysisResults] = useState(false);

  // Vérifier si les services sont déjà connectés au chargement
  useEffect(() => {
    const savedSearchConsoleCode = localStorage.getItem('search_console_code');
    const savedAnalyticsCode = localStorage.getItem('analytics_code');
    
    if (savedSearchConsoleCode) {
      setIsSearchConsoleConnected(true);
      setSearchConsoleCode(savedSearchConsoleCode);
    }
    
    if (savedAnalyticsCode) {
      setIsAnalyticsConnected(true);
      setAnalyticsCode(savedAnalyticsCode);
    }
  }, []);

  const handleSearchConsoleConnect = () => {
    if (!searchConsoleCode.trim()) {
      toast.error("Veuillez entrer un code valide");
      return;
    }
    // Sauvegarder le code dans localStorage pour l'exemple
    localStorage.setItem('search_console_code', searchConsoleCode);
    setIsSearchConsoleConnected(true);
    toast.success("Google Search Console connecté avec succès");
  };

  const handleAnalyticsConnect = () => {
    if (!analyticsCode.trim()) {
      toast.error("Veuillez entrer un code valide");
      return;
    }
    // Sauvegarder le code dans localStorage pour l'exemple
    localStorage.setItem('analytics_code', analyticsCode);
    setIsAnalyticsConnected(true);
    toast.success("Google Analytics connecté avec succès");
  };

  const handleAnalyzeData = async () => {
    if (!domain.trim()) {
      toast.error("Veuillez entrer un domaine valide");
      return;
    }

    if (!isSearchConsoleConnected && !isAnalyticsConnected) {
      toast.error("Veuillez connecter au moins un service avant d'analyser");
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulation d'analyse pour l'exemple
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isSearchConsoleConnected) {
        // Utilisation de l'utilitaire Google Search Console
        const searchConsole = new GoogleSearchConsole();
        await searchConsole.getSearchAnalytics(domain);
        
        // Analyse des données Search Console
        await analyzeSearchConsole(domain);
      }
      
      toast.success(`Analyse du domaine ${domain} terminée avec succès`);
      setHasAnalysisResults(true);
    } catch (error) {
      console.error("Erreur lors de l'analyse:", error);
      toast.error("Une erreur s'est produite lors de l'analyse des données");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Intégrations</h2>
      <p className="text-gray-600 mb-4">
        Connectez vos outils SEO préférés pour analyser les données consolidées.
      </p>
      
      {/* Section d'analyse de domaine */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-lg mb-2">Analyser un domaine</h3>
        <p className="text-sm text-gray-600 mb-3">
          Entrez le domaine que vous souhaitez analyser avec les services connectés.
        </p>
        <div className="flex flex-col md:flex-row gap-2">
          <Input
            type="text"
            placeholder="exemple.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleAnalyzeData}
            disabled={isAnalyzing || (!isSearchConsoleConnected && !isAnalyticsConnected)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isAnalyzing ? "Analyse en cours..." : "Analyser les données"}
          </Button>
        </div>
        
        {hasAnalysisResults && (
          <div className="mt-3 text-sm text-green-600 font-medium">
            ✓ Analyse terminée. Consultez les résultats dans les sections Analytics et Ranking Tracker.
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
          <h3 className="font-semibold text-lg mb-2">Google Search Console</h3>
          <p className="text-sm text-gray-600 mb-3">Connectez votre compte pour analyser les performances de recherche.</p>
          {!isSearchConsoleConnected ? (
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Code d'authentification"
                value={searchConsoleCode}
                onChange={(e) => setSearchConsoleCode(e.target.value)}
              />
              <Button 
                onClick={handleSearchConsoleConnect}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Connecter
              </Button>
            </div>
          ) : (
            <div className="text-green-600 font-medium">
              ✓ Connecté
            </div>
          )}
        </div>

        <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
          <h3 className="font-semibold text-lg mb-2">Google Analytics</h3>
          <p className="text-sm text-gray-600 mb-3">Intégrez vos statistiques de trafic et de comportement.</p>
          {!isAnalyticsConnected ? (
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Code d'authentification"
                value={analyticsCode}
                onChange={(e) => setAnalyticsCode(e.target.value)}
              />
              <Button 
                onClick={handleAnalyticsConnect}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Connecter
              </Button>
            </div>
          ) : (
            <div className="text-green-600 font-medium">
              ✓ Connecté
            </div>
          )}
        </div>

        <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
          <h3 className="font-semibold text-lg mb-2">Semrush</h3>
          <p className="text-sm text-gray-600">Importez vos données d'analyse concurrentielle.</p>
          <Button className="mt-3 text-purple-600 font-medium">
            Connecter
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default IntegrationsSection;
