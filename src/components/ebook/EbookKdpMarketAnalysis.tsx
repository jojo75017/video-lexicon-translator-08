import React, { useState } from 'react';
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
  Users, Star, Lightbulb, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

export const EbookKdpMarketAnalysis: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

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
    "demand": 75, // score 0-100
    "competition": 60, // score 0-100
    "avgPrice": 12.99,
    "avgReviews": 150,
    "topKeywords": ["mot-clé 1", "mot-clé 2", ...],
    "estimatedRevenue": {
      "low": 200, // revenus mensuels estimés (bas)
      "mid": 800, // revenus mensuels estimés (moyen)
      "high": 2500 // revenus mensuels estimés (haut)
    },
    "trend": "rising", // rising, stable, declining
    "opportunity": "high" // high, medium, low
  },
  "competitors": [
    {
      "title": "Titre du livre concurrent",
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
    "Recommandation stratégique 2"
  ],
  "pricingStrategy": {
    "optimal": 11.99,
    "range": { "min": 9.99, "max": 14.99 },
    "reasoning": "Explication de la stratégie de prix"
  },
  "contentGaps": [
    "Lacune de contenu 1 (opportunité)",
    "Lacune de contenu 2 (opportunité)"
  ],
  "titleSuggestions": [
    "Suggestion de titre 1",
    "Suggestion de titre 2"
  ]
}

Crée 3-5 concurrents fictifs réalistes, 3-5 recommandations stratégiques, 3-5 lacunes de contenu à exploiter, et 5 suggestions de titres optimisés SEO.`
        }
      });

      if (error) throw error;

      let parsedData;
      try {
        const cleanContent = data.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsedData = JSON.parse(cleanContent);
      } catch {
        throw new Error('Erreur de parsing');
      }

      setAnalysis(parsedData);
      toast.success('Analyse du marché terminée !');
    } catch (error) {
      console.error('Erreur analyse:', error);
      toast.error('Erreur lors de l\'analyse');
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case 'stable': return <ArrowRight className="h-4 w-4 text-amber-500" />;
      case 'declining': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Analyse du Marché KDP
          </CardTitle>
          <CardDescription>
            Analysez les tendances, la concurrence et estimez vos revenus potentiels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Label>Mot-clé ou niche à analyser</Label>
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Ex: développement personnel, recettes véganes, fantasy romance..."
                onKeyPress={(e) => e.key === 'Enter' && analyzeMarket()}
              />
            </div>
            <Button
              onClick={analyzeMarket}
              disabled={isAnalyzing}
              className="self-end"
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
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="competitors">Concurrence</TabsTrigger>
            <TabsTrigger value="strategy">Stratégie</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunités</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Métriques principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <span className="text-xs text-muted-foreground">Demande</span>
                </div>
                <div className="text-2xl font-bold">{analysis.niche.demand}%</div>
                <Progress value={analysis.niche.demand} className="h-2 mt-2" />
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  <span className="text-xs text-muted-foreground">Concurrence</span>
                </div>
                <div className="text-2xl font-bold">{analysis.niche.competition}%</div>
                <Progress value={analysis.niche.competition} className="h-2 mt-2" />
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-5 w-5 text-emerald-500" />
                  <span className="text-xs text-muted-foreground">Prix moyen</span>
                </div>
                <div className="text-2xl font-bold">${analysis.niche.avgPrice}</div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  <span className="text-xs text-muted-foreground">Avis moyens</span>
                </div>
                <div className="text-2xl font-bold">{analysis.niche.avgReviews}</div>
              </Card>
            </div>

            {/* Score d'opportunité */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Award className={`h-8 w-8 ${getOpportunityColor(analysis.niche.opportunity)}`} />
                    <div>
                      <h3 className="font-semibold">Score d'opportunité</h3>
                      <p className="text-sm text-muted-foreground">Basé sur la demande vs concurrence</p>
                    </div>
                  </div>
                  <Badge 
                    variant={analysis.niche.opportunity === 'high' ? 'default' : 'secondary'}
                    className="text-lg px-4 py-1"
                  >
                    {analysis.niche.opportunity === 'high' ? '🔥 Excellente' : 
                     analysis.niche.opportunity === 'medium' ? '⚡ Moyenne' : '⚠️ Faible'}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm">Tendance:</span>
                  {getTrendIcon(analysis.niche.trend)}
                  <span className="text-sm font-medium capitalize">{analysis.niche.trend}</span>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">💰 Estimation des revenus mensuels</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Pessimiste</p>
                      <p className="text-lg font-bold text-red-500">${analysis.niche.estimatedRevenue.low}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Réaliste</p>
                      <p className="text-lg font-bold text-amber-500">${analysis.niche.estimatedRevenue.mid}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Optimiste</p>
                      <p className="text-lg font-bold text-emerald-500">${analysis.niche.estimatedRevenue.high}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mots-clés */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">🔑 Mots-clés populaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.niche.topKeywords.map((kw, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Analyse de la concurrence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.competitors.map((comp, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{comp.title}</h4>
                        <p className="text-sm text-muted-foreground">par {comp.author}</p>
                      </div>
                      <Badge>#{comp.rank}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Prix</p>
                        <p className="font-bold">${comp.price}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Avis</p>
                        <p className="font-bold">{comp.reviews}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Note</p>
                        <p className="font-bold flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          {comp.rating}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-emerald-600 mb-1 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Points forts
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {comp.strengths.map((s, i) => (
                            <li key={i}>• {s}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-red-600 mb-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Points faibles
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {comp.weaknesses.map((w, i) => (
                            <li key={i}>• {w}</li>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Stratégie de prix recommandée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Prix optimal suggéré</p>
                  <p className="text-4xl font-bold text-primary">${analysis.pricingStrategy.optimal}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Fourchette: ${analysis.pricingStrategy.range.min} - ${analysis.pricingStrategy.range.max}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm">{analysis.pricingStrategy.reasoning}</p>
                </div>
              </CardContent>
            </Card>

            {/* Recommandations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Recommandations stratégiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Lacunes de contenu à exploiter
                </CardTitle>
                <CardDescription>
                  Ces sujets sont peu couverts par la concurrence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.contentGaps.map((gap, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-amber-500/10 to-transparent rounded-lg">
                      <span className="text-2xl">💡</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Suggestions de titres */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Suggestions de titres optimisés
                </CardTitle>
                <CardDescription>
                  Titres optimisés pour le SEO Amazon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.titleSuggestions.map((title, index) => (
                    <li 
                      key={index} 
                      className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(title);
                        toast.success('Titre copié !');
                      }}
                    >
                      <span className="font-medium">{title}</span>
                      <p className="text-xs text-muted-foreground mt-1">Cliquez pour copier</p>
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
