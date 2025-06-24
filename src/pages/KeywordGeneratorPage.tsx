import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, Copy, Sparkles, TrendingUp, Users, DollarSign, Key, Settings, CheckCircle, AlertCircle, Target, Brain, MessageSquare, BarChart3, Globe, Zap, Filter, Eye, Calendar, HelpCircle, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { OpenAIService } from '../utils/seo/openaiService';
import KeywordDensityAnalyzer from '../components/seo/KeywordDensityAnalyzer';
import KeywordTrendAnalysis from '../components/seo/keyword/KeywordTrendAnalysis';
import KeywordQuestions from '../components/seo/keyword/KeywordQuestions';
import ContentIdeaGenerator from '../components/seo/keyword/ContentIdeaGenerator';

interface Keyword {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  trend: 'up' | 'down' | 'stable';
  competition: 'faible' | 'moyenne' | 'forte';
  intent?: string;
  type?: 'standard' | 'longTail' | 'semantic';
}

interface CompetitorData {
  name: string;
  strength: number;
}

const KeywordGeneratorPage = () => {
  const [mainKeyword, setMainKeyword] = useState('');
  const [language, setLanguage] = useState('fr');
  const [isGenerating, setIsGenerating] = useState(false);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [longTailKeywords, setLongTailKeywords] = useState<Keyword[]>([]);
  const [semanticKeywords, setSemanticKeywords] = useState<Keyword[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [activeTab, setActiveTab] = useState('generator');
  
  // États pour l'API OpenAI
  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem('openaiKey') || '');
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'unchecked' | 'valid' | 'invalid'>('unchecked');
  const [isValidatingKey, setIsValidatingKey] = useState(false);

  // États pour les filtres
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [intentFilter, setIntentFilter] = useState('all');
  const [volumeFilter, setVolumeFilter] = useState('all');

  const [showDensityAnalyzer, setShowDensityAnalyzer] = useState(false);

  const validateApiKey = async () => {
    if (!openaiKey.trim()) {
      toast.error('Veuillez entrer une clé API OpenAI');
      return;
    }

    setIsValidatingKey(true);
    try {
      const openAIService = new OpenAIService(openaiKey);
      const isValid = await openAIService.validateApiKey();
      
      if (isValid) {
        localStorage.setItem('openaiKey', openaiKey);
        setApiKeyStatus('valid');
        setShowApiConfig(false);
        toast.success('Clé API OpenAI validée avec succès');
      } else {
        setApiKeyStatus('invalid');
        toast.error('Clé API invalide. Vérifiez votre clé OpenAI.');
      }
    } catch (error) {
      setApiKeyStatus('invalid');
      toast.error('Erreur lors de la validation de la clé API');
    } finally {
      setIsValidatingKey(false);
    }
  };

  const generateKeywords = async () => {
    if (!mainKeyword.trim()) {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    setIsGenerating(true);
    
    try {
      let generatedKeywords: Keyword[] = [];
      let generatedLongTail: Keyword[] = [];
      let generatedSemantic: Keyword[] = [];
      let competitorData: CompetitorData[] = [];

      // Si une clé API valide est configurée, utiliser OpenAI
      if (apiKeyStatus === 'valid' && openaiKey) {
        try {
          const openAIService = new OpenAIService(openaiKey);
          
          // Générer les différents types de mots-clés en parallèle
          const [aiKeywords, longTailKws, semanticKws, competitorNames] = await Promise.all([
            openAIService.generateKeywords(mainKeyword),
            openAIService.generateLongTailKeywords(mainKeyword),
            openAIService.generateSemanticKeywords(mainKeyword),
            openAIService.analyzeCompetitors(mainKeyword)
          ]);
          
          // Enrichir les mots-clés standards
          const enrichedKeywords = await Promise.all(
            aiKeywords.slice(0, 15).map(async (kw) => {
              const [difficulty, volume, intent] = await Promise.all([
                openAIService.analyzeKeywordDifficulty(kw),
                openAIService.estimateSearchVolume(kw),
                openAIService.analyzeSearchIntent(kw)
              ]);
              
              return {
                keyword: kw,
                volume,
                difficulty,
                cpc: parseFloat((Math.random() * 3 + 0.5).toFixed(2)),
                trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down' as 'up' | 'down' | 'stable',
                competition: difficulty > 70 ? 'forte' : difficulty > 40 ? 'moyenne' : 'faible' as 'faible' | 'moyenne' | 'forte',
                intent,
                type: 'standard' as const
              };
            })
          );

          // Enrichir les mots-clés longue traîne
          const enrichedLongTail = await Promise.all(
            longTailKws.slice(0, 12).map(async (kw) => {
              const [difficulty, volume, intent] = await Promise.all([
                openAIService.analyzeKeywordDifficulty(kw),
                openAIService.estimateSearchVolume(kw),
                openAIService.analyzeSearchIntent(kw)
              ]);
              
              return {
                keyword: kw,
                volume: Math.floor(volume * 0.3),
                difficulty: Math.floor(difficulty * 0.7),
                cpc: parseFloat((Math.random() * 2 + 0.2).toFixed(2)),
                trend: Math.random() > 0.7 ? 'up' : 'stable' as 'up' | 'down' | 'stable',
                competition: 'faible' as const,
                intent,
                type: 'longTail' as const
              };
            })
          );

          // Enrichir les mots-clés sémantiques
          const enrichedSemantic = await Promise.all(
            semanticKws.slice(0, 10).map(async (kw) => {
              const [difficulty, volume, intent] = await Promise.all([
                openAIService.analyzeKeywordDifficulty(kw),
                openAIService.estimateSearchVolume(kw),
                openAIService.analyzeSearchIntent(kw)
              ]);
              
              return {
                keyword: kw,
                volume: Math.floor(volume * 0.8),
                difficulty: Math.floor(difficulty * 0.9),
                cpc: parseFloat((Math.random() * 2.5 + 0.3).toFixed(2)),
                trend: Math.random() > 0.5 ? 'stable' : 'up' as 'up' | 'down' | 'stable',
                competition: difficulty > 60 ? 'forte' : difficulty > 30 ? 'moyenne' : 'faible' as 'faible' | 'moyenne' | 'forte',
                intent,
                type: 'semantic' as const
              };
            })
          );

          // Données des concurrents
          competitorData = competitorNames.map(name => ({
            name,
            strength: Math.floor(Math.random() * 40) + 60
          }));
          
          generatedKeywords = enrichedKeywords;
          generatedLongTail = enrichedLongTail;
          generatedSemantic = enrichedSemantic;
          
          toast.success(`Analyse complète générée avec l'IA OpenAI !`);
        } catch (error) {
          console.error('Erreur OpenAI:', error);
          toast.warning('Erreur avec l\'API OpenAI, génération de données génériques');
          generatedKeywords = generateFallbackKeywords(mainKeyword);
        }
      } else {
        // Génération de mots-clés génériques
        generatedKeywords = generateFallbackKeywords(mainKeyword);
        generatedLongTail = generateFallbackLongTail(mainKeyword);
        generatedSemantic = generateFallbackSemantic(mainKeyword);
        competitorData = generateFallbackCompetitors();
        toast.info('Données générées (configurez OpenAI pour plus de précision)');
      }

      setKeywords(generatedKeywords.sort((a, b) => b.volume - a.volume));
      setLongTailKeywords(generatedLongTail.sort((a, b) => b.volume - a.volume));
      setSemanticKeywords(generatedSemantic.sort((a, b) => b.volume - a.volume));
      setCompetitors(competitorData);
    } catch (error) {
      toast.error('Erreur lors de la génération des mots-clés');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackKeywords = (baseKeyword: string): Keyword[] => {
    const prefixes = ['comment', 'pourquoi', 'meilleur', 'guide', 'tutoriel', 'prix', 'avis', 'comparatif'];
    const suffixes = ['gratuit', 'en ligne', 'pas cher', '2024', 'facile', 'rapide', 'professionnel', 'france'];
    
    const generated: Keyword[] = [];

    generated.push({
      keyword: baseKeyword,
      volume: Math.floor(Math.random() * 15000) + 5000,
      difficulty: Math.floor(Math.random() * 100),
      cpc: parseFloat((Math.random() * 4).toFixed(2)),
      trend: Math.random() > 0.5 ? 'up' : 'stable',
      competition: Math.random() > 0.6 ? 'forte' : Math.random() > 0.3 ? 'moyenne' : 'faible',
      intent: 'informationnel',
      type: 'standard'
    });

    [...prefixes.slice(0, 6), ...suffixes.slice(0, 6)].forEach((modifier, index) => {
      generated.push({
        keyword: index < 6 ? `${modifier} ${baseKeyword}` : `${baseKeyword} ${modifier}`,
        volume: Math.floor(Math.random() * 8000) + 500,
        difficulty: Math.floor(Math.random() * 80),
        cpc: parseFloat((Math.random() * 3).toFixed(2)),
        trend: Math.random() > 0.7 ? 'up' : Math.random() > 0.4 ? 'stable' : 'down',
        competition: Math.random() > 0.5 ? 'moyenne' : 'faible',
        intent: ['informationnel', 'commercial', 'transactionnel'][Math.floor(Math.random() * 3)],
        type: 'standard'
      });
    });

    return generated;
  };

  const generateFallbackLongTail = (baseKeyword: string): Keyword[] => {
    const longTailPhrases = [
      `comment choisir ${baseKeyword} pour débutant`,
      `meilleur ${baseKeyword} qualité prix 2024`,
      `où acheter ${baseKeyword} pas cher en france`,
      `${baseKeyword} vs alternative comparaison`,
      `guide complet ${baseKeyword} étape par étape`,
      `${baseKeyword} gratuit en ligne sans inscription`
    ];

    return longTailPhrases.map(phrase => ({
      keyword: phrase,
      volume: Math.floor(Math.random() * 1000) + 50,
      difficulty: Math.floor(Math.random() * 40) + 10,
      cpc: parseFloat((Math.random() * 1.5 + 0.2).toFixed(2)),
      trend: Math.random() > 0.8 ? 'up' : 'stable',
      competition: 'faible',
      intent: 'informationnel',
      type: 'longTail'
    }));
  };

  const generateFallbackSemantic = (baseKeyword: string): Keyword[] => {
    const semanticTerms = [
      'solution', 'outil', 'service', 'plateforme', 'logiciel', 'application'
    ];

    return semanticTerms.map(term => ({
      keyword: `${term} ${baseKeyword}`,
      volume: Math.floor(Math.random() * 3000) + 200,
      difficulty: Math.floor(Math.random() * 60) + 20,
      cpc: parseFloat((Math.random() * 2.5 + 0.4).toFixed(2)),
      trend: Math.random() > 0.6 ? 'stable' : 'up',
      competition: Math.random() > 0.5 ? 'moyenne' : 'faible',
      intent: 'commercial',
      type: 'semantic'
    }));
  };

  const generateFallbackCompetitors = (): CompetitorData[] => {
    return [
      { name: 'Google', strength: 95 },
      { name: 'Amazon', strength: 88 },
      { name: 'Wikipedia', strength: 82 },
      { name: 'YouTube', strength: 79 },
      { name: 'Facebook', strength: 75 }
    ];
  };

  const copyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    toast.success('Mot-clé copié !');
  };

  const exportCSV = () => {
    const allKeywords = [...keywords, ...longTailKeywords, ...semanticKeywords];
    if (allKeywords.length === 0) {
      toast.error('Aucun mot-clé à exporter');
      return;
    }

    const csvContent = "Mot-clé,Volume,Difficulté,CPC,Tendance,Concurrence,Intention,Type\n" 
      + allKeywords.map(k => `"${k.keyword}",${k.volume},${k.difficulty},${k.cpc},${k.trend},${k.competition},${k.intent || 'N/A'},${k.type || 'standard'}`).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analyse-mots-cles-${mainKeyword}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Export CSV téléchargé !');
  };

  const filterKeywords = (keywordList: Keyword[]) => {
    return keywordList.filter(kw => {
      if (difficultyFilter !== 'all') {
        if (difficultyFilter === 'easy' && kw.difficulty > 30) return false;
        if (difficultyFilter === 'medium' && (kw.difficulty <= 30 || kw.difficulty > 60)) return false;
        if (difficultyFilter === 'hard' && kw.difficulty <= 60) return false;
      }
      
      if (intentFilter !== 'all' && kw.intent !== intentFilter) return false;
      
      if (volumeFilter !== 'all') {
        if (volumeFilter === 'low' && kw.volume > 1000) return false;
        if (volumeFilter === 'medium' && (kw.volume <= 1000 || kw.volume > 5000)) return false;
        if (volumeFilter === 'high' && kw.volume <= 5000) return false;
      }
      
      return true;
    });
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'bg-green-100 text-green-800 border-green-200';
    if (difficulty < 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'informationnel': return 'bg-blue-100 text-blue-800';
      case 'commercial': return 'bg-purple-100 text-purple-800';
      case 'transactionnel': return 'bg-green-100 text-green-800';
      case 'navigationnel': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'longTail': return <MessageSquare className="h-4 w-4" />;
      case 'semantic': return <Brain className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getAllKeywords = () => [...keywords, ...longTailKeywords, ...semanticKeywords];
  const totalVolume = getAllKeywords().reduce((sum, kw) => sum + kw.volume, 0);
  const avgDifficulty = getAllKeywords().length > 0 ? Math.round(getAllKeywords().reduce((sum, kw) => sum + kw.difficulty, 0) / getAllKeywords().length) : 0;
  const avgCpc = getAllKeywords().length > 0 ? (getAllKeywords().reduce((sum, kw) => sum + kw.cpc, 0) / getAllKeywords().length).toFixed(2) : '0.00';

  if (showDensityAnalyzer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto p-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                onClick={() => setShowDensityAnalyzer(false)}
                className="flex items-center gap-2"
              >
                ← Retour au générateur
              </Button>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
                <Target className="h-10 w-10 text-blue-600" />
                Analyseur de Densité de Mots-Clés
              </h1>
              <div></div>
            </div>
          </div>
          <KeywordDensityAnalyzer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Sparkles className="h-10 w-10 text-blue-600" />
            Suite Complète SEO & Mots-Clés
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Analyse complète de mots-clés, tendances, questions FAQ et génération de contenu
          </p>
        </div>

        {/* Configuration API */}
        <Card className="mb-8 shadow-lg border-l-4 border-l-purple-500">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-purple-600" />
                Configuration OpenAI API
              </div>
              <div className="flex items-center gap-2">
                {apiKeyStatus === 'valid' && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    API Connectée
                  </Badge>
                )}
                {apiKeyStatus === 'invalid' && (
                  <Badge variant="destructive">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    API Invalide
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowApiConfig(!showApiConfig)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  {showApiConfig ? 'Masquer' : 'Configurer'}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          
          {(showApiConfig || apiKeyStatus !== 'valid') && (
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Clé API OpenAI (sk-...)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      placeholder="sk-..."
                      value={openaiKey}
                      onChange={(e) => setOpenaiKey(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={validateApiKey}
                      disabled={isValidatingKey || !openaiKey.trim()}
                    >
                      {isValidatingKey ? 'Validation...' : 'Valider'}
                    </Button>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Fonctionnalités IA disponibles :</strong>
                  </p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Génération intelligente de mots-clés et analyse sémantique</li>
                    <li>• Analyse de tendances et prédictions saisonnières</li>
                    <li>• Génération automatique de questions FAQ</li>
                    <li>• Idées de contenu SEO personnalisées</li>
                    <li>• Analyse de densité de mots-clés comme 1.fr</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Onglets principaux */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Générateur
            </TabsTrigger>
            <TabsTrigger value="density" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Densité
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Tendances
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Contenu
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Résultats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-xl">Recherche de mots-clés</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700">Mot-clé principal</label>
                    <Input
                      placeholder="Ex: marketing digital"
                      value={mainKeyword}
                      onChange={(e) => setMainKeyword(e.target.value)}
                      className="border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700">Langue</label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="border-2 border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">🇫🇷 Français</SelectItem>
                        <SelectItem value="en">🇺🇸 Anglais</SelectItem>
                        <SelectItem value="es">🇪🇸 Espagnol</SelectItem>
                        <SelectItem value="de">🇩🇪 Allemand</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={generateKeywords}
                      disabled={isGenerating || !mainKeyword.trim()}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                          Analyse en cours...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          {apiKeyStatus === 'valid' ? 'Analyser avec IA' : 'Analyser'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="density">
            <KeywordDensityAnalyzer />
          </TabsContent>

          <TabsContent value="trends">
            <KeywordTrendAnalysis />
          </TabsContent>

          <TabsContent value="questions">
            <KeywordQuestions />
          </TabsContent>

          <TabsContent value="content">
            <ContentIdeaGenerator />
          </TabsContent>

          <TabsContent value="results">
            {getAllKeywords().length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100">Total mots-clés</p>
                          <p className="text-2xl font-bold">{getAllKeywords().length}</p>
                        </div>
                        <Search className="h-8 w-8 text-blue-200" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100">Volume total</p>
                          <p className="text-2xl font-bold">{totalVolume.toLocaleString()}</p>
                        </div>
                        <Users className="h-8 w-8 text-green-200" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-yellow-100">Difficulté moy.</p>
                          <p className="text-2xl font-bold">{avgDifficulty}/100</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-yellow-200" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100">CPC moyen</p>
                          <p className="text-2xl font-bold">{avgCpc}€</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-purple-200" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                  <Button onClick={exportCSV} variant="outline" className="border-2">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter CSV
                  </Button>
                  
                  <div className="flex items-center gap-2 ml-auto">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Difficulté" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes</SelectItem>
                        <SelectItem value="easy">Facile</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="hard">Difficile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Tous les mots-clés ({filterKeywords(getAllKeywords()).length})</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-2 p-6">
                      {filterKeywords(getAllKeywords()).slice(0, 20).map((keyword, index) => (
                        <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {getTypeIcon(keyword.type || 'standard')}
                              <h4 className="font-semibold text-lg text-gray-800">{keyword.keyword}</h4>
                              <Badge className={getIntentColor(keyword.intent || 'informationnel')}>
                                {keyword.intent || 'N/A'}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyKeyword(keyword.keyword)}
                              className="hover:bg-blue-50"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <span className="text-blue-600 font-medium">Volume</span>
                              <div className="text-xl font-bold text-blue-800">{keyword.volume.toLocaleString()}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <span className="text-gray-600 font-medium">Difficulté</span>
                              <div className="mt-1">
                                <Badge className={getDifficultyColor(keyword.difficulty)}>
                                  {keyword.difficulty}/100
                                </Badge>
                              </div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                              <span className="text-green-600 font-medium">CPC</span>
                              <div className="text-xl font-bold text-green-800">{keyword.cpc}€</div>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg">
                              <span className="text-purple-600 font-medium">Type</span>
                              <div className="mt-1">
                                <Badge variant="secondary">
                                  {keyword.type === 'longTail' ? 'Longue traîne' : 
                                   keyword.type === 'semantic' ? 'Sémantique' : 'Standard'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="text-center py-16">
                <CardContent>
                  <Search className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                    Aucun résultat
                  </h3>
                  <p className="text-gray-500 text-lg">
                    Générez des mots-clés dans l'onglet "Générateur" pour voir les résultats ici.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default KeywordGeneratorPage;
