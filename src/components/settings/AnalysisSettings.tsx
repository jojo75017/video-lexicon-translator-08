import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OpenAIKeyForm from './OpenAIKeyForm';
import { Cog, Wrench, Key, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';
import { toast } from 'sonner';
import { OpenAIService } from '@/utils/seo/openaiService';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AnalysisSettings = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const siteAnalyzer = useSiteAnalyzer();
  const [apiKey, setApiKey] = useState<string>('');
  const [isValidKey, setIsValidKey] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<{ exists: boolean, valid: boolean, message: string } | null>(null);

  useEffect(() => {
    // Ensure proxy is always enabled
    OpenAIService.enableProxy();
    
    // Retrieve stored key when component loads
    const storedKey = localStorage.getItem('openaiKey');
    if (storedKey) {
      console.log("OpenAI key found in AnalysisSettings");
      setApiKey(storedKey);
      
      // Set the key in OpenAIService immediately
      OpenAIService.setApiKey(storedKey);
      
      // Check format first
      const hasValidFormat = checkApiKeyFormat(storedKey);
      
      if (hasValidFormat) {
        // Check if the key is valid against API
        checkApiKeyStatus();
      }
    } else {
      console.log("No OpenAI key found in localStorage");
      setApiStatus({
        exists: false,
        valid: false,
        message: "Aucune clé API définie. Configurez une clé OpenAI pour activer les fonctionnalités d'analyse avancées."
      });
    }
  }, []);

  const checkApiKeyFormat = (key: string) => {
    const hasValidFormat = key && key.length > 20 && key.startsWith('sk-');
    setIsValidKey(hasValidFormat);
    return hasValidFormat;
  };
  
  const checkApiKeyStatus = async () => {
    setIsLoading(true);
    try {
      const status = await OpenAIService.checkApiKeyStatus();
      setApiStatus(status);
      setIsValidKey(status.valid);
      console.log("API key status checked:", status);
      
      if (status.valid) {
        toast.success("Clé API validée", {
          description: "Votre clé OpenAI est valide et prête à être utilisée."
        });
      }
      setIsLoading(false);
      return status;
    } catch (error) {
      console.error("Error checking API key status:", error);
      setApiStatus({
        exists: true,
        valid: false,
        message: "Impossible de vérifier la clé API. Vérifiez votre connexion internet."
      });
      setIsValidKey(false);
      setIsLoading(false);
      return { exists: true, valid: false, message: "Erreur de connexion" };
    }
  };

  const handleSaveApiKey = async (key: string) => {
    if (!key) {
      toast.error("Clé API manquante", {
        description: "Veuillez entrer une clé OpenAI API valide"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // First check format
      const hasValidFormat = checkApiKeyFormat(key);
      if (!hasValidFormat) {
        toast.error("Format de clé incorrect", {
          description: "La clé doit commencer par 'sk-' et être de longueur suffisante"
        });
        setIsLoading(false);
        return;
      }
      
      console.log("Saving and validating API key:", key.substring(0, 5) + "...");
      
      // Immediately save key to localStorage
      localStorage.setItem('openaiKey', key);
      setApiKey(key);
      
      // Set key in OpenAIService
      OpenAIService.setApiKey(key);
      
      // Ensure proxy is enabled
      OpenAIService.enableProxy();
      
      // Create OpenAIService instance to validate key
      const openaiService = new OpenAIService(key);
      const isValid = await openaiService.validateApiKey();
      
      // Update validation state
      setIsValidKey(isValid);
      
      if (isValid) {
        setApiStatus({
          exists: true,
          valid: true,
          message: "Clé OpenAI valide. Les fonctionnalités d'analyse AI sont activées."
        });
        
        toast.success("Clé API validée avec succès", {
          description: "Votre clé API a été enregistrée et validée"
        });
      } else {
        setApiStatus({
          exists: true,
          valid: false,
          message: "La clé API existe mais semble invalide. Vérifiez les crédits et l'accès à votre compte OpenAI."
        });
        
        toast.error("Clé API invalide", {
          description: "La clé a été enregistrée mais n'a pas pu être validée avec OpenAI"
        });
      }
    } catch (error) {
      console.error("Error validating API key:", error);
      
      setApiStatus({
        exists: true,
        valid: false,
        message: "Impossible de valider la clé API. Vérifiez votre connexion internet."
      });
      
      // Despite error, keep key stored
      toast.warning("Clé enregistrée", {
        description: "La clé a été enregistrée mais n'a pas pu être validée en raison d'une erreur de connexion"
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
      
      {apiStatus && (
        <Alert className={`mb-4 ${apiStatus.valid ? 'bg-green-50 text-green-800 border-green-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
          <div className="flex items-center">
            {apiStatus.valid ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            <AlertTitle>{apiStatus.valid ? "Intégration OpenAI Active" : "Problème avec l'intégration OpenAI"}</AlertTitle>
          </div>
          <AlertDescription className="mt-2">
            {apiStatus.message}
          </AlertDescription>
        </Alert>
      )}
      
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
              Autres APIs
            </h3>
            <p className="text-gray-600">
              D'autres intégrations d'API seront bientôt disponibles pour améliorer vos analyses SEO.
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
