
import React, { useState, useEffect } from 'react';
import { KeywordSuggestion } from '@/types/seo';
import KeywordSuggestions from '@/components/seo/analysis/KeywordSuggestions';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { OpenAIService } from '@/utils/seo/openaiService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmojiTab from '@/components/seo/analysis/EmojiTab';
import HashtagsTab from '@/components/seo/analysis/HashtagsTab';
import { Card } from "@/components/ui/card";
import { generateBothDescriptions } from '@/utils/seo/generators/descriptionGenerator';
import { CheckCircle, AlertCircle } from 'lucide-react';

const KeywordTabContent = () => {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<KeywordSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [descriptionType, setDescriptionType] = useState<'short' | 'long'>('short');
  const [apiKeyStatus, setApiKeyStatus] = useState<'unchecked' | 'valid' | 'invalid'>('unchecked');
  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem('openaiKey') || '');
  const [validationMessage, setValidationMessage] = useState<string>('');
  
  // Vérifier la clé API au chargement du composant
  useEffect(() => {
    const checkApiKey = async () => {
      const apiKey = localStorage.getItem('openaiKey');
      if (!apiKey) {
        setApiKeyStatus('invalid');
        setValidationMessage("Aucune clé API configurée");
        return;
      }

      try {
        const openAIService = new OpenAIService(apiKey);
        // Essayer de valider la clé API
        OpenAIService.enableProxy();
        const isValid = await openAIService.validateApiKey();
        setApiKeyStatus(isValid ? 'valid' : 'invalid');
        
        if (isValid) {
          setValidationMessage("Clé API validée avec succès");
          toast.success("Clé API OpenAI validée");
          setOpenaiKey(apiKey);
          
          // Générer automatiquement des suggestions avec un mot-clé par défaut
          if (suggestions.length === 0) {
            setIsLoading(true);
            try {
              const defaultKeyword = "référencement";
              const newKeywords = await openAIService.getKeywordSuggestions(defaultKeyword);
              
              // S'assurer que chaque suggestion a des descriptions courtes et longues
              const enhancedKeywords = newKeywords.map(kw => {
                if (!kw.suggestedShortDescription || !kw.suggestedLongDescription) {
                  const descriptions = generateBothDescriptions(kw.keyword);
                  return {
                    ...kw,
                    suggestedShortDescription: descriptions.short,
                    suggestedLongDescription: descriptions.long,
                    suggestedDescription: descriptions.short
                  };
                }
                return kw;
              });
              
              setSuggestions(enhancedKeywords);
              setKeyword(defaultKeyword);
              toast.success("Suggestions générées automatiquement");
            } catch (error) {
              console.error("Erreur lors de la génération automatique:", error);
              // Générer des données de démonstration en cas d'échec
              const demoKeywords = generateDemoKeywords("référencement");
              setSuggestions(demoKeywords);
              setKeyword("référencement");
              toast.warning("Mode démonstration activé", {
                description: "Utilisation de données de démonstration."
              });
            } finally {
              setIsLoading(false);
            }
          }
        } else {
          setValidationMessage("La clé API n'a pas pu être validée");
          toast.error("La clé API n'a pas pu être validée");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la clé API:", error);
        setApiKeyStatus('invalid');
        setValidationMessage("Impossible de vérifier la clé API (problème réseau)");
        toast.error("Erreur de connexion", {
          description: "Impossible de vérifier votre clé API. Vérifiez votre connexion Internet."
        });
      }
    };
    
    checkApiKey();
  }, []);

  // Gérer la sauvegarde de la clé API
  const handleSaveApiKey = async () => {
    if (openaiKey) {
      localStorage.setItem('openaiKey', openaiKey);
      toast.info("Validation de la clé API en cours...");
      setValidationMessage("Validation en cours...");
      
      // Valider la clé API
      const openAIService = new OpenAIService(openaiKey);
      OpenAIService.enableProxy();
      try {
        const isValid = await openAIService.validateApiKey();
        setApiKeyStatus(isValid ? 'valid' : 'invalid');
        
        if (isValid) {
          setValidationMessage("Clé API validée avec succès");
          toast.success("Clé API OpenAI validée avec succès");
          
          // Générer automatiquement des suggestions
          setIsLoading(true);
          try {
            // Utiliser un mot-clé par défaut pour la première génération
            const defaultKeyword = "référencement";
            const newKeywords = await openAIService.getKeywordSuggestions(defaultKeyword);
            
            // S'assurer que chaque suggestion a des descriptions courtes et longues
            const enhancedKeywords = newKeywords.map(kw => {
              if (!kw.suggestedShortDescription || !kw.suggestedLongDescription) {
                const descriptions = generateBothDescriptions(kw.keyword);
                return {
                  ...kw,
                  suggestedShortDescription: descriptions.short,
                  suggestedLongDescription: descriptions.long,
                  suggestedDescription: descriptions.short
                };
              }
              return kw;
            });
            
            setSuggestions(enhancedKeywords);
            setKeyword(defaultKeyword);
            toast.success("Suggestions générées automatiquement");
          } catch (error) {
            console.error("Erreur lors de la génération:", error);
            // Générer des données de démonstration
            const demoKeywords = generateDemoKeywords("référencement");
            setSuggestions(demoKeywords);
            setKeyword("référencement");
            toast.warning("Mode démonstration activé", {
              description: "Utilisation de données de démonstration."
            });
          } finally {
            setIsLoading(false);
          }
        } else {
          setValidationMessage("La clé API n'a pas pu être validée");
          toast.error("La clé API n'a pas pu être validée");
        }
      } catch (error) {
        console.error("Erreur lors de la validation:", error);
        setApiKeyStatus('invalid');
        setValidationMessage("Impossible de vérifier la clé API (problème réseau)");
        toast.warning("Clé sauvegardée mais impossible de la valider (problème réseau)");
      }
    } else {
      toast.error("Veuillez entrer une clé API");
    }
  };

  const handleGenerateKeywords = async () => {
    if (!keyword) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }

    setIsLoading(true);
    try {
      const apiKey = openaiKey || localStorage.getItem('openaiKey');
      if (!apiKey) {
        toast.error("Clé API OpenAI manquante", {
          description: "Veuillez configurer votre clé API dans le champ ci-dessus"
        });
        setIsLoading(false);
        return;
      }

      // S'assurer que le proxy est activé
      OpenAIService.enableProxy();
      
      const openAIService = new OpenAIService(apiKey);

      // Utiliser une méthode pour générer des données de démonstration en cas d'échec
      let results;
      try {
        results = await openAIService.getKeywordSuggestions(keyword);
        console.log("Suggestions générées avec l'API:", results);
      } catch (error) {
        console.error("Erreur API, génération de données de démonstration:", error);
        // Générer des données de démonstration
        results = generateDemoKeywords(keyword);
        toast.warning("Mode démonstration activé", {
          description: "Connexion à l'API impossible. Utilisation de données de démonstration."
        });
      }

      // Assurons-nous que chaque suggestion a des descriptions courtes et longues
      const enhancedResults = results.map(kw => {
        // Générer les deux types de descriptions
        const descriptions = generateBothDescriptions(kw.keyword);
        
        return {
          ...kw,
          suggestedShortDescription: kw.suggestedShortDescription || descriptions.short,
          suggestedLongDescription: kw.suggestedLongDescription || descriptions.long,
          suggestedDescription: kw.suggestedDescription || descriptions.short
        };
      });
      
      setSuggestions(enhancedResults);
      toast.success("Suggestions générées avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      toast.error("Erreur de génération", {
        description: "Impossible de générer des suggestions pour ce mot-clé. Vérifiez votre clé API et votre connexion."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour générer des données de démonstration
  const generateDemoKeywords = (keyword: string): KeywordSuggestion[] => {
    const baseKeyword = keyword.toLowerCase();
    // Générer des descriptions pour chaque mot-clé de démonstration
    const keywords = [
      {
        keyword: baseKeyword,
        searchVolume: 5200,
        difficulty: 67,
        suggestedTitle: `Guide ultime ${baseKeyword} : Les secrets des experts | 2024`,
        relevance: 95,
        competition: 0.78,
        cpc: 2.34,
        volume: 5200
      },
      {
        keyword: `meilleur ${baseKeyword}`,
        searchVolume: 3800,
        difficulty: 58,
        suggestedTitle: `Top 10 des meilleurs ${baseKeyword} | Comparatif complet`,
        relevance: 88,
        competition: 0.82,
        cpc: 3.12,
        volume: 3800
      },
      {
        keyword: `${baseKeyword} pas cher`,
        searchVolume: 2900,
        difficulty: 45,
        suggestedTitle: `${baseKeyword} pas cher : Guide d'achat pour petits budgets 2024`,
        relevance: 82,
        competition: 0.65,
        cpc: 1.88,
        volume: 2900
      },
      {
        keyword: `comment choisir ${baseKeyword}`,
        searchVolume: 2200,
        difficulty: 42,
        suggestedTitle: `Comment choisir le bon ${baseKeyword} ? Guide pratique 2024`,
        relevance: 79,
        competition: 0.58,
        cpc: 1.65,
        volume: 2200
      },
      {
        keyword: `${baseKeyword} avis`,
        searchVolume: 4100,
        difficulty: 51,
        suggestedTitle: `Avis ${baseKeyword} : Ce qu'en pensent vraiment les utilisateurs`,
        relevance: 86,
        competition: 0.72,
        cpc: 2.05,
        volume: 4100
      }
    ];
    
    // Ajouter des descriptions courtes et longues à chaque mot-clé
    return keywords.map(kw => {
      const descriptions = generateBothDescriptions(kw.keyword);
      return {
        ...kw,
        suggestedDescription: descriptions.short,
        suggestedShortDescription: descriptions.short,
        suggestedLongDescription: descriptions.long
      };
    });
  };

  const handleInsertTitle = (value: string) => {
    setTitle(value);
    toast.success("Titre inséré");
  };

  const handleInsertDescription = (value: string) => {
    if (descriptionType === 'short') {
      setShortDescription(value);
      toast.success("Description courte insérée");
    } else {
      setLongDescription(value);
      toast.success("Description longue insérée");
    }
  };

  const handleSwitchDescriptionType = (type: 'short' | 'long') => {
    setDescriptionType(type);
  };

  return (
    <div className="space-y-6">
      {/* Section clé API */}
      <Card className="p-4 border border-blue-100">
        <h3 className="font-medium text-blue-800 mb-2">Configuration de l'API OpenAI</h3>
        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="Entrez votre clé API OpenAI (sk-...)"
            value={openaiKey}
            onChange={(e) => setOpenaiKey(e.target.value)}
            className={`flex-1 ${apiKeyStatus === 'valid' ? 'border-green-500' : apiKeyStatus === 'invalid' ? 'border-red-500' : ''}`}
          />
          <Button onClick={handleSaveApiKey} variant="outline" className="whitespace-nowrap">
            Sauvegarder la clé
          </Button>
        </div>
        <div className="flex items-center mt-2">
          {apiKeyStatus === 'valid' && (
            <div className="flex items-center text-xs text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>{validationMessage}</span>
            </div>
          )}
          {apiKeyStatus === 'invalid' && (
            <div className="flex items-center text-xs text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>{validationMessage}</span>
            </div>
          )}
          {apiKeyStatus === 'unchecked' && (
            <span className="text-xs text-gray-500">Aucune clé API vérifiée</span>
          )}
        </div>
      </Card>

      <div className="flex gap-4">
        <Input
          placeholder="Entrez votre mot-clé principal"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={handleGenerateKeywords}
          disabled={isLoading}
        >
          {isLoading ? "Génération..." : "Générer"}
        </Button>
      </div>

      {apiKeyStatus === 'invalid' && openaiKey === '' && (
        <Card className="p-4 border-yellow-300 bg-yellow-50">
          <p className="text-sm text-yellow-800">
            Aucune clé API OpenAI valide détectée. Veuillez configurer votre clé pour des résultats optimaux.
          </p>
        </Card>
      )}

      {suggestions.length > 0 && (
        <>
          <KeywordSuggestions
            generatedKeywords={suggestions}
            onGenerateClick={handleGenerateKeywords}
            fieldValue={title}
            onInsert={handleInsertTitle}
            maxLength={60}
            descriptionValue={descriptionType === 'short' ? shortDescription : longDescription}
            onInsertDescription={handleInsertDescription}
            maxLengthDescription={descriptionType === 'short' ? 155 : 500}
            descriptionType={descriptionType}
          />

          <Card className="p-6 shadow-sm border-t-4 border-t-blue-500">
            <h3 className="text-lg font-medium mb-4">Optimisez votre contenu</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Titre SEO ({title.length}/60)
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={60}
                className={`${title.length > 55 ? 'border-yellow-400' : title.length > 45 ? 'border-green-400' : 'border-gray-300'}`}
              />
            </div>
            
            <Tabs defaultValue="short" onValueChange={(value) => handleSwitchDescriptionType(value as 'short' | 'long')}>
              <TabsList className="mb-2">
                <TabsTrigger value="short">Description courte</TabsTrigger>
                <TabsTrigger value="long">Description longue</TabsTrigger>
              </TabsList>
              
              <TabsContent value="short">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Description courte ({shortDescription.length}/155)
                  </label>
                  <textarea
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    maxLength={155}
                    rows={3}
                    className={`w-full p-2 border rounded-md ${shortDescription.length > 145 ? 'border-yellow-400' : shortDescription.length > 120 ? 'border-green-400' : 'border-gray-300'}`}
                  ></textarea>
                </div>
              </TabsContent>
              
              <TabsContent value="long">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Description longue ({longDescription.length}/500)
                  </label>
                  <textarea
                    value={longDescription}
                    onChange={(e) => setLongDescription(e.target.value)}
                    maxLength={500}
                    rows={6}
                    className={`w-full p-2 border rounded-md ${longDescription.length > 480 ? 'border-yellow-400' : longDescription.length > 400 ? 'border-green-400' : 'border-gray-300'}`}
                  ></textarea>
                </div>
              </TabsContent>
            </Tabs>
            
            <Tabs defaultValue="emoji" className="mt-6">
              <TabsList className="mb-2">
                <TabsTrigger value="emoji">Emojis</TabsTrigger>
                <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
              </TabsList>
              
              <TabsContent value="emoji">
                <EmojiTab 
                  fieldValue={title} 
                  onInsert={handleInsertTitle}
                  maxLength={60}
                />
              </TabsContent>
              
              <TabsContent value="hashtags">
                <HashtagsTab 
                  fieldValue={descriptionType === 'short' ? shortDescription : longDescription} 
                  onInsert={handleInsertDescription}
                  maxLength={descriptionType === 'short' ? 155 : 500}
                />
              </TabsContent>
            </Tabs>
          </Card>
        </>
      )}
    </div>
  );
};

export default KeywordTabContent;
