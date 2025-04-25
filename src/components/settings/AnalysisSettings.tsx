
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OpenAIKeyForm from './OpenAIKeyForm';
import { Cog, Wrench, Key, Lock } from 'lucide-react';
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';
import { toast } from 'sonner';
import { OpenAIService } from '@/utils/seo/openaiService';

const AnalysisSettings = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const siteAnalyzer = useSiteAnalyzer();
  const [apiKey, setApiKey] = useState<string>('');
  const [isValidKey, setIsValidKey] = useState<boolean>(false);

  useEffect(() => {
    // Récupérer la clé stockée lors du chargement du composant
    const storedKey = localStorage.getItem('openaiKey');
    if (storedKey) {
      console.log("Clé OpenAI trouvée dans AnalysisSettings");
      setApiKey(storedKey);
      checkApiKeyFormat(storedKey);
    }
    
    // Activer le proxy par défaut
    OpenAIService.enableProxy();
  }, []);

  const checkApiKeyFormat = (key: string) => {
    const hasValidFormat = key && key.length > 20 && key.startsWith('sk-');
    setIsValidKey(hasValidFormat);
    return hasValidFormat;
  };

  const handleSaveApiKey = async (key: string) => {
    if (!key) {
      toast.error("Clé API manquante", {
        description: "Veuillez entrer une clé API OpenAI valide"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Vérifier d'abord le format de la clé
      const hasValidFormat = checkApiKeyFormat(key);
      if (!hasValidFormat) {
        toast.error("Format de clé API incorrect", {
          description: "La clé doit commencer par 'sk-' et avoir une longueur suffisante"
        });
        setIsLoading(false);
        return;
      }
      
      console.log("Sauvegarde et validation de la clé API:", key.substring(0, 5) + "...");
      
      // Sauvegarder la clé dans localStorage immédiatement
      localStorage.setItem('openaiKey', key);
      setApiKey(key);
      
      // S'assurer que le proxy est activé
      OpenAIService.enableProxy();
      
      // Créer une instance OpenAIService pour valider la clé
      const openaiService = new OpenAIService(key);
      const isValid = await openaiService.validateApiKey();
      
      // Mettre à jour l'état de validation
      setIsValidKey(isValid);
      
      if (isValid) {
        toast.success("Clé API validée avec succès", {
          description: "Votre clé API a été sauvegardée et validée"
        });
      } else {
        toast.error("Clé API non valide", {
          description: "La clé a été sauvegardée mais n'a pas pu être validée auprès d'OpenAI"
        });
      }
    } catch (error) {
      console.error("Erreur lors de la validation de la clé API:", error);
      
      // Malgré l'erreur, on garde la clé stockée
      toast.warning("Clé sauvegardée", {
        description: "La clé a été sauvegardée mais n'a pas pu être validée en raison d'une erreur de connexion"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <Cog className="mr-2 h-6 w-6 text-gray-800" />
          Paramètres d'analyse
        </h2>
      </div>
      
      <Tabs defaultValue="api" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="api" className="flex items-center">
            <Key className="mr-2 h-4 w-4" />
            Clés API
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Wrench className="mr-2 h-4 w-4" />
            Configuration
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="api" className="space-y-6">
          <OpenAIKeyForm 
            apiKey={apiKey} 
            onSave={handleSaveApiKey} 
            isLoading={isLoading} 
            isValid={isValidKey} 
          />
          
          <Card className="p-6 bg-gray-50 border border-gray-200">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Lock className="mr-2 h-5 w-5 text-gray-600" />
              Autres API
            </h3>
            <p className="text-gray-600">
              D'autres intégrations API seront disponibles prochainement pour enrichir vos analyses SEO.
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <Card className="p-6 bg-gray-50 border border-gray-200">
            <h3 className="text-lg font-bold mb-4">Paramètres d'analyse</h3>
            <p className="text-gray-600 mb-4">
              Ces paramètres contrôlent le comportement des fonctions d'analyse.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AnalysisSettings;
