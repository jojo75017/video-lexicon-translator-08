import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Search, Star, MessageSquare, Crown, ExternalLink, Loader2, Target,
  TrendingUp, AlertTriangle, ShieldCheck, BarChart3, Tag, Key,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { FirecrawlNoticeBanner } from './FirecrawlNoticeBanner';
import { FirecrawlCreditsIndicator } from './FirecrawlCreditsIndicator';
import { KdpPilotAccuracyBanner } from './KdpPilotAccuracyBanner';
import { ScrapedMetricWarning } from './ScrapedMetricWarning';

interface SpyBook {
  title: string;
  author?: string;
  price?: number | null;
  rating?: number | null;
  reviews?: number | null;
  bestSeller?: boolean;
  format?: string;
  position: number;
}

interface SpyAnalysis {
  resultsCount: number;
  avgPrice: number;
  avgReviews: number;
  avgRating: number;
  lowReviewCount: number;
  opportunity: number;
  competitionScore: number;
  verdict: string;
}

interface SpyResult {
  keyword: string;
  marketplace: string;
  searchUrl: string;
  books: SpyBook[];
  analysis: SpyAnalysis;
}

interface AmazonSpyTabProps {
  initialKeyword?: string;
}

const opportunityColor = (score: number) =>
  score >= 70 ? 'text-emerald-600' : score >= 50 ? 'text-orange-500' : 'text-red-500';

// Mots vides à ignorer lors de l'extraction de mots-clés depuis les titres concurrents.
const STOPWORDS = new Set([
  'le','la','les','un','une','des','de','du','et','ou','à','a','au','aux','en','dans','sur','pour','par','avec','sans',
  'ce','cette','ces','son','sa','ses','leur','leurs','mon','ma','mes','votre','vos','nos','notre','qui','que','quoi',
  'the','a','an','of','and','or','to','in','on','for','with','your','you','how','is','it','book','livre','tome','vol',
  'guide','édition','edition','ebook','kindle','broché','broche','format','pdf','volume',
]);

/** Extrait les mots-clés récurrents dans les titres des concurrents (point positif #1). */
function extractTitleKeywords(books: SpyBook[]): { word: string; count: number }[] {
  const freq = new Map<string, number>();
  for (const b of books) {
    const seen = new Set<string>();
    const words = (b.title || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 4 && !STOPWORDS.has(w) && !/^\d+$/.test(w));
    for (const w of words) {
      if (seen.has(w)) continue; // 1 occurrence max par titre
      seen.add(w);
      freq.set(w, (freq.get(w) || 0) + 1);
    }
  }
  return [...freq.entries()]
    .map(([word, count]) => ({ word, count }))
    .filter((k) => k.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);
}

const AmazonSpyTab: React.FC<AmazonSpyTabProps> = ({ initialKeyword = '' }) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [marketplace, setMarketplace] = useState('fr');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SpyResult | null>(null);

  const runSpy = async () => {
    if (!keyword.trim()) {
      toast.error('Entrez un mot-clé ou une niche à espionner');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('amazon-spy', {
        body: { keyword: keyword.trim(), marketplace },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (!data?.books?.length) {
        toast.warning('Aucun livre trouvé pour ce mot-clé sur Amazon.');
      } else {
        toast.success(`${data.books.length} livres analysés sur Amazon`);
      }
      setResult(data as SpyResult);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec de l'analyse Amazon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <FirecrawlNoticeBanner />
      <KdpPilotAccuracyBanner />
      <FirecrawlCreditsIndicator />
      <Card className="border-2 border-amber-300/60 bg-gradient-to-br from-amber-50/60 to-orange-50/40 dark:from-amber-950/20 dark:to-orange-950/10">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Espion Amazon — analyse de niche réelle</h3>
              <p className="text-xs text-muted-foreground">
                Scanne les vrais résultats Amazon (prix, avis, best-sellers) et calcule le score d'opportunité.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runSpy()}
              placeholder="Niche ou mot-clé (ex: méditation pleine conscience)"
              className="flex-1"
            />
            <Select value={marketplace} onValueChange={setMarketplace}>
              <SelectTrigger className="w-full sm:w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Amazon.fr</SelectItem>
                <SelectItem value="com">Amazon.com</SelectItem>
                <SelectItem value="co.uk">Amazon.co.uk</SelectItem>
                <SelectItem value="de">Amazon.de</SelectItem>
                <SelectItem value="es">Amazon.es</SelectItem>
                <SelectItem value="it">Amazon.it</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={runSpy} disabled={loading} className="bg-amber-600 hover:bg-amber-700">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Search className="w-4 h-4 mr-1" />}
              Espionner
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <p className="text-sm">Scan des résultats Amazon en cours…</p>
        </div>
      )}

      {result && !loading && (
        <>
          {/* ⭐ POINT POSITIF #1 — mots-clés récurrents dans les titres concurrents */}
          {(() => {
            const titleKeywords = extractTitleKeywords(result.books);
            if (!titleKeywords.length) return null;
            const max = titleKeywords[0].count;
            return (
              <Card className="border-2 border-emerald-400/70 bg-gradient-to-br from-emerald-50/80 to-teal-50/50 dark:from-emerald-950/25 dark:to-teal-950/10 shadow-sm">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shrink-0">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                        Mots-clés gagnants dans les titres concurrents
                        <Badge className="bg-emerald-600 text-white text-[9px] py-0">POINT FORT</Badge>
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        Réutilisez ces mots dans VOTRE titre pour être trouvé sur la même requête.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {titleKeywords.map((k) => (
                      <span
                        key={k.word}
                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-white/80 dark:bg-emerald-950/30 px-3 py-1 text-xs font-medium"
                        title={`Présent dans ${k.count} titres sur ${result.books.length}`}
                      >
                        <span className="capitalize">{k.word}</span>
                        <span
                          className="rounded-full bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5"
                          style={{ opacity: 0.55 + 0.45 * (k.count / max) }}
                        >
                          ×{k.count}
                        </span>
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })()}

          {/* Synthèse */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <div className={`text-3xl font-extrabold ${opportunityColor(result.analysis.opportunity)}`}>
                  {result.analysis.opportunity}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">Score opportunité /100</p>
                <Progress value={result.analysis.opportunity} className="h-1.5 mt-1" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <Tag className="w-4 h-4 mx-auto text-orange-500 mb-1" />
                <div className="text-xl font-bold">{result.analysis.avgPrice || '—'} €</div>
                <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                  Prix moyen <ScrapedMetricWarning size={11} />
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <MessageSquare className="w-4 h-4 mx-auto text-purple-500 mb-1" />
                <div className="text-xl font-bold">{result.analysis.avgReviews}</div>
                <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                  Avis moyens <ScrapedMetricWarning size={11} />
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <Star className="w-4 h-4 mx-auto text-amber-500 mb-1" />
                <div className="text-xl font-bold">{result.analysis.avgRating || '—'}</div>
                <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                  Note moyenne /5 <ScrapedMetricWarning size={11} />
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className={
            result.analysis.opportunity >= 50
              ? 'border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/10'
              : 'border-orange-300 bg-orange-50/50 dark:bg-orange-950/10'
          }>
            <CardContent className="p-3 flex items-center gap-3">
              {result.analysis.opportunity >= 50
                ? <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                : <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />}
              <div className="flex-1">
                <p className="font-semibold text-sm">{result.analysis.verdict}</p>
                <p className="text-xs text-muted-foreground">
                  {result.analysis.lowReviewCount} livre(s) avec moins de 50 avis sur {result.analysis.resultsCount} —
                  {result.analysis.lowReviewCount >= 3
                    ? ' des places sont à prendre en première page.'
                    : ' la première page est tenue par des titres établis.'}
                </p>
              </div>
              <a href={result.searchUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm"><ExternalLink className="w-3.5 h-3.5 mr-1" /> Voir sur Amazon</Button>
              </a>
            </CardContent>
          </Card>

          {/* Liste des livres */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <BarChart3 className="w-4 h-4" /> Top {result.books.length} de la première page
            </div>
            {result.books.map((book, idx) => (
              <motion.div
                key={`${book.position}-${idx}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-3 flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-6 text-center shrink-0">#{book.position}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm leading-snug line-clamp-2">{book.title}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-[11px] text-muted-foreground">
                        {book.author && <span>{book.author}</span>}
                        {book.format && <Badge variant="secondary" className="text-[10px] py-0">{book.format}</Badge>}
                        {book.bestSeller && (
                          <Badge className="bg-amber-500 text-white text-[10px] py-0 gap-0.5">
                            <Crown className="w-2.5 h-2.5" /> Best Seller
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0 space-y-0.5">
                      {typeof book.price === 'number' && (
                        <div className="font-bold text-sm text-orange-600 flex items-center justify-end gap-1">
                          {book.price} € <ScrapedMetricWarning size={10} />
                        </div>
                      )}
                      <div className="flex items-center justify-end gap-2 text-[11px] text-muted-foreground">
                        {typeof book.rating === 'number' && (
                          <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{book.rating} <ScrapedMetricWarning size={10} /></span>
                        )}
                        {typeof book.reviews === 'number' && (
                          <span className="flex items-center gap-0.5"><MessageSquare className="w-3 h-3" />{book.reviews} <ScrapedMetricWarning size={10} /></span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {!result && !loading && (
        <div className="text-center py-10 text-muted-foreground">
          <TrendingUp className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Lancez une analyse pour découvrir la concurrence réelle d'une niche sur Amazon.</p>
        </div>
      )}
    </div>
  );
};

export default AmazonSpyTab;
