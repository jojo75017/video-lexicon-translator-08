
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle, Tag, FileText, KeyRound, Info, Search, Link, Copy, Check } from 'lucide-react';
import { toast } from "sonner";
import { KeywordSuggestion } from '@/types/seo';
import { OpenAIService } from '@/utils/seo/openaiService';
import KeywordSuggestions from '@/components/seo/analysis/KeywordSuggestions';
import OpenAIKeyForm from '@/components/OpenAIKeyForm';

// Demo keywords pour tester l'interface sans API
const demoKeywords: KeywordSuggestion[] = [
  {
    keyword: "analyse seo",
    searchVolume: 9500,
    difficulty: 67,
    suggestedTitle: "Analyse SEO complète : Boostez votre visibilité en ligne ✓",
    suggestedDescription: "Découvrez comment optimiser votre site web avec notre analyse SEO experte. Améliorez votre classement et augmentez votre trafic organique."
  },
  {
    keyword: "audit référencement",
    searchVolume: 5400,
    difficulty: 45,
    suggestedTitle: "Audit de Référencement Professionnel | Résultats Garantis",
    suggestedDescription: "Un audit de référencement complet pour identifier les points forts et faibles de votre site. Recommandations personnalisées et plan d'action détaillé."
  },
  {
    keyword: "seo google",
    searchVolume: 12000,
    difficulty: 72,
    suggestedTitle: "SEO Google 2023 : Stratégies qui fonctionnent vraiment 🚀",
    suggestedDescription: "Maîtrisez les dernières techniques SEO pour Google. Guide expert pour améliorer votre classement et respecter les algorithmes les plus récents."
  },
  {
    keyword: "optimisation site web",
    searchVolume: 7200,
    difficulty: 53,
    suggestedTitle: "Optimisation Site Web : Performance & Conversion Maximale",
    suggestedDescription: "Services d'optimisation de site web pour une meilleure performance, un meilleur référencement et des taux de conversion plus élevés. Résultats mesurables."
  },
  {
    keyword: "meta description seo",
    searchVolume: 3600,
    difficulty: 38,
    suggestedTitle: "Meta Descriptions SEO : Guide Complet pour 2023",
    suggestedDescription: "Apprenez à rédiger des meta descriptions efficaces pour le SEO. Conseils d'experts, exemples et meilleures pratiques pour augmenter vos clics."
  }
];

const KeywordTabContent = () => {
  const [openaiKey, setOpenaiKey] = useState<string>('');
  const [isValidKey, setIsValidKey] = useState<boolean>(false);
  const [isLoadingKey, setIsLoadingKey] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [generatedKeywords, setGeneratedKeywords] = useState<KeywordSuggestion[]>([]);
  const [isCopied, setIsCopied] = useState<{title: boolean, description: boolean}>({title: false, description: false});
  const [error, setError] = useState<string | null>(null);

  // Vérifier s'il y a une clé OpenAI dans le localStorage
  useEffect(() => {
    const storedKey = localStorage.getItem('openaiKey');
    if (storedKey) {
      console.log("Clé OpenAI trouvée dans localStorage");
      setOpenaiKey(storedKey);
      validateApiKey(storedKey);
    } else {
      console.log("Aucune clé OpenAI trouvée dans localStorage");
    }
  }, []);

  // Valider la clé API
  const validateApiKey = async (key: string) => {
    if (!key) {
      setIsValidKey(false);
      return;
    }

    setIsLoadingKey(true);
    try {
      const openaiService = new OpenAIService(key);
      const isValid = await openaiService.validateApiKey();
      setIsValidKey(isValid);

      if (isValid) {
        localStorage.setItem('openaiKey', key);
        console.log("Clé API valide et sauvegardée dans localStorage");
        
        toast.success("Clé API OpenAI valide", {
          description: "Vous pouvez maintenant utiliser les fonctionnalités d'IA"
        });
      } else {
        console.log("Clé API invalide");
        toast.error("Clé API OpenAI invalide", {
          description: "Veuillez vérifier votre clé et réessayer"
        });
      }
    } catch (err) {
      console.error("Erreur lors de la validation de la clé API:", err);
      setIsValidKey(false);
      
      toast.error("Erreur de validation", {
        description: "Impossible de valider la clé API"
      });
    } finally {
      setIsLoadingKey(false);
    }
  };

  const handleSaveApiKey = (key: string) => {
    setOpenaiKey(key);
    validateApiKey(key);
  };

  // Analyser une URL
  const analyzeUrl = async () => {
    if (!url) {
      toast.error("Veuillez entrer une URL");
      return;
    }
    
    if (!isValidKey) {
      toast.error("Clé API OpenAI requise", {
        description: "Veuillez configurer votre clé API pour utiliser cette fonctionnalité"
      });
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Nettoyage de l'URL
      let formattedUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        formattedUrl = 'https://' + url;
      }
      
      console.log("Analyse de l'URL:", formattedUrl);
      toast.info("Analyse en cours", {
        description: "Extraction des données du site..."
      });
      
      const openaiService = new OpenAIService(openaiKey);
      const result = await openaiService.analyzeWebpage(formattedUrl);
      
      console.log("Résultat de l'analyse:", result);
      
      if (result && result.keywords && result.keywords.length > 0) {
        // Utiliser les résultats pour générer des suggestions
        const keywordList = result.keywords;
        const mainKeyword = keywordList[0]; // Prendre le premier mot-clé comme principal
        
        setKeyword(mainKeyword);
        
        // Générer des suggestions basées sur ce mot-clé
        await generateKeywordSuggestions(mainKeyword);
      } else {
        console.warn("Aucun mot-clé trouvé dans l'analyse");
        toast.warning("Analyse limitée", {
          description: "Aucun mot-clé principal n'a pu être extrait"
        });
        
        // Fallback: utiliser le domaine comme mot-clé
        const domain = new URL(formattedUrl).hostname.replace('www.', '');
        setKeyword(domain);
        await generateKeywordSuggestions(domain);
      }
    } catch (err) {
      console.error("Erreur lors de l'analyse de l'URL:", err);
      setError(`Erreur d'analyse: ${err instanceof Error ? err.message : "Erreur inconnue"}`);
      
      toast.error("Erreur d'analyse", {
        description: "Impossible d'analyser cette URL"
      });
      
      // Fallback avec des données de démonstration
      setGeneratedKeywords(demoKeywords);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Générer des suggestions de mots-clés
  const generateKeywordSuggestions = async (keywordText: string) => {
    if (!keywordText) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }
    
    if (!isValidKey) {
      toast.error("Clé API OpenAI requise", {
        description: "Veuillez configurer votre clé API pour utiliser cette fonctionnalité"
      });
      
      // Utiliser des données de démonstration
      console.log("Utilisation de données de démonstration");
      setGeneratedKeywords(demoKeywords);
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      console.log("Génération de suggestions pour:", keywordText);
      toast.info("Génération en cours", {
        description: "Création de suggestions optimisées..."
      });
      
      const openaiService = new OpenAIService(openaiKey);
      const suggestions = await openaiService.getKeywordSuggestions(keywordText);
      
      console.log("Suggestions générées:", suggestions);
      
      if (suggestions && suggestions.length > 0) {
        setGeneratedKeywords(suggestions);
        
        // Utiliser le premier résultat pour remplir le titre et la description
        if (suggestions[0].suggestedTitle) {
          setTitle(suggestions[0].suggestedTitle);
        }
        
        if (suggestions[0].suggestedDescription) {
          setDescription(suggestions[0].suggestedDescription);
        }
        
        toast.success("Suggestions générées", {
          description: `${suggestions.length} suggestions créées avec succès`
        });
      } else {
        console.warn("Aucune suggestion générée");
        toast.warning("Génération limitée", {
          description: "Aucune suggestion n'a pu être générée"
        });
        
        // Utiliser les données de démonstration
        setGeneratedKeywords(demoKeywords);
      }
    } catch (err) {
      console.error("Erreur lors de la génération des suggestions:", err);
      setError(`Erreur de génération: ${err instanceof Error ? err.message : "Erreur inconnue"}`);
      
      toast.error("Erreur de génération", {
        description: "Impossible de générer des suggestions"
      });
      
      // Fallback avec des données de démonstration
      setGeneratedKeywords(demoKeywords);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Copier le texte dans le presse-papier
  const copyToClipboard = (text: string, type: 'title' | 'description') => {
    navigator.clipboard.writeText(text);
    
    setIsCopied({
      ...isCopied,
      [type]: true
    });
    
    toast.success(`${type === 'title' ? 'Titre' : 'Description'} copié`, {
      duration: 1500
    });
    
    setTimeout(() => {
      setIsCopied({
        ...isCopied,
        [type]: false
      });
    }, 2000);
  };

  // Mettre à jour le titre depuis les suggestions
  const updateTitleFromSuggestion = (newTitle: string) => {
    setTitle(newTitle);
    toast.success("Titre mis à jour", {
      description: "Le titre a été mis à jour avec la suggestion"
    });
  };

  // Mettre à jour la description depuis les suggestions
  const updateDescriptionFromSuggestion = (newDescription: string) => {
    setDescription(newDescription);
    toast.success("Description mise à jour", {
      description: "La description a été mise à jour avec la suggestion"
    });
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  // Utiliser une fonction pour encapsuler la génération de suggestions
  const handleGenerateKeywords = () => {
    if (keyword) {
      generateKeywordSuggestions(keyword);
    } else {
      toast.error("Veuillez entrer un mot-clé");
    }
  };

  // Utiliser une fonction pour insérer un emoji ou hashtag dans le titre/description
  const handleInsertIntoField = (value: string, field: 'title' | 'description') => {
    if (field === 'title') {
      setTitle(value);
    } else {
      setDescription(value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration de la clé API */}
      <Card className="p-6 shadow-sm bg-white">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Configuration API</h3>
        </div>
        
        <OpenAIKeyForm 
          apiKey={openaiKey} 
          onSave={handleSaveApiKey} 
          isLoading={isLoadingKey}
          isValid={isValidKey}
        />
        
        {isValidKey && (
          <div className="mt-2 text-sm text-green-600 flex items-center">
            <Info className="h-4 w-4 mr-1" />
            Clé API valide. Vous pouvez utiliser toutes les fonctionnalités.
          </div>
        )}
      </Card>
      
      {/* Analyse d'URL */}
      <Card className="p-6 shadow-sm bg-white">
        <div className="flex items-center gap-2 mb-4">
          <Link className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-medium">Analyse d'URL</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              URL du site à analyser
            </label>
            <div className="flex space-x-2">
              <Input 
                id="url"
                placeholder="https://exemple.com" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={analyzeUrl}
                disabled={isAnalyzing || !url}
                className="whitespace-nowrap"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Analyser
                  </>
                )}
              </Button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Nous analyserons cette URL pour extraire des mots-clés pertinents.
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </Card>
      
      {/* Génération de Mots-clés */}
      <Card className="p-6 shadow-sm bg-white">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-medium">Génération de meta tags</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
              Mot-clé principal
            </label>
            <div className="flex space-x-2">
              <Input 
                id="keyword"
                placeholder="seo, marketing digital, etc." 
                value={keyword} 
                onChange={handleKeywordChange}
                className="flex-1"
              />
              <Button
                onClick={handleGenerateKeywords}
                disabled={isAnalyzing || !keyword}
                className="whitespace-nowrap"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Générer
                  </>
                )}
              </Button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Entrez un mot-clé principal pour générer des suggestions de titres et descriptions.
            </p>
          </div>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Balise Title (max 60 caractères)
            </label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Input 
                  id="title"
                  placeholder="Titre optimisé pour le SEO" 
                  value={title} 
                  onChange={handleTitleChange}
                  className="pr-10"
                  maxLength={60}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Button
                    onClick={() => copyToClipboard(title, 'title')}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    {isCopied.title ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500 flex justify-between">
              <span>Le titre apparaît dans les résultats de recherche.</span>
              <span className={`font-medium ${title.length > 60 ? 'text-red-500' : ''}`}>
                {title.length}/60
              </span>
            </p>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description (max 155 caractères)
            </label>
            <div className="flex flex-col space-y-2">
              <div className="relative">
                <Textarea 
                  id="description"
                  placeholder="Description optimisée pour le SEO avec mots-clés pertinents" 
                  value={description} 
                  onChange={handleDescriptionChange}
                  className="pr-10 resize-none"
                  rows={3}
                  maxLength={155}
                />
                <div className="absolute top-0 right-0 m-2">
                  <Button
                    onClick={() => copyToClipboard(description, 'description')}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    {isCopied.description ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500 flex justify-between">
              <span>La description apparaît sous le titre dans les résultats de recherche.</span>
              <span className={`font-medium ${description.length > 155 ? 'text-red-500' : ''}`}>
                {description.length}/155
              </span>
            </p>
          </div>
        </div>
      </Card>
      
      {/* Suggestions */}
      <KeywordSuggestions 
        generatedKeywords={generatedKeywords} 
        onGenerateClick={handleGenerateKeywords}
        fieldValue={title}
        onInsert={(val) => handleInsertIntoField(val, 'title')}
        maxLength={60}
        descriptionValue={description}
        onInsertDescription={(val) => handleInsertIntoField(val, 'description')}
        maxLengthDescription={155}
      />
    </div>
  );
};

export default KeywordTabContent;
