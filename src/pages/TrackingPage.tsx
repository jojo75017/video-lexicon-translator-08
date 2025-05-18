
import React, { useState, useEffect } from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { LineChart, Info, Search, RefreshCw, Globe, Key } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import RankingTracker from '@/components/seo/RankingTracker';
import { toast } from 'sonner';

const TrackingPage = () => {
  const [url, setUrl] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [apiKey, setApiKey] = useState(localStorage.getItem('dataForSEOKey') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  
  // Utiliser l'URL du site actuel comme valeur par défaut si rien n'est saisi
  useEffect(() => {
    if (!inputUrl && !url) {
      const defaultUrl = window.location.origin.includes('lovableproject') 
        ? 'https://example.com' 
        : window.location.origin;
      setInputUrl(defaultUrl);
    }
  }, [inputUrl, url]);
  
  // Démarrer le suivi au chargement de la page
  useEffect(() => {
    console.log("TrackingPage: Chargement initial");
    // Démarrer le suivi après un court délai
    const timer = setTimeout(() => {
      if (!isTracking && inputUrl) {
        console.log("TrackingPage: Démarrage automatique du suivi");
        handleStartTracking();
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleStartTracking = () => {
    if (!inputUrl.trim()) {
      toast.error("Veuillez entrer une URL à suivre");
      return;
    }
    
    // Formater l'URL si nécessaire
    let formattedUrl = inputUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
      setInputUrl(formattedUrl);
    }
    
    // Démarrer le suivi des positions
    console.log(`Démarrage du suivi pour: ${formattedUrl}`);
    setUrl(formattedUrl);
    setIsTracking(true);
    toast.success(`Suivi des positions démarré pour ${formattedUrl}`);
  };
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);
  };
  
  const handleResetTracking = () => {
    setIsTracking(false);
    // Réinitialiser après un court délai pour permettre le rechargement des données
    setTimeout(() => {
      handleStartTracking();
    }, 300);
  };
  
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };
  
  const handleSaveApiKey = () => {
    if (apiKey) {
      localStorage.setItem('dataForSEOKey', apiKey);
      toast.success('Clé API sauvegardée');
      setShowApiKeyInput(false);
    } else {
      toast.error('Veuillez entrer une clé API valide');
    }
  };
  
  return (
    <UnifiedDashboard>
      <div className="container mx-auto py-4">
        <Card className="p-6 shadow-sm">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <LineChart className="h-6 w-6 text-purple-600" />
              Suivi des Positions
            </h2>
            
            <Alert className="bg-purple-50 border-purple-200">
              <Info className="h-4 w-4 text-purple-600" />
              <AlertTitle>Suivi des positions dans les moteurs de recherche</AlertTitle>
              <AlertDescription>
                Cette fonctionnalité vous permet de suivre l'évolution de vos positions pour vos mots-clés principaux et d'identifier les opportunités d'optimisation.
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-wrap gap-2 my-4">
              <div className="relative flex-1 min-w-[200px]">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Entrez l'URL de votre site"
                  value={inputUrl}
                  onChange={handleUrlChange}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={handleStartTracking}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Search className="h-4 w-4 mr-2" />
                {!isTracking ? "Démarrer le suivi" : "Mettre à jour"}
              </Button>
              {isTracking && (
                <Button 
                  onClick={handleResetTracking} 
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
              )}
              <Button
                onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                variant="outline"
                className="border-purple-200"
              >
                <Key className="h-4 w-4 mr-2" />
                {apiKey ? "Modifier la clé API" : "Ajouter une clé API"}
              </Button>
            </div>
            
            {showApiKeyInput && (
              <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium mb-2">Configuration de l'API</h3>
                <div className="flex gap-2 mb-1">
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={handleApiKeyChange}
                    placeholder="Entrez votre clé API DataForSEO"
                    className="flex-1"
                  />
                  <Button onClick={handleSaveApiKey}>
                    Sauvegarder
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  La clé API permet d'obtenir des données plus précises pour le suivi de vos positions.
                </p>
              </div>
            )}
            
            {isTracking && <RankingTracker url={url} apiKey={apiKey} />}
            
            {!isTracking && (
              <div className="p-8 text-center border border-dashed border-gray-300 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Entrez une URL pour commencer</h3>
                <p className="text-gray-600">
                  Démarrez le suivi pour voir l'évolution de vos positions dans les moteurs de recherche.
                  Vous pourrez analyser les tendances, identifier les mots-clés performants et découvrir 
                  des opportunités d'optimisation pour améliorer votre visibilité.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default TrackingPage;
