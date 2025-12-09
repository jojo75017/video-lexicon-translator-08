import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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
  Sparkles,
  GitCompare,
  Library,
  PieChart,
  LineChart,
  Award,
  Trophy,
  Flame,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import EbookAmazonComparator from './EbookAmazonComparator';
import EbookPublishedBooksDashboard from './EbookPublishedBooksDashboard';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';

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
  marketTrends?: { month: string; demand: number; competition: number }[];
}

const CHART_COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

interface TitleVolumeData {
  title: string;
  searchVolume: number;
  monthlyTrend: number;
  competitionIndex: number;
  suggestedKeywords: string[];
  estimatedClicks: number;
  relevanceScore: number;
  cpc: number;
  seasonalTrends: { month: string; volume: number }[];
  searchIntent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  difficulty: number;
  opportunityScore: number;
  avgBookPrice: number;
  estimatedRevenue: number;
}

const EbookKdpAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [keyword, setKeyword] = useState('');
  const [keywordResults, setKeywordResults] = useState<KeywordData[]>([]);
  const [bsrInput, setBsrInput] = useState('');
  const [priceInput, setPriceInput] = useState('4.99');
  const [bsrEstimate, setBsrEstimate] = useState<BSREstimate | null>(null);
  const [nicheInput, setNicheInput] = useState('');
  const [nicheAnalysis, setNicheAnalysis] = useState<NicheAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [titleSearch, setTitleSearch] = useState('');
  const [titleVolumeResults, setTitleVolumeResults] = useState<TitleVolumeData[]>([]);
  const [isLoadingTitle, setIsLoadingTitle] = useState(false);

  // Generate projection data for charts
  const revenueProjection = useMemo(() => {
    if (!bsrEstimate) return [];
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    return months.map((month, index) => {
      // Simulate seasonal variations
      const seasonalMultiplier = [0.8, 0.85, 0.9, 0.95, 1, 1.1, 0.9, 0.85, 1.05, 1.1, 1.3, 1.5][index];
      return {
        month,
        revenus: Math.round(bsrEstimate.monthlyRevenue * seasonalMultiplier),
        ventes: Math.round(bsrEstimate.monthlySales * seasonalMultiplier)
      };
    });
  }, [bsrEstimate]);

  const bsrRangeData = useMemo(() => {
    const ranges = [
      { range: '1-100', sales: 150, label: 'Bestseller' },
      { range: '100-500', sales: 55, label: 'Très bon' },
      { range: '500-1K', sales: 30, label: 'Bon' },
      { range: '1K-5K', sales: 15, label: 'Moyen' },
      { range: '5K-10K', sales: 7, label: 'Faible' },
      { range: '10K-50K', sales: 3, label: 'Très faible' },
      { range: '50K+', sales: 1, label: 'Minimal' }
    ];
    return ranges;
  }, []);

  const calculateBSRtoSales = (bsr: number, price: number): BSREstimate => {
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
    toast.success('Estimation calculée avec projections !');
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
        toast.success('Analyse terminée avec graphiques !');
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
      const prompt = `Analyse la niche "${nicheInput}" pour Amazon KDP. Génère une analyse détaillée du marché avec tendances.

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
  "contentGaps": ["opportunité 1", "opportunité 2", "opportunité 3"],
  "marketTrends": [
    { "month": "Jan", "demand": 65, "competition": 40 },
    { "month": "Fév", "demand": 70, "competition": 42 },
    { "month": "Mar", "demand": 75, "competition": 45 },
    { "month": "Avr", "demand": 72, "competition": 48 },
    { "month": "Mai", "demand": 78, "competition": 50 },
    { "month": "Juin", "demand": 80, "competition": 52 }
  ]
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
        toast.success('Analyse de niche terminée avec graphiques !');
      }
    } catch (error) {
      console.error('Erreur analyse niche:', error);
      toast.error('Erreur lors de l\'analyse');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeTitleVolume = async () => {
    if (!titleSearch.trim()) {
      toast.error('Veuillez entrer un titre ou mot-clé');
      return;
    }

    setIsLoadingTitle(true);
    try {
      const prompt = `Analyse le volume de recherche SEO pour le titre/mot-clé "${titleSearch}" sur Amazon KDP.

IMPORTANT: Réponds UNIQUEMENT avec un JSON valide, sans texte avant ou après.

{
  "results": [
    {
      "title": "${titleSearch}",
      "searchVolume": [nombre entre 500 et 100000],
      "monthlyTrend": [pourcentage variation -30 à +50],
      "competitionIndex": [score 1-100],
      "suggestedKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
      "estimatedClicks": [clics estimés par mois],
      "relevanceScore": [score 1-100],
      "cpc": [coût par clic en euros entre 0.05 et 3.50],
      "seasonalTrends": [
        {"month": "Jan", "volume": [volume]},
        {"month": "Fév", "volume": [volume]},
        {"month": "Mar", "volume": [volume]},
        {"month": "Avr", "volume": [volume]},
        {"month": "Mai", "volume": [volume]},
        {"month": "Juin", "volume": [volume]},
        {"month": "Juil", "volume": [volume]},
        {"month": "Aoû", "volume": [volume]},
        {"month": "Sep", "volume": [volume]},
        {"month": "Oct", "volume": [volume]},
        {"month": "Nov", "volume": [volume]},
        {"month": "Déc", "volume": [volume]}
      ],
      "searchIntent": "[informational/commercial/transactional/navigational]",
      "difficulty": [score SEO difficulté 1-100],
      "opportunityScore": [score opportunité 1-100],
      "avgBookPrice": [prix moyen des livres sur ce sujet entre 2.99 et 19.99],
      "estimatedRevenue": [revenu mensuel estimé si top 10]
    },
    {
      "title": "[variante optimisée 1]",
      "searchVolume": [nombre],
      "monthlyTrend": [pourcentage],
      "competitionIndex": [score],
      "suggestedKeywords": ["kw1", "kw2", "kw3"],
      "estimatedClicks": [clics],
      "relevanceScore": [score],
      "cpc": [cpc],
      "seasonalTrends": [12 mois],
      "searchIntent": "[intent]",
      "difficulty": [score],
      "opportunityScore": [score],
      "avgBookPrice": [prix],
      "estimatedRevenue": [revenu]
    },
    {
      "title": "[variante optimisée 2]",
      "searchVolume": [nombre],
      "monthlyTrend": [pourcentage],
      "competitionIndex": [score],
      "suggestedKeywords": ["kw1", "kw2", "kw3"],
      "estimatedClicks": [clics],
      "relevanceScore": [score],
      "cpc": [cpc],
      "seasonalTrends": [12 mois],
      "searchIntent": "[intent]",
      "difficulty": [score],
      "opportunityScore": [score],
      "avgBookPrice": [prix],
      "estimatedRevenue": [revenu]
    }
  ]
}`;

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { 
          prompt,
          type: 'title-volume-analysis'
        }
      });

      if (error) throw error;

      const content = data?.content || data?.generatedText || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setTitleVolumeResults(parsed.results || []);
        toast.success('Analyse SEO complète terminée !');
      }
    } catch (error) {
      console.error('Erreur analyse volume:', error);
      toast.error('Erreur lors de l\'analyse');
    } finally {
      setIsLoadingTitle(false);
    }
  };

  // Title volume chart data
  const titleVolumeChartData = useMemo(() => {
    return titleVolumeResults.map(item => ({
      name: item.title.substring(0, 20) + (item.title.length > 20 ? '...' : ''),
      volume: item.searchVolume,
      clics: item.estimatedClicks,
      competition: item.competitionIndex,
      relevance: item.relevanceScore,
      cpc: (item.cpc || 0) * 100,
      opportunity: item.opportunityScore || 0
    }));
  }, [titleVolumeResults]);

  // Seasonal trends chart data
  const seasonalChartData = useMemo(() => {
    if (titleVolumeResults.length === 0 || !titleVolumeResults[0]?.seasonalTrends) return [];
    return titleVolumeResults[0].seasonalTrends;
  }, [titleVolumeResults]);

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'commercial': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'transactional': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'informational': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'navigational': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getIntentLabel = (intent: string) => {
    switch (intent) {
      case 'commercial': return 'Commercial';
      case 'transactional': return 'Transactionnel';
      case 'informational': return 'Informationnel';
      case 'navigational': return 'Navigation';
      default: return intent;
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

  const getBSRBadge = (bsr: number) => {
    if (bsr <= 1000) return { icon: Trophy, color: 'text-yellow-400', label: 'Top Seller' };
    if (bsr <= 5000) return { icon: Award, color: 'text-purple-400', label: 'Excellent' };
    if (bsr <= 20000) return { icon: Flame, color: 'text-orange-400', label: 'Bon' };
    return { icon: Eye, color: 'text-blue-400', label: 'À surveiller' };
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

  // Keyword comparison chart data
  const keywordComparisonData = useMemo(() => {
    return keywordResults.map(kw => ({
      name: kw.keyword.substring(0, 15) + (kw.keyword.length > 15 ? '...' : ''),
      volume: kw.searchVolume,
      opportunity: kw.opportunity,
      competition: kw.competitionScore
    }));
  }, [keywordResults]);

  return (
    <div className="space-y-6">
      {/* Header with gradient */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <BarChart3 className="h-7 w-7 text-purple-400" />
            </div>
            KDP Analytics Pro
          </h2>
          <p className="text-muted-foreground">
            Analysez le marché Amazon KDP avec des données et graphiques avancés
          </p>
        </div>
        <Button onClick={exportResults} variant="outline" size="sm" className="gap-2 hover:bg-purple-500/10 hover:border-purple-500/50">
          <Download className="h-4 w-4" />
          Exporter
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 bg-background/80 backdrop-blur border border-border/50 p-1 rounded-xl">
          <TabsTrigger value="dashboard" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/20 data-[state=active]:to-emerald-500/20 data-[state=active]:border-green-500/30 gap-2">
            <Library className="h-4 w-4" />
            <span className="hidden sm:inline">Livres</span>
          </TabsTrigger>
          <TabsTrigger value="volume" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-teal-500/20 data-[state=active]:border-cyan-500/30 gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Volume</span>
          </TabsTrigger>
          <TabsTrigger value="keywords" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-violet-500/20 data-[state=active]:border-purple-500/30 gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Mots-clés</span>
          </TabsTrigger>
          <TabsTrigger value="bsr" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:border-amber-500/30 gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">BSR</span>
          </TabsTrigger>
          <TabsTrigger value="niche" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-cyan-500/20 data-[state=active]:border-blue-500/30 gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Niche</span>
          </TabsTrigger>
          <TabsTrigger value="comparator" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/20 data-[state=active]:to-red-500/20 data-[state=active]:border-orange-500/30 gap-2">
            <GitCompare className="h-4 w-4" />
            <span className="hidden sm:inline">Comparer</span>
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          <EbookPublishedBooksDashboard />
        </TabsContent>

        {/* Volume Search Tab */}
        <TabsContent value="volume" className="space-y-4">
          <Card className="bg-gradient-to-br from-cyan-500/5 to-teal-500/5 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/20">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                </div>
                Volume de recherche - Titres & Mots-clés
              </CardTitle>
              <CardDescription>
                Analysez le potentiel de recherche d'un titre ou mot-clé sur Amazon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  value={titleSearch}
                  onChange={(e) => setTitleSearch(e.target.value)}
                  placeholder="Ex: Comment perdre du poids, Guide pratique du jardinage..."
                  className="flex-1 bg-background/50"
                  onKeyDown={(e) => e.key === 'Enter' && analyzeTitleVolume()}
                />
                <Button onClick={analyzeTitleVolume} disabled={isLoadingTitle} className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600">
                  {isLoadingTitle ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Analyser
                </Button>
              </div>

              {/* Volume Results Chart */}
              {titleVolumeResults.length > 0 && (
                <div className="space-y-6">
                  {/* Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Volume Chart */}
                    <Card className="bg-background/50 border-border/30">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-cyan-400" />
                          Comparaison des volumes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-56">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={titleVolumeChartData}>
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
                              <Bar dataKey="volume" name="Volume" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="clics" name="Clics" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Seasonal Trends Chart */}
                    {seasonalChartData.length > 0 && (
                      <Card className="bg-background/50 border-border/30">
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <LineChart className="h-4 w-4 text-amber-400" />
                            Tendances saisonnières
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={seasonalChartData}>
                                <defs>
                                  <linearGradient id="seasonalGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px'
                                  }}
                                />
                                <Area type="monotone" dataKey="volume" stroke="#f59e0b" fill="url(#seasonalGradient)" strokeWidth={2} />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Radar Chart */}
                  <Card className="bg-background/50 border-border/30">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <PieChart className="h-4 w-4 text-teal-400" />
                        Analyse multi-critères SEO
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={titleVolumeChartData}>
                            <PolarGrid stroke="hsl(var(--border))" />
                            <PolarAngleAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                            <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" fontSize={8} />
                            <Radar name="Compétition" dataKey="competition" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                            <Radar name="Opportunité" dataKey="opportunity" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
                            <Radar name="CPC (x100)" dataKey="cpc" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                            <Legend />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Results Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {titleVolumeResults.map((item, index) => (
                      <Card key={index} className="bg-background/50 border-border/30 hover:border-cyan-500/30 transition-colors">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm line-clamp-2 flex-1">{item.title}</h4>
                            <div className="flex gap-1">
                              <Badge className={item.monthlyTrend >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                                {item.monthlyTrend >= 0 ? '+' : ''}{item.monthlyTrend}%
                              </Badge>
                              {item.searchIntent && (
                                <Badge className={getIntentColor(item.searchIntent)}>
                                  {getIntentLabel(item.searchIntent)}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-2 text-xs">
                            <div className="bg-cyan-500/10 rounded p-2">
                              <div className="text-muted-foreground text-[10px]">Volume</div>
                              <div className="text-sm font-bold text-cyan-400">{(item.searchVolume || 0).toLocaleString()}</div>
                            </div>
                            <div className="bg-teal-500/10 rounded p-2">
                              <div className="text-muted-foreground text-[10px]">Clics</div>
                              <div className="text-sm font-bold text-teal-400">{(item.estimatedClicks || 0).toLocaleString()}</div>
                            </div>
                            <div className="bg-purple-500/10 rounded p-2">
                              <div className="text-muted-foreground text-[10px]">CPC</div>
                              <div className="text-sm font-bold text-purple-400">{(item.cpc || 0).toFixed(2)}€</div>
                            </div>
                            <div className="bg-amber-500/10 rounded p-2">
                              <div className="text-muted-foreground text-[10px]">Prix moy.</div>
                              <div className="text-sm font-bold text-amber-400">{(item.avgBookPrice || 0).toFixed(2)}€</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Compétition</span>
                                <span className={(item.competitionIndex || 0) > 70 ? 'text-red-400' : (item.competitionIndex || 0) > 40 ? 'text-yellow-400' : 'text-green-400'}>
                                  {item.competitionIndex || 0}/100
                                </span>
                              </div>
                              <Progress value={item.competitionIndex || 0} className="h-1.5" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Difficulté SEO</span>
                                <span className={(item.difficulty || 0) > 70 ? 'text-red-400' : (item.difficulty || 0) > 40 ? 'text-yellow-400' : 'text-green-400'}>
                                  {item.difficulty || 0}/100
                                </span>
                              </div>
                              <Progress value={item.difficulty || 0} className="h-1.5" />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Opportunité</span>
                                <span className={(item.opportunityScore || 0) > 70 ? 'text-green-400' : (item.opportunityScore || 0) > 40 ? 'text-yellow-400' : 'text-red-400'}>
                                  {item.opportunityScore || 0}/100
                                </span>
                              </div>
                              <Progress value={item.opportunityScore || 0} className="h-1.5" />
                            </div>
                            <div className="bg-green-500/10 rounded p-2 text-center">
                              <div className="text-muted-foreground text-[10px]">Rev. estimé</div>
                              <div className="text-sm font-bold text-green-400">{(item.estimatedRevenue || 0).toLocaleString()}€/mois</div>
                            </div>
                          </div>

                          {item.suggestedKeywords && item.suggestedKeywords.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-2">
                              {item.suggestedKeywords.slice(0, 5).map((kw, kwIndex) => (
                                <Badge key={kwIndex} variant="outline" className="text-[10px] bg-background/50">
                                  {kw}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {titleVolumeResults.length === 0 && !isLoadingTitle && (
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Entrez un titre ou mot-clé pour analyser son volume de recherche</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-4">
          <Card className="bg-gradient-to-br from-purple-500/5 to-violet-500/5 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-500/20">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                </div>
                Recherche de mots-clés KDP
              </CardTitle>
              <CardDescription>
                Analysez le volume de recherche, la concurrence et le potentiel de revenus avec graphiques
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Ex: développement personnel, romance paranormale..."
                  className="flex-1 bg-background/50"
                  onKeyDown={(e) => e.key === 'Enter' && analyzeKeywords()}
                />
                <Button onClick={analyzeKeywords} disabled={isLoading} className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600">
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Analyser
                </Button>
              </div>

              {/* Keywords Comparison Chart */}
              {keywordResults.length > 0 && (
                <div className="space-y-6">
                  {/* Chart Section */}
                  <Card className="bg-background/50 border-border/30">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-purple-400" />
                        Comparaison des mots-clés
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={keywordComparisonData}>
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
                            <Bar dataKey="volume" name="Volume" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="opportunity" name="Opportunité" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="competition" name="Concurrence" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Keywords Cards */}
                  {keywordResults.map((kw, idx) => (
                    <Card key={idx} className="bg-background/30 border-border/30 hover:border-purple-500/30 transition-colors">
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
                          <div className="text-center p-3 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-lg border border-purple-500/20">
                            <div className="text-xs text-muted-foreground">Volume</div>
                            <div className="font-bold text-purple-400 text-xl">{kw.searchVolume?.toLocaleString()}</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg border border-blue-500/20">
                            <div className="text-xs text-muted-foreground">Prix moyen</div>
                            <div className="font-bold text-blue-400 text-xl">{kw.avgPrice?.toFixed(2)}€</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg border border-green-500/20">
                            <div className="text-xs text-muted-foreground">Ventes/mois</div>
                            <div className="font-bold text-green-400 text-xl">{kw.estimatedMonthlySales}</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-lg border border-amber-500/20">
                            <div className="text-xs text-muted-foreground">Opportunité</div>
                            <div className={`font-bold text-xl ${getOpportunityColor(kw.opportunity)}`}>{kw.opportunity}/100</div>
                            <Progress value={kw.opportunity} className="h-1 mt-1" />
                          </div>
                        </div>

                        {kw.topBooks && kw.topBooks.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
                              Top livres concurrents:
                            </div>
                            <div className="grid gap-2">
                              {kw.topBooks.slice(0, 3).map((book, bookIdx) => {
                                const badge = getBSRBadge(book.bsr);
                                const BadgeIcon = badge.icon;
                                return (
                                  <div key={bookIdx} className="flex items-center justify-between text-sm bg-background/50 p-3 rounded-lg border border-border/30">
                                    <div className="flex-1 truncate">
                                      <span className="font-medium">{book.title}</span>
                                      <span className="text-muted-foreground ml-2">par {book.author}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs">
                                      <div className="flex items-center gap-1">
                                        <BadgeIcon className={`h-3 w-3 ${badge.color}`} />
                                        <span className="text-purple-400">#{book.bsr}</span>
                                      </div>
                                      <span className="text-green-400 font-medium">{book.price}€</span>
                                      <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                        {book.rating}
                                      </div>
                                      <span className="text-muted-foreground">({book.reviews} avis)</span>
                                    </div>
                                  </div>
                                );
                              })}
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

        {/* BSR Calculator Tab */}
        <TabsContent value="bsr" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Calculator Card */}
            <Card className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/20">
                    <TrendingUp className="h-5 w-5 text-amber-400" />
                  </div>
                  Calculateur BSR → Ventes
                </CardTitle>
                <CardDescription>
                  Estimez les ventes et revenus à partir du rang Amazon
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Rang BSR</Label>
                    <Input
                      type="number"
                      value={bsrInput}
                      onChange={(e) => setBsrInput(e.target.value)}
                      placeholder="Ex: 15000"
                      min="1"
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Prix de vente (€)</Label>
                    <Input
                      type="number"
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      placeholder="Ex: 4.99"
                      min="0.99"
                      step="0.01"
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <Button onClick={handleBSRCalculation} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  <Zap className="h-4 w-4 mr-2" />
                  Calculer les estimations
                </Button>

                {bsrEstimate && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30">
                        <CardContent className="p-4 text-center">
                          <BookOpen className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                          <div className="text-xs text-muted-foreground">Ventes/jour</div>
                          <div className="text-2xl font-bold text-purple-400">{bsrEstimate.dailySales}</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30">
                        <CardContent className="p-4 text-center">
                          <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                          <div className="text-xs text-muted-foreground">Ventes/mois</div>
                          <div className="text-2xl font-bold text-blue-400">{bsrEstimate.monthlySales}</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
                        <CardContent className="p-4 text-center">
                          <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-400" />
                          <div className="text-xs text-muted-foreground">Revenus/mois</div>
                          <div className="text-2xl font-bold text-green-400">{bsrEstimate.monthlyRevenue.toFixed(2)}€</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/30">
                        <CardContent className="p-4 text-center">
                          <Star className="h-6 w-6 mx-auto mb-2 text-amber-400" />
                          <div className="text-xs text-muted-foreground">Revenus/an</div>
                          <div className="text-2xl font-bold text-amber-400">{bsrEstimate.yearlyRevenue.toFixed(2)}€</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border-pink-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <div className="text-xs text-muted-foreground">Taux royalties</div>
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
              </CardContent>
            </Card>

            {/* Charts Card */}
            <div className="space-y-4">
              {/* Revenue Projection Chart */}
              {bsrEstimate && (
                <Card className="bg-background/50 border-border/30">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <LineChart className="h-4 w-4 text-green-400" />
                      Projection des revenus sur 12 mois
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueProjection}>
                          <defs>
                            <linearGradient id="colorRevenu" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                            formatter={(value: number) => [`${value}€`, 'Revenus']}
                          />
                          <Area type="monotone" dataKey="revenus" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenu)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* BSR Range Reference Chart */}
              <Card className="bg-background/50 border-border/30">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-purple-400" />
                    Référence BSR → Ventes journalières
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={bsrRangeData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                        <YAxis dataKey="range" type="category" stroke="hsl(var(--muted-foreground))" fontSize={10} width={60} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                          formatter={(value: number) => [`${value} ventes/jour`, 'Estimation']}
                        />
                        <Bar dataKey="sales" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg">
            <strong>Note:</strong> Ces estimations sont basées sur des formules approximatives. 
            Les ventes réelles varient selon la saisonnalité, promotions, etc.
            Le taux de 70% s'applique aux ebooks de 2.99€ à 9.99€, sinon 35%.
          </div>
        </TabsContent>

        {/* Niche Analysis Tab */}
        <TabsContent value="niche" className="space-y-4">
          <Card className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/20">
                  <Target className="h-5 w-5 text-blue-400" />
                </div>
                Analyse de Niche Avancée
              </CardTitle>
              <CardDescription>
                Évaluez le potentiel d'une niche avec graphiques de tendances
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={nicheInput}
                  onChange={(e) => setNicheInput(e.target.value)}
                  placeholder="Ex: fitness pour seniors, thriller psychologique..."
                  className="flex-1 bg-background/50"
                  onKeyDown={(e) => e.key === 'Enter' && analyzeNiche()}
                />
                <Button onClick={analyzeNiche} disabled={isLoading} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Filter className="h-4 w-4" />}
                  Analyser
                </Button>
              </div>

              {nicheAnalysis && (
                <div className="space-y-4 mt-4">
                  {/* Score Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30">
                      <CardContent className="p-4 text-center">
                        <div className="text-xs text-muted-foreground mb-1">Score demande</div>
                        <div className={`text-2xl font-bold ${getOpportunityColor(nicheAnalysis.demandScore)}`}>
                          {nicheAnalysis.demandScore}/100
                        </div>
                        <Progress value={nicheAnalysis.demandScore} className="h-1 mt-2" />
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30">
                      <CardContent className="p-4 text-center">
                        <div className="text-xs text-muted-foreground mb-1">Concurrence</div>
                        <div className="text-xl font-bold text-blue-400">{nicheAnalysis.competitionLevel}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
                      <CardContent className="p-4 text-center">
                        <div className="text-xs text-muted-foreground mb-1">Potentiel profit</div>
                        <div className="text-xl font-bold text-green-400">{nicheAnalysis.profitPotential}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/30">
                      <CardContent className="p-4 text-center">
                        <div className="text-xs text-muted-foreground mb-1">Prix moyen</div>
                        <div className="text-xl font-bold text-amber-400">{nicheAnalysis.avgPrice?.toFixed(2)}€</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Market Trends Chart */}
                  {nicheAnalysis.marketTrends && (
                    <Card className="bg-background/50 border-border/30">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <LineChart className="h-4 w-4 text-blue-400" />
                          Tendances du marché (6 derniers mois)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsLineChart data={nicheAnalysis.marketTrends}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: 'hsl(var(--card))',
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '8px'
                                }}
                              />
                              <Legend />
                              <Line type="monotone" dataKey="demand" name="Demande" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                              <Line type="monotone" dataKey="competition" name="Concurrence" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
                            </RechartsLineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-background/30 border-border/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <PieChart className="h-4 w-4 text-purple-400" />
                          Meilleures catégories
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {nicheAnalysis.bestSellingCategories?.map((cat, idx) => (
                            <Badge key={idx} variant="outline" className="bg-purple-500/10 border-purple-500/30">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-background/30 border-border/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Search className="h-4 w-4 text-blue-400" />
                          Mots-clés suggérés
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {nicheAnalysis.keywordSuggestions?.map((kw, idx) => (
                            <Badge 
                              key={idx} 
                              variant="outline" 
                              className="bg-blue-500/10 border-blue-500/30 cursor-pointer hover:bg-blue-500/20 transition-colors"
                              onClick={() => { setKeyword(kw); setActiveTab('keywords'); }}
                            >
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
                          <li key={idx} className="flex items-start gap-2 text-sm p-2 bg-green-500/5 rounded-lg">
                            <span className="text-green-400 mt-0.5">💡</span>
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

        {/* Comparator Tab */}
        <TabsContent value="comparator" className="space-y-4">
          <EbookAmazonComparator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EbookKdpAnalytics;
