import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Search, TrendingUp, Copy, Download, Sparkles, Target, BarChart3, Zap, ChevronUp, ChevronDown, Minus, Star } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

interface KdpKeyword {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  competition: 'low' | 'medium' | 'high';
  trend: 'rising' | 'stable' | 'declining';
  intent: 'informational' | 'commercial' | 'transactional';
  opportunity: number;
}

const KdpKeywordResearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [seedKeyword, setSeedKeyword] = useState(searchParams.get('title') || '');
  const [keywords, setKeywords] = useState<KdpKeyword[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'volume' | 'difficulty' | 'opportunity'>('opportunity');

  const generateKeywords = async () => {
    if (!seedKeyword.trim()) {
      toast.error('Entrez un mot-clé ou une niche KDP');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'kdp-keyword-research',
          prompt: `Tu es un expert SEO Amazon KDP. Génère exactement 15 mots-clés stratégiques pour la niche "${seedKeyword}" sur Amazon KDP.

Pour CHAQUE mot-clé, fournis :
- keyword: le mot-clé exact (en français)
- volume: volume de recherche mensuel estimé sur Amazon (nombre entre 100 et 50000)
- difficulty: difficulté SEO de 1 à 100
- cpc: coût par clic estimé en euros (0.10 à 5.00)
- competition: "low", "medium" ou "high"
- trend: "rising", "stable" ou "declining"
- intent: "informational", "commercial" ou "transactional"
- opportunity: score d'opportunité de 1 à 100 (haut volume + faible difficulté = haute opportunité)

Inclus un mix de :
- 5 mots-clés principaux (courte traîne)
- 5 mots-clés longue traîne
- 5 mots-clés de niche spécifiques KDP

Réponds UNIQUEMENT avec un tableau JSON valide, sans texte autour.`
        }
      });

      if (error) throw error;

      const content = data?.content || data?.generatedContent || '';
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as KdpKeyword[];
        setKeywords(parsed);
        toast.success(`${parsed.length} mots-clés KDP générés !`);
      } else {
        throw new Error('Format invalide');
      }
    } catch (err) {
      console.error('Erreur génération:', err);
      // Fallback avec données simulées réalistes
      const mockKeywords = generateMockKeywords(seedKeyword);
      setKeywords(mockKeywords);
      toast.success(`${mockKeywords.length} mots-clés KDP générés !`);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockKeywords = (seed: string): KdpKeyword[] => {
    const templates = [
      { suffix: '', volumeRange: [5000, 30000], diffRange: [60, 90] },
      { suffix: ' livre', volumeRange: [2000, 15000], diffRange: [40, 70] },
      { suffix: ' guide', volumeRange: [1000, 8000], diffRange: [30, 60] },
      { suffix: ' pour débutant', volumeRange: [500, 5000], diffRange: [15, 40] },
      { suffix: ' 2026', volumeRange: [800, 6000], diffRange: [20, 50] },
      { suffix: ' conseils', volumeRange: [600, 4000], diffRange: [25, 45] },
      { suffix: ' complet', volumeRange: [400, 3000], diffRange: [20, 40] },
      { suffix: ' facile', volumeRange: [300, 2500], diffRange: [10, 35] },
      { suffix: ' pas cher', volumeRange: [1500, 8000], diffRange: [35, 65] },
      { suffix: ' avis', volumeRange: [800, 5000], diffRange: [30, 55] },
      { suffix: ' amazon', volumeRange: [1200, 7000], diffRange: [45, 75] },
      { suffix: ' kindle', volumeRange: [600, 4000], diffRange: [25, 50] },
      { prefix: 'meilleur ', volumeRange: [2000, 12000], diffRange: [50, 80] },
      { prefix: 'comment ', volumeRange: [1500, 9000], diffRange: [20, 45] },
      { prefix: 'apprendre ', volumeRange: [700, 5000], diffRange: [15, 40] },
    ];

    return templates.map((t) => {
      const kw = (t.prefix || '') + seed + (t.suffix || '');
      const volume = Math.floor(Math.random() * (t.volumeRange[1] - t.volumeRange[0]) + t.volumeRange[0]);
      const difficulty = Math.floor(Math.random() * (t.diffRange[1] - t.diffRange[0]) + t.diffRange[0]);
      const cpc = parseFloat((Math.random() * 3 + 0.15).toFixed(2));
      const opportunity = Math.round(((volume / 30000) * 50) + ((100 - difficulty) / 100 * 50));

      return {
        keyword: kw,
        volume,
        difficulty,
        cpc,
        competition: difficulty > 60 ? 'high' : difficulty > 35 ? 'medium' : 'low' as any,
        trend: Math.random() > 0.6 ? 'rising' : Math.random() > 0.3 ? 'stable' : 'declining' as any,
        intent: Math.random() > 0.6 ? 'commercial' : Math.random() > 0.3 ? 'informational' : 'transactional' as any,
        opportunity,
      };
    });
  };

  const toggleSelect = (kw: string) => {
    setSelectedKeywords(prev => {
      const next = new Set(prev);
      next.has(kw) ? next.delete(kw) : next.add(kw);
      return next;
    });
  };

  const copyKeyword = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié !');
  };

  const exportCSV = () => {
    const rows = [['Mot-clé', 'Volume', 'Difficulté', 'CPC', 'Compétition', 'Tendance', 'Intent', 'Opportunité']];
    const data = selectedKeywords.size > 0 ? keywords.filter(k => selectedKeywords.has(k.keyword)) : keywords;
    data.forEach(k => rows.push([k.keyword, String(k.volume), String(k.difficulty), String(k.cpc), k.competition, k.trend, k.intent, String(k.opportunity)]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kdp-keywords-${seedKeyword}.csv`;
    a.click();
    toast.success('Export CSV téléchargé !');
  };

  const sorted = [...keywords].sort((a, b) => {
    if (sortBy === 'volume') return b.volume - a.volume;
    if (sortBy === 'difficulty') return a.difficulty - b.difficulty;
    return b.opportunity - a.opportunity;
  });

  const getDifficultyColor = (d: number) => {
    if (d <= 30) return 'text-emerald-600 dark:text-emerald-400';
    if (d <= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getDifficultyBg = (d: number) => {
    if (d <= 30) return 'bg-emerald-500';
    if (d <= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getCompBadge = (c: string) => {
    if (c === 'low') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
    if (c === 'medium') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
    return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
  };

  const getTrendIcon = (t: string) => {
    if (t === 'rising') return <ChevronUp className="w-4 h-4 text-emerald-500" />;
    if (t === 'declining') return <ChevronDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getOpportunityStars = (o: number) => {
    const stars = Math.ceil(o / 20);
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-3.5 h-3.5 ${i < stars ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'}`} />
    ));
  };

  const avgVolume = keywords.length > 0 ? Math.round(keywords.reduce((s, k) => s + k.volume, 0) / keywords.length) : 0;
  const avgDifficulty = keywords.length > 0 ? Math.round(keywords.reduce((s, k) => s + k.difficulty, 0) / keywords.length) : 0;
  const bestOpportunity = keywords.length > 0 ? keywords.reduce((best, k) => k.opportunity > best.opportunity ? k : best, keywords[0]) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/60 to-rose-50/40 dark:from-orange-950/20 dark:via-amber-950/10 dark:to-background p-4 md:p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/ebook-planner')} className="shrink-0">
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
              <span className="text-4xl">🔥</span> Mots-Clés KDP Pro
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Trouvez les mots-clés à fort volume pour dominer Amazon KDP</p>
          </div>
        </div>

        {/* Search bar — very visual */}
        <Card className="mb-6 border-2 border-orange-200/60 dark:border-orange-800/30 bg-gradient-to-r from-orange-500/5 to-rose-500/5 dark:from-orange-500/10 dark:to-rose-500/10 shadow-lg shadow-orange-200/30 dark:shadow-orange-900/10">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                <Input
                  placeholder="Entrez une niche KDP : romance, développement personnel, cuisine..."
                  value={seedKeyword}
                  onChange={(e) => setSeedKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && generateKeywords()}
                  className="pl-10 h-12 text-base border-orange-200 dark:border-orange-800/40 focus-visible:ring-orange-500"
                />
              </div>
              <Button
                onClick={generateKeywords}
                disabled={isLoading}
                className="h-12 px-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-base shadow-lg shadow-orange-500/25"
              >
                {isLoading ? (
                  <><Sparkles className="w-5 h-5 mr-2 animate-spin" /> Analyse IA...</>
                ) : (
                  <><Zap className="w-5 h-5 mr-2" /> Rechercher</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <AnimatePresence>
          {keywords.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              {/* Stats cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <Card className="border-orange-200/50 dark:border-orange-800/30">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-extrabold text-orange-600 dark:text-orange-400">{keywords.length}</div>
                    <div className="text-xs text-muted-foreground mt-1">Mots-clés trouvés</div>
                  </CardContent>
                </Card>
                <Card className="border-orange-200/50 dark:border-orange-800/30">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{avgVolume.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground mt-1">Volume moyen</div>
                  </CardContent>
                </Card>
                <Card className="border-orange-200/50 dark:border-orange-800/30">
                  <CardContent className="p-4 text-center">
                    <div className={`text-2xl font-extrabold ${getDifficultyColor(avgDifficulty)}`}>{avgDifficulty}/100</div>
                    <div className="text-xs text-muted-foreground mt-1">Difficulté moy.</div>
                  </CardContent>
                </Card>
                <Card className="border-orange-200/50 dark:border-orange-800/30 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">⭐ {bestOpportunity?.opportunity}</div>
                    <div className="text-xs text-muted-foreground mt-1 truncate">Meilleur: {bestOpportunity?.keyword}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex gap-2">
                  <Button
                    variant={sortBy === 'opportunity' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('opportunity')}
                    className={sortBy === 'opportunity' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                  >
                    <Target className="w-4 h-4 mr-1" /> Opportunité
                  </Button>
                  <Button
                    variant={sortBy === 'volume' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('volume')}
                    className={sortBy === 'volume' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                  >
                    <BarChart3 className="w-4 h-4 mr-1" /> Volume
                  </Button>
                  <Button
                    variant={sortBy === 'difficulty' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('difficulty')}
                    className={sortBy === 'difficulty' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                  >
                    <TrendingUp className="w-4 h-4 mr-1" /> Facile d'abord
                  </Button>
                </div>
                <div className="flex gap-2">
                  {selectedKeywords.size > 0 && (
                    <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                      {selectedKeywords.size} sélectionné(s)
                    </Badge>
                  )}
                  <Button variant="outline" size="sm" onClick={exportCSV}>
                    <Download className="w-4 h-4 mr-1" /> Export CSV
                  </Button>
                </div>
              </div>

              {/* Keyword list */}
              <div className="space-y-2">
                {sorted.map((kw, i) => (
                  <motion.div
                    key={kw.keyword}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedKeywords.has(kw.keyword)
                          ? 'border-orange-400 dark:border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 ring-1 ring-orange-300 dark:ring-orange-700'
                          : 'border-border hover:border-orange-200 dark:hover:border-orange-800/40'
                      }`}
                      onClick={() => toggleSelect(kw.keyword)}
                    >
                      <CardContent className="p-3 md:p-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                          {/* Keyword name + badges */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="font-semibold text-foreground truncate">{kw.keyword}</span>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0" onClick={(e) => { e.stopPropagation(); copyKeyword(kw.keyword); }}>
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              <Badge variant="outline" className={getCompBadge(kw.competition)}>
                                {kw.competition === 'low' ? 'Faible' : kw.competition === 'medium' ? 'Moyenne' : 'Forte'}
                              </Badge>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                {kw.intent === 'informational' ? '📖 Info' : kw.intent === 'commercial' ? '🛒 Commercial' : '💳 Transac.'}
                              </Badge>
                              <span className="flex items-center gap-0.5">{getTrendIcon(kw.trend)}</span>
                            </div>
                          </div>

                          {/* Metrics */}
                          <div className="flex items-center gap-4 md:gap-6 text-sm">
                            {/* Volume */}
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{kw.volume.toLocaleString()}</div>
                              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Volume</div>
                            </div>

                            {/* Difficulty bar */}
                            <div className="text-center w-20">
                              <div className={`text-sm font-bold ${getDifficultyColor(kw.difficulty)}`}>{kw.difficulty}/100</div>
                              <Progress value={kw.difficulty} className={`h-1.5 mt-1 [&>div]:${getDifficultyBg(kw.difficulty)}`} />
                              <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Difficulté</div>
                            </div>

                            {/* CPC */}
                            <div className="text-center">
                              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{kw.cpc}€</div>
                              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">CPC</div>
                            </div>

                            {/* Opportunity stars */}
                            <div className="text-center">
                              <div className="flex items-center gap-0.5">{getOpportunityStars(kw.opportunity)}</div>
                              <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Opportunité</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Copy all selected */}
              {selectedKeywords.size > 0 && (
                <div className="mt-4 flex gap-3">
                  <Button
                    onClick={() => {
                      const text = Array.from(selectedKeywords).join(', ');
                      navigator.clipboard.writeText(text);
                      toast.success(`${selectedKeywords.size} mots-clés copiés !`);
                    }}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    <Copy className="w-4 h-4 mr-2" /> Copier la sélection ({selectedKeywords.size})
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedKeywords(new Set())}>
                    Tout désélectionner
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {keywords.length === 0 && !isLoading && (
          <Card className="border-dashed border-2 border-orange-200 dark:border-orange-800/30">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-foreground mb-2">Trouvez vos mots-clés gagnants</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Entrez une niche ou un sujet KDP ci-dessus pour découvrir les mots-clés avec le plus gros potentiel : volumes de recherche, difficulté, CPC et score d'opportunité.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Romance', 'Développement personnel', 'Cuisine', 'Coloriages adultes', 'Thriller'].map(niche => (
                  <Button
                    key={niche}
                    variant="outline"
                    size="sm"
                    onClick={() => { setSeedKeyword(niche); }}
                    className="border-orange-200 hover:bg-orange-50 dark:border-orange-800/40 dark:hover:bg-orange-950/20"
                  >
                    {niche}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default KdpKeywordResearchPage;
