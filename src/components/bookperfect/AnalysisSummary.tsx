import React from 'react';
import { PartyPopper } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Analysis, Manuscript } from '@/lib/bookperfect/types';

interface Props {
  manuscript: Manuscript;
  analysis: Analysis;
  elapsedMs: number | null;
}

function formatDuration(ms: number): string {
  const totalSec = Math.round(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min === 0) return `${sec} s`;
  return `${min} min ${sec.toString().padStart(2, '0')} s`;
}

export const AnalysisSummary: React.FC<Props> = ({ manuscript, analysis, elapsedMs }) => {
  const corrections = analysis.issues.length;
  const traces = analysis.issues.filter((i) => i.category === 'traces-ia').length;
  const kdpChecks = analysis.kdpReport.length;
  const kdpOk = analysis.kdpReport.filter((c) => c.ok).length;
  const kdpPct = kdpChecks ? Math.round((kdpOk / kdpChecks) * 100) : 0;

  const stats = [
    { icon: '📖', label: 'Pages analysées', value: manuscript.pageEstimate.toLocaleString('fr-FR') },
    { icon: '📝', label: 'Mots analysés', value: manuscript.wordCount.toLocaleString('fr-FR') },
    { icon: '✍️', label: 'Corrections proposées', value: corrections.toLocaleString('fr-FR') },
    { icon: '📚', label: 'Traces IA détectées', value: traces.toLocaleString('fr-FR') },
    { icon: '📑', label: 'Contrôles KDP', value: `${kdpPct} %` },
    ...(elapsedMs != null ? [{ icon: '⏱️', label: 'Temps total', value: formatDuration(elapsedMs) }] : []),
  ];

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-1">
          <PartyPopper className="h-7 w-7 text-primary" />
          <h2 className="text-xl md:text-2xl font-bold">Félicitations ! 🎉</h2>
        </div>
        <p className="text-muted-foreground mb-5">
          Votre manuscrit de {manuscript.pageEstimate.toLocaleString('fr-FR')} pages a été analysé avec succès.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg border bg-card p-3 text-center">
              <div className="text-2xl mb-0.5">{s.icon}</div>
              <div className="text-lg font-bold tabular-nums">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
