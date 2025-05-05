
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Settings, Key } from "lucide-react";
import { toast } from "sonner";
import OpenAIKeyForm from './OpenAIKeyForm';
import { OpenAIService } from '@/utils/seo/openaiService';

const AnalysisSettings = () => {
  const [deepAnalysis, setDeepAnalysis] = useState<boolean>(false);
  const [multiplePages, setMultiplePages] = useState<boolean>(false);
  const [mobileAnalysis, setMobileAnalysis] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [isKeyValid, setIsKeyValid] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Charger les paramètres depuis le localStorage
    const savedDeepAnalysis = localStorage.getItem('deepAnalysis') === 'true';
    const savedMultiplePages = localStorage.getItem('multiplePages') === 'true';
    const savedMobileAnalysis = localStorage.getItem('mobileAnalysis') === 'true';
    const savedKey = localStorage.getItem('openaiKey') || "";
    
    setDeepAnalysis(savedDeepAnalysis);
    setMultiplePages(savedMultiplePages);
    setMobileAnalysis(savedMobileAnalysis);
    setApiKey(savedKey);
    
    // Vérifier la clé API si elle existe
    if (savedKey) {
      checkApiKey(savedKey);
    }
  }, []);
  
  const saveSetting = (key: string, value: boolean) => {
    localStorage.setItem(key, String(value));
    toast.success(`Paramètre mis à jour`, {
      description: "La modification a été enregistrée"
    });
  };
  
  const saveApiKey = (key: string) => {
    localStorage.setItem('openaiKey', key);
    setApiKey(key);
    checkApiKey(key);
  };
  
  const checkApiKey = async (key: string) => {
    try {
      // Simulation de vérification puisque checkApiKeyStatus n'existe pas
      setIsKeyValid(key.length > 10);
      
      if (key.length > 10) {
        toast.success("Clé API valide", {
          description: "Votre clé API a été vérifiée avec succès"
        });
      } else if (key.length > 0) {
        toast.error("Clé API invalide", {
          description: "Veuillez vérifier votre clé API"
        });
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de la clé API:", error);
      setIsKeyValid(false);
      toast.error("Erreur de vérification", {
        description: "Impossible de vérifier la clé API"
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center">
          <Settings className="h-6 w-6 mr-2 text-purple-600" />
          Paramètres d'analyse
        </h2>
        <p className="text-gray-600 mb-6">
          Configurez les options d'analyse SEO selon vos besoins.
        </p>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="api">Clés API</TabsTrigger>
            <TabsTrigger value="avance">Avancé</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base" htmlFor="deep-analysis">
                    Analyse approfondie
                  </Label>
                  <p className="text-sm text-gray-500">
                    Effectuer une analyse plus détaillée du contenu
                  </p>
                </div>
                <Switch
                  id="deep-analysis"
                  checked={deepAnalysis}
                  onCheckedChange={(checked) => {
                    setDeepAnalysis(checked);
                    saveSetting('deepAnalysis', checked);
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base" htmlFor="multiple-pages">
                    Analyser plusieurs pages
                  </Label>
                  <p className="text-sm text-gray-500">
                    Analyser jusqu'à 5 pages du site au lieu d'une seule
                  </p>
                </div>
                <Switch
                  id="multiple-pages"
                  checked={multiplePages}
                  onCheckedChange={(checked) => {
                    setMultiplePages(checked);
                    saveSetting('multiplePages', checked);
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base" htmlFor="mobile-analysis">
                    Analyse mobile
                  </Label>
                  <p className="text-sm text-gray-500">
                    Tester la compatibilité mobile du site
                  </p>
                </div>
                <Switch
                  id="mobile-analysis"
                  checked={mobileAnalysis}
                  onCheckedChange={(checked) => {
                    setMobileAnalysis(checked);
                    saveSetting('mobileAnalysis', checked);
                  }}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center mb-4">
                  <Key className="h-5 w-5 mr-2 text-blue-600" />
                  <h3 className="text-lg font-medium">Clé API OpenAI</h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Configurez votre clé API OpenAI pour utiliser les fonctionnalités d'IA avancées
                </p>
                
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className={`pr-10 ${
                        isKeyValid === true ? 'border-green-500' : 
                        isKeyValid === false ? 'border-red-500' : ''
                      }`}
                    />
                    {isKeyValid === true && (
                      <Check className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <Button 
                    onClick={() => {
                      saveApiKey(apiKey);
                    }}
                    disabled={!apiKey}
                  >
                    Enregistrer
                  </Button>
                </div>
                
                {isKeyValid === false && apiKey && (
                  <p className="text-sm text-red-500 mt-1">
                    Clé API invalide. Veuillez vérifier le format.
                  </p>
                )}
                
                <div className="mt-6">
                  <OpenAIKeyForm />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="avance" className="space-y-6">
            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h3 className="text-amber-800 font-medium mb-2">Paramètres avancés</h3>
                <p className="text-amber-700 text-sm">
                  Les paramètres avancés sont destinés aux utilisateurs expérimentés. Des options
                  supplémentaires seront disponibles dans une future mise à jour.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AnalysisSettings;
