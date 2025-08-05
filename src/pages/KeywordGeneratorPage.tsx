import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Search, Target, TrendingUp, Copy, Download, Globe, Brain, Filter, BarChart3, Users, Smartphone, ShoppingCart, Mic, Map, ChevronDown, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  trend: 'hausse' | 'baisse' | 'stable';
  type: string;
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  competition: number;
  seasonality: string;
  geo: string[];
  serp_features: string[];
  related_queries: string[];
  cluster: string;
}

interface ClusterData {
  name: string;
  keywords: KeywordData[];
  avgVolume: number;
  avgDifficulty: number;
  intent: string;
}

const KeywordGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  
  // États principaux
  const [seedKeyword, setSeedKeyword] = useState('');
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [clusters, setClusters] = useState<ClusterData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  
  // Filtres et configuration
  const [selectedCountry, setSelectedCountry] = useState('FR');
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [minVolume, setMinVolume] = useState(100);
  const [maxDifficulty, setMaxDifficulty] = useState(80);
  const [selectedIntent, setSelectedIntent] = useState<string>('all');
  const [selectedStrategy, setSelectedStrategy] = useState('general');
  const [enableClustering, setEnableClustering] = useState(true);
  
  // Analytics
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [competitorKeywords, setCompetitorKeywords] = useState<KeywordData[]>([]);
  const [voiceSearchKeywords, setVoiceSearchKeywords] = useState<KeywordData[]>([]);

  // Fonctions utilitaires
  const getRandomIntent = (): 'informational' | 'commercial' | 'transactional' | 'navigational' => {
    const intents = ['informational', 'commercial', 'transactional', 'navigational'] as const;
    return intents[Math.floor(Math.random() * intents.length)];
  };

  const getRandomTrend = (): 'hausse' | 'baisse' | 'stable' => {
    const trends = ['hausse', 'baisse', 'stable'] as const;
    return trends[Math.floor(Math.random() * trends.length)];
  };

  const getSerpFeatures = (): string[] => {
    const features = ['Featured Snippet', 'People Also Ask', 'Local Pack', 'Knowledge Panel', 'Videos', 'Images', 'Shopping'];
    return features.slice(0, Math.floor(Math.random() * 4) + 1);
  };

  const generateAdvancedKeywords = () => {
    if (!seedKeyword.trim()) {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    setIsLoading(true);

    // Simulation avancée de génération de mots-clés
    setTimeout(() => {
      const prefixes = ['meilleur', 'comment', 'pourquoi', 'guide', 'prix', 'avis', 'comparatif', 'pas cher', 'top', 'acheter'];
      const suffixes = ['2024', 'france', 'gratuit', 'en ligne', 'débutant', 'professionnel', 'facile', 'rapide', 'pas cher', 'premium'];
      const questions = ['que', 'quel', 'comment', 'pourquoi', 'où', 'quand', 'qui'];
      
      const generatedKeywords: KeywordData[] = [
        // Mot-clé principal
        { 
          keyword: seedKeyword, 
          volume: 15000, 
          difficulty: 85, 
          cpc: 2.40, 
          trend: 'stable',
          type: 'Principal',
          intent: 'commercial',
          competition: 0.8,
          seasonality: 'Stable toute l\'année',
          geo: ['France', 'Belgique', 'Suisse', 'Canada'],
          serp_features: ['Featured Snippet', 'People Also Ask', 'Shopping'],
          related_queries: [`${seedKeyword} gratuit`, `${seedKeyword} prix`, `meilleur ${seedKeyword}`],
          cluster: 'Principal'
        },
        
        // Variations avec préfixes
        ...prefixes.slice(0, 6).map((prefix, i) => ({
          keyword: `${prefix} ${seedKeyword}`,
          volume: Math.floor(Math.random() * 8000) + 1000,
          difficulty: Math.floor(Math.random() * 40) + 30,
          cpc: Math.random() * 3 + 0.5,
          trend: getRandomTrend(),
          type: 'Longue traîne',
          intent: getRandomIntent(),
          competition: Math.random() * 0.7 + 0.2,
          seasonality: Math.random() > 0.5 ? 'Pic en décembre' : 'Stable',
          geo: ['France', 'Belgique'],
          serp_features: getSerpFeatures(),
          related_queries: [`${prefix} ${seedKeyword} ${suffixes[i % suffixes.length]}`],
          cluster: 'Commercial'
        } as KeywordData)),
        
        // Variations avec suffixes
        ...suffixes.slice(0, 6).map((suffix, i) => ({
          keyword: `${seedKeyword} ${suffix}`,
          volume: Math.floor(Math.random() * 5000) + 500,
          difficulty: Math.floor(Math.random() * 30) + 20,
          cpc: Math.random() * 2 + 0.3,
          trend: getRandomTrend(),
          type: 'Longue traîne',
          intent: suffix === 'gratuit' ? 'informational' : 'commercial',
          competition: Math.random() * 0.6 + 0.1,
          seasonality: suffix === '2024' ? 'Trending' : 'Stable',
          geo: ['France'],
          serp_features: getSerpFeatures(),
          related_queries: [`${seedKeyword} ${suffix} avis`],
          cluster: 'Informationnel'
        } as KeywordData)),

        // Questions
        ...questions.slice(0, 5).map((question, i) => ({
          keyword: `${question} ${seedKeyword}`,
          volume: Math.floor(Math.random() * 2000) + 200,
          difficulty: Math.floor(Math.random() * 25) + 15,
          cpc: Math.random() * 1.5 + 0.2,
          trend: getRandomTrend(),
          type: 'Question',
          intent: 'informational',
          competition: Math.random() * 0.4 + 0.1,
          seasonality: 'Stable',
          geo: ['France', 'Canada'],
          serp_features: ['People Also Ask', 'Featured Snippet'],
          related_queries: [`${question} choisir ${seedKeyword}`],
          cluster: 'Questions'
        } as KeywordData)),

        // Mots-clés e-commerce (si stratégie sélectionnée)
        ...(selectedStrategy === 'ecommerce' ? [
          {
            keyword: `acheter ${seedKeyword}`,
            volume: 3500,
            difficulty: 65,
            cpc: 4.20,
            trend: 'hausse' as const,
            type: 'Transactionnel',
            intent: 'transactional' as const,
            competition: 0.9,
            seasonality: 'Pic Black Friday',
            geo: ['France'],
            serp_features: ['Shopping', 'Local Pack'],
            related_queries: [`${seedKeyword} pas cher`, `${seedKeyword} livraison`],
            cluster: 'E-commerce'
          },
          {
            keyword: `${seedKeyword} pas cher`,
            volume: 2800,
            difficulty: 55,
            cpc: 3.80,
            trend: 'stable' as const,
            type: 'Prix',
            intent: 'commercial' as const,
            competition: 0.75,
            seasonality: 'Pic soldes',
            geo: ['France'],
            serp_features: ['Shopping', 'Price Comparison'],
            related_queries: [`${seedKeyword} promo`, `${seedKeyword} discount`],
            cluster: 'E-commerce'
          }
        ] : []),

        // Mots-clés recherche vocale (si activée)
        ...(selectedStrategy === 'voice' ? [
          {
            keyword: `ok google ${seedKeyword}`,
            volume: 1200,
            difficulty: 25,
            cpc: 1.50,
            trend: 'hausse' as const,
            type: 'Vocal',
            intent: 'navigational' as const,
            competition: 0.3,
            seasonality: 'Croissance mobile',
            geo: ['France'],
            serp_features: ['Voice Search', 'Featured Snippet'],
            related_queries: [`hey siri ${seedKeyword}`],
            cluster: 'Vocal'
          }
        ] : [])
      ];

      // Filtrer selon les critères
      const filteredKeywords = generatedKeywords.filter(kw => 
        kw.volume >= minVolume && 
        kw.difficulty <= maxDifficulty &&
        (selectedIntent === 'all' || kw.intent === selectedIntent)
      );

      setKeywords(filteredKeywords);
      
      // Générer des clusters si activé
      if (enableClustering) {
        generateClusters(filteredKeywords);
      }
      
      // Générer des suggestions IA
      generateAISuggestions(seedKeyword);
      
      setIsLoading(false);
      toast.success(`${filteredKeywords.length} mots-clés générés avec métriques avancées !`);
    }, 2500);
  };

  const generateClusters = (keywordsList: KeywordData[]) => {
    const clusterMap: { [key: string]: KeywordData[] } = {};
    
    keywordsList.forEach(kw => {
      if (!clusterMap[kw.cluster]) {
        clusterMap[kw.cluster] = [];
      }
      clusterMap[kw.cluster].push(kw);
    });

    const clustersData: ClusterData[] = Object.entries(clusterMap).map(([name, keywords]) => ({
      name,
      keywords,
      avgVolume: Math.round(keywords.reduce((acc, kw) => acc + kw.volume, 0) / keywords.length),
      avgDifficulty: Math.round(keywords.reduce((acc, kw) => acc + kw.difficulty, 0) / keywords.length),
      intent: keywords[0]?.intent || 'informational'
    }));

    setClusters(clustersData);
  };

  const generateAISuggestions = (keyword: string) => {
    const suggestions = [
      `${keyword} tendances 2024`,
      `${keyword} vs alternatives`,
      `${keyword} pour débutants`,
      `erreurs ${keyword}`,
      `${keyword} ROI`,
      `futur du ${keyword}`
    ];
    setSuggestions(suggestions);
  };

  const analyzeCompetitors = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockCompetitors: KeywordData[] = [
        {
          keyword: `${seedKeyword} concurrent 1`,
          volume: 8500,
          difficulty: 45,
          cpc: 1.80,
          trend: 'hausse',
          type: 'Concurrent',
          intent: 'commercial',
          competition: 0.6,
          seasonality: 'Stable',
          geo: ['France'],
          serp_features: ['Shopping'],
          related_queries: [],
          cluster: 'Concurrence'
        }
      ];
      setCompetitorKeywords(mockCompetitors);
      setIsLoading(false);
      toast.success('Analyse concurrentielle terminée !');
    }, 1500);
  };

  const generateVoiceKeywords = () => {
    setIsLoading(true);
    setTimeout(() => {
      const voiceKws: KeywordData[] = [
        {
          keyword: `où trouver ${seedKeyword}`,
          volume: 2200,
          difficulty: 30,
          cpc: 1.20,
          trend: 'hausse',
          type: 'Vocal Local',
          intent: 'navigational',
          competition: 0.4,
          seasonality: 'Mobile peak',
          geo: ['France'],
          serp_features: ['Voice Search', 'Local Pack'],
          related_queries: [],
          cluster: 'Vocal'
        }
      ];
      setVoiceSearchKeywords(voiceKws);
      setIsLoading(false);
      toast.success('Mots-clés recherche vocale générés !');
    }, 1000);
  };

  const toggleKeywordSelection = (keyword: string) => {
    const newSelection = new Set(selectedKeywords);
    if (newSelection.has(keyword)) {
      newSelection.delete(keyword);
    } else {
      newSelection.add(keyword);
    }
    setSelectedKeywords(newSelection);
  };

  const copyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    toast.success('Mot-clé copié !');
  };

  const exportKeywords = () => {
    const exportData = keywords.map(k => ({
      'Mot-clé': k.keyword,
      'Volume': k.volume,
      'Difficulté': k.difficulty,
      'CPC': k.cpc.toFixed(2),
      'Tendance': k.trend,
      'Type': k.type,
      'Intent': k.intent,
      'Competition': k.competition.toFixed(2),
      'Saisonnalité': k.seasonality,
      'Géographie': k.geo.join('; '),
      'SERP Features': k.serp_features.join('; '),
      'Cluster': k.cluster
    }));

    const csv = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keywords-advanced-${seedKeyword}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Export avancé réussi !');
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'bg-green-100 text-green-800';
    if (difficulty < 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getIntentColor = (intent: string) => {
    const colors: { [key: string]: string } = {
      'informational': 'bg-blue-100 text-blue-800',
      'commercial': 'bg-purple-100 text-purple-800',
      'transactional': 'bg-green-100 text-green-800',
      'navigational': 'bg-orange-100 text-orange-800'
    };
    return colors[intent] || 'bg-gray-100 text-gray-800';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'hausse': return '📈';
      case 'baisse': return '📉';
      default: return '➡️';
    }
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'Principal': 'bg-blue-100 text-blue-800',
      'Longue traîne': 'bg-purple-100 text-purple-800',
      'Question': 'bg-orange-100 text-orange-800',
      'Transactionnel': 'bg-green-100 text-green-800',
      'Vocal': 'bg-pink-100 text-pink-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            🔍 Générateur de Mots-clés Avancé
          </h1>
        </div>

        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Générateur
            </TabsTrigger>
            <TabsTrigger value="clustering" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Clustering
            </TabsTrigger>
            <TabsTrigger value="competitors" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Concurrents
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Vocal
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Configuration */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Configuration Avancée
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Mot-clé principal</label>
                    <Input
                      placeholder="marketing digital"
                      value={seedKeyword}
                      onChange={(e) => setSeedKeyword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && generateAdvancedKeywords()}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Pays cible</label>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FR">🇫🇷 France</SelectItem>
                        <SelectItem value="BE">🇧🇪 Belgique</SelectItem>
                        <SelectItem value="CH">🇨🇭 Suisse</SelectItem>
                        <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                        <SelectItem value="US">🇺🇸 États-Unis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Stratégie</label>
                    <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">🎯 Général</SelectItem>
                        <SelectItem value="ecommerce">🛒 E-commerce</SelectItem>
                        <SelectItem value="voice">🎤 Recherche vocale</SelectItem>
                        <SelectItem value="mobile">📱 Mobile-first</SelectItem>
                        <SelectItem value="local">📍 Local SEO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Volume minimum: {minVolume}</label>
                    <input
                      type="range"
                      min="10"
                      max="10000"
                      value={minVolume}
                      onChange={(e) => setMinVolume(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Difficulté max: {maxDifficulty}%</label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={maxDifficulty}
                      onChange={(e) => setMaxDifficulty(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Intent de recherche</label>
                    <Select value={selectedIntent} onValueChange={setSelectedIntent}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="informational">Informationnel</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="transactional">Transactionnel</SelectItem>
                        <SelectItem value="navigational">Navigationnel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="clustering" 
                      checked={enableClustering}
                      onCheckedChange={(checked) => setEnableClustering(checked as boolean)}
                    />
                    <label htmlFor="clustering" className="text-sm font-medium">
                      Activer le clustering IA
                    </label>
                  </div>

                  <Button onClick={generateAdvancedKeywords} disabled={isLoading} className="w-full">
                    <Brain className="h-4 w-4 mr-2" />
                    {isLoading ? 'Analyse IA...' : 'Générer avec IA'}
                  </Button>

                  {keywords.length > 0 && (
                    <div className="pt-4 border-t space-y-3">
                      <div className="text-sm font-medium">Métriques Avancées</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total:</span>
                          <span className="font-medium">{keywords.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Volume moyen:</span>
                          <span className="font-medium">
                            {Math.round(keywords.reduce((acc, k) => acc + k.volume, 0) / keywords.length).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Difficulté moy:</span>
                          <span className="font-medium">
                            {Math.round(keywords.reduce((acc, k) => acc + k.difficulty, 0) / keywords.length)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>CPC moyen:</span>
                          <span className="font-medium">
                            {(keywords.reduce((acc, k) => acc + k.cpc, 0) / keywords.length).toFixed(2)}€
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sélectionnés:</span>
                          <span className="font-medium">{selectedKeywords.size}</span>
                        </div>
                      </div>

                      <Button variant="outline" onClick={exportKeywords} className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Export Avancé CSV
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Résultats */}
              {keywords.length > 0 && (
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Analyse Avancée des Mots-clés
                      <Badge variant="outline">{keywords.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {keywords.map((keyword, index) => (
                        <div 
                          key={index} 
                          className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                            selectedKeywords.has(keyword.keyword) ? 'bg-blue-50 border-blue-200' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={selectedKeywords.has(keyword.keyword)}
                                onChange={() => toggleKeywordSelection(keyword.keyword)}
                                className="rounded"
                              />
                              <span className="font-semibold text-lg">{keyword.keyword}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyKeyword(keyword.keyword)}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getTypeColor(keyword.type)}>
                                {keyword.type}
                              </Badge>
                              <Badge variant="outline" className={getIntentColor(keyword.intent)}>
                                {keyword.intent}
                              </Badge>
                              <span className="text-lg">{getTrendIcon(keyword.trend)}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 text-sm mb-3">
                            <div>
                              <div className="text-gray-500">Volume</div>
                              <div className="font-medium flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {keyword.volume.toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500">Difficulté</div>
                              <Badge variant="outline" className={getDifficultyColor(keyword.difficulty)}>
                                {keyword.difficulty}%
                              </Badge>
                            </div>
                            <div>
                              <div className="text-gray-500">CPC</div>
                              <div className="font-medium">{keyword.cpc.toFixed(2)}€</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Competition</div>
                              <div className="font-medium">{(keyword.competition * 100).toFixed(0)}%</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Cluster</div>
                              <Badge variant="outline">{keyword.cluster}</Badge>
                            </div>
                            <div>
                              <div className="text-gray-500">Géo</div>
                              <div className="font-medium">{keyword.geo.join(', ')}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500 mb-1">SERP Features</div>
                              <div className="flex flex-wrap gap-1">
                                {keyword.serp_features.map((feature, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500 mb-1">Saisonnalité</div>
                              <div className="font-medium">{keyword.seasonality}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="clustering" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {clusters.map((cluster, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>📊 {cluster.name}</span>
                      <Badge variant="outline">{cluster.keywords.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Volume moyen:</span>
                        <span className="font-medium">{cluster.avgVolume.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Difficulté moy:</span>
                        <span className="font-medium">{cluster.avgDifficulty}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Intent principal:</span>
                        <Badge variant="outline" className={getIntentColor(cluster.intent)}>
                          {cluster.intent}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {cluster.keywords.slice(0, 5).map((kw, i) => (
                        <div key={i} className="text-sm p-2 bg-gray-50 rounded">
                          <div className="font-medium">{kw.keyword}</div>
                          <div className="text-gray-500">
                            {kw.volume.toLocaleString()} vol. • {kw.difficulty}% diff.
                          </div>
                        </div>
                      ))}
                      {cluster.keywords.length > 5 && (
                        <div className="text-sm text-gray-500 text-center">
                          +{cluster.keywords.length - 5} autres mots-clés
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="competitors" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Analyse Concurrentielle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Button onClick={analyzeCompetitors} disabled={isLoading || !seedKeyword}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Analyser la concurrence
                  </Button>
                </div>
                {competitorKeywords.length > 0 && (
                  <div className="space-y-3">
                    {competitorKeywords.map((kw, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="font-medium">{kw.keyword}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          Volume: {kw.volume.toLocaleString()} • Difficulté: {kw.difficulty}% • CPC: {kw.cpc.toFixed(2)}€
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voice" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Recherche Vocale & Mobile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Button onClick={generateVoiceKeywords} disabled={isLoading || !seedKeyword}>
                    <Smartphone className={`h-4 w-4 mr-2`} />
                    Générer mots-clés vocaux
                  </Button>
                </div>
                {voiceSearchKeywords.length > 0 && (
                  <div className="space-y-3">
                    {voiceSearchKeywords.map((kw, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="font-medium">{kw.keyword}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          Volume: {kw.volume.toLocaleString()} • Difficulté: {kw.difficulty}% • Type: {kw.type}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {kw.serp_features.map((feature, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Suggestions IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {suggestions.length > 0 ? (
                    <div className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <div 
                          key={index} 
                          className="p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                          onClick={() => setSeedKeyword(suggestion)}
                        >
                          <div className="font-medium text-blue-800">{suggestion}</div>
                          <div className="text-sm text-blue-600">Cliquez pour analyser</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center py-8">
                      Générez d'abord des mots-clés pour voir les suggestions IA
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Métriques Globales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {keywords.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {keywords.filter(k => k.difficulty < 30).length}
                          </div>
                          <div className="text-sm text-green-700">Faciles</div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-600">
                            {keywords.filter(k => k.difficulty >= 30 && k.difficulty < 60).length}
                          </div>
                          <div className="text-sm text-yellow-700">Moyens</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="text-2xl font-bold text-red-600">
                            {keywords.filter(k => k.difficulty >= 60).length}
                          </div>
                          <div className="text-sm text-red-700">Difficiles</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {Math.round(keywords.reduce((acc, k) => acc + k.volume, 0) / 1000)}K
                          </div>
                          <div className="text-sm text-blue-700">Vol. Total</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center py-8">
                      Générez des mots-clés pour voir les métriques
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default KeywordGeneratorPage;