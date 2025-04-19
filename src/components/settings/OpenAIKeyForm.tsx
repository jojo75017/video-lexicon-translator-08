
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Sparkles, Key, Check, AlertCircle } from 'lucide-react';
import { OpenAIService } from '@/utils/seo/openaiService';

const OpenAIKeyForm = () => {
  const [apiKey, setApiKey] = useState('');
  const [savedApiKey, setSavedApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isKeyValid, setIsKeyValid] = useState(false);

  useEffect(() => {
    // Récupérer la clé API depuis le localStorage
    const storedKey = localStorage.getItem('openaiKey');
    if (storedKey) {
      setSavedApiKey(storedKey);
      setIsKeyValid(true);
      // Masquer la clé pour l'affichage
      setApiKey('');
    }
  }, []);

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast.error("Veuillez entrer une clé API valide");
      return;
    }
    
    setIsValidating(true);
    
    try {
      // Tester la clé API
      const openaiService = new OpenAIService(apiKey);
      const isValid = await testOpenAIKey(apiKey);
      
      if (isValid) {
        // Sauvegarder la clé dans localStorage
        localStorage.setItem('openaiKey', apiKey);
        setSavedApiKey(apiKey);
        setApiKey(''); // Effacer le champ pour des raisons de sécurité
        setIsKeyValid(true);
        
        toast.success("Clé API OpenAI configurée avec succès", {
          description: "Vous pouvez maintenant utiliser les fonctionnalités alimentées par OpenAI"
        });
      } else {
        toast.error("Clé API OpenAI invalide", {
          description: "Veuillez vérifier votre clé et réessayer"
        });
      }
    } catch (error) {
      console.error("Erreur lors de la validation de la clé API:", error);
      toast.error("Erreur lors de la validation", {
        description: "Impossible de valider la clé API. Veuillez réessayer."
      });
    } finally {
      setIsValidating(false);
    }
  };

  const testOpenAIKey = async (key: string): Promise<boolean> => {
    try {
      // Appel simple à l'API pour vérifier la validité de la clé
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.status === 200;
    } catch (error) {
      console.error("Erreur lors du test de la clé OpenAI:", error);
      return false;
    }
  };

  const handleRemoveKey = () => {
    localStorage.removeItem('openaiKey');
    setSavedApiKey('');
    setApiKey('');
    setIsKeyValid(false);
    
    toast.success("Clé API OpenAI supprimée", {
      description: "Les fonctionnalités OpenAI ne seront plus disponibles"
    });
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Sparkles className="mr-2 h-5 w-5 text-indigo-600" />
        Configuration OpenAI
      </h2>
      
      <p className="text-gray-600 mb-4">
        Connectez votre clé API OpenAI pour améliorer les analyses SEO avec des recommandations IA avancées et des suggestions de mots-clés pertinentes.
      </p>
      
      {isKeyValid ? (
        <div className="mb-6">
          <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
            <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-800">Clé API OpenAI configurée</h3>
              <p className="text-green-700 text-sm mt-1">
                Votre clé API OpenAI est correctement configurée et prête à être utilisée.
              </p>
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveKey}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Supprimer la clé
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSaveKey} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="openai-key" className="text-sm font-medium text-gray-700 flex items-center">
              <Key className="h-4 w-4 mr-1.5 text-gray-500" />
              Clé API OpenAI
            </label>
            <Input
              id="openai-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Votre clé API est stockée localement dans votre navigateur et n'est jamais partagée.
            </p>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-700">
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
              <p>
                Vous pouvez obtenir votre clé API sur le <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-amber-800 underline hover:no-underline">site d'OpenAI</a>.
              </p>
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={isValidating || !apiKey.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isValidating ? "Validation en cours..." : "Configurer la clé API"}
          </Button>
        </form>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        <h3 className="font-semibold mb-1">Fonctionnalités activées avec OpenAI:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Suggestions de mots-clés pertinents pour votre contenu</li>
          <li>Analyses sémantiques avancées</li>
          <li>Recommandations d'optimisation de contenu</li>
          <li>Génération d'idées pour améliorer le référencement</li>
        </ul>
      </div>
    </Card>
  );
};

export default OpenAIKeyForm;
