
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OpenAIKeyForm from './OpenAIKeyForm';
import { Cog, Wrench, Key, Lock } from 'lucide-react';
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';
import { toast } from 'sonner';

const AnalysisSettings = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const siteAnalyzer = useSiteAnalyzer();
  const [apiKey, setApiKey] = useState<string>('');
  const [isValidKey, setIsValidKey] = useState<boolean>(false);

  useEffect(() => {
    // Récupérer la clé stockée lors du chargement du composant
    const storedKey = localStorage.getItem('openaiKey');
    if (storedKey) {
      setApiKey(storedKey);
      setIsValidKey(true); // On présume que la clé stockée est valide
    }
  }, []);

  const handleSaveApiKey = async (key: string) => {
    if (!key) return;
    
    setIsLoading(true);
    try {
      // Vérifier explicitement que la clé a une longueur minimale
      if (key.length < 20) {
        toast.error("Clé API trop courte", {
          description: "Veuillez vérifier votre clé OpenAI"
        });
        return;
      }
      
      console.log("Tentative de validation de la clé:", key.substring(0, 5) + "...");
      
      // Sauvegarder la clé dans localStorage immédiatement pour éviter des problèmes de timing
      localStorage.setItem('openaiKey', key);
      setApiKey(key);
      
      toast.success("Clé API sauvegardée", {
        description: "Votre clé API a été sauvegardée localement",
      });
      
      setIsValidKey(true);
    } catch (error) {
      console.error("Erreur lors de la validation de la clé API:", error);
      toast.error("Erreur de validation", {
        description: "Impossible de valider la clé API. Vérifiez votre connexion internet."
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
