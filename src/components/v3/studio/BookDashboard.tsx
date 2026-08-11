import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookChapter, CHAPTER_STATUS_ICONS, CHAPTER_STATUS_LABELS, ChapterStatus } from '@/types/studioPro';

interface Props {
  chaptersTarget: number;
  chapters: BookChapter[];
}

const statusOf = (c: BookChapter): ChapterStatus =>
  (['a_ecrire', 'brouillon', 'a_corriger', 'valide'].includes(c.status) ? c.status : 'a_ecrire') as ChapterStatus;

/** Tableau de bord du livre : compteurs + liste des chapitres avec statut. */
const BookDashboard: React.FC<Props> = ({ chaptersTarget, chapters }) => {
  const written = chapters.filter((c) => statusOf(c) !== 'a_ecrire').length;
  const validated = chapters.filter((c) => statusOf(c) === 'valide').length;
  const toFix = chapters.filter((c) => statusOf(c) === 'a_corriger').length;
  const total = Math.max(chaptersTarget, chapters.length);
  const progress = total > 0 ? Math.round((validated / total) * 100) : 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Tableau de bord du livre</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: 'Chapitres prévus', value: total },
              { label: 'Rédigés', value: written },
              { label: 'Validés', value: validated },
              { label: 'À contrôler', value: toFix },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border bg-card p-3 text-center">
                <div className="text-2xl font-semibold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progression</span>
              <span className="font-semibold">{progress} %</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Chapitres</CardTitle>
        </CardHeader>
        <CardContent>
          {chapters.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Les chapitres apparaîtront ici dès que vous aurez validé la Bible du livre.
            </p>
          ) : (
            <ul className="divide-y">
              {chapters.map((c) => {
                const st = statusOf(c);
                return (
                  <li key={c.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        Chapitre {c.position} — {c.title}
                      </p>
                      {c.objective && (
                        <p className="truncate text-xs text-muted-foreground">{c.objective}</p>
                      )}
                    </div>
                    <Badge variant={st === 'valide' ? 'default' : 'secondary'} className="shrink-0">
                      {CHAPTER_STATUS_ICONS[st]} {CHAPTER_STATUS_LABELS[st]}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookDashboard;
