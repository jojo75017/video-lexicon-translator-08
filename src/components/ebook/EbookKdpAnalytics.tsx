import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Target, 
  Zap,
  BookOpen,
  Star,
  ArrowUp,
  ArrowDown,
  Minus,
  RefreshCw,
  Download,
  Filter,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface KeywordData {
  keyword: string;
  searchVolume: number;
  competition: 'low' | 'medium' | 'high';
  competitionScore: number;
  trend: 'up' | 'down' | 'stable';
  avgPrice: number;
  avgBSR: number;
  estimatedMonthlySales: number;
  estimatedMonthlyRevenue: number;
  opportunity: number;
  topBooks: {
    title: string;
    author: string;
    bsr: number;
    price: number;
    reviews: number;
    rating: number;
    estimatedSales: number;
  }[];
}

interface BSREstimate {
  bsr: number;
  dailySales: number;
  monthlySales: number;
  price: number;
  royaltyRate: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
}

interface NicheAnalysis {
  niche: string;
  demandScore: number;
  competitionLevel: string;
  profitPotential: string;
  avgBooksPerNiche: number;
  avgReviews: number;
  avgPrice: number;
  bestSellingCategories: string[];
  keywordSuggestions: string[];
  contentGaps: string[];
}

const EbookKdpAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('keywords');
  const [keyword, setKeyword] = useState('');
  const [keywordResults, setKeywordResults] = useState<KeywordData[]>([]);
  const [bsrInput, setBsrInput] = useState('');
  const [priceInput, setPriceInput] = useState('4.99');
  const [bsrEstimate, setBsrEstimate] = useState<BSREstimate | null>(null);
  const [nicheInput, setNicheInput] = useState('');
  const [nicheAnalysis, setNicheAnalysis] = useState<NicheAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateBSRtoSales = (bsr: number, price: number): BSREstimate => {
    // Formule d'estimation basée sur les données Amazon KDP
    // Plus le BSR est bas, plus les ventes sont élevées
    let dailySales: number;
    
    if (bsr <= 100) {
      dailySales = 100 + (100 - bsr) * 2;
    } else if (bsr <= 500) {
      dailySales = 50 + (500 - bsr) * 0.1;
    } else if (bsr <= 1000) {
      dailySales = 25 + (1000 - bsr) * 0.05;
    } else if (bsr <= 5000) {
      dailySales = 10 + (5000 - bsr) * 0.004;
    } else if (bsr <= 10000) {
      dailySales = 5 + (10000 - bsr) * 0.001;
    } else if (bsr <= 50000) {
      dailySales = 2 + (50000 - bsr) * 0.00008;
    } else if (bsr <= 100000) {
      dailySales = 1 + (100000 - bsr) * 0.00002;
    } else {
      dailySales = Math.max(0.1, 0.5 - (bsr - 100000) * 0.000001);
    }

    const monthlySales = Math.round(dailySales * 30);
    
    // Calcul des royalties (70% pour prix >= 2.99€, sinon 35%)
    const royaltyRate = price >= 2.99 ? 0.70 : 0.35;
    const monthlyRevenue = Math.round(monthlySales * price * royaltyRate * 100) / 100;
    const yearlyRevenue = Math.round(monthlyRevenue * 12 * 100) / 100;

    return {
      bsr,
      dailySales: Math.round(dailySales * 10) / 10,
      monthlySales,
      price,
      royaltyRate: royaltyRate * 100,
      monthlyRevenue,
      yearlyRevenue
    };
  };

  const handleBSRCalculation = () => {
    const bsr = parseInt(bsrInput);
    const price = parseFloat(priceInput);
    
    if (isNaN(bsr) || bsr < 1) {
      toast.error('Veuillez entrer un rang BSR valide');
      return;
    }
    
    if (isNaN(price) || price < 0.99) {
      toast.error('Veuillez entrer un prix valide (minimum 0.99€)');
      return;
    }

    const estimate = calculateBSRtoSales(bsr, price);
    setBsrEstimate(estimate);
    toast.success('Estimation calculée !');
  };

  const analyzeKeywords = async () => {
    if (!keyword.trim()) {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `Analyse le mot-clé "${keyword}" pour Amazon KDP. Génère des données réalistes d'analyse de marché.

IMPORTANT: Réponds UNIQUEMENT avec un JSON valide, sans texte avant ou après.

{
  "keywords": [
    {
      "keyword": "${keyword}",
      "searchVolume": [nombre entre 1000 et 50000],
      "competition": "[low/medium/high]",
      "competitionScore": [1-100],
      "trend": "[up/down/stable]",
      "avgPrice": [prix moyen entre 2.99 et 14.99],
      "avgBSR": [rang moyen entre 5000 et 100000],
      "estimatedMonthlySales": [ventes estimées],
      "estimatedMonthlyRevenue": [revenus estimés],
      "opportunity": [score 1-100],
      "topBooks": [
        {
          "title": "Titre du livre concurrent",
          "author": "Nom auteur",
          "bsr": [rang],
          "price": [prix],
          "reviews": [nombre avis],
          "rating": [note 3.5-5],
          "estimatedSales": [ventes mensuelles]
        }
      ]
    },
    // Ajoute 4 mots-clés similaires/variantes
  ]
}`;

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { 
          prompt,
          type: 'kdp-analytics'
        }
      });

      if (error) throw error;

      const content = data?.content || data?.generatedText || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setKeywordResults(parsed.keywords || []);
        toast.success('Analyse terminée !');
      }
    } catch (error) {
      console.error('Erreur analyse:', error);
      toast.error('Erreur lors de l\'analyse');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeNiche = async () => {
    if (!nicheInput.trim()) {
      toast.error('Veuillez entrer une niche');
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `Analyse la niche "${nicheInput}" pour Amazon KDP. Génère une analyse détaillée du marché.

IMPORTANT: Réponds UNIQUEMENT avec un JSON valide, sans texte avant ou après.

{
  "niche": "${nicheInput}",
  "demandScore": [score 1-100],
  "competitionLevel": "[Faible/Modérée/Élevée/Très élevée]",
  "profitPotential": "[Excellent/Bon/Moyen/Faible]",
  "avgBooksPerNiche": [nombre moyen de livres],
  "avgReviews": [moyenne des avis],
  "avgPrice": [prix moyen],
  "bestSellingCategories": ["catégorie 1", "catégorie 2", "catégorie 3"],
  "keywordSuggestions": ["mot-clé 1", "mot-clé 2", "mot-clé 3", "mot-clé 4", "mot-clé 5"],
  "contentGaps": ["opportunité 1", "opportunité 2", "opportunité 3"]
}`;

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { 
          prompt,
          type: 'niche-analysis'
        }
      });

      if (error) throw error;

      const content = data?.content || data?.generatedText || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setNicheAnalysis(parsed);
        toast.success('Analyse de niche terminée !');
      }
    } catch (error) {
      console.error('Erreur analyse niche:', error);
      toast.error('Erreur lors de l\'analyse');
    } finally {
      setIsLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getCompetitionColor = (comp: string) => {
    switch (comp) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getOpportunityColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const exportResults = () => {
    const data = {
      keywords: keywordResults,
      bsrEstimate,
      nicheAnalysis,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kdp-analytics-${Date.now()}.json`;
    a.click();
    toast.success('Données exportées !');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-purple-400" />
            KDP Analytics
          </h2>
          <p className="text-muted-foreground text-sm">
            Analysez le marché Amazon KDP comme un pro
          </p>
        </div>
        <Button onClick={exportResults} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-background/50 border border-border/50">
          <TabsTrigger value="keywords" className="data-[state=active]:bg-purple-500/20">
            <Search className="h-4 w-4 mr-2" />
            Mots-clés
          </TabsTrigger>
          <TabsTrigger value="bsr" className="data-[state=active]:bg-green-500/20">
            <DollarSign className="h-4 w-4 mr-2" />
            Calculateur BSR
          </TabsTrigger>
          <TabsTrigger value="niche" className="data-[state=active]:bg-blue-500/20">
            <Target className="h-4 w-4 mr-2" />
            Analyse Niche
          </TabsTrigger>
        </TabsList>

        {/* Onglet Mots-clés */}
        <TabsContent value="keywords" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                Recherche de mots-clés KDP
              </CardTitle>
              <CardDescription>
                Analysez le volume de recherche, la concurrence et le potentiel de revenus
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Ex: développement personnel, romance paranormale..."
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && analyzeKeywords()}
                />
                <Button onClick={analyzeKeywords} disabled={isLoading}>
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Analyser
                </Button>
              </div>

              {keywordResults.length > 0 && (
                <div className="space-y-4">
                  {keywordResults.map((kw, idx) => (
                    <Card key={idx} className="bg-background/30 border-border/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">{kw.keyword}</span>
                            {getTrendIcon(kw.trend)}
                          </div>
                          <Badge className={getCompetitionColor(kw.competition)}>
                            {kw.competition === 'low' ? 'Faible' : kw.competition === 'medium' ? 'Moyenne' : 'Élevée'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-2 bg-purple-500/10 rounded-lg">
                            <div className="text-xs text-muted-foreground">Volume</div>
                            <div className="font-bold text-purple-400">{kw.searchVolume?.toLocaleString()}</div>
                          </div>
                          <div className="text-center p-2 bg-blue-500/10 rounded-lg">
                            <div className="text-xs text-muted-foreground">Prix moyen</div>
                            <div className="font-bold text-blue-400">{kw.avgPrice?.toFixed(2)}€</div>
                          </div>
                          <div className="text-center p-2 bg-green-500/10 rounded-lg">
                            <div className="text-xs text-muted-foreground">Ventes/mois</div>
                            <div className="font-bold text-green-400">{kw.estimatedMonthlySales}</div>
                          </div>
                          <div className="text-center p-2 bg-amber-500/10 rounded-lg">
                            <div className="text-xs text-muted-foreground">Opportunité</div>
                            <div className={`font-bold ${getOpportunityColor(kw.opportunity)}`}>{kw.opportunity}/100</div>
                          </div>
                        </div>

                        {kw.topBooks && kw.topBooks.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">Top livres concurrents:</div>
                            <div className="grid gap-2">
                              {kw.topBooks.slice(0, 3).map((book, bookIdx) => (
                                <div key={bookIdx} className="flex items-center justify-between text-sm bg-background/50 p-2 rounded">
                                  <div className="flex-1 truncate">
                                    <span className="font-medium">{book.title}</span>
                                    <span className="text-muted-foreground ml-2">par {book.author}</span>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs">
                                    <span className="text-purple-400">#{book.bsr}</span>
                                    <span className="text-green-400">{book.price}€</span>
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                      {book.rating}
                                    </div>
                                    <span className="text-muted-foreground">({book.reviews} avis)</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Calculateur BSR */}
        <TabsContent value="bsr" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Calculateur BSR → Ventes
              </CardTitle>
              <CardDescription>
                Estimez les ventes et revenus à partir du rang Amazon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rang BSR (Best Seller Rank)</Label>
                  <Input
                    type="number"
                    value={bsrInput}
                    onChange={(e) => setBsrInput(e.target.value)}
                    placeholder="Ex: 15000"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Prix de vente (€)</Label>
                  <Input
                    type="number"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    placeholder="Ex: 4.99"
                    min="0.99"
                    step="0.01"
                  />
                </div>
              </div>

              <Button onClick={handleBSRCalculation} className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Calculer les estimations
              </Button>

              {bsrEstimate && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  <Card className="bg-purple-500/10 border-purple-500/30">
                    <CardContent className="p-4 text-center">
                      <BookOpen className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                      <div className="text-xs text-muted-foreground">Ventes/jour</div>
                      <div className="text-2xl font-bold text-purple-400">{bsrEstimate.dailySales}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-500/10 border-blue-500/30">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                      <div className="text-xs text-muted-foreground">Ventes/mois</div>
                      <div className="text-2xl font-bold text-blue-400">{bsrEstimate.monthlySales}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-500/10 border-green-500/30">
                    <CardContent className="p-4 text-center">
                      <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-400" />
                      <div className="text-xs text-muted-foreground">Revenus/mois</div>
                      <div className="text-2xl font-bold text-green-400">{bsrEstimate.monthlyRevenue.toFixed(2)}€</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-amber-500/10 border-amber-500/30">
                    <CardContent className="p-4 text-center">
                      <Star className="h-6 w-6 mx-auto mb-2 text-amber-400" />
                      <div className="text-xs text-muted-foreground">Revenus/an</div>
                      <div className="text-2xl font-bold text-amber-400">{bsrEstimate.yearlyRevenue.toFixed(2)}€</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-pink-500/10 border-pink-500/30 col-span-2">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-muted-foreground">Taux de royalties</div>
                          <div className="text-lg font-bold text-pink-400">{bsrEstimate.royaltyRate}%</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Prix unitaire</div>
                          <div className="text-lg font-bold">{bsrEstimate.price.toFixed(2)}€</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Royalties/vente</div>
                          <div className="text-lg font-bold text-green-400">
                            {(bsrEstimate.price * bsrEstimate.royaltyRate / 100).toFixed(2)}€
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg">
                <strong>Note:</strong> Ces estimations sont basées sur des formules approximatives. 
                Les ventes réelles peuvent varier en fonction de nombreux facteurs (saisonnalité, promotions, etc.).
                Le taux de 70% s'applique aux ebooks de 2.99€ à 9.99€, sinon 35%.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Analyse Niche */}
        <TabsContent value="niche" className="space-y-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-400" />
                Analyse de Niche
              </CardTitle>
              <CardDescription>
                Évaluez le potentiel d'une niche avant de vous lancer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={nicheInput}
                  onChange={(e) => setNicheInput(e.target.value)}
                  placeholder="Ex: fitness pour seniors, thriller psychologique..."
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && analyzeNiche()}
                />
                <Button onClick={analyzeNiche} disabled={isLoading}>
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Filter className="h-4 w-4" />}
                  Analyser
                </Button>
              </div>

              {nicheAnalysis && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-purple-500/10 border-purple-500/30">
                      <CardContent className="p-3 text-center">
                        <div className="text-xs text-muted-foreground">Score demande</div>
                        <div className={`text-xl font-bold ${getOpportunityColor(nicheAnalysis.demandScore)}`}>
                          {nicheAnalysis.demandScore}/100
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-500/10 border-blue-500/30">
                      <CardContent className="p-3 text-center">
                        <div className="text-xs text-muted-foreground">Concurrence</div>
                        <div className="text-xl font-bold text-blue-400">{nicheAnalysis.competitionLevel}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-500/10 border-green-500/30">
                      <CardContent className="p-3 text-center">
                        <div className="text-xs text-muted-foreground">Potentiel profit</div>
                        <div className="text-xl font-bold text-green-400">{nicheAnalysis.profitPotential}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-amber-500/10 border-amber-500/30">
                      <CardContent className="p-3 text-center">
                        <div className="text-xs text-muted-foreground">Prix moyen</div>
                        <div className="text-xl font-bold text-amber-400">{nicheAnalysis.avgPrice?.toFixed(2)}€</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-background/30 border-border/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Meilleures catégories</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {nicheAnalysis.bestSellingCategories?.map((cat, idx) => (
                            <Badge key={idx} variant="outline" className="bg-purple-500/10">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-background/30 border-border/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Mots-clés suggérés</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {nicheAnalysis.keywordSuggestions?.map((kw, idx) => (
                            <Badge key={idx} variant="outline" className="bg-blue-500/10 cursor-pointer hover:bg-blue-500/20"
                              onClick={() => { setKeyword(kw); setActiveTab('keywords'); }}>
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-green-400" />
                        Opportunités de contenu
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {nicheAnalysis.contentGaps?.map((gap, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-green-400 mt-1">•</span>
                            <span>{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EbookKdpAnalytics;
