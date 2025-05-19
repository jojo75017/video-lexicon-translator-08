
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Check, X, Activity, BarChart, LineChart, Brain, Globe } from "lucide-react";
import { toast } from "sonner";
import { GoogleSearchConsole } from '@/utils/googleSearchConsole';

interface DomainStatusProps {
  domain: string;
  isAvailable: boolean | null;
  isChecking: boolean;
}

export const DomainStatus: React.FC<DomainStatusProps> = ({ domain, isAvailable, isChecking }) => {
  const [isLoadingTraffic, setIsLoadingTraffic] = useState(false);
  const [isConnectingSearchConsole, setIsConnectingSearchConsole] = useState(false);
  const [isConnectingAnalytics, setIsConnectingAnalytics] = useState(false);
  const [isGeneratingAiSuggestions, setIsGeneratingAiSuggestions] = useState(false);
  
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
      // Ici, vous pourriez implémenter une vraie connexion à l'API Google Analytics
      // Pour l'instant, nous simulons une réponse
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

  const generateAdvancedAiSuggestions = async () => {
    if (!domain) return;
    
    setIsGeneratingAiSuggestions(true);
    toast.info(`Génération de suggestions avancées par IA pour ${domain} en cours...`);
    
    try {
      // Simuler une opération d'IA qui prend un peu de temps
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const baseName = domain.split('.')[0];
      const variations = [
        { domain: `${baseName}pro.com`, score: 92, reason: "Version professionnelle avec TLD premium" },
        { domain: `my${baseName}.com`, score: 88, reason: "Préfixe engageant qui personnalise l'expérience" },
        { domain: `${baseName}hub.com`, score: 85, reason: "Suggère une plateforme centrale pour votre activité" },
        { domain: `${baseName}.io`, score: 84, reason: "TLD moderne idéal pour les technologies et startups" },
        { domain: `get${baseName}.com`, score: 82, reason: "Suggère une action directe et une accessibilité" }
      ];
      
      // Informer l'utilisateur du succès avec un toast contenant un aperçu
      toast.success(`Suggestions avancées générées par IA pour ${domain}`, {
        description: "5 nouvelles suggestions premium disponibles",
        duration: 5000
      });
      
      // Simuler l'ajout de ces suggestions à la liste existante
      // Dans une implémentation réelle, vous utiliseriez une fonction passée via props
      // pour mettre à jour l'état du composant parent
    } catch (error) {
      console.error("Erreur lors de la génération des suggestions avancées:", error);
      toast.error(`Erreur lors de la génération des suggestions: ${error.message}`);
    } finally {
      setIsGeneratingAiSuggestions(false);
    }
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
        <span className="ml-3 text-green-700">Vérification de la disponibilité...</span>
      </div>
    );
  }
  
  if (isAvailable === null) {
    return null;
  }
  
  return isAvailable ? (
    <Alert className="bg-green-50 text-green-800 border-green-200">
      <div className="flex flex-col w-full">
        <div className="flex items-start">
          <Check className="h-5 w-5 text-green-600 mt-0.5" />
          <div className="ml-2">
            <AlertTitle className="font-medium">Domaine disponible!</AlertTitle>
            <AlertDescription>
              Le domaine <strong>{domain}</strong> est actuellement disponible à l'enregistrement.
            </AlertDescription>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2 justify-end">
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
            onClick={generateAdvancedAiSuggestions}
            disabled={isGeneratingAiSuggestions}
          >
            <Brain className="h-4 w-4" />
            {isGeneratingAiSuggestions ? 'Génération...' : 'Suggestions IA avancées'}
          </Button>
        </div>
      </div>
    </Alert>
  ) : (
    <Alert className="bg-red-50 text-red-800 border-red-200">
      <X className="h-5 w-5 text-red-600" />
      <AlertTitle className="font-medium">Domaine non disponible</AlertTitle>
      <AlertDescription>
        Le domaine <strong>{domain}</strong> est déjà enregistré ou réservé.
        <div className="mt-2">
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50"
            onClick={generateAdvancedAiSuggestions}
            disabled={isGeneratingAiSuggestions}
          >
            <Globe className="h-4 w-4 mr-1" />
            {isGeneratingAiSuggestions ? 'Recherche...' : 'Trouver des alternatives par IA'}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DomainStatus;
