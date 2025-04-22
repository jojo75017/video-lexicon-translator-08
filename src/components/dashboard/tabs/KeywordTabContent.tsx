
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle, Tag, FileText, KeyRound, Info, Search, Link, Copy, Check, SwitchCamera } from 'lucide-react';
import { toast } from "sonner";
import { KeywordSuggestion } from '@/types/seo';
import { OpenAIService } from '@/utils/seo/openaiService';
import KeywordSuggestions from '@/components/seo/analysis/KeywordSuggestions';
import OpenAIKeyForm from '@/components/settings/OpenAIKeyForm';

// Demo keywords pour tester l'interface sans API
const demoKeywords: KeywordSuggestion[] = [
  {
    keyword: "analyse seo",
    searchVolume: 9500,
    difficulty: 67,
    relevance: 85,
    competition: 70,
    cpc: 2.50,
    suggestedTitle: "Analyse SEO complète : Boostez votre visibilité en ligne ✓",
    suggestedDescription: "Découvrez comment optimiser votre site web avec notre analyse SEO experte. Améliorez votre classement et augmentez votre trafic organique.",
    suggestedShortDescription: "Découvrez notre analyse SEO experte pour optimiser votre site web, améliorer votre classement et augmenter votre trafic organique.",
    suggestedLongDescription: "Découvrez comment optimiser votre site web avec notre analyse SEO experte. Notre méthode complète examine tous les aspects techniques et stratégiques qui influencent votre positionnement dans les moteurs de recherche. Identifiez les opportunités d'amélioration, corrigez les problèmes techniques qui freinent votre visibilité, et développez une stratégie de contenu qui répond précisément aux attentes de votre audience. Nos experts vous accompagnent pour implémenter les bonnes pratiques SEO et vous aider à surpasser vos concurrents. Améliorez votre classement, augmentez votre trafic organique et boostez vos conversions grâce à une visibilité optimale."
  },
  {
    keyword: "audit référencement",
    searchVolume: 5400,
    difficulty: 45,
    relevance: 80,
    competition: 65,
    cpc: 1.80,
    suggestedTitle: "Audit de Référencement Professionnel | Résultats Garantis",
    suggestedDescription: "Un audit de référencement complet pour identifier les points forts et faibles de votre site. Recommandations personnalisées et plan d'action détaillé.",
    suggestedShortDescription: "Audit de référencement complet identifiant forces et faiblesses de votre site. Recommandations personnalisées et plan d'action détaillé.",
    suggestedLongDescription: "Bénéficiez d'un audit de référencement complet réalisé par nos experts pour identifier précisément les points forts et les faiblesses de votre site web. Notre analyse approfondie examine plus de 200 facteurs SEO, de la structure technique aux stratégies de contenu et de linking. Vous recevrez un rapport détaillé incluant une évaluation de votre positionnement actuel, une analyse de votre concurrence, et surtout des recommandations personnalisées classées par priorité. Notre plan d'action détaillé vous guidera étape par étape pour améliorer votre visibilité en ligne et générer plus de trafic qualifié. Profitez de notre expertise pour optimiser durablement votre présence sur les moteurs de recherche."
  },
  {
    keyword: "seo google",
    searchVolume: 12000,
    difficulty: 72,
    relevance: 90,
    competition: 75,
    cpc: 3.20,
    suggestedTitle: "SEO Google 2023 : Stratégies qui fonctionnent vraiment 🚀",
    suggestedDescription: "Maîtrisez les dernières techniques SEO pour Google. Guide expert pour améliorer votre classement et respecter les algorithmes les plus récents.",
    suggestedShortDescription: "Maîtrisez les dernières techniques SEO pour Google. Améliorez votre classement avec des stratégies conformes aux algorithmes récents.",
    suggestedLongDescription: "Maîtrisez les dernières techniques de référencement naturel pour Google avec notre guide expert complet. Découvrez les stratégies SEO 2023 qui fonctionnent réellement et qui vous permettront d'améliorer significativement votre positionnement dans les résultats de recherche. Notre approche est constamment mise à jour pour rester alignée avec les évolutions des algorithmes de Google, y compris les mises à jour Core, l'importance croissante des signaux d'expérience utilisateur et l'intelligence artificielle qui alimente désormais le moteur de recherche. Apprenez à optimiser vos pages pour les Featured Snippets, à créer un contenu qui répond parfaitement aux intentions de recherche, et à développer une stratégie d'acquisition de backlinks éthique et durable."
  },
  {
    keyword: "optimisation site web",
    searchVolume: 7200,
    difficulty: 53,
    relevance: 75,
    competition: 60,
    cpc: 2.10,
    suggestedTitle: "Optimisation Site Web : Performance & Conversion Maximale",
    suggestedDescription: "Services d'optimisation de site web pour une meilleure performance, un meilleur référencement et des taux de conversion plus élevés. Résultats mesurables.",
    suggestedShortDescription: "Services d'optimisation web pour améliorer performance, référencement et taux de conversion. Résultats mesurables garantis.",
    suggestedLongDescription: "Transformez votre site web en une véritable machine de performance et de conversion grâce à nos services d'optimisation professionnels. Notre approche globale combine l'amélioration technique (vitesse de chargement, responsive design, architecture de l'information), l'optimisation SEO (structure sémantique, maillage interne, stratégie de mots-clés) et l'optimisation de l'expérience utilisateur (parcours client, clarté des appels à l'action, tests A/B). Nos interventions sont basées sur une analyse approfondie de vos métriques actuelles et sur les meilleures pratiques du secteur. Vous bénéficierez d'un suivi détaillé avec des rapports réguliers montrant l'évolution de vos indicateurs clés de performance et le retour sur investissement de chaque optimisation réalisée."
  },
  {
    keyword: "meta description seo",
    searchVolume: 3600,
    difficulty: 38,
    relevance: 70,
    competition: 50,
    cpc: 1.50,
    suggestedTitle: "Meta Descriptions SEO : Guide Complet pour 2023",
    suggestedDescription: "Apprenez à rédiger des meta descriptions efficaces pour le SEO. Conseils d'experts, exemples et meilleures pratiques pour augmenter vos clics.",
    suggestedShortDescription: "Apprenez à rédiger des meta descriptions efficaces pour le SEO. Conseils d'experts et exemples pour augmenter vos clics.",
    suggestedLongDescription: "Apprenez à rédiger des meta descriptions parfaitement optimisées pour le SEO avec notre guide complet 2023. Ces courts paragraphes affichés dans les résultats de recherche sont essentiels pour convaincre les utilisateurs de cliquer sur votre lien plutôt que sur celui d'un concurrent. Découvrez comment trouver le juste équilibre entre optimisation pour les moteurs de recherche et copywriting persuasif, comment inclure intelligemment vos mots-clés sans faire de bourrage, et comment adapter vos descriptions à différents types de pages (accueil, produits, articles de blog, etc.). Notre guide inclut une analyse de nombreux exemples réussis dans différents secteurs, des templates personnalisables, et un processus étape par étape pour créer et tester l'efficacité de vos meta descriptions."
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
  const [descriptionType, setDescriptionType] = useState<'short' | 'long'>('short');
  const maxLengthDescription = descriptionType === 'short' ? 155 : 500;

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
        
        // Utiliser la description appropriée selon le type sélectionné
        if (descriptionType === 'short' && suggestions[0].suggestedShortDescription) {
          setDescription(suggestions[0].suggestedShortDescription);
        } else if (descriptionType === 'long' && suggestions[0].suggestedLongDescription) {
          setDescription(suggestions[0].suggestedLongDescription);
        } else if (suggestions[0].suggestedDescription) {
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

  // Basculer entre description courte et longue
  const toggleDescriptionType = () => {
    const newType = descriptionType === 'short' ? 'long' : 'short';
    setDescriptionType(newType);
    
    // Si on a des suggestions, mettre à jour la description avec le nouveau type
    if (generatedKeywords.length > 0) {
      const firstKeyword = generatedKeywords[0];
      if (newType === 'short' && firstKeyword.suggestedShortDescription) {
        setDescription(firstKeyword.suggestedShortDescription);
      } else if (newType === 'long' && firstKeyword.suggestedLongDescription) {
        setDescription(firstKeyword.suggestedLongDescription);
      }
    }
    
    toast.info(`Mode description ${newType === 'short' ? 'courte' : 'longue'} activé`, {
      description: `Longueur maximum: ${newType === 'short' ? '155' : '500'} caractères`
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
              <div className="flex justify-between items-center">
                <span>Meta Description (max {maxLengthDescription} caractères)</span>
                <Button 
                  variant="outline" 
                  onClick={toggleDescriptionType}
                  size="sm"
                  className="h-7 gap-1 text-xs"
                >
                  <SwitchCamera className="h-3 w-3" />
                  Mode {descriptionType === 'short' ? 'court' : 'long'} ({descriptionType === 'short' ? '155' : '500'})
                </Button>
              </div>
            </label>
            <div className="flex flex-col space-y-2">
              <div className="relative">
                <Textarea 
                  id="description"
                  placeholder="Description optimisée pour le SEO avec mots-clés pertinents" 
                  value={description} 
                  onChange={handleDescriptionChange}
                  className="pr-10 resize-none"
                  rows={6}
                  maxLength={maxLengthDescription}
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
              <span className={`font-medium ${
                description.length > maxLengthDescription ? 'text-red-500' : 
                description.length > maxLengthDescription * 0.9 ? 'text-yellow-500' : 'text-green-500'
              }`}>
                {description.length}/{maxLengthDescription}
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
        maxLengthDescription={maxLengthDescription}
        descriptionType={descriptionType}
      />
    </div>
  );
};

export default KeywordTabContent;

