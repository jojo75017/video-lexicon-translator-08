import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  TrendingUp, 
  BarChart3, 
  Download, 
  Sparkles, 
  Globe, 
  ExternalLink, 
  ArrowRight, 
  Info,
  FileText,
  MessageSquare,
  Tag,
  FolderTree,
  Key,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import KeywordResults from './keyword/KeywordResults';
import KeywordCard from './keyword/KeywordCard';
import { 
  generateStandardKeywords, 
  generateLongTailKeywords, 
  rankKeywordsByDifficulty, 
  rankKeywordsByVolume,
  generateTrendData,
  sortKeywordsByScore
} from '@/utils/keyword/keywordGeneratorUtils';
import DynamicFAQ from './keyword/DynamicFAQ';
import KeywordOpportunities from './keyword/KeywordOpportunities';
import KeywordFAQ from './keyword/KeywordFAQ';
import SiteStructureAnalyzer from './keyword/SiteStructureAnalyzer';
import { OpenAIService } from '@/utils/seo/openaiService';

// Fonction pour générer des titres variés et personnalisés
const generateDynamicTitle = (keyword: string, type: 'standard' | 'long-tail' | 'question' | 'semantic' | 'ai-generated'): string => {
  const titleTemplates = {
    'standard': [
      `${keyword} : Guide Complet ${new Date().getFullYear()}`,
      `Tout Savoir sur ${keyword} - Guide Expert`,
      `${keyword} : Stratégies et Conseils Pratiques`,
      `Maîtriser ${keyword} : Méthodes Éprouvées`,
      `${keyword} - Solutions Efficaces et Astuces`,
      `Guide ${keyword} : De Débutant à Expert`,
      `${keyword} : Les Meilleures Pratiques`
    ],
    'long-tail': [
      `Comment bien choisir ${keyword} : Guide pratique`,
      `${keyword} : Comparatif et conseils d'achat`,
      `Optimiser ${keyword} : techniques avancées`,
      `${keyword} pour débutants : guide étape par étape`,
      `Les erreurs à éviter avec ${keyword}`,
      `${keyword} : prix, avis et recommandations`
    ],
    'question': [
      `Réponse complète : ${keyword}`,
      `${keyword} : explication détaillée`,
      `Tout comprendre sur ${keyword}`,
      `${keyword} : guide et solutions`,
      `${keyword} : réponses d'experts`
    ],
    'semantic': [
      `${keyword} : analyse approfondie ${new Date().getFullYear()}`,
      `${keyword} : tendances et perspectives`,
      `Comprendre ${keyword} : guide technique`,
      `${keyword} : étude complète et insights`,
      `${keyword} : vision d'expert et analyse`
    ],
    'ai-generated': [
      `${keyword} avec l'IA : guide innovant`,
      `${keyword} : approche moderne et efficace`,
      `${keyword} : stratégies d'avenir`,
      `${keyword} : méthodes optimisées par l'IA`,
      `${keyword} : solutions intelligentes`
    ]
  };

  const templates = titleTemplates[type] || titleTemplates['standard'];
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  // Limiter à 60 caractères pour le SEO
  return randomTemplate.length > 60 ? randomTemplate.substring(0, 57) + "..." : randomTemplate;
};

// Fonction pour générer des descriptions variées et personnalisées
const generateDynamicDescription = (keyword: string, type: 'standard' | 'long-tail' | 'question' | 'semantic' | 'ai-generated'): string => {
  const descTemplates = {
    'standard': [
      `Découvrez tout sur ${keyword} avec notre guide expert. Conseils pratiques, astuces et stratégies pour réussir. Gratuit et complet.`,
      `Maîtrisez ${keyword} grâce à notre guide détaillé. Techniques avancées, bonnes pratiques et conseils d'experts pour optimiser vos résultats.`,
      `Guide complet ${keyword} : tout ce que vous devez savoir. Méthodes éprouvées, exemples concrets et astuces pour réussir rapidement.`,
      `Apprenez ${keyword} efficacement avec notre approche step-by-step. Conseils d'experts, outils recommandés et stratégies gagnantes.`,
      `${keyword} expliqué simplement : guide pratique avec exemples, conseils et techniques pour obtenir des résultats concrets.`
    ],
    'long-tail': [
      `${keyword} : trouvez les meilleures solutions avec notre comparatif expert. Prix, avis, recommandations et guide d'achat complet.`,
      `Comment optimiser ${keyword} ? Découvrez nos techniques avancées, astuces pratiques et conseils pour améliorer vos performances.`,
      `${keyword} pour débutants : guide étape par étape avec exemples concrets, erreurs à éviter et bonnes pratiques à adopter.`,
      `Choisir ${keyword} en ${new Date().getFullYear()} : comparatif, avis utilisateurs et recommandations d'experts pour faire le bon choix.`,
      `${keyword} : analyse détaillée, avantages, inconvénients et conseils pratiques pour optimiser votre stratégie.`
    ],
    'question': [
      `${keyword} : obtenez une réponse complète avec nos experts. Solutions pratiques, conseils et guide étape par étape.`,
      `Réponse détaillée à ${keyword} avec exemples concrets, explications claires et conseils d'experts pour réussir.`,
      `${keyword} expliqué par nos spécialistes : réponse complète, astuces pratiques et solutions efficaces.`,
      `Tout savoir sur ${keyword} : réponse exhaustive avec conseils, exemples et bonnes pratiques pour optimiser vos résultats.`,
      `${keyword} : réponse d'expert avec solutions concrètes, conseils pratiques et méthodes éprouvées.`
    ],
    'semantic': [
      `Analyse approfondie de ${keyword} : tendances, insights et perspectives d'experts pour optimiser votre stratégie.`,
      `${keyword} : étude complète avec données récentes, analyses techniques et recommandations stratégiques.`,
      `Comprendre ${keyword} : guide technique avec exemples pratiques, études de cas et conseils d'optimisation.`,
      `${keyword} : vision d'expert avec analyse détaillée, bonnes pratiques et stratégies avancées pour réussir.`,
      `${keyword} décrypté : analyse technique, tendances marché et conseils stratégiques pour optimiser vos performances.`
    ],
    'ai-generated': [
      `${keyword} optimisé par l'IA : découvrez les stratégies innovantes et solutions intelligentes pour maximiser vos résultats.`,
      `${keyword} avec l'intelligence artificielle : approches modernes, outils avancés et techniques d'optimisation.`,
      `${keyword} : méthodes IA pour des résultats supérieurs. Stratégies innovantes et conseils d'experts en intelligence artificielle.`,
      `Révolutionnez ${keyword} avec l'IA : techniques avancées, automatisation et optimisation pour des performances exceptionnelles.`,
      `${keyword} nouvelle génération : solutions IA, algorithmes avancés et stratégies intelligentes pour réussir.`
    ]
  };

  const templates = descTemplates[type] || descTemplates['standard'];
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  // Limiter à 155 caractères pour le SEO
  return randomTemplate.length > 155 ? randomTemplate.substring(0, 152) + "..." : randomTemplate;
};

const KeywordGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [language, setLanguage] = useState('fr');
  const [searchVolume, setSearchVolume] = useState('all');
  const [competition, setCompetition] = useState('all');
  const [activeTab, setActiveTab] = useState('standard');
  const [hasSearched, setHasSearched] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [showAiIdeas, setShowAiIdeas] = useState(false);
  
  // États pour les résultats
  const [standardKeywords, setStandardKeywords] = useState<KeywordSuggestion[]>([]);
  const [longTailKeywords, setLongTailKeywords] = useState<KeywordSuggestion[]>([]);
  const [questionKeywords, setQuestionKeywords] = useState<KeywordSuggestion[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  
  // États pour les données complémentaires
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [serpResults, setSerpResults] = useState<any[]>([]);
  
  // Configuration OpenAI
  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem('openaiKey') || '');
  const [apiKeyStatus, setApiKeyStatus] = useState<'unchecked' | 'valid' | 'invalid'>(
    localStorage.getItem('openaiKey') ? 'valid' : 'unchecked'
  );
  const [showApiConfig, setShowApiConfig] = useState(false);

  // Validation de la clé API OpenAI
  const validateAndSaveApiKey = async () => {
    if (!openaiKey) {
      toast.error('Veuillez entrer une clé API OpenAI');
      return;
    }

    try {
      setApiKeyStatus('unchecked');
      toast.info('Validation de la clé API...');
      
      const openAIService = new OpenAIService(openaiKey);
      const isValid = await openAIService.validateApiKey();
      
      if (isValid) {
        localStorage.setItem('openaiKey', openaiKey);
        setApiKeyStatus('valid');
        setShowApiConfig(false);
        toast.success('Clé API OpenAI validée et sauvegardée');
      } else {
        setApiKeyStatus('invalid');
        toast.error('Clé API OpenAI invalide');
      }
    } catch (error) {
      setApiKeyStatus('invalid');
      toast.error('Erreur lors de la validation de la clé API');
    }
  };
  
  // Fonction pour générer les mots-clés
  const handleGenerate = async () => {
    if (!keyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      // Générer les mots-clés standards avec titres/descriptions personnalisés
      let standards = generateStandardKeywords(keyword).map(kw => ({
        ...kw,
        suggestedTitle: generateDynamicTitle(kw.keyword, 'standard'),
        suggestedDescription: generateDynamicDescription(kw.keyword, 'standard'),
        trend: generateTrendData(kw.keyword) // Ensure trend is number[]
      }));
      
      // Générer les mots-clés longue traîne avec titres/descriptions personnalisés
      let longTails = generateLongTailKeywords(keyword).map(kw => ({
        ...kw,
        suggestedTitle: generateDynamicTitle(kw.keyword, 'long-tail'),
        suggestedDescription: generateDynamicDescription(kw.keyword, 'long-tail'),
        trend: generateTrendData(kw.keyword) // Ensure trend is number[]
      }));
      
      // Si on a une clé OpenAI valide, enrichir avec l'IA
      if (apiKeyStatus === 'valid' && openaiKey) {
        try {
          const openAIService = new OpenAIService(openaiKey);
          const aiKeywords = await openAIService.generateKeywords(keyword);
          
          if (aiKeywords.length > 0) {
            // Enrichir les mots-clés avec les suggestions IA
            const aiEnrichedKeywords = aiKeywords.map(kw => ({
              keyword: kw,
              volume: Math.floor(Math.random() * 2000) + 100,
              difficulty: Math.floor(Math.random() * 80) + 10,
              cpc: parseFloat((Math.random() * 3).toFixed(2)),
              type: 'ai-generated' as 'ai-generated',
              intent: 'mixed' as 'mixed',
              opportunity: Math.floor(Math.random() * 40) + 50,
              trend: generateTrendData(kw),
              suggestedTitle: generateDynamicTitle(kw, 'ai-generated'),
              suggestedDescription: generateDynamicDescription(kw, 'ai-generated'),
              searchVolume: Math.floor(Math.random() * 2000) + 100,
              relevance: Math.floor(Math.random() * 40) + 60
            }));
            
            // Mélanger avec les mots-clés existants
            standards = [...standards, ...aiEnrichedKeywords.slice(0, 5)];
            longTails = [...longTails, ...aiEnrichedKeywords.slice(5, 10)];
            
            toast.success(`Mots-clés enrichis avec l'IA OpenAI`);
          }
        } catch (error) {
          console.error('Erreur OpenAI:', error);
          toast.warning('Génération standard utilisée (erreur IA)');
        }
      }
      
      // Générer les questions fréquentes avec titres/descriptions personnalisés
      const generateSimpleQuestions = (keyword: string): string[] => {
        const questionTypes = [
          `Comment ${keyword} fonctionne-t-il exactement ?`,
          `Quelle est la meilleure façon d'utiliser ${keyword} ?`,
          `Pourquoi ${keyword} est-il si important aujourd'hui ?`,
          `Quelles sont les meilleures alternatives à ${keyword} ?`,
          `Quels sont les principaux avantages de ${keyword} ?`,
          `Comment débuter avec ${keyword} efficacement ?`,
          `${keyword} est-il fait pour mon entreprise ?`,
          `Combien coûte réellement ${keyword} ?`,
          `Comment optimiser ${keyword} pour de meilleurs résultats ?`,
          `Quelles erreurs éviter avec ${keyword} ?`
        ];
        
        // Mélanger et prendre 5 questions aléatoirement
        return questionTypes.sort(() => 0.5 - Math.random()).slice(0, 5);
      };

      const questions = generateSimpleQuestions(keyword).map(q => ({
        keyword: q,
        volume: Math.floor(Math.random() * 500) + 10,
        difficulty: Math.floor(Math.random() * 40) + 5,
        cpc: parseFloat((Math.random() * 0.8).toFixed(2)),
        type: 'question' as 'question',
        intent: 'informational' as 'informational',
        opportunity: Math.floor(Math.random() * 30) + 60,
        trend: generateTrendData(q),
        suggestedTitle: generateDynamicTitle(q, 'question'),
        suggestedDescription: generateDynamicDescription(q, 'question'),
        searchVolume: Math.floor(Math.random() * 500) + 10,
        relevance: Math.floor(Math.random() * 30) + 70
      }));
      
      // Genérer des données de concurrents fictives
      const mockCompetitors = [
        { 
          name: "Booking.com", 
          url: "https://www.booking.com", 
          strength: 95, 
          organic_traffic: 850000, 
          keywords: 45000 
        },
        { 
          name: "TripAdvisor", 
          url: "https://www.tripadvisor.fr", 
          strength: 88, 
          organic_traffic: 650000, 
          keywords: 35000 
        },
        { 
          name: "Airbnb", 
          url: "https://www.airbnb.fr", 
          strength: 82, 
          organic_traffic: 420000, 
          keywords: 28000 
        },
        { 
          name: "Office de Tourisme de Quimper", 
          url: "https://www.quimper-tourisme.bzh", 
          strength: 65, 
          organic_traffic: 45000, 
          keywords: 2800 
        },
        { 
          name: "Hotels.com", 
          url: "https://fr.hotels.com", 
          strength: 78, 
          organic_traffic: 320000, 
          keywords: 22000 
        }
      ];
      
      // Mettre à jour les états
      setStandardKeywords(standards);
      setLongTailKeywords(longTails);
      setQuestionKeywords(questions);
      setCompetitors(mockCompetitors);
      setSerpResults([]);
      setHasGenerated(true);
      
      const totalGenerated = standards.length + longTails.length + questions.length;
      toast.success(`${totalGenerated} mots-clés générés${apiKeyStatus === 'valid' ? ' (IA activée)' : ''}`);
    } catch (error) {
      console.error("Erreur lors de la génération des mots-clés:", error);
      toast.error("Erreur lors de la génération des mots-clés");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fonction pour trier les mots-clés
  const sortKeywords = (type: string) => {
    switch(type) {
      case 'volume':
        setStandardKeywords([...rankKeywordsByVolume(standardKeywords)]);
        setLongTailKeywords([...rankKeywordsByVolume(longTailKeywords)]);
        toast.info("Mots-clés triés par volume de recherche");
        break;
      case 'difficulty':
        setStandardKeywords([...rankKeywordsByDifficulty(standardKeywords)]);
        setLongTailKeywords([...rankKeywordsByDifficulty(longTailKeywords)]);
        toast.info("Mots-clés triés par difficulté");
        break;
      case 'opportunity':
        setStandardKeywords([...sortKeywordsByScore(standardKeywords)]);
        setLongTailKeywords([...sortKeywordsByScore(longTailKeywords)]);
        toast.info("Mots-clés triés par opportunité");
        break;
      default:
        break;
    }
  };
  
  const toggleKeywordSelection = (keyword: string) => {
    setSelectedKeywords(prev => {
      if (prev.includes(keyword)) {
        return prev.filter(k => k !== keyword);
      } else {
        return [...prev, keyword];
      }
    });
  };
  
  const clearSelectedKeywords = () => {
    setSelectedKeywords([]);
    toast.info("Tous les mots-clés ont été désélectionnés");
  };
  
  const exportSelectedKeywords = () => {
    if (selectedKeywords.length === 0) {
      toast.error("Aucun mot-clé sélectionné");
      return;
    }
    
    const allKeywords = [...standardKeywords, ...longTailKeywords, ...questionKeywords];
    const selected = allKeywords.filter(kw => selectedKeywords.includes(kw.keyword));
    
    let csv = "Mot-clé,Volume,Difficulté,CPC,Opportunité,Type,Intention\n";
    selected.forEach(kw => {
      csv += `"${kw.keyword}",${kw.volume || 'N/A'},${kw.difficulty || 'N/A'},${kw.cpc || 'N/A'},${kw.opportunity || 'N/A'},${kw.type || 'standard'},${kw.intent || 'N/A'}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mots-cles-${keyword.replace(/\s+/g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${selectedKeywords.length} mots-clés exportés`);
  };

  const handleGenerateMoreIdeas = () => {
    if (openaiKey.trim() === '') {
      toast.error("Veuillez configurer votre clé API OpenAI d'abord");
      return;
    }
    
    setShowAiIdeas(prevState => {
      const newState = !prevState;
      return newState;
    });
    
    toast.info("Panneau d'idées IA", {
      description: showAiIdeas ? "Panneau fermé" : "Explorez des suggestions générées par l'IA"
    });
  };

  // Nombre total de mots-clés générés
  const totalKeywords = standardKeywords.length + longTailKeywords.length + questionKeywords.length;
  
  // Vérifier si des données de concurrents sont disponibles
  const hasCompetitorData = competitors.length > 0;
  
  return (
    <div className="space-y-6">
      {/* Configuration de l'API OpenAI */}
      <Card className="p-6 border-t-4 border-t-purple-500">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h2 className="text-xl font-bold">Configuration OpenAI</h2>
          {apiKeyStatus === 'valid' && (
            <Badge className="bg-green-100 text-green-800 text-xs">
              <Zap className="w-3 h-3 mr-1" />
              IA activée
            </Badge>
          )}
        </div>

        {(showApiConfig || apiKeyStatus !== 'valid') && (
          <div className="mb-4">
            <div className="flex gap-2 mb-2">
              <Input
                type="password"
                placeholder="sk-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="flex-1"
              />
              <Button onClick={validateAndSaveApiKey} disabled={!openaiKey}>
                Valider
              </Button>
            </div>
            <p className="text-xs text-purple-600">
              Avec OpenAI, obtenez des suggestions de mots-clés plus pertinentes et personnalisées.
            </p>
          </div>
        )}

        {apiKeyStatus !== 'valid' && (
          <Button 
            variant="outline"
            onClick={() => setShowApiConfig(!showApiConfig)}
            className="flex items-center gap-2"
          >
            <Key className="w-4 h-4" />
            Configurer OpenAI
          </Button>
        )}
        
        <div className="mt-4 text-sm text-gray-600">
          <p className="flex items-center gap-1">
            <Info className="h-4 w-4" /> 
            La clé API OpenAI permet d'obtenir des suggestions de mots-clés plus pertinentes et des analyses concurrentielles détaillées.
          </p>
        </div>
      </Card>
      
      <Card className="p-6 border-t-4 border-t-blue-500">
        <div className="flex items-center gap-2 mb-6">
          <Search className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-bold">Recherche de mots-clés</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
          <div>
            <Input 
              placeholder="Entrez votre mot-clé principal"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Langue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">Anglais</SelectItem>
              <SelectItem value="es">Espagnol</SelectItem>
              <SelectItem value="de">Allemand</SelectItem>
              <SelectItem value="it">Italien</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={searchVolume} onValueChange={setSearchVolume}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Volume de recherche" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous volumes</SelectItem>
              <SelectItem value="high">Volume élevé</SelectItem>
              <SelectItem value="medium">Volume moyen</SelectItem>
              <SelectItem value="low">Volume faible</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={competition} onValueChange={setCompetition}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Concurrence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toute concurrence</SelectItem>
              <SelectItem value="high">Concurrence élevée</SelectItem>
              <SelectItem value="medium">Concurrence moyenne</SelectItem>
              <SelectItem value="low">Concurrence faible</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={handleGenerate}
            disabled={isLoading || !keyword.trim()}
            className="flex-1"
          >
            {isLoading ? (
              <>Génération en cours...</>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Générer des mots-clés
              </>
            )}
          </Button>
          
          {hasGenerated && (
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => sortKeywords('volume')}
                className="flex items-center gap-1"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Volume</span>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => sortKeywords('difficulty')}
                className="flex items-center gap-1"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Difficulté</span>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => sortKeywords('opportunity')}
                className="flex items-center gap-1"
              >
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Opportunité</span>
              </Button>
            </div>
          )}
        </div>
      </Card>
      
      {/* État vide */}
      {!hasSearched && (
        <Card className="p-6 text-center py-12">
          <Search className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2">Commencez votre recherche de mots-clés</h2>
          <p className="text-gray-600 mb-6">
            Analysez les mots-clés pour votre contenu, identifiez les meilleures opportunités et obtenez des insights sur la concurrence. 
            {apiKeyStatus === 'valid' ? ' IA OpenAI activée pour des suggestions personnalisées.' : ' Configurez OpenAI pour des suggestions plus précises.'}
          </p>
        </Card>
      )}
      
      {/* État de chargement */}
      {isLoading && (
        <Card className="p-6 text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <h2 className="text-xl font-medium mb-2">
            Recherche de mots-clés en cours...
            {apiKeyStatus === 'valid' && <Badge className="ml-2 bg-purple-100 text-purple-800">IA</Badge>}
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Nous analysons les données pour vous fournir les meilleures suggestions de mots-clés.
          </p>
        </Card>
      )}
      
      {/* Résultats */}
      {hasGenerated && !isLoading && (
        <>
          <KeywordResults 
            standardKeywords={standardKeywords}
            longTailKeywords={longTailKeywords}
            selectedKeywords={selectedKeywords}
            competitors={competitors}
            serpResults={serpResults}
            hasCompetitorData={hasCompetitorData}
            totalKeywords={totalKeywords}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            toggleKeywordSelection={toggleKeywordSelection}
            clearSelectedKeywords={clearSelectedKeywords}
            exportSelectedKeywords={exportSelectedKeywords}
            keyword={keyword}
          />
          
          <Tabs defaultValue="opportunities" className="mt-6">
            <TabsList className="mb-4">
              <TabsTrigger value="opportunities" className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                Opportunités
              </TabsTrigger>
              <TabsTrigger value="structure" className="flex items-center gap-1.5">
                <FolderTree className="h-4 w-4" />
                Structure du site
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" />
                FAQ
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="opportunities">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <KeywordOpportunities 
                  keywords={[...standardKeywords, ...longTailKeywords, ...questionKeywords]} 
                  mainKeyword={keyword}
                />
                <DynamicFAQ keyword={keyword} />
              </div>
            </TabsContent>
            
            <TabsContent value="structure">
              <SiteStructureAnalyzer />
            </TabsContent>
            
            <TabsContent value="faq">
              <KeywordFAQ />
            </TabsContent>
          </Tabs>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <KeywordOpportunities 
              keywords={[...standardKeywords, ...longTailKeywords, ...questionKeywords]} 
              mainKeyword={keyword}
            />
            
            <DynamicFAQ keyword={keyword} />
          </div>
          
          {questionKeywords.length > 0 && (
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Questions fréquentes (FAQ)</h2>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {questionKeywords.length} questions
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {questionKeywords.map((question, idx) => (
                  <KeywordCard 
                    key={idx}
                    keywordData={question}
                    isSelected={selectedKeywords.includes(question.keyword)}
                    onToggleSelection={toggleKeywordSelection}
                  />
                ))}
              </div>
            </Card>
          )}
          
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Champ sémantique et synonymes</h2>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {[...standardKeywords, ...longTailKeywords]
                .slice(0, 15)
                .map((kw, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary"
                    className="px-3 py-1 text-sm"
                  >
                    {kw.keyword}
                  </Badge>
                ))
              }
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-emerald-500" />
              <h2 className="text-lg font-semibold">Suggestions de contenu personnalisées</h2>
            </div>
            
            <ul className="space-y-2 mb-6">
              {[...questionKeywords].slice(0, 3).map((q, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-emerald-500 mt-0.5" />
                  <div>
                    <span className="font-medium">{q.suggestedTitle}</span>
                    <p className="text-sm text-gray-600 mt-1">{q.suggestedDescription}</p>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleGenerateMoreIdeas}
              >
                <MessageSquare className="h-4 w-4" />
                Générer plus d'idées avec l'IA
              </Button>
            </div>
            
            {showAiIdeas && (
              <div className="mt-6 p-4 border border-blue-100 rounded-lg bg-blue-50">
                <h3 className="font-medium text-blue-800 mb-3">Idées de contenu générées par l'IA</h3>
                
                <div className="space-y-3">
                  {[
                    { title: `Comparatif des meilleurs outils pour ${keyword} en ${new Date().getFullYear()}`, desc: `Analyse comparative détaillée des solutions ${keyword} disponibles sur le marché avec prix et fonctionnalités.` },
                    { title: `Comment mesurer l'efficacité de votre stratégie ${keyword}`, desc: `KPIs essentiels et métriques clés pour évaluer la performance de votre approche ${keyword}.` },
                    { title: `${keyword} pour débutants : guide pas à pas`, desc: `Tutoriel complet pour maîtriser ${keyword} même sans expérience préalable, avec exemples pratiques.` },
                    { title: `Les tendances ${keyword} à surveiller cette année`, desc: `Analyse des évolutions récentes et perspectives d'avenir dans le domaine ${keyword}.` },
                    { title: `Étude de cas : Comment augmenter son ROI avec ${keyword}`, desc: `Retour d'expérience concret sur l'optimisation des investissements ${keyword} pour maximiser les résultats.` }
                  ].map((idea, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border border-blue-100">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-blue-500 mt-1" />
                          <div>
                            <span className="font-medium">{idea.title}</span>
                            <p className="text-sm text-gray-600 mt-1">{idea.desc}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default KeywordGenerator;
