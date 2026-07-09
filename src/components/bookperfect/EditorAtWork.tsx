import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen, Brain, PenLine, ShoppingCart, FileCheck, MessageSquareText, Sparkles, Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Analysis, Issue, Manuscript } from '@/lib/bookperfect/types';

interface Props {
  manuscript: Manuscript;
  analysis: Analysis;
  runningIndex: number | null;
}

/** Phases affichées en boucle pour matérialiser le travail de l'éditeur. */
const PHASES = [
  { icon: BookOpen, label: '📖 Lecture du manuscrit…' },
  { icon: Brain, label: '🧠 Compréhension du récit…' },
  { icon: PenLine, label: '✍️ Analyse éditoriale…' },
  { icon: ShoppingCart, label: '📚 Vérification Amazon KDP…' },
  { icon: FileCheck, label: '✅ Préparation du rapport…' },
];

const COUNTERS: { key: Issue['category']; label: string; icon: string; className: string }[] = [
  { key: 'orthographe', label: 'Orthographe / Typo', icon: '✔', className: 'text-primary' },
  { key: 'style', label: 'Style / Répétitions', icon: '✔', className: 'text-amber-600' },
  { key: 'traces-ia', label: 'Traces IA / provisoire', icon: '✔', className: 'text-destructive' },
  { key: 'kdp', label: 'Contrôles Amazon KDP', icon: '✔', className: 'text-purple-600' },
];

/** Construit des messages "intelligents" à partir des données RÉELLES. */
function buildSmartMessages(manuscript: Manuscript, analysis: Analysis): string[] {
  const msgs: string[] = [];
  for (const ch of manuscript.chapters) {
    const r = analysis.chapterResults.find((x) => x.chapterId === ch.id);
    if (r?.status !== 'done' && r?.status !== 'failed') continue;
    const chIssues = analysis.issues.filter((i) => i.chapterId === ch.id);
    const style = chIssues.filter((i) => i.category === 'style').length;
    const traces = chIssues.filter((i) => i.category === 'traces-ia').length;
    const ortho = chIssues.filter((i) => i.category === 'orthographe').length;
    const kdp = chIssues.filter((i) => i.category === 'kdp').length;

    if (traces > 0) msgs.push(`💬 Une trace de texte provisoire a été détectée dans « ${ch.title} ».`);
    if (style >= 3) msgs.push(`💬 « ${ch.title} » contient plusieurs répétitions ou lourdeurs à revoir.`);
    if (ortho >= 5) msgs.push(`💬 Plusieurs corrections orthographiques proposées dans « ${ch.title} ».`);
    if (kdp > 0) msgs.push(`💬 Point de conformité KDP relevé dans « ${ch.title} ».`);
    if (style === 0 && ortho <= 1 && traces === 0 && kdp === 0 && r?.status === 'done') {
      msgs.push(`💬 « ${ch.title} » est propre — rien à signaler. 👍`);
    }
  }
  return msgs;
}

export const EditorAtWork: React.FC<Props> = ({ manuscript, analysis, runningIndex }) => {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPhase((p) => (p + 1) % PHASES.length), 1800);
    return () => clearInterval(t);
  }, []);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of COUNTERS) map[c.key] = analysis.issues.filter((i) => i.category === c.key).length;
    return map;
  }, [analysis.issues]);

  const totalFound = COUNTERS.reduce((s, c) => s + (counts[c.key] || 0), 0);

  const smart = useMemo(() => buildSmartMessages(manuscript, analysis), [manuscript, analysis]);
  const smartFeed = smart.slice(-8).reverse();

  const feedRef = useRef<HTMLDivElement>(null);

  const CurrentIcon = PHASES[phase].icon;

  return (
    <Card className="border-primary/30 bg-gradient-to-b from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> Éditeur au travail
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Animation de phase */}
        <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2.5 text-sm font-medium animate-fade-in" key={phase}>
          <CurrentIcon className="h-4 w-4 text-primary shrink-0 animate-pulse" />
          <span className="truncate">{PHASES[phase].label}</span>
          <Loader2 className="h-3.5 w-3.5 text-primary ml-auto shrink-0 animate-spin" />
        </div>

        {/* Corrections trouvées (temps réel) */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Corrections trouvées · {totalFound}
          </div>
          <div className="space-y-1.5">
            {COUNTERS.map((c) => (
              <div key={c.key} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5">
                  <span className={c.className}>{c.icon}</span> {c.label}
                </span>
                <span className="font-bold tabular-nums">{counts[c.key] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Messages intelligents */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
            <MessageSquareText className="h-3.5 w-3.5" /> Remarques de l'éditeur
          </div>
          <div ref={feedRef} className="max-h-[220px] overflow-y-auto space-y-2 pr-1">
            {smartFeed.length === 0 ? (
              <p className="text-sm text-muted-foreground py-3 text-center">
                Les remarques apparaîtront au fil de la lecture…
              </p>
            ) : (
              smartFeed.map((m, i) => (
                <div key={i} className="text-sm leading-snug rounded-md border bg-card px-2.5 py-2 animate-fade-in">
                  {m}
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
