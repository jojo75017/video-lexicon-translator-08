import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Radar, TrendingUp, CalendarClock, Lightbulb, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

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

const trendColor: Record<string, string> = {
  'émergent': '#10B981',
  'en hausse': '#38bdf8',
  'stable': '#FF9E2D',
  'en déclin': '#E94E77',
};

const demandColor: Record<string, string> = {
  faible: '#E94E77',
  moyen: '#FF9E2D',
  fort: '#10B981',
};

const VigieTrends: React.FC = () => {
  const [niche, setNiche] = useState('');
  const [market, setMarket] = useState('Amazon.fr');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<VigieInsights | null>(null);

  const run = async () => {
    if (niche.trim().length < 2) {
      toast.error('Précise une niche à analyser.');
      return;
    }
    setLoading(true);
    setInsights(null);
    try {
      const { data, error } = await supabase.functions.invoke('vigie-trends', {
        body: { niche: niche.trim(), market },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setInsights(data.insights as VigieInsights);
    } catch (e: any) {
      toast.error(e?.message || "Échec de l'analyse VIGIE.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Niche à scruter (ex. développement personnel, romance contemporaine…)"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && run()}
        />
        <Input
          className="sm:w-36"
          value={market}
          onChange={(e) => setMarket(e.target.value)}
          placeholder="Marché"
        />
        <Button onClick={run} disabled={loading} style={{ background: '#38bdf8', color: 'white' }}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Radar className="h-4 w-4" />}
          <span className="ml-1.5">Scanner</span>
        </Button>
      </div>

      {loading && (
        <p className="text-sm text-joy-ink/60">VIGIE scrute les tendances de « {niche} »…</p>
      )}

      {insights && (
        <div className="space-y-4 text-sm">
          <div className="rounded-xl border p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-semibold">Dynamique de la niche</span>
              <Badge style={{ background: '#38bdf8', color: 'white' }}>
                <TrendingUp className="mr-1 h-3 w-3" /> Momentum {insights.momentum_score}/100
              </Badge>
            </div>
            <p className="text-joy-ink/70">{insights.niche_summary}</p>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-1.5 font-semibold">
              <Radar className="h-4 w-4" /> Sujets émergents
            </p>
            <div className="space-y-2">
              {insights.emerging_topics.map((t, i) => (
                <div key={i} className="rounded-lg border p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{t.topic}</span>
                    <span
                      className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
                      style={{ background: `${trendColor[t.trend]}22`, color: trendColor[t.trend] }}
                    >
                      {t.trend}
                    </span>
                  </div>
                  <p className="text-joy-ink/70">{t.rationale}</p>
                  <p className="text-joy-ink/50">📖 Angle : {t.book_angle}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-1.5 font-semibold">
              <CalendarClock className="h-4 w-4" /> Saisonnalité
            </p>
            <div className="space-y-2">
              {insights.seasonality.map((s, i) => (
                <div key={i} className="rounded-lg border p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{s.period}</span>
                    <span
                      className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
                      style={{ background: `${demandColor[s.demand]}22`, color: demandColor[s.demand] }}
                    >
                      Demande {s.demand}
                    </span>
                  </div>
                  <p className="text-joy-ink/70">{s.tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 flex items-center gap-1.5 font-semibold">
              <Lightbulb className="h-4 w-4" /> Prochain livre à écrire
            </p>
            <ol className="list-decimal space-y-1 pl-5 text-joy-ink/70">
              {insights.next_book_recommendations.map((r, i) => <li key={i}>{r}</li>)}
            </ol>
          </div>

          <div>
            <p className="mb-1.5 flex items-center gap-1.5 font-semibold">
              <AlertTriangle className="h-4 w-4" /> À surveiller
            </p>
            <ul className="list-disc space-y-1 pl-5 text-joy-ink/70">
              {insights.watch_outs.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default VigieTrends;
