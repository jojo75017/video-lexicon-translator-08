
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Loader2, Search, Languages, Check, Download, X, HelpCircle, 
  TrendingUp, Users, BrainCircuit, HelpingHand
} from 'lucide-react';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const KeywordGenerator = () => {
  // États locaux pour gérer le composant
  const [keyword, setKeyword] = useState('');
  const [language, setLanguage] = useState('fr');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keywordSuggestions, setKeywordSuggestions] = useState<KeywordSuggestion[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('general');

  // Liste d'exemples de suggestions de mots-clés
  const exampleSuggestions: KeywordSuggestion[] = [
    {
      keyword: "référencement seo",
      volume: 4400,
      competition: 0.82,
      cpc: 2.45,
      difficulty: 75,
      relevance: 98
    },
    {
      keyword: "optimisation site web",
      volume: 2900,
      competition: 0.75,
      cpc: 1.95,
      difficulty: 68,
      relevance: 95
    },
    {
      keyword: "mots clés seo",
      volume: 1900,
      competition: 0.65,
      cpc: 1.75,
      difficulty: 60,
      relevance: 92
    },
    {
      keyword: "analyse seo",
      volume: 3200,
      competition: 0.70,
      cpc: 2.10,
      difficulty: 65,
      relevance: 90
    },
    {
      keyword: "audit référencement",
      volume: 1200,
      competition: 0.55,
      cpc: 1.50,
      difficulty: 55,
      relevance: 88
    }
  ];

  // Données pour les mots-clés longue traîne
  const longTailKeywords: KeywordSuggestion[] = [
    {
      keyword: "comment améliorer le référencement naturel",
      volume: 880,
      competition: 0.45,
      cpc: 1.1,
      difficulty: 35,
      relevance: 95
    },
    {
      keyword: "outils gratuits pour analyse seo",
      volume: 590,
      competition: 0.32,
      cpc: 0.75,
      difficulty: 28,
      relevance: 90
    },
    {
      keyword: "techniques avancées d'optimisation site web",
      volume: 320,
      competition: 0.25,
      cpc: 0.95,
      difficulty: 42,
      relevance: 88
    },
    {
      keyword: "comment choisir les bons mots clés seo",
      volume: 640,
      competition: 0.37,
      cpc: 1.2,
      difficulty: 30,
      relevance: 94
    },
    {
      keyword: "meilleur plugin wordpress pour seo",
      volume: 780,
      competition: 0.65,
      cpc: 1.55,
      difficulty: 45,
      relevance: 85
    }
  ];

  // Données pour les questions associées
  const questionKeywords: KeywordSuggestion[] = [
    {
      keyword: "comment faire du référencement naturel?",
      volume: 580,
      competition: 0.35,
      cpc: 0.95,
      difficulty: 25,
      relevance: 96
    },
    {
      keyword: "pourquoi le seo est important?",
      volume: 490,
      competition: 0.28,
      cpc: 0.85,
      difficulty: 20,
      relevance: 93
    },
    {
      keyword: "quels sont les meilleurs outils seo?",
      volume: 620,
      competition: 0.55,
      cpc: 1.35,
      difficulty: 38,
      relevance: 91
    },
    {
      keyword: "comment améliorer son classement google?",
      volume: 780,
      competition: 0.60,
      cpc: 1.65,
      difficulty: 45,
      relevance: 94
    },
    {
      keyword: "quand voir les résultats du seo?",
      volume: 390,
      competition: 0.25,
      cpc: 0.75,
      difficulty: 22,
      relevance: 87
    }
  ];

  // Données pour les synonymes
  const synonymKeywords: KeywordSuggestion[] = [
    {
      keyword: "référencement naturel",
      volume: 2200,
      competition: 0.65,
      cpc: 1.85,
      difficulty: 62,
      relevance: 95
    },
    {
      keyword: "optimisation pour moteurs de recherche",
      volume: 980,
      competition: 0.42,
      cpc: 1.15,
      difficulty: 39,
      relevance: 92
    },
    {
      keyword: "positionnement web",
      volume: 730,
      competition: 0.35,
      cpc: 0.95,
      difficulty: 32,
      relevance: 88
    },
    {
      keyword: "marketing de recherche",
      volume: 560,
      competition: 0.38,
      cpc: 1.05,
      difficulty: 36,
      relevance: 85
    },
    {
      keyword: "indexation google",
      volume: 890,
      competition: 0.48,
      cpc: 1.25,
      difficulty: 42,
      relevance: 86
    }
  ];

  // Données pour les concurrents
  const competitors = [
    {
      name: "seo-expert.fr",
      url: "https://www.seo-expert.fr",
      keywords: 850,
      traffic: 28500,
      strength: 75
    },
    {
      name: "optimisation-referencement.com",
      url: "https://www.optimisation-referencement.com",
      keywords: 620,
      traffic: 19800,
      strength: 68
    },
    {
      name: "agence-seo-paris.fr",
      url: "https://www.agence-seo-paris.fr",
      keywords: 540,
      traffic: 15200,
      strength: 62
    },
    {
      name: "referencement-naturel.org",
      url: "https://www.referencement-naturel.org",
      keywords: 480,
      traffic: 12600,
      strength: 58
    }
  ];

  const generateKeywords = () => {
    if (!keyword) {
      setError("Veuillez saisir un mot-clé");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Simuler une requête API avec une temporisation
    setTimeout(() => {
      try {
        // Générer des suggestions basées sur le mot-clé saisi
        const suggestions = [...exampleSuggestions].map(sugg => ({
          ...sugg,
          keyword: `${keyword} ${sugg.keyword.split(' ').slice(-1)[0]}`,
          relevance: Math.floor(Math.random() * 30) + 70 // Pertinence entre 70 et 100
        }));
        
        // Adapter les mots-clés longue traîne
        const longTail = longTailKeywords.map(sugg => ({
          ...sugg,
          keyword: sugg.keyword.includes(keyword) ? sugg.keyword : `${keyword} ${sugg.keyword}`,
          relevance: Math.floor(Math.random() * 20) + 75
        }));

        // Adapter les questions
        const questions = questionKeywords.map(sugg => ({
          ...sugg,
          keyword: sugg.keyword.replace("référencement naturel", keyword.toLowerCase()),
          relevance: Math.floor(Math.random() * 15) + 80
        }));

        // Adapter les synonymes
        const synonyms = synonymKeywords.map(sugg => ({
          ...sugg,
          keyword: sugg.keyword,
          relevance: Math.floor(Math.random() * 25) + 70
        }));
        
        setKeywordSuggestions(suggestions);
        setActiveTab('general');
        toast.success(`${suggestions.length} mots-clés générés avec succès`);
      } catch (err) {
        setError("Erreur lors de la génération des mots-clés");
        toast.error("Échec de la génération des mots-clés");
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  const selectKeyword = (keywordValue: string) => {
    if (selectedKeywords.includes(keywordValue)) {
      setSelectedKeywords(prev => prev.filter(k => k !== keywordValue));
    } else {
      setSelectedKeywords(prev => [...prev, keywordValue]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateKeywords();
  };

  const handleExport = () => {
    if (selectedKeywords.length === 0) {
      toast.warning("Aucun mot-clé sélectionné pour l'export");
      return;
    }
    
    // Dans une application réelle, on implémenterait un export approprié
    toast.success(`${selectedKeywords.length} mots-clés exportés`);
    console.log("Exported keywords:", selectedKeywords);
  };

  const handleClearAll = () => {
    if (selectedKeywords.length > 0) {
      setSelectedKeywords([]);
      toast.info("Tous les mots-clés ont été désélectionnés");
    }
  };

  // Fonction pour afficher les suggestions dans un format uniforme
  const renderSuggestions = (suggestions: KeywordSuggestion[]) => {
    if (!suggestions || suggestions.length === 0) return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-500">Aucune donnée disponible. Veuillez générer des mots-clés.</p>
      </div>
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index}
            className={`p-3 rounded-md transition-all cursor-pointer hover:scale-[1.01] ${
              selectedKeywords.includes(suggestion.keyword) 
                ? 'bg-indigo-50 border-2 border-indigo-500 shadow-md' 
                : 'border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
            }`}
            onClick={() => selectKeyword(suggestion.keyword)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                  selectedKeywords.includes(suggestion.keyword) 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-gray-100'
                }`}>
                  {selectedKeywords.includes(suggestion.keyword) && <Check className="h-3 w-3" />}
                </span>
                <span className="font-medium text-gray-800">{suggestion.keyword}</span>
              </div>
              {suggestion.volume && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {suggestion.volume} recherches
                </span>
              )}
            </div>
            {suggestion.competition !== undefined && (
              <div className="mt-2 flex items-center">
                <span className="text-xs text-gray-500 mr-2">Concurrence:</span>
                <div className="w-28 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      suggestion.competition < 0.3 ? 'bg-gradient-to-r from-green-400 to-green-500' : 
                      suggestion.competition < 0.7 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
                      'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                    style={{ width: `${suggestion.competition * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-xs">
                  {suggestion.competition < 0.3 ? 'Faible' : 
                   suggestion.competition < 0.7 ? 'Moyenne' : 
                   'Élevée'}
                </span>
              </div>
            )}
            {suggestion.cpc !== undefined && (
              <div className="mt-1 flex items-center text-xs text-gray-600">
                <span>CPC: {suggestion.cpc.toFixed(2)}€</span>
                <span className="mx-2">•</span>
                <span>Difficulté: {suggestion.difficulty}/100</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Rendu du composant de concurrents
  const renderCompetitors = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          Principaux concurrents pour "{keyword}"
        </h3>
        
        {competitors.map((competitor, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-md font-medium text-blue-600 hover:underline">
                <a href={competitor.url} target="_blank" rel="noopener noreferrer">
                  {competitor.name}
                </a>
              </h4>
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                {competitor.keywords} mots-clés
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-3 items-center">
              <div>
                <p className="text-xs text-gray-500">Traffic estimé</p>
                <p className="font-semibold">{competitor.traffic.toLocaleString()} visites/mois</p>
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-500">Force SEO</p>
                  <p className="text-xs font-medium">{competitor.strength}/100</p>
                </div>
                <Progress 
                  value={competitor.strength} 
                  className="h-2"
                  indicatorClassName={
                    competitor.strength > 70 ? "bg-red-500" : 
                    competitor.strength > 50 ? "bg-amber-500" : 
                    "bg-green-500"
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50 p-6 hover:shadow-lg transition-all">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot-clé principal</label>
                <div className="relative">
                  <Input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full pl-10 border border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                    placeholder="ex: formation en ligne"
                    required
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-indigo-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full min-w-[150px] border border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm">
                    <SelectValue placeholder="Choisir une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="it">Italiano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Button 
                  type="submit" 
                  className="w-full h-10 mt-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                  disabled={loading || !keyword}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Générer des mots-clés
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Card>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow animate-fade-in">
          <div className="flex items-center">
            <X className="h-5 w-5 mr-2 text-red-500" />
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {keywordSuggestions.length > 0 ? (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-indigo-100 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Suggestions de mots-clés</h3>
            <div className="flex space-x-2">
              <Button
                onClick={handleClearAll}
                variant="outline"
                className="text-gray-600 border-gray-300 hover:bg-gray-100"
                size="sm"
              >
                <X className="h-4 w-4 mr-1" /> Tout désélectionner
              </Button>
              <Button
                onClick={handleExport}
                variant="outline"
                className="text-green-600 border-green-300 hover:bg-green-50"
                size="sm"
              >
                <Download className="h-4 w-4 mr-1" /> Exporter
              </Button>
            </div>
          </div>

          <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="mb-4 overflow-x-auto">
              <TabsList className="inline-flex w-auto space-x-1 bg-transparent">
                <TabsTrigger value="general" className="flex items-center gap-1 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">
                  <Search className="w-4 h-4" />
                  <span>Généraux</span>
                </TabsTrigger>
                <TabsTrigger value="longtail" className="flex items-center gap-1 data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
                  <TrendingUp className="w-4 h-4" />
                  <span>Longue traîne</span>
                </TabsTrigger>
                <TabsTrigger value="questions" className="flex items-center gap-1 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700">
                  <HelpCircle className="w-4 h-4" />
                  <span>Questions</span>
                </TabsTrigger>
                <TabsTrigger value="synonyms" className="flex items-center gap-1 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                  <BrainCircuit className="w-4 h-4" />
                  <span>Synonymes</span>
                </TabsTrigger>
                <TabsTrigger value="competitors" className="flex items-center gap-1 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
                  <Users className="w-4 h-4" />
                  <span>Concurrents</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="general" className="mt-4">
              {renderSuggestions(keywordSuggestions)}
            </TabsContent>

            <TabsContent value="longtail" className="mt-4">
              {renderSuggestions(longTailKeywords)}
            </TabsContent>

            <TabsContent value="questions" className="mt-4">
              {renderSuggestions(questionKeywords)}
            </TabsContent>

            <TabsContent value="synonyms" className="mt-4">
              {renderSuggestions(synonymKeywords)}
            </TabsContent>

            <TabsContent value="competitors" className="mt-4">
              {renderCompetitors()}
            </TabsContent>
          </Tabs>
        </div>
      ) : !loading && (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg text-center animate-fade-in">
          <Languages className="mx-auto h-10 w-10 text-blue-500 mb-2" />
          <p className="text-blue-700">
            Entrez un mot-clé principal pour générer des suggestions
          </p>
        </div>
      )}
      
      {selectedKeywords.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 shadow animate-fade-in">
          <h3 className="text-lg font-medium text-green-800 mb-2">Mots-clés sélectionnés ({selectedKeywords.length})</h3>
          <div className="flex flex-wrap gap-2">
            {selectedKeywords.map((keyword, index) => (
              <div 
                key={index}
                className="bg-white px-3 py-1 rounded-full border border-green-300 flex items-center gap-2 shadow-sm hover:shadow transition-shadow"
              >
                <span className="text-gray-700">{keyword}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    selectKeyword(keyword);
                  }}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section Analytics */}
      {keyword && keywordSuggestions.length > 0 && (
        <Card className="p-6 border border-blue-100">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-blue-600 h-5 w-5" />
            <h3 className="text-lg font-medium">Analytics pour "{keyword}"</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-700 uppercase font-medium">Volume de recherche</p>
              <p className="text-2xl font-bold mt-1">4,800 <span className="text-sm font-normal text-blue-600">/ mois</span></p>
              <div className="flex items-center mt-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+12% depuis le mois dernier</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
              <p className="text-xs text-green-700 uppercase font-medium">Difficulté moyenne</p>
              <p className="text-2xl font-bold mt-1">48<span className="text-sm font-normal text-green-600">/100</span></p>
              <div className="flex items-center mt-1">
                <Progress value={48} className="h-1 flex-grow" />
                <span className="text-xs text-green-700 ml-2">Modérée</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-100">
              <p className="text-xs text-amber-700 uppercase font-medium">CPC moyen</p>
              <p className="text-2xl font-bold mt-1">1.85<span className="text-sm font-normal text-amber-600">€</span></p>
              <div className="flex items-center mt-1 text-xs text-amber-600">
                <span>Compétition moyenne</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
              <p className="text-xs text-purple-700 uppercase font-medium">Tendance</p>
              <p className="text-2xl font-bold mt-1">En hausse</p>
              <div className="flex items-center mt-1 text-xs text-purple-600">
                <HelpingHand className="h-3 w-3 mr-1" />
                <span>Moment opportun pour se positionner</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium mb-3">Tendance sur 12 mois</h4>
            <div className="h-32 flex items-end justify-between gap-2">
              {Array.from({ length: 12 }).map((_, i) => {
                const height = 30 + Math.random() * 70;
                return (
                  <div key={i} className="flex-grow flex flex-col items-center">
                    <div 
                      className="w-full bg-indigo-500 rounded-t hover:bg-indigo-600 transition-colors"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-1">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Section Structure des pages */}
      {keyword && keywordSuggestions.length > 0 && (
        <Card className="p-6 border border-blue-100">
          <div className="flex items-center gap-2 mb-4">
            <HelpingHand className="text-green-600 h-5 w-5" />
            <h3 className="text-lg font-medium">Recommandations de structure pour "{keyword}"</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-3">Structure de page recommandée</h4>
              
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium mb-1">H1</span>
                  <p className="text-gray-900 font-medium">{keyword.charAt(0).toUpperCase() + keyword.slice(1)} : Guide Complet et Astuces</p>
                </div>
                
                <div className="p-3 bg-white border border-gray-200 rounded">
                  <p className="text-gray-600 text-sm">Introduction au {keyword} et présentation des points clés qui seront abordés dans l'article.</p>
                </div>
                
                <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                  <span className="inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium mb-1">H2</span>
                  <p className="text-gray-900 font-medium">Qu'est-ce que le {keyword} ?</p>
                </div>
                
                <div className="p-3 bg-white border border-gray-200 rounded">
                  <p className="text-gray-600 text-sm">Définition détaillée du {keyword} et explication de son importance.</p>
                </div>
                
                <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                  <span className="inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium mb-1">H2</span>
                  <p className="text-gray-900 font-medium">Les avantages du {keyword}</p>
                </div>
                
                <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded">
                  <span className="inline-block bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-medium mb-1">H3</span>
                  <p className="text-gray-900 font-medium">Avantage 1: Amélioration du positionnement</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-3">Répartition des mots-clés</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Mot-clé principal ({keyword})</span>
                    <span className="text-sm font-medium">5-10 occurrences</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Mots-clés secondaires</span>
                    <span className="text-sm font-medium">3-6 occurrences chacun</span>
                  </div>
                  <Progress value={65} className="h-2" indicatorClassName="bg-green-500" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Mots-clés longue traîne</span>
                    <span className="text-sm font-medium">1-3 occurrences chacun</span>
                  </div>
                  <Progress value={40} className="h-2" indicatorClassName="bg-amber-500" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Questions associées</span>
                    <span className="text-sm font-medium">2-4 questions</span>
                  </div>
                  <Progress value={55} className="h-2" indicatorClassName="bg-blue-500" />
                </div>
                
                <div className="flex flex-wrap gap-2 mt-6">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">Au début du texte</Badge>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">Dans les titres H1/H2</Badge>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">Dans l'introduction</Badge>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">Dans la conclusion</Badge>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">Dans les alt des images</Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium mb-3">Bonnes pratiques de structure SEO</h4>
            
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Utilisez un seul H1 contenant le mot-clé principal</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Structurez votre contenu avec des H2 et H3 incluant des mots-clés secondaires</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Maintenez une densité de mots-clés entre 1% et 2% pour éviter le sur-optimisation</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Créez des paragraphes courts de 3-4 phrases pour améliorer la lisibilité</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Incorporez les questions fréquentes en sous-titres H3 ou H4</span>
              </li>
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
};

export default KeywordGenerator;
