import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Search, Loader2, Copy, BookOpen, DollarSign, Star, 
  TrendingUp, BarChart3, Eye, Key, Sparkles, ExternalLink,
  Users, Target, ArrowRight, Hash, Globe, ClipboardCheck,
  AlertTriangle, CheckCircle2, XCircle, Zap, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// ——— Types ———

interface BookData {
  asin: string;
  title: string;
  author: string | null;
  price: number | null;
  rating: number | null;
  reviews: number | null;
  bsr: number | null;
  pages: number | null;
  categories: string[];
  description: string;
  estimatedDailySales: number | null;
  estimatedMonthlySales: number | null;
  estimatedMonthlyRevenue: number | null;
  amazonUrl: string;
  scrapedAt: string;
}

interface NicheResult {
  title: string;
  url: string;
  description: string;
  asin: string | null;
  markdown: string;
}

interface KeywordData {
  title: string;
  singleKeywords: Array<{ word: string; count: number; relevance: number }>;
  phraseKeywords: Array<{ phrase: string; count: number; relevance: number }>;
  suggestedBackendKeywords: string[];
  titleKeywords: string[];
}

interface AuditCriterion {
  name: string;
  score: number;
  status: 'excellent' | 'bon' | 'moyen' | 'faible' | 'critique';
  recommendation: string;
  priority: 'haute' | 'moyenne' | 'basse';
}

interface AuditData {
  overall_score: number;
  overall_verdict: string;
  criteria: AuditCriterion[];
  quick_wins: string[];
}

const MARKETPLACES = [
  { value: 'fr', label: '🇫🇷 France', domain: 'amazon.fr' },
  { value: 'us', label: '🇺🇸 USA', domain: 'amazon.com' },
  { value: 'uk', label: '🇬🇧 UK', domain: 'amazon.co.uk' },
  { value: 'de', label: '🇩🇪 Allemagne', domain: 'amazon.de' },
];

export const KdpAmazonResearch: React.FC = () => {
  const [activeTab, setActiveTab] = useState('asin');
  const [marketplace, setMarketplace] = useState('fr');
  const [isLoading, setIsLoading] = useState(false);

  // ASIN tab
  const [asinInput, setAsinInput] = useState('');
  const [bookData, setBookData] = useState<BookData | null>(null);

  // Niche tab
  const [nicheQuery, setNicheQuery] = useState('');
  const [nicheResults, setNicheResults] = useState<NicheResult[]>([]);

  // Competitor tab
  const [competitorAsins, setCompetitorAsins] = useState('');
  const [competitorData, setCompetitorData] = useState<BookData[]>([]);

  // Keywords tab
  const [keywordAsin, setKeywordAsin] = useState('');
  const [keywordData, setKeywordData] = useState<KeywordData | null>(null);

  // Audit
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const callScraper = async (body: Record<string, any>) => {
    const { data, error } = await supabase.functions.invoke('kdp-asin-scraper', { body });
    if (error) throw new Error(error.message);
    if (!data?.success) throw new Error(data?.error || 'Erreur inconnue');
    return data.data;
  };

  // ——— ASIN Lookup ———
  const handleAsinLookup = async (asinOverride?: string) => {
    const targetAsin = (asinOverride ?? asinInput).trim();
    if (!targetAsin) { toast.error('Entrez un ASIN'); return; }

    setIsLoading(true);
    setBookData(null);
    setAuditData(null);
    try {
      const result = await callScraper({ mode: 'asin', asin: targetAsin, marketplace });
      setAsinInput(targetAsin);
      setBookData(result);
      toast.success('Fiche produit récupérée !');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors du scraping');
    } finally {
      setIsLoading(false);
    }
  };

  // ——— Niche Analysis ———
  const handleNicheSearch = async () => {
    const targetQuery = nicheQuery.trim();
    if (!targetQuery) { toast.error('Entrez une niche à analyser'); return; }

    setIsLoading(true);
    setNicheResults([]);
    try {
      const results = await callScraper({ mode: 'niche', query: targetQuery, marketplace });
      setNicheResults(results);
      toast.success(`${results.length} livre(s) trouvé(s) !`);
    } catch (err: any) {
      toast.error(err.message || 'Erreur de recherche');
    } finally {
      setIsLoading(false);
    }
  };

  // ——— Competitor Spy ———
  const handleCompetitorSpy = async () => {
    const asins = competitorAsins.split(/[\s,\n]+/).map(a => a.trim()).filter(a => a.length > 5);
    if (asins.length === 0) { toast.error('Entrez au moins un ASIN'); return; }
    if (asins.length > 5) { toast.error('Maximum 5 ASINs à la fois'); return; }
    
    setIsLoading(true);
    setCompetitorData([]);
    try {
      const results: BookData[] = [];
      for (const asin of asins) {
        try {
          const result = await callScraper({ mode: 'asin', asin, marketplace });
          results.push(result);
        } catch {
          toast.error(`Impossible de scraper ${asin}`);
        }
      }
      setCompetitorData(results);
      toast.success(`${results.length} fiche(s) récupérée(s) !`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ——— Keyword Extraction ———
  const handleKeywordExtract = async () => {
    const targetAsin = keywordAsin.trim();
    if (!targetAsin) { toast.error('Entrez un ASIN'); return; }

    setIsLoading(true);
    setKeywordData(null);
    try {
      const result = await callScraper({ mode: 'keywords', asin: targetAsin, marketplace });
      setKeywordAsin(targetAsin);
      setKeywordData(result);
      toast.success('Mots-clés extraits !');
    } catch (err: any) {
      toast.error(err.message || 'Erreur d\'extraction');
    } finally {
      setIsLoading(false);
    }
  };

  // ——— Book Audit ———
  const handleAudit = async () => {
    if (!bookData) return;
    setIsAuditing(true);
    setAuditData(null);
    try {
      const { data, error } = await supabase.functions.invoke('kdp-book-audit', {
        body: { bookData },
      });
      if (error) throw new Error(error.message);
      if (!data?.success) throw new Error(data?.error || 'Erreur d\'audit');
      setAuditData(data.data);
      toast.success('Audit terminé !');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'audit');
    } finally {
      setIsAuditing(false);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié !');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Search className="h-6 w-6 text-primary" />
            Recherche KDP Amazon
          </h2>
          <p className="text-muted-foreground mt-1">Données réelles scrapées en temps réel via Firecrawl</p>
        </div>
        <Select value={marketplace} onValueChange={setMarketplace}>
          <SelectTrigger className="w-[180px]">
            <Globe className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MARKETPLACES.map(m => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full bg-secondary/50 p-1.5 gap-1">
          <TabsTrigger value="asin" className="flex items-center gap-1.5 data-[state=active]:bg-[#3B9EFF] data-[state=active]:text-white data-[state=active]:shadow-[0_0_12px_rgba(59,158,255,0.4)] text-muted-foreground transition-all">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Fiche ASIN</span>
          </TabsTrigger>
          <TabsTrigger value="niche" className="flex items-center gap-1.5 data-[state=active]:bg-[#10B981] data-[state=active]:text-white data-[state=active]:shadow-[0_0_12px_rgba(16,185,129,0.4)] text-muted-foreground transition-all">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analyse Niche</span>
          </TabsTrigger>
          <TabsTrigger value="competitors" className="flex items-center gap-1.5 data-[state=active]:bg-[#F59E0B] data-[state=active]:text-white data-[state=active]:shadow-[0_0_12px_rgba(245,158,11,0.4)] text-muted-foreground transition-all">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Espion</span>
          </TabsTrigger>
          <TabsTrigger value="keywords" className="flex items-center gap-1.5 data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white data-[state=active]:shadow-[0_0_12px_rgba(139,92,246,0.4)] text-muted-foreground transition-all">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">Mots-Clés</span>
          </TabsTrigger>
          <TabsTrigger value="studio" className="flex items-center gap-1.5 data-[state=active]:bg-[#EF4444] data-[state=active]:text-white data-[state=active]:shadow-[0_0_12px_rgba(239,68,68,0.4)] text-muted-foreground transition-all">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Studio KDP</span>
          </TabsTrigger>
        </TabsList>

        {/* ——— TAB 1: ASIN ——— */}
        <TabsContent value="asin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Fiche Produit par ASIN
              </CardTitle>
              <CardDescription>Entrez un ASIN Amazon pour voir toutes les données du livre</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: B0DPQ3XKCD"
                  value={asinInput}
                  onChange={e => setAsinInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAsinLookup()}
                  className="flex-1"
                />
                <Button onClick={() => handleAsinLookup()} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  <span className="ml-2">Analyser</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {bookData && (
            <>
              <BookDataCard book={bookData} onCopy={copyText} />
              
              {/* Audit Button */}
              <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-primary/10">
                        <ClipboardCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Audit & Améliorations IA</h3>
                        <p className="text-sm text-muted-foreground">Scores 0-100 et recommandations pour optimiser votre fiche</p>
                      </div>
                    </div>
                    <Button onClick={handleAudit} disabled={isAuditing} className="bg-gradient-to-r from-primary to-[#8B5CF6] hover:opacity-90">
                      {isAuditing ? (
                        <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Analyse en cours...</>
                      ) : (
                        <><ShieldCheck className="h-4 w-4 mr-2" /> Lancer l'audit</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Audit Results */}
              {auditData && <AuditResultsCard audit={auditData} />}
            </>
          )}
        </TabsContent>

        {/* ——— TAB 2: NICHE ——— */}
        <TabsContent value="niche" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Analyse de Niche
              </CardTitle>
              <CardDescription>Recherchez une niche pour voir les livres concurrents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: développement personnel, recettes vegan, thriller français..."
                  value={nicheQuery}
                  onChange={e => setNicheQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleNicheSearch()}
                  className="flex-1"
                />
                <Button onClick={handleNicheSearch} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
                  <span className="ml-2">Analyser</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {nicheResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{nicheResults.length} livres trouvés pour "{nicheQuery}"</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {nicheResults.map((result, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <Badge variant="outline" className="mt-1 shrink-0">#{i + 1}</Badge>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{result.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{result.description}</p>
                      {result.asin && (
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">ASIN: {result.asin}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => {
                              setAsinInput(result.asin!);
                              setActiveTab('asin');
                              handleAsinLookup(result.asin!);
                            }}
                          >
                            <ArrowRight className="h-3 w-3 mr-1" />
                            Voir la fiche
                          </Button>
                        </div>
                      )}
                    </div>
                    {result.url && (
                      <a href={result.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </a>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ——— TAB 3: COMPETITORS ——— */}
        <TabsContent value="competitors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Espion Concurrents
              </CardTitle>
              <CardDescription>Comparez jusqu'à 5 livres concurrents côte à côte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="ASINs séparés par des virgules: B0DPQ3XKCD, B0ABCDEFGH..."
                  value={competitorAsins}
                  onChange={e => setCompetitorAsins(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleCompetitorSpy} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                  <span className="ml-2">Comparer</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {competitorData.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 text-sm font-medium text-foreground">Livre</th>
                    <th className="text-center p-3 text-sm font-medium text-foreground">Prix</th>
                    <th className="text-center p-3 text-sm font-medium text-foreground">BSR</th>
                    <th className="text-center p-3 text-sm font-medium text-foreground">Note</th>
                    <th className="text-center p-3 text-sm font-medium text-foreground">Avis</th>
                    <th className="text-center p-3 text-sm font-medium text-foreground">Ventes/mois</th>
                    <th className="text-center p-3 text-sm font-medium text-foreground">Revenus/mois</th>
                  </tr>
                </thead>
                <tbody>
                  {competitorData.map((book, i) => (
                    <tr key={i} className="border-b hover:bg-muted/30">
                      <td className="p-3">
                        <div className="max-w-[250px]">
                          <p className="font-medium text-foreground text-sm truncate">{book.title}</p>
                          <p className="text-xs text-muted-foreground">{book.author || 'Auteur inconnu'}</p>
                        </div>
                      </td>
                      <td className="text-center p-3 font-medium text-foreground">{book.price ? `${book.price}€` : '—'}</td>
                      <td className="text-center p-3">
                        <Badge variant={book.bsr && book.bsr < 10000 ? 'default' : 'secondary'}>
                          {book.bsr ? `#${book.bsr.toLocaleString()}` : '—'}
                        </Badge>
                      </td>
                      <td className="text-center p-3">
                        {book.rating ? (
                          <span className="flex items-center justify-center gap-1 text-foreground">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            {book.rating}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="text-center p-3 text-foreground">{book.reviews?.toLocaleString() || '—'}</td>
                      <td className="text-center p-3 font-medium text-foreground">{book.estimatedMonthlySales || '—'}</td>
                      <td className="text-center p-3 font-bold text-primary">{book.estimatedMonthlyRevenue ? `${book.estimatedMonthlyRevenue}€` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* ——— TAB 4: KEYWORDS ——— */}
        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                Extracteur de Mots-Clés
              </CardTitle>
              <CardDescription>Extraire les mots-clés d'un livre concurrent pour optimiser votre référencement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="ASIN du concurrent: B0DPQ3XKCD"
                  value={keywordAsin}
                  onChange={e => setKeywordAsin(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleKeywordExtract()}
                  className="flex-1"
                />
                <Button onClick={handleKeywordExtract} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Hash className="h-4 w-4" />}
                  <span className="ml-2">Extraire</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {keywordData && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Mots-clés simples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {keywordData.singleKeywords.slice(0, 15).map((kw, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{kw.word}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={kw.relevance} className="w-20 h-2" />
                        <Badge variant="outline" className="text-xs">{kw.count}x</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Expressions clés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {keywordData.phraseKeywords.length > 0 ? (
                    keywordData.phraseKeywords.map((kw, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-foreground">{kw.phrase}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={kw.relevance} className="w-20 h-2" />
                          <Badge variant="outline" className="text-xs">{kw.count}x</Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucune expression récurrente détectée</p>
                  )}
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    7 Mots-clés Backend KDP suggérés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {keywordData.suggestedBackendKeywords.map((kw, i) => (
                      <Badge key={i} className="cursor-pointer hover:bg-primary/80" onClick={() => copyText(kw)}>
                        {kw}
                        <Copy className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => copyText(keywordData.suggestedBackendKeywords.join(', '))}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copier tous les mots-clés
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* ——— TAB 5: STUDIO KDP ——— */}
        <TabsContent value="studio" className="space-y-4">
          <StudioKdpTab marketplace={marketplace} onNavigateAsin={(asin) => { setAsinInput(asin); setActiveTab('asin'); }} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// ——— Sub-Components ———

const BookDataCard: React.FC<{ book: BookData; onCopy: (t: string) => void }> = ({ book, onCopy }) => (
  <Card>
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <CardTitle className="text-lg text-foreground">{book.title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {book.author && `par ${book.author} · `}ASIN: {book.asin}
          </p>
        </div>
        <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-1" /> Amazon
          </Button>
        </a>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={DollarSign} label="Prix" value={book.price ? `${book.price}€` : 'N/A'} color="text-green-600" />
        <StatCard icon={TrendingUp} label="BSR" value={book.bsr ? `#${book.bsr.toLocaleString()}` : 'N/A'} color="text-blue-600" />
        <StatCard icon={Star} label="Note" value={book.rating ? `${book.rating}/5` : 'N/A'} color="text-yellow-600" />
        <StatCard icon={Users} label="Avis" value={book.reviews?.toLocaleString() || 'N/A'} color="text-purple-600" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard icon={BarChart3} label="Ventes/jour" value={book.estimatedDailySales?.toString() || 'N/A'} color="text-orange-600" />
        <StatCard icon={BarChart3} label="Ventes/mois" value={book.estimatedMonthlySales?.toString() || 'N/A'} color="text-orange-600" />
        <StatCard icon={DollarSign} label="Revenus/mois" value={book.estimatedMonthlyRevenue ? `${book.estimatedMonthlyRevenue}€` : 'N/A'} color="text-emerald-600" />
      </div>

      {book.categories.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-foreground mb-2">Catégories</h4>
          <div className="flex flex-wrap gap-2">
            {book.categories.map((cat, i) => (
              <Badge key={i} variant="secondary" className="text-xs">{cat}</Badge>
            ))}
          </div>
        </div>
      )}

      {book.description && (
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">Description</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{book.description}</p>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <Button variant="outline" size="sm" onClick={() => onCopy(book.asin)}>
          <Copy className="h-3 w-3 mr-1" /> ASIN
        </Button>
        <Button variant="outline" size="sm" onClick={() => onCopy(book.title)}>
          <Copy className="h-3 w-3 mr-1" /> Titre
        </Button>
        <Button variant="outline" size="sm" onClick={() => onCopy(JSON.stringify(book, null, 2))}>
          <Copy className="h-3 w-3 mr-1" /> Tout
        </Button>
      </div>
    </CardContent>
  </Card>
);

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-blue-500';
  if (score >= 40) return 'text-amber-500';
  if (score >= 20) return 'text-orange-500';
  return 'text-red-500';
};

const getScoreBg = (score: number) => {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-blue-500';
  if (score >= 40) return 'bg-amber-500';
  if (score >= 20) return 'bg-orange-500';
  return 'bg-red-500';
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'excellent': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case 'bon': return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
    case 'moyen': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'faible': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case 'critique': return <XCircle className="h-4 w-4 text-red-500" />;
    default: return null;
  }
};

const getPriorityBadge = (priority: string) => {
  const colors: Record<string, string> = {
    haute: 'bg-red-500/10 text-red-500 border-red-500/20',
    moyenne: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    basse: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  };
  return colors[priority] || colors.basse;
};

const AuditResultsCard: React.FC<{ audit: AuditData }> = ({ audit }) => (
  <div className="space-y-4">
    {/* Overall Score */}
    <Card className="overflow-hidden">
      <div className="relative">
        <div className={`absolute inset-0 opacity-10 ${getScoreBg(audit.overall_score)}`} />
        <CardContent className="pt-6 relative">
          <div className="flex items-center gap-6">
            <div className="relative">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
                <circle cx="60" cy="60" r="52" fill="none" strokeWidth="8" strokeDasharray={`${audit.overall_score * 3.27} 327`} strokeLinecap="round" className={getScoreColor(audit.overall_score)} stroke="currentColor" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-3xl font-black ${getScoreColor(audit.overall_score)}`}>{audit.overall_score}</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-1">Score Global</h3>
              <p className="text-muted-foreground">{audit.overall_verdict}</p>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>

    {/* Criteria Grid */}
    <div className="grid gap-3 md:grid-cols-2">
      {audit.criteria.map((criterion, i) => (
        <Card key={i} className="hover:border-primary/30 transition-colors">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(criterion.status)}
                <span className="font-semibold text-foreground text-sm">{criterion.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-xs ${getPriorityBadge(criterion.priority)}`}>
                  {criterion.priority}
                </Badge>
                <span className={`text-lg font-black ${getScoreColor(criterion.score)}`}>{criterion.score}</span>
              </div>
            </div>
            <div className="w-full h-2 rounded-full bg-muted/30 mb-2">
              <div className={`h-2 rounded-full transition-all ${getScoreBg(criterion.score)}`} style={{ width: `${criterion.score}%` }} />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{criterion.recommendation}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Quick Wins */}
    {audit.quick_wins.length > 0 && (
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Actions Rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {audit.quick_wins.map((win, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-amber-500 font-bold mt-0.5">→</span>
                {win}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    )}
  </div>
);

  <div className="p-3 rounded-lg border bg-card">
    <div className="flex items-center gap-2 mb-1">
      <Icon className={`h-4 w-4 ${color}`} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
    <p className="text-lg font-bold text-foreground">{value}</p>
  </div>
);

const StudioKdpTab: React.FC<{ marketplace: string; onNavigateAsin: (asin: string) => void }> = ({ marketplace, onNavigateAsin }) => {
  const tools = [
    { 
      icon: BookOpen, title: 'Calculateur de Royalties', 
      description: 'Estimez vos gains KDP selon le prix, les pages et le format',
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30'
    },
    { 
      icon: Target, title: 'Score de Compétitivité', 
      description: 'Évaluez vos chances face aux concurrents dans une niche',
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
    },
    { 
      icon: TrendingUp, title: 'Tendances Saisonnières', 
      description: 'Identifiez les meilleurs moments pour publier',
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30'
    },
    { 
      icon: DollarSign, title: 'Stratégie de Prix', 
      description: 'Trouvez le prix optimal pour maximiser vos revenus',
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30'
    },
  ];

  const [royaltyPrice, setRoyaltyPrice] = useState('');
  const [royaltyPages, setRoyaltyPages] = useState('');
  const [royaltyFormat, setRoyaltyFormat] = useState('ebook');

  const calculateRoyalty = () => {
    const price = parseFloat(royaltyPrice);
    if (!price || price <= 0) return null;

    if (royaltyFormat === 'ebook') {
      // 70% royalty for prices 2.99-9.99, 35% otherwise
      const rate = price >= 2.99 && price <= 9.99 ? 0.70 : 0.35;
      const deliveryCost = price >= 2.99 && price <= 9.99 ? 0.15 : 0;
      const royalty = (price - deliveryCost) * rate;
      return { royalty: Math.max(0, royalty), rate: rate * 100, format: 'Kindle' };
    } else {
      const pages = parseInt(royaltyPages) || 200;
      const printCost = 0.85 + (pages * 0.012); // Approximate
      const royalty = (price * 0.6) - printCost;
      return { royalty: Math.max(0, royalty), rate: 60, format: 'Broché', printCost };
    }
  };

  const royalty = calculateRoyalty();

  return (
    <div className="space-y-6">
      {/* Calculateur de Royalties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Calculateur de Royalties KDP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Format</label>
              <Select value={royaltyFormat} onValueChange={setRoyaltyFormat}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ebook">📱 Kindle (eBook)</SelectItem>
                  <SelectItem value="paperback">📖 Broché</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Prix (€)</label>
              <Input type="number" step="0.01" value={royaltyPrice} onChange={e => setRoyaltyPrice(e.target.value)} placeholder="9.99" />
            </div>
            {royaltyFormat === 'paperback' && (
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Pages</label>
                <Input type="number" value={royaltyPages} onChange={e => setRoyaltyPages(e.target.value)} placeholder="200" />
              </div>
            )}
            {royalty && (
              <div className="flex flex-col justify-end">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-xs text-muted-foreground">Royalty par vente</p>
                  <p className="text-2xl font-bold text-primary">{royalty.royalty.toFixed(2)}€</p>
                  <p className="text-xs text-muted-foreground">Taux: {royalty.rate}%</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Tools Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {tools.map((tool, i) => (
          <Card key={i} className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-lg ${tool.color}`}>
                  <tool.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default KdpAmazonResearch;
