import React from 'react';
import { Loader2, CheckCircle2, XCircle, Circle, Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CATEGORY_LABELS } from '@/lib/bookperfect/types';
import type { Analysis, IssueCategory, Manuscript } from '@/lib/bookperfect/types';

interface Props {
  manuscript: Manuscript;
  analysis: Analysis;
  runningIndex: number | null;
}

const CATEGORY_BADGE: Record<IssueCategory, string> = {
  'traces-ia': 'bg-destructive/10 text-destructive border-destructive/30',
  orthographe: 'bg-primary/10 text-primary border-primary/30',
  style: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  kdp: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
};

export const AnalysisProgress: React.FC<Props> = ({ manuscript, analysis, runningIndex }) => {
  const total = manuscript.chapters.length;
  const done = analysis.chapterResults.filter((r) => r.status === 'done').length;
  const failed = analysis.chapterResults.filter((r) => r.status === 'failed').length;
  const pct = Math.round(((done + failed) / total) * 100);

  const runningTitle = runningIndex != null ? manuscript.chapters[runningIndex]?.title : null;
  // Flux "en direct" : les dernières corrections détectées, plus récentes en haut.
  const liveIssues = [...analysis.issues].reverse().slice(0, 12);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
          Analyse en cours — chapitre {Math.min((runningIndex ?? done) + 1, total)} / {total}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={pct} />
        <p className="text-sm text-muted-foreground">
          {done} terminés · {failed} en échec · {total - done - failed} en attente
        </p>
        <div className="max-h-[360px] overflow-y-auto pr-2 space-y-1">
          {manuscript.chapters.map((ch, i) => {
            const r = analysis.chapterResults.find((x) => x.chapterId === ch.id);
            const status = i === runningIndex ? 'running' : r?.status || 'pending';
            return (
              <div key={ch.id} className="flex items-center gap-2 text-sm py-1">
                {status === 'done' && <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />}
                {status === 'failed' && <XCircle className="h-4 w-4 text-destructive shrink-0" />}
                {status === 'running' && <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />}
                {status === 'pending' && <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />}
                <span className={`truncate ${status === 'pending' ? 'text-muted-foreground' : ''}`}>{ch.title}</span>
                {status === 'failed' && <span className="ml-auto text-xs text-destructive shrink-0">échec — sera relancé</span>}
              </div>
            );
          })}
        </div>

        {/* Flux en direct — "regardez le directeur éditorial corriger" */}
        <div className="rounded-lg border bg-muted/30">
          <div className="border-b px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <Pencil className="h-3.5 w-3.5 text-primary" />
            Corrections en direct
            {runningTitle && (
              <span className="ml-auto normal-case font-normal text-primary flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" /> ✍️ {runningTitle}
              </span>
            )}
          </div>
          <div className="max-h-[280px] overflow-y-auto p-3 space-y-2">
            {liveIssues.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Les corrections détectées s'afficheront ici au fil de l'analyse…
              </p>
            ) : (
              liveIssues.map((issue) => (
                <div key={issue.id} className="text-sm border-b border-border/50 pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] uppercase tracking-wide border rounded px-1.5 py-0.5 ${CATEGORY_BADGE[issue.category]}`}>
                      {CATEGORY_LABELS[issue.category]}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">{issue.chapterTitle}</span>
                  </div>
                  {issue.original && (
                    <p className="leading-relaxed">
                      <span className="line-through decoration-destructive/60 bg-destructive/5 px-1 rounded">{issue.original}</span>
                      {issue.suggestion && (
                        <>
                          {' → '}
                          <span className="bg-green-500/10 text-green-700 dark:text-green-400 px-1 rounded font-medium">{issue.suggestion}</span>
                        </>
                      )}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>

    </Card>
  );
};
