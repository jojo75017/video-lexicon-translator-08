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
import SearchConsoleDataViewer from './keyword/SearchConsoleData';
import SiteStructureAnalyzer from './keyword/SiteStructureAnalyzer';
import { RankingData } from '@/types/seo/Ranking';
import { OpenAIService } from '@/utils/seo/openaiService';

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
  
  // État pour les données de Search Console
  const [searchConsoleData, setSearchConsoleData] = useState<RankingData | undefined>(undefined);
  const [isLoadingSearchConsole, setIsLoadingSearchConsole] = useState<boolean>(false);

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
      // Générer les mots-clés standards
      let standards = generateStandardKeywords(keyword);
      
      // Générer les mots-clés longue traîne
      let longTails = generateLongTailKeywords(keyword);
      
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
              trend: generateTrendData(kw)
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
      
      // Générer les questions fréquentes
      const generateSimpleQuestions = (keyword: string): string[] => {
        return [
          `Comment ${keyword} fonctionne?`,
          `Quelle est la meilleure façon d'utiliser ${keyword}?`,
          `Pourquoi ${keyword} est-il important?`,
          `Quelles sont les alternatives à ${keyword}?`,
          `Quels sont les avantages de ${keyword}?`
        ];
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
        suggestedTitle: `Guide complet: ${q}`,
        suggestedDescription: `Découvrez tout ce que vous devez savoir sur ${q}. Guide pratique, conseils d'experts et astuces pour optimiser votre utilisation.`
      }));
      
      // Enrichir les mots-clés avec des données supplémentaires
      const enrichKeywordsSimple = (keywords: KeywordSuggestion[]): KeywordSuggestion[] => {
        return keywords.map(kw => ({
          ...kw,
          suggestedTitle: `Guide complet sur ${kw.keyword}: Tout ce que vous devez savoir`,
          suggestedDescription: `Découvrez les meilleures pratiques pour maîtriser ${kw.keyword}. Conseils d'experts, astuces et stratégies pour réussir.`
        }));
      };
      
      const enrichedStandards = enrichKeywordsSimple(standards);
      const enrichedLongTails = enrichKeywordsSimple(longTails);
      
      // Genérer des données de concurrents fictives
      const mockCompetitors = [
        { 
          name: "competitor1.com", 
          url: "https://www.competitor1.com", 
          strength: 85, 
          organic_traffic: 45000, 
          keywords: 1200 
        },
        { 
          name: "competitor2.com", 
          url: "https://www.competitor2.com", 
          strength: 72, 
          organic_traffic: 28000, 
          keywords: 850 
        },
        { 
          name: "competitor3.com", 
          url: "https://www.competitor3.com", 
          strength: 63, 
          organic_traffic: 17500, 
          keywords: 520 
        }
      ];
      
      // Mettre à jour les états
      setStandardKeywords(enrichedStandards);
      setLongTailKeywords(enrichedLongTails);
      setQuestionKeywords(questions);
      setCompetitors(mockCompetitors);
      setSerpResults([]);
      setHasGenerated(true);
      
      const totalGenerated = enrichedStandards.length + enrichedLongTails.length + questions.length;
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

  const fetchSearchConsoleData = () => {
    if (!keyword.trim()) {
      toast.error("Veuillez d'abord entrer un mot-clé");
      return;
    }
    
    setIsLoadingSearchConsole(true);
    
    setTimeout(() => {
      const mockData: RankingData = {
        totalImpressions: Math.floor(Math.random() * 10000) + 500,
        totalClicks: Math.floor(Math.random() * 2000) + 100,
        averageCTR: ((Math.random() * 5) + 1).toFixed(2),
        averagePosition: Math.random() * 20 + 1,
        impressions: Math.floor(Math.random() * 10000) + 1000,
        clicks: Math.floor(Math.random() * 2000) + 100,
        position: Math.random() * 10 + 1,
        historicalData: Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (30 - i));
          return {
            date: date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
            position: Math.random() * 30 + 1
          };
        }),
        topQueries: [
          { query: keyword, clicks: 120, impressions: 1500, ctr: 0.08, position: 3.2, change: -0.5 },
          { query: `${keyword} gratuit`, clicks: 85, impressions: 980, ctr: 0.087, position: 4.8, change: 0 },
          { query: `${keyword} en ligne`, clicks: 65, impressions: 750, ctr: 0.087, position: 5.3, change: 1.2 },
          { query: `meilleur ${keyword}`, clicks: 45, impressions: 690, ctr: 0.065, position: 6.7, change: -0.8 },
          { query: `tutoriel ${keyword}`, clicks: 38, impressions: 520, ctr: 0.073, position: 8.1, change: 0.4 },
        ],
        optimizationOpportunities: [
          { query: `comment utiliser ${keyword}`, clicks: 15, impressions: 450, ctr: 0.033, position: 5.2, change: 0 },
          { query: `comparatif ${keyword}`, clicks: 12, impressions: 380, ctr: 0.031, position: 4.8, change: 0 },
          { query: `${keyword} vs concurrent`, clicks: 8, impressions: 290, ctr: 0.027, position: 6.3, change: 0 }
        ]
      };
      
      setSearchConsoleData(mockData);
      setIsLoadingSearchConsole(false);
      toast.success("Données Search Console chargées", {
        description: `Analyse pour: "${keyword}"`
      });
    }, 2000);
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
              <TabsTrigger value="searchConsole" className="flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4" />
                Search Console
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
            
            <TabsContent value="searchConsole">
              <div className="grid grid-cols-1 gap-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Données Google Search Console</h3>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={fetchSearchConsoleData}
                    disabled={isLoadingSearchConsole}
                  >
                    {isLoadingSearchConsole ? (
                      <span>Chargement...</span>
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4" />
                        <span>Charger les données</span>
                      </>
                    )}
                  </Button>
                </div>
                
                <SearchConsoleDataViewer 
                  data={searchConsoleData}
                  isLoading={isLoadingSearchConsole}
                  keyword={keyword}
                />
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
              <h2 className="text-lg font-semibold">Suggestions de contenu</h2>
            </div>
            
            <ul className="space-y-2 mb-6">
              {[...questionKeywords].slice(0, 3).map((q, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-emerald-500 mt-0.5" />
                  <span>{q.keyword}</span>
                </li>
              ))}
              
              {[
                `Guide complet sur ${keyword}`,
                `Les 10 erreurs à éviter avec ${keyword}`,
                `Comment optimiser votre ${keyword} en 2024`
              ].map((title, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-emerald-500 mt-0.5" />
                  <span>{title}</span>
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
                    `Comparatif des meilleurs outils pour ${keyword} en 2024`,
                    `Comment mesurer l'efficacité de votre stratégie ${keyword}`,
                    `${keyword} pour débutants : guide pas à pas`,
                    `Les tendances ${keyword} à surveiller cette année`,
                    `Étude de cas : Comment augmenter son ROI avec ${keyword}`
                  ].map((idea, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border border-blue-100">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-blue-500 mt-1" />
                          <span>{idea}</span>
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
