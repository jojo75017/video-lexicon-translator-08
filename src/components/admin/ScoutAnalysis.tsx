import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Target, TrendingUp, Lightbulb, KeyRound, ListChecks, Plus, X } from 'lucide-react';
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

interface NicheTab {
  id: string;
  niche: string;
  market: string;
  loading: boolean;
  insights: ScoutInsights | null;
}

const strengthColor: Record<string, string> = {
  faible: '#10B981',
  moyen: '#FF9E2D',
  fort: '#E94E77',
};

const newTab = (): NicheTab => ({
  id: crypto.randomUUID(),
  niche: '',
  market: 'Amazon.fr',
  loading: false,
  insights: null,
});

const ScoutAnalysis: React.FC = () => {
  const [tabs, setTabs] = useState<NicheTab[]>([newTab()]);
  const [activeId, setActiveId] = useState<string>(tabs[0].id);

  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  const patch = (id: string, p: Partial<NicheTab>) =>
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, ...p } : t)));

  const addTab = () => {
    const t = newTab();
    setTabs((prev) => [...prev, t]);
    setActiveId(t.id);
  };

  const closeTab = (id: string) => {
    setTabs((prev) => {
      const next = prev.filter((t) => t.id !== id);
      const safe = next.length ? next : [newTab()];
      if (id === activeId) setActiveId(safe[0].id);
      return safe;
    });
  };

  const run = async (tab: NicheTab) => {
    if (tab.niche.trim().length < 2) {
      toast.error('Précise une niche à analyser.');
      return;
    }
    patch(tab.id, { loading: true, insights: null });
    try {
      const { data, error } = await supabase.functions.invoke('scout-analysis', {
        body: { niche: tab.niche.trim(), market: tab.market },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      patch(tab.id, { insights: data.insights as ScoutInsights });
    } catch (e: any) {
      toast.error(e?.message || "Échec de l'analyse SCOUT.");
    } finally {
      patch(tab.id, { loading: false });
    }
  };

  return (
    <div className="space-y-4">
      {/* Onglets de niches */}
      <div className="flex flex-wrap items-center gap-1.5 border-b pb-2">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setActiveId(t.id)}
            className="group flex items-center gap-1.5 rounded-t-lg border px-3 py-1.5 text-sm transition-colors"
            style={
              t.id === activeId
                ? { background: '#4f46e5', color: 'white', borderColor: '#4f46e5' }
                : { background: 'transparent' }
            }
          >
            {t.loading && <Loader2 className="h-3 w-3 animate-spin" />}
            <span className="max-w-[140px] truncate">{t.niche.trim() || `Niche ${i + 1}`}</span>
            {tabs.length > 1 && (
              <X
                className="h-3 w-3 opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(t.id);
                }}
              />
            )}
          </button>
        ))}
        <Button variant="ghost" size="sm" onClick={addTab} className="h-8">
          <Plus className="h-4 w-4" /> Niche
        </Button>
      </div>

      {/* Formulaire de l'onglet actif */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Niche à analyser (ex. développement personnel, cuisine cétogène…)"
          value={active.niche}
          onChange={(e) => patch(active.id, { niche: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && !active.loading && run(active)}
        />
        <Input
          className="sm:w-36"
          value={active.market}
          onChange={(e) => patch(active.id, { market: e.target.value })}
          placeholder="Marché"
        />
        <Button onClick={() => run(active)} disabled={active.loading} style={{ background: '#4f46e5', color: 'white' }}>
          {active.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          <span className="ml-1.5">Analyser</span>
        </Button>
      </div>

      {active.loading && (
        <p className="text-sm text-joy-ink/60">SCOUT scanne le marché « {active.niche} »…</p>
      )}

      {active.insights && (
        <div className="space-y-4 text-sm">
          <div className="rounded-xl border p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-semibold">Synthèse marché</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Saturation : {active.insights.saturation_level}</Badge>
                <Badge style={{ background: '#4f46e5', color: 'white' }}>
                  <TrendingUp className="mr-1 h-3 w-3" /> {active.insights.opportunity_score}/100
                </Badge>
              </div>
            </div>
            <p className="text-joy-ink/70">{active.insights.niche_summary}</p>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-1.5 font-semibold">
              <Target className="h-4 w-4" /> Concurrents identifiés
            </p>
            <div className="space-y-2">
              {active.insights.top_competitors.map((c, i) => (
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
              {active.insights.differentiation_angles.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>

          <div>
            <p className="mb-1.5 flex items-center gap-1.5 font-semibold">
              <KeyRound className="h-4 w-4" /> Mots-clés à cibler
            </p>
            <div className="flex flex-wrap gap-1.5">
              {active.insights.recommended_keywords.map((k, i) => (
                <Badge key={i} variant="secondary">{k}</Badge>
              ))}
            </div>
          </div>

          <div className="rounded-xl border p-3">
            <span className="font-semibold">Sous-titre suggéré</span>
            <p className="italic text-joy-ink/70">« {active.insights.suggested_subtitle} »</p>
          </div>

          <div>
            <p className="mb-1.5 flex items-center gap-1.5 font-semibold">
              <ListChecks className="h-4 w-4" /> Plan d'action
            </p>
            <ol className="list-decimal space-y-1 pl-5 text-joy-ink/70">
              {active.insights.action_plan.map((a, i) => <li key={i}>{a}</li>)}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoutAnalysis;
