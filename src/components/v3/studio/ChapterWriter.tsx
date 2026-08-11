import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertTriangle, BookOpen, Check, Loader2, PenLine, Save, Sparkles, StopCircle, Wand2,
} from 'lucide-react';
import {
  BookChapter, CHAPTER_STATUS_ICONS, CHAPTER_STATUS_LABELS, ChapterMemory, ChapterStatus,
} from '@/types/studioPro';

interface Props {
  chapters: BookChapter[];
  contents: Record<string, string>;
  memories: ChapterMemory[];
  alerts: Record<number, string[]>;
  busyChapterId: string | null;
  busyLabel: string;
  runningAll: boolean;
  onWrite: (chapter: BookChapter, opts?: { polish?: boolean; guidance?: string }) => void;
  onWriteAll: () => void;
  onCancelAll: () => void;
  onSave: (chapter: BookChapter, content: string, validate?: boolean) => void;
}

const statusLabel = (s: string) => CHAPTER_STATUS_LABELS[s as ChapterStatus] || s;
const statusIcon = (s: string) => CHAPTER_STATUS_ICONS[s as ChapterStatus] || '•';
const countWords = (t: string) => t.split(/\s+/).filter(Boolean).length;

/**
 * Phase 2 du Studio Pro : ChatGPT rédige un chapitre à la fois, l'auteur corrige
 * et valide, Gemini alimente la mémoire du livre pour garder la cohérence.
 */
const ChapterWriter: React.FC<Props> = ({
  chapters, contents, memories, alerts, busyChapterId, busyLabel, runningAll,
  onWrite, onWriteAll, onCancelAll, onSave,
}) => {
  const sorted = useMemo(() => [...chapters].sort((a, b) => a.position - b.position), [chapters]);
  const [selectedId, setSelectedId] = useState<string | null>(sorted[0]?.id || null);
  const [draft, setDraft] = useState('');
  const [guidance, setGuidance] = useState('');

  const selected = sorted.find((c) => c.id === selectedId) || sorted[0] || null;

  useEffect(() => {
    if (!selectedId && sorted.length) setSelectedId(sorted[0].id);
  }, [sorted, selectedId]);

  useEffect(() => {
    if (selected) setDraft(contents[selected.id] || '');
  }, [selected?.id, contents]);

  const written = sorted.filter((c) => c.status !== 'a_ecrire').length;
  const totalWords = sorted.reduce((sum, c) => sum + (c.word_count || 0), 0);
  const progress = sorted.length ? Math.round((written / sorted.length) * 100) : 0;
  const memory = memories.find((m) => m.chapter_id === selected?.id);
  const chapterAlerts = selected ? alerts[selected.position] || [] : [];
  const busy = Boolean(busyChapterId);
  const dirty = Boolean(selected && draft !== (contents[selected.id] || ''));

  if (!sorted.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <BookOpen className="h-8 w-8 text-muted-foreground" />
          <p className="font-semibold">Aucun chapitre à rédiger pour l’instant</p>
          <p className="text-sm text-muted-foreground">
            Validez la Bible du livre (onglet 2) : les chapitres apparaîtront ici, prêts à être rédigés.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="min-w-[220px] flex-1">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">{written} / {sorted.length} chapitres rédigés</span>
              <span className="text-muted-foreground">{totalWords.toLocaleString('fr-FR')} mots</span>
            </div>
            <Progress value={progress} />
          </div>
          {runningAll ? (
            <Button variant="outline" onClick={onCancelAll}>
              <StopCircle className="mr-2 h-4 w-4" /> Arrêter la rédaction
            </Button>
          ) : (
            <Button onClick={onWriteAll} disabled={busy || written === sorted.length}>
              <Sparkles className="mr-2 h-4 w-4" /> Rédiger tout le livre
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Chapitres</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="max-h-[520px]">
              <ul className="divide-y">
                {sorted.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(c.id)}
                      className={`flex w-full items-start gap-2 px-4 py-3 text-left text-sm transition-colors hover:bg-muted ${
                        selected?.id === c.id ? 'bg-muted' : ''
                      }`}
                    >
                      <span aria-hidden>{statusIcon(c.status)}</span>
                      <span className="flex-1">
                        <span className="block font-medium">Ch. {c.position} — {c.title}</span>
                        <span className="block text-xs text-muted-foreground">
                          {statusLabel(c.status)}{c.word_count ? ` · ${c.word_count} mots` : ''}
                        </span>
                      </span>
                      {busyChapterId === c.id && <Loader2 className="h-4 w-4 animate-spin" />}
                    </button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>

        {selected && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CardTitle className="text-base">
                    Chapitre {selected.position} — {selected.title}
                  </CardTitle>
                  <Badge variant="secondary">{statusLabel(selected.status)}</Badge>
                </div>
                {selected.objective && (
                  <p className="text-sm text-muted-foreground">Objectif : {selected.objective}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="guidance">
                    Consigne pour la plume IA (facultatif)
                  </label>
                  <Input
                    id="guidance"
                    value={guidance}
                    onChange={(e) => setGuidance(e.target.value)}
                    placeholder="Ex. plus de dialogues, rythme rapide, terminer sur un doute…"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => onWrite(selected, { guidance: guidance.trim() || undefined })}
                    disabled={busy}
                  >
                    {busyChapterId === selected.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <PenLine className="mr-2 h-4 w-4" />
                    )}
                    {contents[selected.id] ? 'Réécrire ce chapitre' : 'Rédiger ce chapitre'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onWrite(selected, { polish: true, guidance: guidance.trim() || undefined })}
                    disabled={busy || !contents[selected.id]}
                  >
                    <Wand2 className="mr-2 h-4 w-4" /> Améliorer le style
                  </Button>
                  <Button variant="outline" onClick={() => onSave(selected, draft)} disabled={busy || !dirty}>
                    <Save className="mr-2 h-4 w-4" /> Enregistrer mes corrections
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => onSave(selected, draft, true)}
                    disabled={busy || !draft.trim()}
                  >
                    <Check className="mr-2 h-4 w-4" /> Valider le chapitre
                  </Button>
                </div>

                {busyChapterId === selected.id && busyLabel && (
                  <p className="text-sm text-muted-foreground">{busyLabel}</p>
                )}

                {chapterAlerts.length > 0 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <span className="font-medium">Points de cohérence repérés :</span>
                      <ul className="mt-1 list-disc pl-4 text-sm">
                        {chapterAlerts.map((a, i) => <li key={i}>{a}</li>)}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <label className="font-medium" htmlFor="chapter-content">Texte du chapitre</label>
                    <span className="text-muted-foreground">
                      {countWords(draft)} mots{selected.word_target ? ` / ${selected.word_target} visés` : ''}
                    </span>
                  </div>
                  <Textarea
                    id="chapter-content"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={22}
                    className="font-serif text-[15px] leading-relaxed"
                    placeholder="Le chapitre rédigé apparaîtra ici. Vous pouvez le corriger librement avant de le valider."
                  />
                </div>
              </CardContent>
            </Card>

            {memory && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Mémoire du chapitre (Gemini)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {memory.summary && <p className="text-muted-foreground">{memory.summary}</p>}
                  {([
                    ['Faits établis', memory.events],
                    ['Personnages présents', memory.characters_present],
                    ['Informations révélées', memory.revealed_info],
                    ['Indices plantés', memory.clues],
                    ['Décisions', memory.decisions],
                    ['Questions ouvertes', memory.open_questions],
                  ] as const).map(([label, list]) =>
                    list && list.length ? (
                      <div key={label}>
                        <p className="font-medium">{label}</p>
                        <ul className="list-disc pl-4 text-muted-foreground">
                          {list.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    ) : null,
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterWriter;
