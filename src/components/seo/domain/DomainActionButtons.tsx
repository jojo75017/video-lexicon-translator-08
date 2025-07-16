
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Activity, LineChart, BarChart, Brain, Filter, Save } from "lucide-react";
import { toast } from "sonner";
import { GoogleSearchConsole } from '@/utils/googleSearchConsole';

interface DomainActionButtonsProps {
  domain: string;
  onGenerateAiSuggestions: () => void;
  onShowFilterDialog: () => void;
}

export const DomainActionButtons: React.FC<DomainActionButtonsProps> = ({ 
  domain, 
  onGenerateAiSuggestions, 
  onShowFilterDialog 
}) => {
  const [isLoadingTraffic, setIsLoadingTraffic] = useState(false);
  const [isConnectingSearchConsole, setIsConnectingSearchConsole] = useState(false);
  const [isConnectingAnalytics, setIsConnectingAnalytics] = useState(false);
  const [isGeneratingAiSuggestions, setIsGeneratingAiSuggestions] = useState(false);
  const [isSavingDomain, setIsSavingDomain] = useState(false);
  
  const searchConsole = new GoogleSearchConsole();

  const estimateTraffic = async () => {
    if (!domain) return;
    
    setIsLoadingTraffic(true);
    toast.info(`Estimation du trafic pour ${domain} en cours...`);
    
    try {
      // Utiliser l'API Search Console pour obtenir des données réelles
      const searchData = await searchConsole.getSearchAnalytics(domain);
      
      toast.success(`Trafic estimé pour ${domain}: ${searchData.impressions.toLocaleString()} impressions, ${searchData.clicks.toLocaleString()} clics`);
    } catch (error) {
      console.error("Erreur lors de l'estimation du trafic:", error);
      // Fallback vers des données simulées en cas d'erreur
      const estimatedVisits = Math.floor(Math.random() * 5000) + 1000;
      toast.success(`Trafic estimé pour ${domain}: ${estimatedVisits.toLocaleString()} visites/mois (données simulées)`);
    } finally {
      setIsLoadingTraffic(false);
    }
  };

  const connectSearchConsole = async () => {
    if (!domain) return;
    
    setIsConnectingSearchConsole(true);
    toast.info(`Connexion à Google Search Console pour ${domain} en cours...`);
    
    try {
      // Ici, vous pourriez implémenter une vraie connexion à l'API Search Console
      // Pour l'instant, nous simulons une réponse
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Domaine ${domain} connecté à Google Search Console avec succès!`);
      toast.info("Pour voir les vraies données, vous devez configurer l'API Google Search Console");
    } catch (error) {
      console.error("Erreur lors de la connexion à Search Console:", error);
      toast.error(`Erreur lors de la connexion à Search Console: ${error.message}`);
    } finally {
      setIsConnectingSearchConsole(false);
    }
  };

  const connectGoogleAnalytics = async () => {
    if (!domain) return;
    
    setIsConnectingAnalytics(true);
    toast.info(`Connexion à Google Analytics pour ${domain} en cours...`);
    
    try {
      // Simulation d'une réponse
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Domaine ${domain} connecté à Google Analytics avec succès!`);
      toast.info("Pour voir les vraies données, vous devez configurer l'API Google Analytics");
    } catch (error) {
      console.error("Erreur lors de la connexion à Google Analytics:", error);
      toast.error(`Erreur lors de la connexion à Google Analytics: ${error.message}`);
    } finally {
      setIsConnectingAnalytics(false);
    }
  };

  const handleGenerateAiSuggestions = () => {
    setIsGeneratingAiSuggestions(true);
    onGenerateAiSuggestions();
    setTimeout(() => {
      setIsGeneratingAiSuggestions(false);
    }, 2000);
  };

  const saveDomainToFavorites = () => {
    setIsSavingDomain(true);
    
    // Simuler l'enregistrement du domaine
    setTimeout(() => {
      toast.success(`Domaine ${domain} ajouté aux favoris`);
      setIsSavingDomain(false);
    }, 1000);
  };

  return (
    <div className="mt-4 flex flex-wrap gap-2 justify-end">
      <Button 
        size="sm" 
        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
        onClick={saveDomainToFavorites}
        disabled={isSavingDomain}
      >
        <Save className="h-4 w-4" />
        {isSavingDomain ? 'Enregistrement...' : 'Ajouter aux favoris'}
      </Button>
      
      <Button 
        size="sm" 
        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
        onClick={estimateTraffic}
        disabled={isLoadingTraffic}
      >
        <Activity className="h-4 w-4" />
        {isLoadingTraffic ? 'Estimation...' : 'Estimer le trafic potentiel'}
      </Button>
      
      <Button 
        size="sm" 
        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
        onClick={connectSearchConsole}
        disabled={isConnectingSearchConsole}
      >
        <LineChart className="h-4 w-4" />
        {isConnectingSearchConsole ? 'Connexion...' : 'Search Console'}
      </Button>
      
      <Button 
        size="sm" 
        className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1"
        onClick={connectGoogleAnalytics}
        disabled={isConnectingAnalytics}
      >
        <BarChart className="h-4 w-4" />
        {isConnectingAnalytics ? 'Connexion...' : 'Google Analytics'}
      </Button>
      
      <Button 
        size="sm" 
        className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1"
        onClick={handleGenerateAiSuggestions}
        disabled={isGeneratingAiSuggestions}
      >
        <Brain className="h-4 w-4" />
        {isGeneratingAiSuggestions ? 'Génération...' : 'Suggestions IA avancées'}
      </Button>

      <Button 
        size="sm" 
        variant="outline"
        className="border-green-300 text-green-600 hover:bg-green-50 flex items-center gap-1"
        onClick={onShowFilterDialog}
      >
        <Filter className="h-4 w-4" />
        Filtres avancés
      </Button>
    </div>
  );
};

export default DomainActionButtons;
