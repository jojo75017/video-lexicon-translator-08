import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft, Search, TrendingUp, Copy, Download, Sparkles, Target,
  BarChart3, Zap, ChevronUp, ChevronDown, Minus, Star, BookOpen,
  Hash, Layers, Eye, ShieldCheck, Lightbulb, CheckCircle, AlertTriangle
} from 'lucide-react';
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
  category?: string;
}

type SearchMode = 'auto' | 'niche' | 'title' | 'longtail' | 'backend7';

const KdpKeywordResearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const titleFromUrl = searchParams.get('title') || '';
  const isFromProject = !!searchParams.get('title');

  const [seedKeyword, setSeedKeyword] = useState(titleFromUrl);
  const [keywords, setKeywords] = useState<KdpKeyword[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'volume' | 'difficulty' | 'opportunity'>('opportunity');
  const [activeTab, setActiveTab] = useState<string>('research');
  const [searchMode, setSearchMode] = useState<SearchMode>(isFromProject ? 'title' : 'auto');
  const [backend7Keywords, setBackend7Keywords] = useState<string[]>([]);
  const [longTailKeywords, setLongTailKeywords] = useState<KdpKeyword[]>([]);
  const [isGenerating7, setIsGenerating7] = useState(false);
  const [isGeneratingLongTail, setIsGeneratingLongTail] = useState(false);
  const [filterCompetition, setFilterCompetition] = useState<string>('all');

  // Detect if input looks like a book title
  const detectInputType = (input: string): 'title' | 'niche' => {
    const words = input.trim().split(/\s+/);
    const hasArticles = /^(le|la|les|un|une|des|l'|d'|du|au|aux)\s/i.test(input);
    const hasUpperCase = words.filter(w => /^[A-ZÀ-Ü]/.test(w)).length >= 2;
    const isLong = words.length >= 4;
    const hasSpecialChars = /[:\-–—]/.test(input);
    if ((isLong && hasArticles) || hasUpperCase || hasSpecialChars || words.length >= 5) return 'title';
    return 'niche';
  };

  const effectiveMode = searchMode === 'auto' ? detectInputType(seedKeyword) : searchMode;

  const getPromptForMode = (mode: SearchMode | 'title' | 'niche') => {
    if (mode === 'title') {
      return `Tu es un expert SEO Amazon KDP. Le titre du livre est : "${seedKeyword}".

Analyse ce titre et génère 20 mots-clés stratégiques que les lecteurs pourraient chercher sur Amazon pour trouver CE livre spécifique.

Pense à :
- Les thèmes principaux du titre
- Les synonymes et termes associés
- Les intentions de recherche des lecteurs
- Les catégories Amazon pertinentes
- Les termes émotionnels liés au sujet

Pour CHAQUE mot-clé :
- keyword: le mot-clé (en français)
- volume: volume de recherche mensuel estimé sur Amazon (100-50000)
- difficulty: difficulté SEO 1-100
- cpc: CPC estimé en euros (0.10-5.00)
- competition: "low", "medium" ou "high"
- trend: "rising", "stable" ou "declining"
- intent: "informational", "commercial" ou "transactional"
- opportunity: score d'opportunité 1-100
- category: catégorie du mot-clé ("thème principal", "synonyme", "longue traîne", "émotionnel", "catégorie")

Réponds UNIQUEMENT avec un tableau JSON valide.`;
    }

    if (mode === 'longtail') {
      return `Tu es un expert SEO Amazon KDP spécialisé en longue traîne. Pour la niche/titre "${seedKeyword}", génère 20 mots-clés LONGUE TRAÎNE très spécifiques (4+ mots).

Ces mots-clés doivent :
- Être très spécifiques et ciblés
- Avoir une faible concurrence
- Correspondre à des intentions d'achat précises
- Inclure des variantes avec "livre", "kindle", "ebook", "pdf"

Pour CHAQUE mot-clé :
- keyword, volume (50-3000), difficulty (5-40), cpc, competition, trend, intent, opportunity, category

Réponds UNIQUEMENT avec un tableau JSON valide.`;
    }

    if (mode === 'backend7') {
      return `Tu es un expert Amazon KDP. Pour le livre "${seedKeyword}", génère exactement 7 mots-clés backend Amazon KDP optimisés.

Règles Amazon KDP pour les 7 mots-clés backend :
- Maximum 50 caractères par mot-clé
- Pas de répétition du titre
- Pas de marques déposées
- Pas de mots comme "livre", "ebook", "kindle" (Amazon les ajoute automatiquement)
- Pas de virgules dans un seul champ
- Utiliser des synonymes et termes complémentaires
- Couvrir différents angles de recherche

Réponds avec un tableau JSON de 7 strings exactement : ["mot-clé 1", "mot-clé 2", ...]`;
    }

    // niche mode
    return `Tu es un expert SEO Amazon KDP. Génère exactement 20 mots-clés stratégiques pour la niche "${seedKeyword}" sur Amazon KDP.

Pour CHAQUE mot-clé :
- keyword: le mot-clé (en français)
- volume: volume de recherche mensuel estimé sur Amazon (100-50000)
- difficulty: difficulté SEO 1-100
- cpc: CPC estimé en euros (0.10-5.00)
- competition: "low", "medium" ou "high"
- trend: "rising", "stable" ou "declining"
- intent: "informational", "commercial" ou "transactional"
- opportunity: score d'opportunité 1-100
- category: catégorie ("courte traîne", "longue traîne", "niche", "tendance", "saisonnière")

Inclus un mix de :
- 5 mots-clés principaux (courte traîne)
- 5 mots-clés longue traîne
- 5 mots-clés de niche spécifiques
- 5 mots-clés tendance/saisonniers

Réponds UNIQUEMENT avec un tableau JSON valide.`;
  };

  const generateKeywords = async () => {
    if (!seedKeyword.trim()) {
      toast.error('Entrez un mot-clé, une niche ou un titre de livre');
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { type: 'kdp-keyword-research', prompt: getPromptForMode(effectiveMode) }
      });
      if (error) throw error;
      const content = data?.content || data?.generatedContent || '';
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as KdpKeyword[];
        setKeywords(parsed);
        toast.success(`${parsed.length} mots-clés KDP générés (mode ${effectiveMode === 'title' ? 'titre' : 'niche'}) !`);
      } else {
        throw new Error('Format invalide');
      }
    } catch (err) {
      console.error('Erreur génération:', err);
      toast.error('Impossible de générer les mots-clés. Vérifiez votre connexion et réessayez.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateBackend7 = async () => {
    if (!seedKeyword.trim()) return;
    setIsGenerating7(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { type: 'kdp-backend-keywords', prompt: getPromptForMode('backend7') }
      });
      if (error) throw error;
      const content = data?.content || data?.generatedContent || '';
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as string[];
        setBackend7Keywords(parsed.slice(0, 7));
        toast.success('7 mots-clés backend KDP générés !');
      } else throw new Error('Format invalide');
    } catch {
      toast.error('Impossible de générer les mots-clés backend. Réessayez.');
    } finally {
      setIsGenerating7(false);
    }
  };

  const generateLongTail = async () => {
    if (!seedKeyword.trim()) return;
    setIsGeneratingLongTail(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { type: 'kdp-longtail', prompt: getPromptForMode('longtail') }
      });
      if (error) throw error;
      const content = data?.content || data?.generatedContent || '';
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as KdpKeyword[];
        setLongTailKeywords(parsed);
        toast.success(`${parsed.length} mots-clés longue traîne générés !`);
      } else throw new Error('Format invalide');
    } catch {
      toast.error('Impossible de générer les mots-clés longue traîne. Réessayez.');
    } finally {
      setIsGeneratingLongTail(false);
    }
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

  const copyAll7 = () => {
    navigator.clipboard.writeText(backend7Keywords.join('\n'));
    toast.success('7 mots-clés backend copiés !');
  };

  const exportCSV = () => {
    const rows = [['Mot-clé', 'Volume', 'Difficulté', 'CPC', 'Compétition', 'Tendance', 'Intent', 'Opportunité', 'Catégorie']];
    const allKw = activeTab === 'longtail' ? longTailKeywords : keywords;
    const data = selectedKeywords.size > 0 ? allKw.filter(k => selectedKeywords.has(k.keyword)) : allKw;
    data.forEach(k => rows.push([k.keyword, String(k.volume), String(k.difficulty), String(k.cpc), k.competition, k.trend, k.intent, String(k.opportunity), k.category || '']));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kdp-keywords-${seedKeyword}.csv`;
    a.click();
    toast.success('Export CSV téléchargé !');
  };

  const currentKeywords = activeTab === 'longtail' ? longTailKeywords : keywords;
  const filtered = filterCompetition === 'all' ? currentKeywords : currentKeywords.filter(k => k.competition === filterCompetition);
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'volume') return b.volume - a.volume;
    if (sortBy === 'difficulty') return a.difficulty - b.difficulty;
    return b.opportunity - a.opportunity;
  });

  const getDifficultyColor = (d: number) => {
    if (d <= 30) return 'text-emerald-600 dark:text-emerald-400';
    if (d <= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };
  const getDifficultyBg = (d: number) => d <= 30 ? 'bg-emerald-500' : d <= 60 ? 'bg-amber-500' : 'bg-red-500';
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

  const avgVolume = currentKeywords.length > 0 ? Math.round(currentKeywords.reduce((s, k) => s + k.volume, 0) / currentKeywords.length) : 0;
  const avgDifficulty = currentKeywords.length > 0 ? Math.round(currentKeywords.reduce((s, k) => s + k.difficulty, 0) / currentKeywords.length) : 0;
  const bestOpportunity = currentKeywords.length > 0 ? currentKeywords.reduce((best, k) => k.opportunity > best.opportunity ? k : best, currentKeywords[0]) : null;
  const lowCompCount = currentKeywords.filter(k => k.competition === 'low').length;

  const renderKeywordRow = (kw: KdpKeyword, i: number) => (
    <motion.div key={kw.keyword} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}>
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
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-semibold text-foreground truncate">{kw.keyword}</span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0" onClick={(e) => { e.stopPropagation(); copyKeyword(kw.keyword); }}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline" className={getCompBadge(kw.competition)}>
                  {kw.competition === 'low' ? '🟢 Faible' : kw.competition === 'medium' ? '🟡 Moyenne' : '🔴 Forte'}
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {kw.intent === 'informational' ? '📖 Info' : kw.intent === 'commercial' ? '🛒 Commercial' : '💳 Transac.'}
                </Badge>
                {kw.category && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                    {kw.category}
                  </Badge>
                )}
                <span className="flex items-center gap-0.5">{getTrendIcon(kw.trend)}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 md:gap-6 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{kw.volume.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Volume</div>
              </div>
              <div className="text-center w-20">
                <div className={`text-sm font-bold ${getDifficultyColor(kw.difficulty)}`}>{kw.difficulty}/100</div>
                <Progress value={kw.difficulty} className={`h-1.5 mt-1 [&>div]:${getDifficultyBg(kw.difficulty)}`} />
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Difficulté</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{kw.cpc}€</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">CPC</div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-0.5">{getOpportunityStars(kw.opportunity)}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Opportunité</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/60 to-rose-50/40 dark:from-orange-950/20 dark:via-amber-950/10 dark:to-background p-4 md:p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="shrink-0">
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
              <span className="text-4xl">🔥</span> Mots-Clés KDP Pro
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Recherche avancée de mots-clés Amazon KDP avec IA</p>
          </div>
        </div>

        {/* Source indicator */}
        {isFromProject && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="mb-4 border-blue-200 dark:border-blue-800/40 bg-blue-50/50 dark:bg-blue-950/20">
              <CardContent className="p-3 flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <span className="text-sm text-muted-foreground">Titre du projet :</span>
                  <span className="ml-2 font-semibold text-foreground">"{titleFromUrl}"</span>
                </div>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  <BookOpen className="w-3 h-3 mr-1" /> Depuis projet
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Search bar with mode selector */}
        <Card className="mb-4 border-2 border-orange-200/60 dark:border-orange-800/30 bg-gradient-to-r from-orange-500/5 to-rose-500/5 dark:from-orange-500/10 dark:to-rose-500/10 shadow-lg shadow-orange-200/30 dark:shadow-orange-900/10">
          <CardContent className="p-4 md:p-6 space-y-3">
            {/* Mode selector */}
            <div className="flex flex-wrap gap-2">
              {[
                { mode: 'auto' as SearchMode, label: '🤖 Auto-détection', desc: 'Détecte titre ou niche' },
                { mode: 'niche' as SearchMode, label: '🎯 Niche', desc: 'Recherche par niche' },
                { mode: 'title' as SearchMode, label: '📖 Titre de livre', desc: 'Optimisé pour un titre' },
              ].map(m => (
                <Button
                  key={m.mode}
                  variant={searchMode === m.mode ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSearchMode(m.mode)}
                  className={searchMode === m.mode ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : ''}
                >
                  {m.label}
                </Button>
              ))}
            </div>

            {/* Detection indicator */}
            {searchMode === 'auto' && seedKeyword.trim() && (
              <div className="flex items-center gap-2 text-sm">
                <Eye className="w-4 h-4 text-orange-500" />
                <span className="text-muted-foreground">Détecté comme :</span>
                <Badge className={effectiveMode === 'title'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                }>
                  {effectiveMode === 'title' ? '📖 Titre de livre' : '🎯 Niche / Mot-clé'}
                </Badge>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                <Input
                  placeholder={searchMode === 'title' || effectiveMode === 'title'
                    ? 'Entrez le titre de votre livre KDP...'
                    : 'Entrez une niche KDP : romance, développement personnel...'}
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
                {isLoading ? <><Sparkles className="w-5 h-5 mr-2 animate-spin" /> Analyse IA...</> : <><Zap className="w-5 h-5 mr-2" /> Rechercher</>}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full max-w-lg bg-orange-100/50 dark:bg-orange-900/20">
            <TabsTrigger value="research" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Search className="w-4 h-4 mr-1" /> Recherche
            </TabsTrigger>
            <TabsTrigger value="longtail" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Layers className="w-4 h-4 mr-1" /> Longue traîne
            </TabsTrigger>
            <TabsTrigger value="backend7" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <Hash className="w-4 h-4 mr-1" /> 7 Backend KDP
            </TabsTrigger>
          </TabsList>

          {/* ==== TAB: Research ==== */}
          <TabsContent value="research">
            <AnimatePresence>
              {keywords.length > 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                    <Card className="border-orange-200/50 dark:border-orange-800/30">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-extrabold text-orange-600 dark:text-orange-400">{keywords.length}</div>
                        <div className="text-xs text-muted-foreground mt-1">Mots-clés</div>
                      </CardContent>
                    </Card>
                    <Card className="border-orange-200/50 dark:border-orange-800/30">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{avgVolume.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground mt-1">Vol. moyen</div>
                      </CardContent>
                    </Card>
                    <Card className="border-orange-200/50 dark:border-orange-800/30">
                      <CardContent className="p-4 text-center">
                        <div className={`text-2xl font-extrabold ${getDifficultyColor(avgDifficulty)}`}>{avgDifficulty}/100</div>
                        <div className="text-xs text-muted-foreground mt-1">Diff. moy.</div>
                      </CardContent>
                    </Card>
                    <Card className="border-orange-200/50 dark:border-orange-800/30">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{lowCompCount}</div>
                        <div className="text-xs text-muted-foreground mt-1">🟢 Faible comp.</div>
                      </CardContent>
                    </Card>
                    <Card className="border-orange-200/50 dark:border-orange-800/30 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">⭐ {bestOpportunity?.opportunity}</div>
                        <div className="text-xs text-muted-foreground mt-1 truncate">Top: {bestOpportunity?.keyword}</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex flex-wrap gap-2">
                      <Button variant={sortBy === 'opportunity' ? 'default' : 'outline'} size="sm" onClick={() => setSortBy('opportunity')}
                        className={sortBy === 'opportunity' ? 'bg-orange-500 hover:bg-orange-600' : ''}>
                        <Target className="w-4 h-4 mr-1" /> Opportunité
                      </Button>
                      <Button variant={sortBy === 'volume' ? 'default' : 'outline'} size="sm" onClick={() => setSortBy('volume')}
                        className={sortBy === 'volume' ? 'bg-blue-500 hover:bg-blue-600' : ''}>
                        <BarChart3 className="w-4 h-4 mr-1" /> Volume
                      </Button>
                      <Button variant={sortBy === 'difficulty' ? 'default' : 'outline'} size="sm" onClick={() => setSortBy('difficulty')}
                        className={sortBy === 'difficulty' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                        <TrendingUp className="w-4 h-4 mr-1" /> Facile d'abord
                      </Button>
                      <span className="border-l border-border mx-1" />
                      {['all', 'low', 'medium', 'high'].map(f => (
                        <Button key={f} variant={filterCompetition === f ? 'default' : 'outline'} size="sm"
                          onClick={() => setFilterCompetition(f)}
                          className={filterCompetition === f ? 'bg-purple-500 hover:bg-purple-600' : ''}>
                          {f === 'all' ? 'Tous' : f === 'low' ? '🟢' : f === 'medium' ? '🟡' : '🔴'}
                        </Button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {selectedKeywords.size > 0 && (
                        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                          {selectedKeywords.size} sélectionné(s)
                        </Badge>
                      )}
                      <Button variant="outline" size="sm" onClick={exportCSV}>
                        <Download className="w-4 h-4 mr-1" /> CSV
                      </Button>
                    </div>
                  </div>

                  {/* Keyword list */}
                  <div className="space-y-2">
                    {sorted.map((kw, i) => renderKeywordRow(kw, i))}
                  </div>

                  {/* Copy selected */}
                  {selectedKeywords.size > 0 && (
                    <div className="mt-4 flex gap-3">
                      <Button onClick={() => { navigator.clipboard.writeText(Array.from(selectedKeywords).join(', ')); toast.success(`${selectedKeywords.size} mots-clés copiés !`); }}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                        <Copy className="w-4 h-4 mr-2" /> Copier ({selectedKeywords.size})
                      </Button>
                      <Button variant="outline" onClick={() => setSelectedKeywords(new Set())}>Tout désélectionner</Button>
                    </div>
                  )}
                </motion.div>
              ) : !isLoading && (
                <Card className="border-dashed border-2 border-orange-200 dark:border-orange-800/30">
                  <CardContent className="p-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Trouvez vos mots-clés gagnants</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      Entrez une niche ou le titre de votre livre KDP. L'IA détecte automatiquement le type et adapte sa recherche.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['Romance', 'Développement personnel', 'Cuisine', 'Coloriages adultes', 'Thriller', 'Les Secrets du Succès'].map(niche => (
                        <Button key={niche} variant="outline" size="sm" onClick={() => setSeedKeyword(niche)}
                          className="border-orange-200 hover:bg-orange-50 dark:border-orange-800/40 dark:hover:bg-orange-950/20">
                          {niche}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* ==== TAB: Long Tail ==== */}
          <TabsContent value="longtail">
            <Card className="mb-4 border-purple-200/50 dark:border-purple-800/30 bg-gradient-to-r from-purple-500/5 to-indigo-500/5">
              <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Layers className="w-6 h-6 text-purple-500" />
                  <div>
                    <h3 className="font-bold text-foreground">Mots-clés Longue Traîne</h3>
                    <p className="text-sm text-muted-foreground">Faible concurrence, haute conversion — idéal pour se positionner rapidement</p>
                  </div>
                </div>
                <Button onClick={generateLongTail} disabled={isGeneratingLongTail || !seedKeyword.trim()}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white">
                  {isGeneratingLongTail ? <><Sparkles className="w-4 h-4 mr-2 animate-spin" /> Génération...</> : <><Zap className="w-4 h-4 mr-2" /> Générer</>}
                </Button>
              </CardContent>
            </Card>

            {longTailKeywords.length > 0 ? (
              <div className="space-y-2">
                {longTailKeywords.sort((a, b) => b.opportunity - a.opportunity).map((kw, i) => renderKeywordRow(kw, i))}
              </div>
            ) : (
              <Card className="border-dashed border-2 border-purple-200 dark:border-purple-800/30">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-3">🎯</div>
                  <p className="text-muted-foreground">Cliquez sur "Générer" pour découvrir des mots-clés longue traîne à faible concurrence</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ==== TAB: 7 Backend Keywords ==== */}
          <TabsContent value="backend7">
            <Card className="mb-4 border-emerald-200/50 dark:border-emerald-800/30 bg-gradient-to-r from-emerald-500/5 to-teal-500/5">
              <CardContent className="p-4 space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Hash className="w-6 h-6 text-emerald-500" />
                    <div>
                      <h3 className="font-bold text-foreground">7 Mots-Clés Backend Amazon KDP</h3>
                      <p className="text-sm text-muted-foreground">Les 7 mots-clés cachés que seul Amazon voit — optimisés selon les règles KDP</p>
                    </div>
                  </div>
                  <Button onClick={generateBackend7} disabled={isGenerating7 || !seedKeyword.trim()}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
                    {isGenerating7 ? <><Sparkles className="w-4 h-4 mr-2 animate-spin" /> Génération...</> : <><Zap className="w-4 h-4 mr-2" /> Générer les 7</>}
                  </Button>
                </div>

                {/* Rules reminder */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />, text: 'Max 50 caractères par champ' },
                    { icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />, text: 'Pas de répétition du titre' },
                    { icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />, text: 'Pas de "livre", "kindle", "ebook"' },
                    { icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />, text: 'Pas de marques déposées' },
                  ].map((rule, i) => (
                    <div key={i} className="flex items-center gap-2 text-muted-foreground">
                      {rule.icon} {rule.text}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {backend7Keywords.length > 0 ? (
              <div className="space-y-3">
                {backend7Keywords.map((kw, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="border-emerald-200/40 dark:border-emerald-800/30 hover:shadow-md transition-all">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-sm font-bold text-emerald-700 dark:text-emerald-300">
                            {i + 1}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">{kw}</span>
                            <div className="text-xs text-muted-foreground mt-0.5">{kw.length}/50 caractères</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={kw.length <= 50
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                          }>
                            {kw.length <= 50 ? '✓ OK' : '✗ Trop long'}
                          </Badge>
                          <Button variant="ghost" size="sm" onClick={() => copyKeyword(kw)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                <div className="flex gap-3 mt-4">
                  <Button onClick={copyAll7} className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
                    <Copy className="w-4 h-4 mr-2" /> Copier les 7 mots-clés
                  </Button>
                  <Button variant="outline" onClick={generateBackend7} disabled={isGenerating7}>
                    <Sparkles className="w-4 h-4 mr-2" /> Régénérer
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="border-dashed border-2 border-emerald-200 dark:border-emerald-800/30">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-3">🔑</div>
                  <p className="text-muted-foreground">Générez vos 7 mots-clés backend optimisés pour Amazon KDP</p>
                  <p className="text-xs text-muted-foreground mt-1">Ces mots-clés sont invisibles pour les lecteurs mais boostent votre référencement</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default KdpKeywordResearchPage;
