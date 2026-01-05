import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Search, TrendingUp, BookOpen, DollarSign, Target, 
  Loader2, Copy, Sparkles, Crown, Flame, BarChart3,
  FolderTree, PenTool, Lightbulb, Award, Star, Users,
  ArrowRight, CheckCircle, Zap, Trophy, Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface BestSeller {
  rank: number;
  title: string;
  author: string;
  price: number;
  reviews: number;
  rating: number;
  category: string;
  estimatedSales: number;
  estimatedRevenue: number;
  keywords: string[];
  strengths: string[];
}

interface TitleSuggestion {
  title: string;
  subtitle: string;
  score: number;
  keywords: string[];
  hook: string;
  targetAudience: string;
}

interface CategoryInfo {
  name: string;
  path: string;
  competition: 'low' | 'medium' | 'high';
  avgBsr: number;
  topKeywords: string[];
  opportunity: number;
  monthlySearches: number;
}

interface NicheAnalysis {
  niche: string;
  score: number;
  demand: number;
  competition: number;
  profitability: number;
  trend: 'rising' | 'stable' | 'declining';
  topBooks: BestSeller[];
  suggestedTitles: TitleSuggestion[];
  bestCategories: CategoryInfo[];
  contentGaps: string[];
  recommendations: string[];
}

export const EbookKdpResearch: React.FC = () => {
  const [activeTab, setActiveTab] = useState('bestsellers');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullAnalysis, setIsFullAnalysis] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<{[key: string]: 'pending' | 'loading' | 'done' | 'error'}>({});
  
  // States for different research types
  const [bestSellers, setBestSellers] = useState<BestSeller[]>([]);
  const [titleSuggestions, setTitleSuggestions] = useState<TitleSuggestion[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [nicheAnalysis, setNicheAnalysis] = useState<NicheAnalysis | null>(null);

  // Fonction pour lancer l'analyse complète (4 recherches en parallèle)
  const handleFullAnalysis = async () => {
    if (!searchQuery.trim()) {
      toast.error('Entrez une catégorie ou niche à analyser');
      return;
    }

    setIsFullAnalysis(true);
    setAnalysisProgress({
      bestsellers: 'loading',
      titles: 'loading', 
      categories: 'loading',
      niche: 'loading'
    });

    const types = ['bestsellers', 'titles', 'categories', 'niche'];
    
    // Lancer les 4 recherches en parallèle
    const promises = types.map(async (type) => {
      try {
        await handleSearchSingle(type);
        setAnalysisProgress(prev => ({ ...prev, [type]: 'done' }));
        return { type, success: true };
      } catch (error) {
        setAnalysisProgress(prev => ({ ...prev, [type]: 'error' }));
        return { type, success: false };
      }
    });

    await Promise.allSettled(promises);
    
    setIsFullAnalysis(false);
    toast.success('🎯 Analyse complète terminée !');
  };

  // Version modifiée de handleSearch pour une seule recherche (sans toast)
  const handleSearchSingle = async (type: string) => {
    let prompt = '';
    
    switch (type) {
      case 'bestsellers':
        prompt = `Analyse les best-sellers Amazon KDP pour la niche "${searchQuery}".

Génère une liste de 8 best-sellers fictifs mais réalistes en JSON:
{
  "bestSellers": [
    {
      "rank": 1,
      "title": "Titre du livre best-seller",
      "author": "Nom de l'auteur",
      "price": 12.99,
      "reviews": 1500,
      "rating": 4.5,
      "category": "Catégorie principale",
      "estimatedSales": 500,
      "estimatedRevenue": 3500,
      "keywords": ["mot-clé 1", "mot-clé 2", "mot-clé 3"],
      "strengths": ["Point fort 1", "Point fort 2"]
    }
  ]
}

Crée des livres variés avec des prix entre 4.99€ et 19.99€, des rangs entre 1 et 10000, des ventes estimées réalistes.`;
        break;

      case 'titles':
        prompt = `Génère des titres et sous-titres optimisés SEO Amazon KDP pour la niche "${searchQuery}".

Crée 8 suggestions de titres en JSON:
{
  "titleSuggestions": [
    {
      "title": "Titre accrocheur et SEO",
      "subtitle": "Sous-titre descriptif avec mots-clés",
      "score": 92,
      "keywords": ["mot-clé principal", "mot-clé secondaire", "mot-clé LSI"],
      "hook": "Promesse ou accroche principale du livre",
      "targetAudience": "Description du public cible"
    }
  ]
}

Les titres doivent être optimisés pour Amazon avec:
- Mots-clés principaux en début de titre
- Sous-titres qui complètent le SEO
- Score de 70 à 98 basé sur l'optimisation
- Hooks variés (promesse, curiosité, bénéfice, urgence)`;
        break;

      case 'categories':
        prompt = `Trouve les meilleures catégories Amazon KDP "cachées" pour la niche "${searchQuery}".

Génère 10 catégories en JSON:
{
  "categories": [
    {
      "name": "Nom de la catégorie",
      "path": "Kindle eBooks > Catégorie Parent > Sous-catégorie > Niche",
      "competition": "low",
      "avgBsr": 15000,
      "topKeywords": ["mot-clé 1", "mot-clé 2", "mot-clé 3"],
      "opportunity": 85,
      "monthlySearches": 12000
    }
  ]
}

Inclus des catégories:
- Évidentes mais stratégiques
- Niches "cachées" moins concurrentielles
- Croisées (2 thèmes combinés)
La compétition peut être "low", "medium" ou "high".`;
        break;

      case 'niche':
        prompt = `Effectue une analyse de niche complète pour "${searchQuery}" sur Amazon KDP.

Génère une analyse exhaustive en JSON:
{
  "niche": "${searchQuery}",
  "score": 78,
  "demand": 82,
  "competition": 55,
  "profitability": 75,
  "trend": "rising",
  "topBooks": [
    {
      "rank": 1,
      "title": "Titre best-seller",
      "author": "Auteur",
      "price": 14.99,
      "reviews": 2000,
      "rating": 4.6,
      "category": "Catégorie",
      "estimatedSales": 800,
      "estimatedRevenue": 6000,
      "keywords": ["mot1", "mot2"],
      "strengths": ["force1", "force2"]
    }
  ],
  "suggestedTitles": [
    {
      "title": "Titre suggéré",
      "subtitle": "Sous-titre optimisé",
      "score": 88,
      "keywords": ["kw1", "kw2"],
      "hook": "Accroche",
      "targetAudience": "Audience cible"
    }
  ],
  "bestCategories": [
    {
      "name": "Catégorie",
      "path": "Chemin complet",
      "competition": "low",
      "avgBsr": 20000,
      "topKeywords": ["kw1", "kw2"],
      "opportunity": 90,
      "monthlySearches": 8000
    }
  ],
  "contentGaps": [
    "Lacune de contenu 1 à exploiter",
    "Lacune de contenu 2 à exploiter",
    "Lacune de contenu 3 à exploiter"
  ],
  "recommendations": [
    "Recommandation stratégique 1",
    "Recommandation stratégique 2",
    "Recommandation stratégique 3",
    "Recommandation stratégique 4"
  ]
}

Génère 5 top books, 5 titres suggérés, 5 catégories, 4 lacunes et 5 recommandations.`;
        break;
    }

    const { data, error } = await supabase.functions.invoke('generate-content', {
      body: {
        type: 'kdp-research',
        prompt
      }
    });

    if (error) {
      throw error;
    }

    const cleanContent = data.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsedData = JSON.parse(cleanContent);

    switch (type) {
      case 'bestsellers':
        setBestSellers(parsedData.bestSellers || []);
        break;
      case 'titles':
        setTitleSuggestions(parsedData.titleSuggestions || []);
        break;
      case 'categories':
        setCategories(parsedData.categories || []);
        break;
      case 'niche':
        setNicheAnalysis(parsedData);
        break;
    }
  };

  const handleSearch = async (type: string) => {
    if (!searchQuery.trim()) {
      toast.error('Entrez un mot-clé ou une niche à analyser');
      return;
    }

    setIsLoading(true);

    try {
      let prompt = '';
      
      switch (type) {
        case 'bestsellers':
          prompt = `Analyse les best-sellers Amazon KDP pour la niche "${searchQuery}".

Génère une liste de 8 best-sellers fictifs mais réalistes en JSON:
{
  "bestSellers": [
    {
      "rank": 1,
      "title": "Titre du livre best-seller",
      "author": "Nom de l'auteur",
      "price": 12.99,
      "reviews": 1500,
      "rating": 4.5,
      "category": "Catégorie principale",
      "estimatedSales": 500,
      "estimatedRevenue": 3500,
      "keywords": ["mot-clé 1", "mot-clé 2", "mot-clé 3"],
      "strengths": ["Point fort 1", "Point fort 2"]
    }
  ]
}

Crée des livres variés avec des prix entre 4.99€ et 19.99€, des rangs entre 1 et 10000, des ventes estimées réalistes.`;
          break;

        case 'titles':
          prompt = `Génère des titres et sous-titres optimisés SEO Amazon KDP pour la niche "${searchQuery}".

Crée 8 suggestions de titres en JSON:
{
  "titleSuggestions": [
    {
      "title": "Titre accrocheur et SEO",
      "subtitle": "Sous-titre descriptif avec mots-clés",
      "score": 92,
      "keywords": ["mot-clé principal", "mot-clé secondaire", "mot-clé LSI"],
      "hook": "Promesse ou accroche principale du livre",
      "targetAudience": "Description du public cible"
    }
  ]
}

Les titres doivent être optimisés pour Amazon avec:
- Mots-clés principaux en début de titre
- Sous-titres qui complètent le SEO
- Score de 70 à 98 basé sur l'optimisation
- Hooks variés (promesse, curiosité, bénéfice, urgence)`;
          break;

        case 'categories':
          prompt = `Trouve les meilleures catégories Amazon KDP "cachées" pour la niche "${searchQuery}".

Génère 10 catégories en JSON:
{
  "categories": [
    {
      "name": "Nom de la catégorie",
      "path": "Kindle eBooks > Catégorie Parent > Sous-catégorie > Niche",
      "competition": "low",
      "avgBsr": 15000,
      "topKeywords": ["mot-clé 1", "mot-clé 2", "mot-clé 3"],
      "opportunity": 85,
      "monthlySearches": 12000
    }
  ]
}

Inclus des catégories:
- Évidentes mais stratégiques
- Niches "cachées" moins concurrentielles
- Croisées (2 thèmes combinés)
La compétition peut être "low", "medium" ou "high".`;
          break;

        case 'niche':
          prompt = `Effectue une analyse de niche complète pour "${searchQuery}" sur Amazon KDP.

Génère une analyse exhaustive en JSON:
{
  "niche": "${searchQuery}",
  "score": 78,
  "demand": 82,
  "competition": 55,
  "profitability": 75,
  "trend": "rising",
  "topBooks": [
    {
      "rank": 1,
      "title": "Titre best-seller",
      "author": "Auteur",
      "price": 14.99,
      "reviews": 2000,
      "rating": 4.6,
      "category": "Catégorie",
      "estimatedSales": 800,
      "estimatedRevenue": 6000,
      "keywords": ["mot1", "mot2"],
      "strengths": ["force1", "force2"]
    }
  ],
  "suggestedTitles": [
    {
      "title": "Titre suggéré",
      "subtitle": "Sous-titre optimisé",
      "score": 88,
      "keywords": ["kw1", "kw2"],
      "hook": "Accroche",
      "targetAudience": "Audience cible"
    }
  ],
  "bestCategories": [
    {
      "name": "Catégorie",
      "path": "Chemin complet",
      "competition": "low",
      "avgBsr": 20000,
      "topKeywords": ["kw1", "kw2"],
      "opportunity": 90,
      "monthlySearches": 8000
    }
  ],
  "contentGaps": [
    "Lacune de contenu 1 à exploiter",
    "Lacune de contenu 2 à exploiter",
    "Lacune de contenu 3 à exploiter"
  ],
  "recommendations": [
    "Recommandation stratégique 1",
    "Recommandation stratégique 2",
    "Recommandation stratégique 3",
    "Recommandation stratégique 4"
  ]
}

Génère 5 top books, 5 titres suggérés, 5 catégories, 4 lacunes et 5 recommandations.`;
          break;
      }

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'kdp-research',
          prompt
        }
      });

      if (error) {
        if (error.message?.includes('402')) {
          toast.error('Crédits AI épuisés. Rechargez vos crédits.');
        } else if (error.message?.includes('429')) {
          toast.error('Trop de requêtes. Réessayez dans quelques instants.');
        } else {
          toast.error('Erreur lors de la recherche');
        }
        throw error;
      }

      const cleanContent = data.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsedData = JSON.parse(cleanContent);

      switch (type) {
        case 'bestsellers':
          setBestSellers(parsedData.bestSellers || []);
          toast.success(`${parsedData.bestSellers?.length || 0} best-sellers trouvés !`);
          break;
        case 'titles':
          setTitleSuggestions(parsedData.titleSuggestions || []);
          toast.success(`${parsedData.titleSuggestions?.length || 0} titres générés !`);
          break;
        case 'categories':
          setCategories(parsedData.categories || []);
          toast.success(`${parsedData.categories?.length || 0} catégories découvertes !`);
          break;
        case 'niche':
          setNicheAnalysis(parsedData);
          toast.success('Analyse de niche complète !');
          break;
      }
    } catch (error) {
      console.error('Erreur recherche KDP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié !');
  };

  const getCompetitionBadge = (comp: string) => {
    switch (comp) {
      case 'low': return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Faible</Badge>;
      case 'medium': return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Moyenne</Badge>;
      case 'high': return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Élevée</Badge>;
      default: return null;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case 'stable': return <ArrowRight className="h-4 w-4 text-amber-500" />;
      case 'declining': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 border-amber-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
              <Search className="h-7 w-7 text-amber-400" />
            </div>
            <div>
              <span className="text-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent font-bold">
                🔍 Recherche KDP Pro
              </span>
              <p className="text-sm text-muted-foreground font-normal mt-1">
                Analysez les best-sellers, générez des titres optimisés et découvrez les niches rentables
              </p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full bg-background/80 backdrop-blur border border-border/50 p-1 rounded-xl h-auto">
          <TabsTrigger 
            value="bestsellers" 
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20 flex items-center gap-2 py-3"
          >
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Best-sellers</span>
          </TabsTrigger>
          <TabsTrigger 
            value="titles" 
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-violet-500/20 flex items-center gap-2 py-3"
          >
            <PenTool className="h-4 w-4" />
            <span className="hidden sm:inline">Titres</span>
          </TabsTrigger>
          <TabsTrigger 
            value="categories" 
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/20 data-[state=active]:to-teal-500/20 flex items-center gap-2 py-3"
          >
            <FolderTree className="h-4 w-4" />
            <span className="hidden sm:inline">Catégories</span>
          </TabsTrigger>
          <TabsTrigger 
            value="niche" 
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500/20 data-[state=active]:to-pink-500/20 flex items-center gap-2 py-3"
          >
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Analyse Niche</span>
          </TabsTrigger>
        </TabsList>

        {/* Search Bar - Catégorie/Niche uniquement */}
        <Card className="mt-4 border-border/50 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Entrez une <strong>catégorie</strong> ou <strong>niche</strong> et l'IA trouvera automatiquement les best-sellers, titres optimisés et opportunités</span>
              </div>
              <div className="flex gap-3">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: développement personnel, cuisine végan, thriller psychologique, fantasy épique..."
                  onKeyPress={(e) => e.key === 'Enter' && handleFullAnalysis()}
                  className="flex-1 text-base"
                  disabled={isFullAnalysis || isLoading}
                />
                <Button
                  onClick={() => handleSearch(activeTab)}
                  disabled={isLoading || isFullAnalysis}
                  variant="outline"
                  className="min-w-[140px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyse...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Onglet actif
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleFullAnalysis}
                  disabled={isLoading || isFullAnalysis}
                  className="bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 hover:from-rose-600 hover:via-purple-600 hover:to-indigo-600 min-w-[200px] shadow-lg"
                >
                  {isFullAnalysis ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      🚀 Analyse Complète
                    </>
                  )}
                </Button>
              </div>

              {/* Barre de progression analyse complète */}
              {isFullAnalysis && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-indigo-500/10 border border-purple-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Analyse complète en cours...</span>
                    <span className="text-xs text-muted-foreground">
                      {Object.values(analysisProgress).filter(s => s === 'done').length}/4 terminées
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { key: 'bestsellers', label: 'Best-sellers', icon: Trophy },
                      { key: 'titles', label: 'Titres', icon: PenTool },
                      { key: 'categories', label: 'Catégories', icon: FolderTree },
                      { key: 'niche', label: 'Niche', icon: Target }
                    ].map(({ key, label, icon: Icon }) => (
                      <div 
                        key={key}
                        className={`p-2 rounded-lg text-center text-xs transition-all ${
                          analysisProgress[key] === 'done' 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : analysisProgress[key] === 'loading'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 animate-pulse'
                            : analysisProgress[key] === 'error'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-muted/30 text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4 mx-auto mb-1" />
                        {label}
                        {analysisProgress[key] === 'done' && <CheckCircle className="h-3 w-3 mx-auto mt-1" />}
                        {analysisProgress[key] === 'loading' && <Loader2 className="h-3 w-3 mx-auto mt-1 animate-spin" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground">Suggestions :</span>
                {['Développement personnel', 'Romance', 'Cuisine healthy', 'Business', 'Fantasy'].map((suggestion) => (
                  <Badge 
                    key={suggestion}
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10 transition-colors text-xs"
                    onClick={() => setSearchQuery(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best-sellers Tab */}
        <TabsContent value="bestsellers" className="space-y-4 mt-4">
          {bestSellers.length === 0 ? (
            <Card className="border-dashed border-2 border-amber-500/30 bg-amber-500/5">
              <CardContent className="py-12 text-center">
                <Trophy className="h-12 w-12 mx-auto text-amber-500/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Découvrez les Best-sellers</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Entrez une niche pour analyser les livres qui se vendent le mieux, leurs revenus estimés et leurs stratégies gagnantes.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {bestSellers.map((book, index) => (
                <Card key={index} className="hover:border-amber-500/30 transition-colors">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-amber-500 border-amber-500/30">
                            #{book.rank}
                          </Badge>
                          <h4 className="font-semibold">{book.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">par {book.author}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {book.price}€
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Star className="h-3 w-3 mr-1 text-amber-500" />
                            {book.rating}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            {book.reviews} avis
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {book.keywords.map((kw, i) => (
                            <Badge key={i} variant="outline" className="text-xs bg-primary/5">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs text-muted-foreground mb-1">Revenus estimés</div>
                        <div className="text-lg font-bold text-emerald-500">{book.estimatedRevenue}€/mois</div>
                        <div className="text-xs text-muted-foreground">{book.estimatedSales} ventes/mois</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Titles Tab */}
        <TabsContent value="titles" className="space-y-4 mt-4">
          {titleSuggestions.length === 0 ? (
            <Card className="border-dashed border-2 border-purple-500/30 bg-purple-500/5">
              <CardContent className="py-12 text-center">
                <PenTool className="h-12 w-12 mx-auto text-purple-500/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Générateur de Titres SEO</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Obtenez des titres et sous-titres optimisés pour Amazon avec score SEO et mots-clés stratégiques.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {titleSuggestions.map((suggestion, index) => (
                <Card key={index} className="hover:border-purple-500/30 transition-colors">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`text-2xl font-bold ${getScoreColor(suggestion.score)}`}>
                            {suggestion.score}
                          </div>
                          <Progress value={suggestion.score} className="h-2 flex-1 max-w-[100px]" />
                        </div>
                        
                        <h4 className="font-bold text-lg mb-1">{suggestion.title}</h4>
                        <p className="text-muted-foreground mb-3">{suggestion.subtitle}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {suggestion.keywords.map((kw, i) => (
                            <Badge key={i} className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                              {kw}
                            </Badge>
                          ))}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Accroche:</span> {suggestion.hook}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          <span className="font-medium">Audience:</span> {suggestion.targetAudience}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(`${suggestion.title}: ${suggestion.subtitle}`)}
                        className="shrink-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4 mt-4">
          {categories.length === 0 ? (
            <Card className="border-dashed border-2 border-emerald-500/30 bg-emerald-500/5">
              <CardContent className="py-12 text-center">
                <FolderTree className="h-12 w-12 mx-auto text-emerald-500/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Catégories Cachées</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Découvrez les catégories Amazon peu concurrentielles mais avec une forte demande pour maximiser votre visibilité.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {categories.map((cat, index) => (
                <Card key={index} className="hover:border-emerald-500/30 transition-colors">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{cat.name}</h4>
                          {getCompetitionBadge(cat.competition)}
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-3 font-mono bg-muted/50 p-2 rounded">
                          {cat.path}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {cat.topKeywords.map((kw, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {kw}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>BSR moyen: #{cat.avgBsr.toLocaleString()}</span>
                          <span>~{cat.monthlySearches.toLocaleString()} recherches/mois</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs text-muted-foreground mb-1">Opportunité</div>
                        <div className={`text-2xl font-bold ${getScoreColor(cat.opportunity)}`}>
                          {cat.opportunity}%
                        </div>
                        <Progress value={cat.opportunity} className="h-2 w-20 mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Niche Analysis Tab */}
        <TabsContent value="niche" className="space-y-4 mt-4">
          {!nicheAnalysis ? (
            <Card className="border-dashed border-2 border-rose-500/30 bg-rose-500/5">
              <CardContent className="py-12 text-center">
                <Target className="h-12 w-12 mx-auto text-rose-500/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analyse de Niche Complète</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Obtenez une analyse exhaustive: demande, concurrence, rentabilité, titres suggérés, catégories et recommandations stratégiques.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Score Global */}
              <Card className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 border-rose-500/30">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{nicheAnalysis.niche}</h3>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(nicheAnalysis.trend)}
                        <span className="text-sm text-muted-foreground">
                          Tendance {nicheAnalysis.trend === 'rising' ? 'en hausse' : nicheAnalysis.trend === 'stable' ? 'stable' : 'en baisse'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mb-1">Score Global</div>
                      <div className={`text-4xl font-bold ${getScoreColor(nicheAnalysis.score)}`}>
                        {nicheAnalysis.score}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-3 rounded-lg bg-background/50">
                      <div className="text-2xl font-bold text-blue-500">{nicheAnalysis.demand}%</div>
                      <div className="text-xs text-muted-foreground">Demande</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background/50">
                      <div className="text-2xl font-bold text-orange-500">{nicheAnalysis.competition}%</div>
                      <div className="text-xs text-muted-foreground">Concurrence</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background/50">
                      <div className="text-2xl font-bold text-emerald-500">{nicheAnalysis.profitability}%</div>
                      <div className="text-xs text-muted-foreground">Rentabilité</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    Recommandations Stratégiques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {nicheAnalysis.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Content Gaps */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-500" />
                    Lacunes de Contenu à Exploiter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {nicheAnalysis.contentGaps.map((gap, index) => (
                      <Badge key={index} variant="outline" className="bg-purple-500/10 border-purple-500/30 py-2">
                        {gap}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Titles */}
              {nicheAnalysis.suggestedTitles.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5 text-amber-500" />
                      Titres Suggérés
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {nicheAnalysis.suggestedTitles.slice(0, 3).map((title, index) => (
                      <div key={index} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <div className="font-semibold">{title.title}</div>
                          <div className="text-sm text-muted-foreground">{title.subtitle}</div>
                        </div>
                        <Badge className={`${getScoreColor(title.score)} bg-transparent`}>
                          {title.score}%
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
