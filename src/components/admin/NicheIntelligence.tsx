import React, { useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Loader2, Search, Sparkles, Eye, TrendingUp, Lightbulb, Target,
  KeyRound, ListChecks, Radar, CalendarClock, AlertTriangle, ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { niches600, niches600Categories } from '@/data/niches600';

// ---------- Types SCOUT ----------
interface Competitor {
  title: string;
  positioning: string;
  estimated_strength: 'faible' | 'moyen' | 'fort';
  weakness: string;
}
interface ScoutInsights {
  niche_summary: string;
  saturation_level: 'faible' | 'moyen' | 'élevé';
  opportunity_score: number;
  top_competitors: Competitor[];
  differentiation_angles: string[];
  recommended_keywords: string[];
  suggested_subtitle: string;
  action_plan: string[];
}

// ---------- Types VIGIE ----------
interface EmergingTopic {
  topic: string;
  trend: 'émergent' | 'en hausse' | 'stable' | 'en déclin';
  rationale: string;
  book_angle: string;
}
interface Seasonality {
  period: string;
  demand: 'faible' | 'moyen' | 'fort';
  tip: string;
}
interface VigieInsights {
  niche_summary: string;
  momentum_score: number;
  emerging_topics: EmergingTopic[];
  seasonality: Seasonality[];
  next_book_recommendations: string[];
  watch_outs: string[];
}

const strengthColor: Record<string, string> = { faible: '#10B981', moyen: '#FF9E2D', fort: '#E94E77' };
const trendColor: Record<string, string> = {
  'émergent': '#10B981', 'en hausse': '#008296', 'stable': '#FF9E2D', 'en déclin': '#E94E77',
};
const demandColor: Record<string, string> = { faible: '#E94E77', moyen: '#FF9E2D', fort: '#10B981' };
const potentielColor = (p: number) =>
  p >= 5 ? '#10B981' : p >= 4 ? '#008296' : p >= 3 ? '#FF9E2D' : '#E94E77';

const NicheIntelligence: React.FC = () => {
  const [tab, setTab] = useState('decouverte');

  // ----- Découverte (SCOUT) -----
  const [query, setQuery] = useState('');
  const [scoutLoading, setScoutLoading] = useState(false);
  const [scout, setScout] = useState<ScoutInsights | null>(null);

  const runScout = async (q?: string) => {
    const niche = (q ?? query).trim();
    if (niche.length < 2) {
      toast.error('Saisissez un sujet, un mot-clé ou un public.');
      return;
    }
    setScoutLoading(true);
    setScout(null);
    try {
      const { data, error } = await supabase.functions.invoke('scout-analysis', {
        body: { niche, market: 'Amazon.fr' },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setScout(data.insights as ScoutInsights);
    } catch (e: any) {
      toast.error(e?.message || "Échec de la découverte de niches.");
    } finally {
      setScoutLoading(false);
    }
  };

  // ----- Prédicteur (VIGIE) -----
  const [trendQuery, setTrendQuery] = useState('');
  const [vigieLoading, setVigieLoading] = useState(false);
  const [vigie, setVigie] = useState<VigieInsights | null>(null);

  const runVigie = async () => {
    const niche = trendQuery.trim();
    if (niche.length < 2) {
      toast.error('Précise une niche à scruter.');
      return;
    }
    setVigieLoading(true);
    setVigie(null);
    try {
      const { data, error } = await supabase.functions.invoke('vigie-trends', {
        body: { niche, market: 'Amazon.fr' },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setVigie(data.insights as VigieInsights);
    } catch (e: any) {
      toast.error(e?.message || "Échec de la prédiction de tendances.");
    } finally {
      setVigieLoading(false);
    }
  };

  // ----- Niches cachées (déterministe) -----
  const hidden = useMemo(
    () =>
      niches600
        .filter((n) => n.concurrence === 'Faible')
        .sort((a, b) => b.potentiel - a.potentiel)
        .slice(0, 24),
    [],
  );

  // ----- 100+ idées par catégorie -----
  const grouped = useMemo(
    () =>
      niches600Categories.map((cat) => ({
        ...cat,
        items: niches600.filter((n) => n.category === cat.key),
      })),
    [],
  );

  const exploreNiche = (niche: string) => {
    setQuery(niche);
    setTab('decouverte');
    runScout(niche);
  };

  return (
    <div className="border-t pt-3">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-joy-cream/50">
          <TabsTrigger value="decouverte"><Sparkles className="mr-1.5 h-4 w-4" /> Découverte intelligente</TabsTrigger>
          <TabsTrigger value="cachees"><Eye className="mr-1.5 h-4 w-4" /> Niches cachées</TabsTrigger>
          <TabsTrigger value="predicteur"><TrendingUp className="mr-1.5 h-4 w-4" /> Prédicteur de tendances</TabsTrigger>
          <TabsTrigger value="idees"><Lightbulb className="mr-1.5 h-4 w-4" /> Plus de 100 idées</TabsTrigger>
        </TabsList>

        {/* ---------- DÉCOUVERTE INTELLIGENTE ---------- */}
        <TabsContent value="decouverte" className="mt-4 space-y-4">
          <div className="rounded-xl border p-4">
            <h3 className="text-lg font-bold">Intelligence de niche alimentée par l'IA</h3>
            <p className="mb-3 text-sm text-joy-ink/60">
              Découvrez des niches littéraires rentables grâce à l'analyse de marché basée sur l'IA.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                placeholder="Saisissez un sujet, un mot-clé ou un public (ex. « perte de poids pour les mamans », « productivité »)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !scoutLoading && runScout()}
              />
              <Button onClick={() => runScout()} disabled={scoutLoading} style={{ background: '#008296', color: 'white' }}>
                {scoutLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span className="ml-1.5">Découvrez des niches</span>
              </Button>
            </div>
            <p className="mt-2 text-xs text-joy-ink/40">
              Suggestions de niche générées par une IA. Validez chaque fiche auprès d'Amazon et de Google Trends.
            </p>
          </div>

          {scoutLoading && <p className="text-sm text-joy-ink/60">SCOUT scanne le marché « {query} »…</p>}

          {scout && (
            <div className="space-y-4 text-sm">
              <div className="rounded-xl border p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-semibold">Synthèse marché</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Saturation : {scout.saturation_level}</Badge>
                    <Badge style={{ background: '#008296', color: 'white' }}>
                      <TrendingUp className="mr-1 h-3 w-3" /> {scout.opportunity_score}/100
                    </Badge>
                  </div>
                </div>
                <p className="text-joy-ink/70">{scout.niche_summary}</p>
                {scout.suggested_subtitle && (
                  <p className="mt-2 text-joy-ink/60"><strong>Sous-titre suggéré :</strong> {scout.suggested_subtitle}</p>
                )}
              </div>

              <div>
                <p className="mb-2 flex items-center gap-1.5 font-semibold"><Target className="h-4 w-4" /> Concurrents identifiés</p>
                <div className="space-y-2">
                  {scout.top_competitors?.map((c, i) => (
                    <div key={i} className="rounded-lg border p-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{c.title}</span>
                        <span className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
                          style={{ background: `${strengthColor[c.estimated_strength]}22`, color: strengthColor[c.estimated_strength] }}>
                          {c.estimated_strength}
                        </span>
                      </div>
                      <p className="text-joy-ink/70">{c.positioning}</p>
                      <p className="text-joy-ink/50">⚠️ Faiblesse : {c.weakness}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-1.5 flex items-center gap-1.5 font-semibold"><Lightbulb className="h-4 w-4" /> Angles de différenciation</p>
                <ul className="list-disc space-y-1 pl-5 text-joy-ink/70">
                  {scout.differentiation_angles?.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>

              <div>
                <p className="mb-1.5 flex items-center gap-1.5 font-semibold"><KeyRound className="h-4 w-4" /> Mots-clés à cibler</p>
                <div className="flex flex-wrap gap-1.5">
                  {scout.recommended_keywords?.map((k, i) => <Badge key={i} variant="outline">{k}</Badge>)}
                </div>
              </div>

              <div>
                <p className="mb-1.5 flex items-center gap-1.5 font-semibold"><ListChecks className="h-4 w-4" /> Plan d'action</p>
                <ol className="list-decimal space-y-1 pl-5 text-joy-ink/70">
                  {scout.action_plan?.map((a, i) => <li key={i}>{a}</li>)}
                </ol>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ---------- NICHES CACHÉES ---------- */}
        <TabsContent value="cachees" className="mt-4 space-y-3">
          <div className="rounded-xl border p-4">
            <h3 className="text-lg font-bold">Niches cachées à faible concurrence</h3>
            <p className="text-sm text-joy-ink/60">
              Des niches à <strong>faible concurrence</strong> et <strong>fort potentiel</strong> — idéales pour percer vite.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {hidden.map((n) => (
              <button key={n.id} onClick={() => exploreNiche(n.niche)}
                className="group rounded-lg border p-3 text-left transition-colors hover:bg-joy-cream/40 hover:ring-1"
                style={{ ['--tw-ring-color' as any]: '#00829666' }}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-lg">{n.emoji}</span>
                  <span className="rounded px-1.5 py-0.5 text-[10px] font-bold"
                    style={{ background: `${potentielColor(n.potentiel)}22`, color: potentielColor(n.potentiel) }}>
                    Potentiel {n.potentiel}/5
                  </span>
                </div>
                <p className="font-semibold leading-tight">{n.niche}</p>
                <p className="text-xs text-joy-ink/50">{n.sousNiche} · {n.motCleAmazon}</p>
                <span className="mt-1.5 flex items-center text-xs opacity-0 transition-opacity group-hover:opacity-100" style={{ color: '#008296' }}>
                  Analyser <ChevronRight className="h-3 w-3" />
                </span>
              </button>
            ))}
          </div>
        </TabsContent>

        {/* ---------- PRÉDICTEUR DE TENDANCES ---------- */}
        <TabsContent value="predicteur" className="mt-4 space-y-4">
          <div className="rounded-xl border p-4">
            <div className="mb-3 flex flex-col gap-1">
              <h3 className="flex items-center gap-2 text-lg font-bold"><Radar className="h-5 w-5" /> Prédicteur de tendances</h3>
              <p className="text-sm text-joy-ink/60">Les niches en vogue actuellement — publiez avant l'arrivée des foules.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                placeholder="Niche à scruter (ex. développement personnel, romance contemporaine…)"
                value={trendQuery}
                onChange={(e) => setTrendQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !vigieLoading && runVigie()}
              />
              <Button onClick={runVigie} disabled={vigieLoading} style={{ background: '#FF9E2D', color: 'white' }}>
                {vigieLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-4 w-4" />}
                <span className="ml-1.5">Prédire les niches émergentes</span>
              </Button>
            </div>
          </div>

          {vigieLoading && <p className="text-sm text-joy-ink/60">VIGIE scrute la niche « {trendQuery} »…</p>}

          {vigie && (
            <div className="space-y-4 text-sm">
              <div className="rounded-xl border p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-semibold">Momentum de la niche</span>
                  <Badge style={{ background: '#FF9E2D', color: 'white' }}>
                    <TrendingUp className="mr-1 h-3 w-3" /> {vigie.momentum_score}/100
                  </Badge>
                </div>
                <p className="text-joy-ink/70">{vigie.niche_summary}</p>
              </div>

              <div>
                <p className="mb-2 flex items-center gap-1.5 font-semibold"><Sparkles className="h-4 w-4" /> Sujets émergents</p>
                <div className="space-y-2">
                  {vigie.emerging_topics?.map((t, i) => (
                    <div key={i} className="rounded-lg border p-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{t.topic}</span>
                        <span className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
                          style={{ background: `${trendColor[t.trend]}22`, color: trendColor[t.trend] }}>{t.trend}</span>
                      </div>
                      <p className="text-joy-ink/70">{t.rationale}</p>
                      <p className="text-joy-ink/50">📖 Angle livre : {t.book_angle}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 flex items-center gap-1.5 font-semibold"><CalendarClock className="h-4 w-4" /> Saisonnalité</p>
                <div className="space-y-2">
                  {vigie.seasonality?.map((s, i) => (
                    <div key={i} className="flex items-start justify-between gap-2 rounded-lg border p-2.5">
                      <div>
                        <span className="font-medium">{s.period}</span>
                        <p className="text-joy-ink/60">{s.tip}</p>
                      </div>
                      <span className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
                        style={{ background: `${demandColor[s.demand]}22`, color: demandColor[s.demand] }}>{s.demand}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-1.5 flex items-center gap-1.5 font-semibold"><Lightbulb className="h-4 w-4" /> Prochains livres recommandés</p>
                <ul className="list-disc space-y-1 pl-5 text-joy-ink/70">
                  {vigie.next_book_recommendations?.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>

              <div>
                <p className="mb-1.5 flex items-center gap-1.5 font-semibold"><AlertTriangle className="h-4 w-4" /> Points de vigilance</p>
                <ul className="list-disc space-y-1 pl-5 text-joy-ink/70">
                  {vigie.watch_outs?.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ---------- PLUS DE 100 IDÉES ---------- */}
        <TabsContent value="idees" className="mt-4 space-y-6">
          <div className="rounded-xl border p-4">
            <h3 className="text-lg font-bold">Plus de 100 idées de niches préchargées</h3>
            <p className="text-sm text-joy-ink/60">
              Parcourez les catégories. Cliquez sur une carte pour lancer instantanément l'analyse de la niche.
            </p>
          </div>
          {grouped.map((cat) => (
            <div key={cat.key}>
              <h4 className="mb-3 flex items-center gap-2 border-b pb-1 text-base font-bold">
                <span>{cat.emoji}</span> {cat.label.replace(/^[^\s]+\s/, '')}
                <span className="text-xs font-normal text-joy-ink/40">{cat.items.length} idées</span>
              </h4>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cat.items.map((n) => (
                  <button key={n.id} onClick={() => exploreNiche(n.niche)}
                    className="group rounded-lg border p-3 text-left transition-colors hover:bg-joy-cream/40 hover:ring-1"
                    style={{ ['--tw-ring-color' as any]: '#00829666' }}>
                    <p className="font-semibold leading-tight">{n.niche}</p>
                    <p className="text-xs text-joy-ink/50">{n.motCleAmazon}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NicheIntelligence;
