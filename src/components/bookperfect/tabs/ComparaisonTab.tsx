import React, { useMemo, useState } from 'react';
import { Columns, Type, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { correctedChapterText } from '@/lib/bookperfect/exporters';
import { diffWords } from '@/lib/bookperfect/textDiff';
import type { Analysis, Manuscript } from '@/lib/bookperfect/types';

interface Props {
  manuscript: Manuscript;
  analysis: Analysis;
}

export const ComparaisonTab: React.FC<Props> = ({ manuscript, analysis }) => {
  const [chapterId, setChapterId] = useState<string>(manuscript.chapters[0]?.id ?? '');
  const [withTypo, setWithTypo] = useState(false);

  const chapter = useMemo(
    () => manuscript.chapters.find((c) => c.id === chapterId) ?? manuscript.chapters[0],
    [manuscript.chapters, chapterId],
  );

  const corrected = useMemo(
    () => (chapter ? correctedChapterText(chapter, analysis, withTypo) : ''),
    [chapter, analysis, withTypo],
  );

  const segments = useMemo(
    () => (chapter ? diffWords(chapter.content, corrected) : []),
    [chapter, corrected],
  );

  const chapterIssues = chapter ? analysis.issues.filter((i) => i.chapterId === chapter.id) : [];
  const applied = chapterIssues.filter((i) => i.status === 'applied').length;
  const pending = chapterIssues.filter((i) => i.status === 'pending').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Columns className="h-5 w-5 text-primary" />
          Comparer avec l'original
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            {applied} appliquée(s) · {pending} en attente
          </span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Le texte original et votre texte corrigé côte à côte, avec les différences en évidence. Validez ou
          ignorez les corrections dans les onglets Orthographe / Style / KDP — cette vue reflète vos choix en direct.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-[240px] flex-1">
            <Select value={chapterId} onValueChange={setChapterId}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un chapitre" />
              </SelectTrigger>
              <SelectContent>
                {manuscript.chapters.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant={withTypo ? 'default' : 'outline'}
            size="sm"
            onClick={() => setWithTypo((v) => !v)}
            className="gap-2"
          >
            <Type className="h-4 w-4" /> Typographie FR {withTypo ? 'activée' : 'désactivée'}
          </Button>
        </div>

        {applied === 0 && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">
            Aucune correction validée pour ce chapitre pour l'instant. Le texte corrigé est identique à l'original
            tant que vous n'avez pas cliqué sur « Appliquer » dans les onglets de corrections.
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Original */}
          <div className="rounded-lg border bg-card">
            <div className="border-b px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Texte original
            </div>
            <div className="max-h-[520px] overflow-y-auto p-4 text-sm leading-relaxed whitespace-pre-wrap">
              {segments.map((seg, idx) =>
                seg.type === 'added' ? null : (
                  <span
                    key={idx}
                    className={seg.type === 'removed'
                      ? 'bg-destructive/10 text-destructive line-through decoration-destructive/50 rounded px-0.5'
                      : ''}
                  >
                    {seg.text}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* Corrigé */}
          <div className="rounded-lg border bg-card">
            <div className="border-b px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
              <ArrowRight className="h-3.5 w-3.5 text-green-600" /> Texte corrigé
            </div>
            <div className="max-h-[520px] overflow-y-auto p-4 text-sm leading-relaxed whitespace-pre-wrap">
              {segments.map((seg, idx) =>
                seg.type === 'removed' ? null : (
                  <span
                    key={idx}
                    className={seg.type === 'added'
                      ? 'bg-green-500/15 text-green-700 dark:text-green-400 rounded px-0.5 font-medium'
                      : ''}
                  >
                    {seg.text}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
