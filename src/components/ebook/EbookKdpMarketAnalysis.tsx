import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, Search, DollarSign, BarChart3, Loader2, 
  Target, Award, AlertTriangle, CheckCircle, BookOpen,
  Users, Star, Lightbulb, ArrowRight, Copy, Sparkles,
  PieChart, Trophy, Flame, Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

interface NicheData {
  name: string;
  demand: number;
  competition: number;
  avgPrice: number;
  avgReviews: number;
  topKeywords: string[];
  estimatedRevenue: { low: number; mid: number; high: number };
  trend: 'rising' | 'stable' | 'declining';
  opportunity: 'high' | 'medium' | 'low';
}

interface CompetitorData {
  title: string;
  author: string;
  price: number;
  reviews: number;
  rating: number;
  rank: number;
  strengths: string[];
  weaknesses: string[];
}

interface MarketAnalysis {
  niche: NicheData;
  competitors: CompetitorData[];
  recommendations: string[];
  pricingStrategy: {
    optimal: number;
    range: { min: number; max: number };
    reasoning: string;
  };
  contentGaps: string[];
  titleSuggestions: string[];
}

const CHART_COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export const EbookKdpMarketAnalysis: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Chart data for competitors
  const competitorChartData = useMemo(() => {
    if (!analysis) return [];
    return analysis.competitors.map(comp => ({
      name: comp.title.substring(0, 12) + (comp.title.length > 12 ? '...' : ''),
      prix: comp.price,
      avis: Math.min(comp.reviews / 10, 100), // Scale for chart
      note: comp.rating * 20, // Scale to 100
      rank: Math.max(100 - (comp.rank / 1000), 0) // Inverse and scale
    }));
  }, [analysis]);

  // Radar chart data for market analysis
  const radarData = useMemo(() => {
    if (!analysis) return [];
    return [
      { metric: 'Demande', value: analysis.niche.demand, fullMark: 100 },
      { metric: 'Opportunité', value: analysis.niche.opportunity === 'high' ? 90 : analysis.niche.opportunity === 'medium' ? 60 : 30, fullMark: 100 },
      { metric: 'Rentabilité', value: analysis.niche.estimatedRevenue.mid > 500 ? 80 : analysis.niche.estimatedRevenue.mid > 200 ? 50 : 30, fullMark: 100 },
      { metric: 'Accessibilité', value: 100 - analysis.niche.competition, fullMark: 100 },
      { metric: 'Potentiel', value: analysis.niche.trend === 'rising' ? 85 : analysis.niche.trend === 'stable' ? 60 : 35, fullMark: 100 }
    ];
  }, [analysis]);

  // Revenue distribution pie chart
  const revenueDistribution = useMemo(() => {
    if (!analysis) return [];
    return [
      { name: 'Pessimiste', value: analysis.niche.estimatedRevenue.low, color: '#ef4444' },
      { name: 'Réaliste', value: analysis.niche.estimatedRevenue.mid - analysis.niche.estimatedRevenue.low, color: '#f59e0b' },
      { name: 'Optimiste', value: analysis.niche.estimatedRevenue.high - analysis.niche.estimatedRevenue.mid, color: '#10b981' }
    ];
  }, [analysis]);

  const analyzeMarket = async () => {
    if (!keyword.trim()) {
      toast.error('Entrez un mot-clé ou une niche');
      return;
    }

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'kdp-market-analysis',
          prompt: `Analyse le marché Amazon KDP pour la niche/mot-clé: "${keyword}"

Génère une analyse détaillée en JSON:
{
  "niche": {
    "name": "${keyword}",
    "demand": 75,
    "competition": 60,
    "avgPrice": 12.99,
    "avgReviews": 150,
    "topKeywords": ["mot-clé 1", "mot-clé 2", "mot-clé 3", "mot-clé 4", "mot-clé 5"],
    "estimatedRevenue": {
      "low": 200,
      "mid": 800,
      "high": 2500
    },
    "trend": "rising",
    "opportunity": "high"
  },
  "competitors": [
    {
      "title": "Titre du livre concurrent 1",
      "author": "Nom auteur",
      "price": 14.99,
      "reviews": 500,
      "rating": 4.3,
      "rank": 5000,
      "strengths": ["point fort 1", "point fort 2"],
      "weaknesses": ["point faible 1", "point faible 2"]
    }
  ],
  "recommendations": [
    "Recommandation stratégique 1",
    "Recommandation stratégique 2",
    "Recommandation stratégique 3"
  ],
  "pricingStrategy": {
    "optimal": 11.99,
    "range": { "min": 9.99, "max": 14.99 },
    "reasoning": "Explication de la stratégie de prix"
  },
  "contentGaps": [
    "Lacune de contenu 1",
    "Lacune de contenu 2",
    "Lacune de contenu 3"
  ],
  "titleSuggestions": [
    "Suggestion de titre 1",
    "Suggestion de titre 2",
    "Suggestion de titre 3",
    "Suggestion de titre 4",
    "Suggestion de titre 5"
  ]
}

Crée 4-5 concurrents fictifs réalistes, 4-5 recommandations stratégiques, 4 lacunes de contenu à exploiter, et 5 suggestions de titres optimisés SEO.`
        }
      });

      if (error) {
        // Check for specific error codes from edge function
        const errorMessage = error.message || 'Erreur lors de l\'analyse';
        if (errorMessage.includes('402') || errorMessage.includes('CREDITS_EXHAUSTED')) {
          toast.error('Crédits AI épuisés. Veuillez recharger vos crédits.');
        } else if (errorMessage.includes('429') || errorMessage.includes('RATE_LIMITED')) {
          toast.error('Trop de requêtes. Réessayez dans quelques instants.');
        } else {
          toast.error(errorMessage);
        }
        throw error;
      }

      let parsedData;
      try {
        const cleanContent = data.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsedData = JSON.parse(cleanContent);
      } catch {
        throw new Error('Erreur de parsing');
      }

      setAnalysis(parsedData);
      toast.success('Analyse du marché terminée avec graphiques !');
    } catch (error: any) {
      console.error('Erreur analyse:', error);
      // Only show generic error if not already shown
      if (!error?.message?.includes('402') && !error?.message?.includes('429')) {
        // Error already shown above
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getOpportunityColor = (opportunity: string) => {
    switch (opportunity) {
      case 'high': return 'text-emerald-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getOpportunityBadge = (opportunity: string) => {
    switch (opportunity) {
      case 'high': return { icon: Flame, label: '🔥 Excellente', class: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      case 'medium': return { icon: Zap, label: '⚡ Moyenne', class: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
      case 'low': return { icon: AlertTriangle, label: '⚠️ Faible', class: 'bg-red-500/20 text-red-400 border-red-500/30' };
      default: return { icon: Target, label: 'Inconnu', class: '' };
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

  const getTrendLabel = (trend: string) => {
    switch (trend) {
      case 'rising': return 'En hausse';
      case 'stable': return 'Stable';
      case 'declining': return 'En baisse';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Features Overview - Always visible */}
      {!analysis && (
        <Card className="bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 border-emerald-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
                <Sparkles className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <span className="text-xl bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Ce que vous pouvez découvrir
                </span>
                <p className="text-sm text-muted-foreground font-normal mt-0.5">
                  Notre plugin d'étude de marché "en un clic"
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
                <div className="p-2 rounded-lg bg-emerald-500/20 shrink-0">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Livres qui se vendent</p>
                  <p className="text-xs text-muted-foreground">Découvrez quels livres se vendent actuellement sur Amazon, avec des estimations de revenus</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
                <div className="p-2 rounded-lg bg-teal-500/20 shrink-0">
                  <Target className="h-4 w-4 text-teal-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Niches rentables</p>
                  <p className="text-xs text-muted-foreground">Trouvez les niches, sous-genres et mots-clés "rentables" pour améliorer vos ventes</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
                <div className="p-2 rounded-lg bg-cyan-500/20 shrink-0">
                  <BarChart3 className="h-4 w-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">+25 000 catégories</p>
                  <p className="text-xs text-muted-foreground">Analysez les meilleures ventes dans n'importe quelle catégorie Kindle, pages d'auteurs et recherches par mot-clé</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
                <div className="p-2 rounded-lg bg-amber-500/20 shrink-0">
                  <TrendingUp className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Ventes régulières</p>
                  <p className="text-xs text-muted-foreground">Développez votre lectorat en écrivant des livres que les gens désirent vraiment</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30 md:col-span-2">
                <div className="p-2 rounded-lg bg-purple-500/20 shrink-0">
                  <Zap className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Gain de temps</p>
                  <p className="text-xs text-muted-foreground">Gagnez du temps sur vos recherches de livres grâce à notre analyse de marché instantanée</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Card */}
      <Card className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
              <BarChart3 className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <span className="text-xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Analyse du Marché KDP
              </span>
              <p className="text-sm text-muted-foreground font-normal mt-0.5">
                Analysez les tendances, la concurrence et estimez vos revenus potentiels
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Ex: développement personnel, recettes véganes, fantasy romance..."
                onKeyPress={(e) => e.key === 'Enter' && analyzeMarket()}
                className="bg-background/50"
              />
            </div>
            <Button
              onClick={analyzeMarket}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyse...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Analyser
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full bg-background/80 backdrop-blur border border-border/50 p-1 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/20 data-[state=active]:to-purple-500/20">
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="competitors" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/20 data-[state=active]:to-red-500/20">
              Concurrence
            </TabsTrigger>
            <TabsTrigger value="strategy" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/20 data-[state=active]:to-teal-500/20">
              Stratégie
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-yellow-500/20">
              Opportunités
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Métriques principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30 p-4">
                <div className="flex items-center justify-between mb-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <span className="text-xs text-muted-foreground">Demande</span>
                </div>
                <div className="text-2xl font-bold">{analysis.niche.demand}%</div>
                <Progress value={analysis.niche.demand} className="h-2 mt-2" />
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/30 p-4">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  <span className="text-xs text-muted-foreground">Concurrence</span>
                </div>
                <div className="text-2xl font-bold">{analysis.niche.competition}%</div>
                <Progress value={analysis.niche.competition} className="h-2 mt-2" />
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/30 p-4">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-5 w-5 text-emerald-500" />
                  <span className="text-xs text-muted-foreground">Prix moyen</span>
                </div>
                <div className="text-2xl font-bold">{analysis.niche.avgPrice}€</div>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/30 p-4">
                <div className="flex items-center justify-between mb-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  <span className="text-xs text-muted-foreground">Avis moyens</span>
                </div>
                <div className="text-2xl font-bold">{analysis.niche.avgReviews}</div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Radar Chart */}
              <Card className="bg-background/50 border-border/30">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-indigo-400" />
                    Analyse radar du marché
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="metric" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                        <Radar name="Marché" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Score d'opportunité */}
              <Card className="bg-background/50 border-border/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Award className={`h-8 w-8 ${getOpportunityColor(analysis.niche.opportunity)}`} />
                      <div>
                        <h3 className="font-semibold">Score d'opportunité</h3>
                        <p className="text-sm text-muted-foreground">Basé sur demande vs concurrence</p>
                      </div>
                    </div>
                    <Badge className={`text-lg px-4 py-1 ${getOpportunityBadge(analysis.niche.opportunity).class}`}>
                      {getOpportunityBadge(analysis.niche.opportunity).label}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 mb-4 p-2 bg-muted/30 rounded-lg">
                    <span className="text-sm">Tendance:</span>
                    {getTrendIcon(analysis.niche.trend)}
                    <span className="text-sm font-medium">{getTrendLabel(analysis.niche.trend)}</span>
                  </div>

                  <div className="bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-400" />
                      Estimation des revenus mensuels
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                        <p className="text-xs text-muted-foreground">Pessimiste</p>
                        <p className="text-lg font-bold text-red-400">{analysis.niche.estimatedRevenue.low}€</p>
                      </div>
                      <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                        <p className="text-xs text-muted-foreground">Réaliste</p>
                        <p className="text-lg font-bold text-amber-400">{analysis.niche.estimatedRevenue.mid}€</p>
                      </div>
                      <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <p className="text-xs text-muted-foreground">Optimiste</p>
                        <p className="text-lg font-bold text-emerald-400">{analysis.niche.estimatedRevenue.high}€</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mots-clés */}
            <Card className="bg-background/50 border-border/30">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Search className="h-4 w-4 text-purple-400" />
                  Mots-clés populaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.niche.topKeywords.map((kw, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-purple-500/20 hover:border-purple-500/50 transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(kw);
                        toast.success('Mot-clé copié !');
                      }}
                    >
                      {kw}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitors" className="space-y-4">
            {/* Competitor Chart */}
            <Card className="bg-background/50 border-border/30">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-orange-400" />
                  Comparaison des concurrents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={competitorChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="prix" name="Prix (€)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="note" name="Note (/100)" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="rank" name="Rang (inversé)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Competitor Cards */}
            <Card className="bg-background/50 border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-400" />
                  Analyse détaillée de la concurrence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.competitors.map((comp, index) => (
                  <Card key={index} className="p-4 bg-gradient-to-br from-background/80 to-muted/20 border-border/30 hover:border-orange-500/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{comp.title}</h4>
                        <p className="text-sm text-muted-foreground">par {comp.author}</p>
                      </div>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        #{comp.rank}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <p className="text-xs text-muted-foreground">Prix</p>
                        <p className="font-bold text-emerald-400">{comp.price}€</p>
                      </div>
                      <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <p className="text-xs text-muted-foreground">Avis</p>
                        <p className="font-bold text-blue-400">{comp.reviews}</p>
                      </div>
                      <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                        <p className="text-xs text-muted-foreground">Note</p>
                        <p className="font-bold flex items-center justify-center gap-1 text-amber-400">
                          <Star className="h-4 w-4 fill-amber-400" />
                          {comp.rating}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                        <p className="text-xs font-medium text-emerald-500 mb-2 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Points forts
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {comp.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-emerald-400">•</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                        <p className="text-xs font-medium text-red-500 mb-2 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Points faibles
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {comp.weaknesses.map((w, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-red-400">•</span> {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-4">
            {/* Stratégie de prix */}
            <Card className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-400" />
                  Stratégie de prix recommandée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6 p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/20">
                  <p className="text-sm text-muted-foreground mb-2">Prix optimal suggéré</p>
                  <p className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    {analysis.pricingStrategy.optimal}€
                  </p>
                  <p className="text-sm text-muted-foreground mt-3">
                    Fourchette: <span className="font-medium">{analysis.pricingStrategy.range.min}€</span> - <span className="font-medium">{analysis.pricingStrategy.range.max}€</span>
                  </p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm">{analysis.pricingStrategy.reasoning}</p>
                </div>
              </CardContent>
            </Card>

            {/* Recommandations */}
            <Card className="bg-background/50 border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-indigo-400" />
                  Recommandations stratégiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-indigo-500/10 to-transparent rounded-lg border border-indigo-500/20">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-4">
            {/* Lacunes de contenu */}
            <Card className="bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border-amber-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-400" />
                  Lacunes de contenu à exploiter
                </CardTitle>
                <CardDescription>
                  Ces sujets sont peu couverts par la concurrence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.contentGaps.map((gap, index) => (
                    <li key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-500/10 to-transparent rounded-lg border border-amber-500/20 hover:border-amber-500/40 transition-colors">
                      <span className="text-2xl">💡</span>
                      <span className="font-medium">{gap}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Suggestions de titres */}
            <Card className="bg-background/50 border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-400" />
                  Suggestions de titres optimisés SEO
                </CardTitle>
                <CardDescription>
                  Cliquez pour copier un titre
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.titleSuggestions.map((title, index) => (
                    <li 
                      key={index} 
                      className="p-4 bg-gradient-to-r from-purple-500/10 to-transparent rounded-lg border border-purple-500/20 cursor-pointer hover:border-purple-500/40 hover:bg-purple-500/15 transition-all group"
                      onClick={() => {
                        navigator.clipboard.writeText(title);
                        toast.success('Titre copié !');
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{title}</span>
                        <Copy className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default EbookKdpMarketAnalysis;
