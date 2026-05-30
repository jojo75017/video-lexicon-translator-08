import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Target, TrendingUp, Lightbulb, KeyRound, ListChecks } from 'lucide-react';
import { toast } from 'sonner';

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

const strengthColor: Record<string, string> = {
  faible: '#10B981',
  moyen: '#FF9E2D',
  fort: '#E94E77',
};

const ScoutAnalysis: React.FC = () => {
  const [niche, setNiche] = useState('');
  const [market, setMarket] = useState('Amazon.fr');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<ScoutInsights | null>(null);

  const run = async () => {
    if (niche.trim().length < 2) {
      toast.error('Précise une niche à analyser.');
      return;
    }
    setLoading(true);
    setInsights(null);
    try {
      const { data, error } = await supabase.functions.invoke('scout-analysis', {
        body: { niche: niche.trim(), market },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setInsights(data.insights as ScoutInsights);
    } catch (e: any) {
      toast.error(e?.message || "Échec de l'analyse SCOUT.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Niche à analyser (ex. développement personnel, cuisine cétogène…)"
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
        <Button onClick={run} disabled={loading} style={{ background: '#4f46e5', color: 'white' }}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          <span className="ml-1.5">Analyser</span>
        </Button>
      </div>

      {loading && (
        <p className="text-sm text-joy-ink/60">SCOUT scanne le marché « {niche} »…</p>
      )}

      {insights && (
        <div className="space-y-4 text-sm">
          <div className="rounded-xl border p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-semibold">Synthèse marché</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Saturation : {insights.saturation_level}</Badge>
                <Badge style={{ background: '#4f46e5', color: 'white' }}>
                  <TrendingUp className="mr-1 h-3 w-3" /> {insights.opportunity_score}/100
                </Badge>
              </div>
            </div>
            <p className="text-joy-ink/70">{insights.niche_summary}</p>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-1.5 font-semibold">
              <Target className="h-4 w-4" /> Concurrents identifiés
            </p>
            <div className="space-y-2">
              {insights.top_competitors.map((c, i) => (
                <div key={i} className="rounded-lg border p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{c.title}</span>
                    <span
                      className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
                      style={{ background: `${strengthColor[c.estimated_strength]}22`, color: strengthColor[c.estimated_strength] }}
                    >
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
            <p className="mb-1.5 flex items-center gap-1.5 font-semibold">
              <Lightbulb className="h-4 w-4" /> Angles de différenciation
            </p>
            <ul className="list-disc space-y-1 pl-5 text-joy-ink/70">
              {insights.differentiation_angles.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>

          <div>
            <p className="mb-1.5 flex items-center gap-1.5 font-semibold">
              <KeyRound className="h-4 w-4" /> Mots-clés à cibler
            </p>
            <div className="flex flex-wrap gap-1.5">
              {insights.recommended_keywords.map((k, i) => (
                <Badge key={i} variant="secondary">{k}</Badge>
              ))}
            </div>
          </div>

          <div className="rounded-xl border p-3">
            <span className="font-semibold">Sous-titre suggéré</span>
            <p className="italic text-joy-ink/70">« {insights.suggested_subtitle} »</p>
          </div>

          <div>
            <p className="mb-1.5 flex items-center gap-1.5 font-semibold">
              <ListChecks className="h-4 w-4" /> Plan d'action
            </p>
            <ol className="list-decimal space-y-1 pl-5 text-joy-ink/70">
              {insights.action_plan.map((a, i) => <li key={i}>{a}</li>)}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoutAnalysis;
