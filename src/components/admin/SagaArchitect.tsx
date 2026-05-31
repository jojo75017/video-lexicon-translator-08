import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookCopy, Users, Sparkles, ListTree, Flag, Lightbulb, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface RecurringCharacter {
  name: string;
  role: string;
  arc: string;
}

interface Tome {
  number: number;
  title: string;
  premise: string;
  arc: string;
  key_events: string[];
  cliffhanger: string;
  themes: string[];
}

interface SagaPlan {
  series_title: string;
  series_pitch: string;
  overarching_arc: string;
  recurring_characters: RecurringCharacter[];
  tomes: Tome[];
  continuity_tips: string[];
}

interface SagaTab {
  id: string;
  premise: string;
  genre: string;
  tomeCount: number;
  loading: boolean;
  plan: SagaPlan | null;
}

const newTab = (): SagaTab => ({
  id: crypto.randomUUID(),
  premise: '',
  genre: '',
  tomeCount: 3,
  loading: false,
  plan: null,
});

const SagaArchitect: React.FC = () => {
  const [tabs, setTabs] = useState<SagaTab[]>([newTab()]);
  const [activeId, setActiveId] = useState<string>(tabs[0].id);

  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  const patch = (id: string, p: Partial<SagaTab>) =>
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

  const run = async (tab: SagaTab) => {
    if (tab.premise.trim().length < 5) {
      toast.error('Décris le livre ou la prémisse à développer en série.');
      return;
    }
    patch(tab.id, { loading: true, plan: null });
    try {
      const { data, error } = await supabase.functions.invoke('saga-architect', {
        body: { premise: tab.premise.trim(), genre: tab.genre.trim(), tomeCount: tab.tomeCount },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      patch(tab.id, { plan: data.plan as SagaPlan });
    } catch (e: any) {
      toast.error(e?.message || "Échec de l'architecture SAGA.");
    } finally {
      patch(tab.id, { loading: false });
    }
  };

  return (
    <div className="space-y-4">
      {/* Onglets de séries */}
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
            <span className="max-w-[140px] truncate">{t.plan?.series_title || t.premise.trim().slice(0, 20) || `Série ${i + 1}`}</span>
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
          <Plus className="h-4 w-4" /> Série
        </Button>
      </div>

      {/* Formulaire de l'onglet actif */}
      <div className="space-y-2">
        <Textarea
          placeholder="Prémisse du livre / tome 1 (ex. Une détective hantée enquête sur des disparitions liées à un phare maudit…)"
          value={active.premise}
          onChange={(e) => patch(active.id, { premise: e.target.value })}
          rows={3}
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            className="sm:flex-1"
            value={active.genre}
            onChange={(e) => patch(active.id, { genre: e.target.value })}
            placeholder="Genre (ex. thriller, romance, fantasy…)"
          />
          <select
            className="h-10 rounded-md border bg-background px-3 text-sm sm:w-40"
            value={active.tomeCount}
            onChange={(e) => patch(active.id, { tomeCount: parseInt(e.target.value, 10) })}
          >
            {[2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n} tomes</option>
            ))}
          </select>
          <Button onClick={() => run(active)} disabled={active.loading} style={{ background: '#4f46e5', color: 'white' }}>
            {active.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span className="ml-1.5">Architecturer</span>
          </Button>
        </div>
      </div>

      {active.loading && (
        <p className="text-sm text-joy-ink/60">SAGA conçoit l'architecture de la série…</p>
      )}

      {active.plan && (
        <div className="space-y-4 text-sm">
          <div className="rounded-xl border p-3">
            <div className="mb-1 flex items-center gap-2">
              <BookCopy className="h-4 w-4" style={{ color: '#4f46e5' }} />
              <span className="font-semibold">{active.plan.series_title}</span>
              <Badge style={{ background: '#4f46e5', color: 'white' }}>{active.plan.tomes.length} tomes</Badge>
            </div>
            <p className="text-joy-ink/70">{active.plan.series_pitch}</p>
            <p className="mt-2 text-joy-ink/60"><span className="font-medium text-joy-ink/80">Arc global :</span> {active.plan.overarching_arc}</p>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-1.5 font-semibold">
              <Users className="h-4 w-4" /> Personnages récurrents
            </p>
            <div className="space-y-2">
              {active.plan.recurring_characters.map((c, i) => (
                <div key={i} className="rounded-lg border p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{c.name}</span>
                    <Badge variant="outline">{c.role}</Badge>
                  </div>
                  <p className="text-joy-ink/70">{c.arc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-1.5 font-semibold">
              <ListTree className="h-4 w-4" /> Plan des tomes
            </p>
            <div className="space-y-2">
              {active.plan.tomes.map((t, i) => (
                <div key={i} className="rounded-lg border p-3">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge style={{ background: '#4f46e5', color: 'white' }}>Tome {t.number}</Badge>
                    <span className="font-semibold">{t.title}</span>
                  </div>
                  <p className="text-joy-ink/70">{t.premise}</p>
                  <p className="mt-1 text-joy-ink/60"><span className="font-medium text-joy-ink/80">Arc :</span> {t.arc}</p>
                  <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-joy-ink/70">
                    {t.key_events.map((e, j) => <li key={j}>{e}</li>)}
                  </ul>
                  <p className="mt-1.5 flex items-start gap-1.5 text-joy-ink/70">
                    <Flag className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: '#E94E77' }} />
                    <span><span className="font-medium text-joy-ink/80">Cliffhanger :</span> {t.cliffhanger}</span>
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {t.themes.map((th, j) => <Badge key={j} variant="secondary">{th}</Badge>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 flex items-center gap-1.5 font-semibold">
              <Lightbulb className="h-4 w-4" /> Conseils de continuité
            </p>
            <ul className="list-disc space-y-1 pl-5 text-joy-ink/70">
              {active.plan.continuity_tips.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SagaArchitect;
