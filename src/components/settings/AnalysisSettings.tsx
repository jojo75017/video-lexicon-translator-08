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
    // Retrieve stored key when component loads
    const storedKey = localStorage.getItem('openaiKey');
    if (storedKey) {
      console.log("OpenAI key found in AnalysisSettings");
      setApiKey(storedKey);
      checkApiKeyFormat(storedKey);
    }
    
    // Enable proxy by default
    OpenAIService.enableProxy();
    
    // Check API key status
    checkApiKeyStatus();
  }, []);

  const checkApiKeyFormat = (key: string) => {
    const hasValidFormat = key && key.length > 20 && key.startsWith('sk-');
    setIsValidKey(hasValidFormat);
    return hasValidFormat;
  };
  
  const checkApiKeyStatus = async () => {
    const status = await OpenAIService.checkApiKeyStatus();
    setApiStatus(status);
    setIsValidKey(status.valid);
    console.log("API key status checked:", status);
    return status;
  };

  const handleSaveApiKey = async (key: string) => {
    if (!key) {
      toast.error("Missing API key", {
        description: "Please enter a valid OpenAI API key"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // First check format
      const hasValidFormat = checkApiKeyFormat(key);
      if (!hasValidFormat) {
        toast.error("Incorrect API key format", {
          description: "Key must start with 'sk-' and be of sufficient length"
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
        toast.success("API key validated successfully", {
          description: "Your API key has been saved and validated"
        });
      } else {
        toast.error("Invalid API key", {
          description: "The key was saved but could not be validated with OpenAI"
        });
      }
      
      // Update overall status
      await checkApiKeyStatus();
    } catch (error) {
      console.error("Error validating API key:", error);
      
      // Despite error, keep key stored
      toast.warning("Key saved", {
        description: "The key was saved but could not be validated due to a connection error"
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
          Analysis Settings
        </h2>
      </div>
      
      {apiStatus && (
        <Alert className={`mb-4 ${apiStatus.valid ? 'bg-green-50 text-green-800 border-green-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
          <div className="flex items-center">
            {apiStatus.valid ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            <AlertTitle>{apiStatus.valid ? "OpenAI Integration Active" : "OpenAI Integration Issue"}</AlertTitle>
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
            API Keys
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
              Other APIs
            </h3>
            <p className="text-gray-600">
              More API integrations will be available soon to enhance your SEO analyses.
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <Card className="p-6 bg-gray-50 border border-gray-200">
            <h3 className="text-lg font-bold mb-4">Analysis Settings</h3>
            <p className="text-gray-600 mb-4">
              These settings control the behavior of the analysis functions.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AnalysisSettings;
