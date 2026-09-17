/**
 * Agent 16 — Lior, Le Relecteur final.
 *
 * Dès que le manuscrit est rédigé (fin de P15), cet agent relit et corrige le
 * livre entier, chapitre par chapitre, avec une barre de progression réelle.
 * Aucun nouveau service : il réutilise `proofreadChapters()` (edge function
 * `strict-proofread` déjà déployée) et la clé IA déjà configurée par l'abonné.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import {
  Loader2, CheckCircle2, AlertCircle, ShieldCheck, RefreshCw, ChevronDown, Undo2, StopCircle,
} from 'lucide-react';
import {
  proofreadChapters,
  effectiveText,
  type ChapterProofread,
} from '@/lib/correcteur/proofreadBook';

export interface FinalProofreadChapterSource {
  titre?: string;
  title?: string;
  contenu?: string;
  content?: string;
}

export interface FinalProofreadOutcome {
  index: number;
  title: string;
  text: string;
  corrections: number;
  quality: number;
  accepted: boolean;
}

interface WorkflowFinalProofreadProps {
  chapters: FinalProofreadChapterSource[];
  /** Démarre la relecture automatiquement dès l'affichage (comportement par défaut). */
  autoStart?: boolean;
  /** Appelé quand l'auteur applique la version corrigée au livre. */
  onApply?: (chapters: FinalProofreadOutcome[]) => void;
}

/** Mémoire locale : une relecture déjà payée ne doit jamais être relancée toute seule. */
const STORE_PREFIX = 'v3:lior-proofread:';

function storeKey(signature: string): string {
  let hash = 0;
  for (let i = 0; i < signature.length; i++) {
    hash = (hash * 31 + signature.charCodeAt(i)) | 0;
  }
  return `${STORE_PREFIX}${hash.toString(36)}-${signature.length}`;
}

type StoredProofread = { items: ChapterProofread[]; finished: boolean; applied: boolean };

function readStored(signature: string): StoredProofread | null {
  try {
    const raw = localStorage.getItem(storeKey(signature));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items) || parsed.items.length === 0) return null;
    return { items: parsed.items, finished: Boolean(parsed.finished), applied: Boolean(parsed.applied) };
  } catch {
    return null;
  }
}

function writeStored(signature: string, data: StoredProofread) {
  try {
    localStorage.setItem(storeKey(signature), JSON.stringify(data));
  } catch {
    /* stockage plein : la relecture reste utilisable pour cette session. */
  }
}

function signatureOf(pairs: Array<{ title: string; length: number }>): string {
  return pairs.map((p) => `${p.title}:${p.length}`).join('|');
}

function toProofreadChapters(sources: FinalProofreadChapterSource[]): ChapterProofread[] {
  return sources.map((raw, i) => ({
    chapterId: `p16-${i}`,
    index: i,
    title: String(raw?.titre ?? raw?.title ?? `Chapitre ${i + 1}`),
    original: String(raw?.contenu ?? raw?.content ?? ''),
    corrected: '',
    corrections: [],
    quality: 0,
    status: 'pending' as const,
    accepted: false,
  }));
}

export default function WorkflowFinalProofread({
  chapters,
  autoStart = true,
  onApply,
}: WorkflowFinalProofreadProps) {
  // Le manuscrit change (nouveau projet) : on repart d'une relecture vierge.
  const signature = useMemo(
    () => chapters.map((c) => `${c?.titre ?? c?.title ?? ''}:${(c?.contenu ?? c?.content ?? '').length}`).join('|'),
    [chapters],
  );
  const initial = useMemo(() => readStored(signature), [signature]);

  const [items, setItems] = useState<ChapterProofread[]>(() => initial?.items ?? toProofreadChapters(chapters));
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(Boolean(initial?.finished));
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [applied, setApplied] = useState(Boolean(initial?.applied));
  const [openChapter, setOpenChapter] = useState<number | null>(null);
  const stopRef = useRef(false);
  const startedRef = useRef(Boolean(initial));
  const itemsRef = useRef<ChapterProofread[]>(items);
  const signatureRef = useRef(signature);
  /** Signature attendue après application au livre : ne doit pas effacer la relecture. */
  const skipSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (signatureRef.current === signature) return;
    signatureRef.current = signature;
    if (skipSignatureRef.current === signature) {
      skipSignatureRef.current = null;
      return;
    }
    const saved = readStored(signature);
    if (saved) {
      itemsRef.current = saved.items;
      setItems(saved.items);
      setFinished(saved.finished);
      setApplied(saved.applied);
      setCurrentIndex(-1);
      startedRef.current = true;
      return;
    }
    const fresh = toProofreadChapters(chapters);
    itemsRef.current = fresh;
    setItems(fresh);
    setFinished(false);
    setApplied(false);
    setCurrentIndex(-1);
    startedRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  const total = items.length;
  const doneCount = items.filter((c) => c.status === 'done').length;
  const failedCount = items.filter((c) => c.status === 'failed').length;
  const percent = total > 0 ? Math.round(((doneCount + failedCount) / total) * 100) : 0;
  const totalCorrections = items.reduce((sum, c) => sum + (c.corrections?.length || 0), 0);
  const doneChapters = items.filter((c) => c.status === 'done');
  const averageQuality = doneChapters.length
    ? Math.round(doneChapters.reduce((sum, c) => sum + (c.quality || 0), 0) / doneChapters.length)
    : 0;

  const run = useCallback(async () => {
    const source = itemsRef.current;
    if (running || source.length === 0) return;
    stopRef.current = false;
    setRunning(true);
    setFinished(false);

    const working = source.map((c) => ({ ...c }));
    try {
      await proofreadChapters(
        working,
        'strict',
        (p) => {
          setCurrentIndex(p.index);
          const next = working.map((c, i) => (i === p.index ? { ...p.chapter } : { ...c }));
          working[p.index] = { ...p.chapter };
          itemsRef.current = next;
          setItems(next);
        },
        () => stopRef.current,
      );
      const ok = working.filter((c) => c.status === 'done').length;
      const ko = working.filter((c) => c.status === 'failed').length;
      if (stopRef.current) {
        toast.info(`Relecture interrompue : ${ok}/${working.length} chapitre(s) corrigé(s), rien n'est perdu.`);
      } else if (ko > 0) {
        toast.warning(`Relecture terminée : ${ok}/${working.length} chapitre(s) corrigé(s), ${ko} à relancer.`);
      } else {
        toast.success(`Lior a relu votre livre : ${ok} chapitre(s) corrigé(s).`);
      }
      setFinished(!stopRef.current);
      itemsRef.current = working;
      writeStored(signatureRef.current, { items: working, finished: !stopRef.current, applied: false });
    } catch (e: any) {
      toast.error(e?.message || 'La relecture finale a échoué.');
    } finally {
      setRunning(false);
      setCurrentIndex(-1);
    }
  }, [running]);

  useEffect(() => {
    if (!autoStart || startedRef.current || items.length === 0) return;
    startedRef.current = true;
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, items.length]);

  const toggleAccept = (index: number, accepted: boolean) => {
    const next = itemsRef.current.map((c, i) => (i === index ? { ...c, accepted } : c));
    itemsRef.current = next;
    setItems(next);
    setApplied(false);
    writeStored(signatureRef.current, { items: next, finished, applied: false });
  };

  const acceptAll = () => {
    const next = itemsRef.current.map((c) => (c.status === 'done' ? { ...c, accepted: true } : c));
    itemsRef.current = next;
    setItems(next);
    applyToBook(next);
  };

  const applyToBook = (source: ChapterProofread[]) => {
    if (!onApply) return;
    const outcomes = source.map((c, i) => ({
      index: i,
      title: c.title,
      text: c.accepted && c.corrected ? effectiveText(c) : c.original,
      corrections: c.accepted ? c.corrections?.length || 0 : 0,
      quality: c.quality || 0,
      accepted: Boolean(c.accepted && c.corrected),
    }));

    // Le livre va changer de longueur : on mémorise la relecture sous l'ancienne
    // et la nouvelle signature, et on demande à ne pas réinitialiser l'affichage.
    const nextSignature = signatureOf(outcomes.map((o) => ({ title: o.title, length: o.text.length })));
    const record = { items: source, finished: true, applied: true };
    writeStored(signatureRef.current, record);
    writeStored(nextSignature, record);
    skipSignatureRef.current = nextSignature;

    onApply(outcomes);
    setApplied(true);
    setFinished(true);
    toast.success('Version corrigée appliquée au livre : les exports utiliseront ce texte.');
  };

  if (total === 0) return null;

  return (
    <Card className="border-2 border-emerald-500/40 bg-emerald-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          Agent 16 · Lior, Le Relecteur final
          <Badge variant="secondary" className="ml-1">Automatique</Badge>
        </CardTitle>
        <CardDescription>
          Votre livre est relu et corrigé en entier avant l'export : orthographe, grammaire, accords,
          ponctuation et tournures. Vous n'avez rien à lancer.
        </CardDescription>

        <div className="mt-4 rounded-xl border bg-background/70 p-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 min-w-0">
              {running ? (
                <Loader2 className="h-5 w-5 animate-spin text-emerald-600 shrink-0" />
              ) : failedCount > 0 ? (
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              )}
              <div className="text-sm font-semibold">
                {running
                  ? `Chapitre ${Math.min(currentIndex + 1, total)} / ${total} en relecture…`
                  : finished
                    ? `Relecture terminée · ${doneCount} / ${total} chapitre(s)`
                    : `${doneCount} / ${total} chapitre(s) corrigé(s)`}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-600 leading-none">{percent}%</div>
              <div className="text-[11px] text-muted-foreground">progression de la correction</div>
            </div>
          </div>
          <Progress value={percent} className="h-3 mt-3" />

          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div className="rounded-lg border bg-background p-2">
              <div className="text-lg font-bold">{totalCorrections}</div>
              <div className="text-[11px] text-muted-foreground">fautes corrigées</div>
            </div>
            <div className="rounded-lg border bg-background p-2">
              <div className="text-lg font-bold">{doneCount}</div>
              <div className="text-[11px] text-muted-foreground">chapitres relus</div>
            </div>
            <div className="rounded-lg border bg-background p-2">
              <div className="text-lg font-bold">{averageQuality || '—'}{averageQuality ? '%' : ''}</div>
              <div className="text-[11px] text-muted-foreground">qualité moyenne</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {running ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 text-destructive border-destructive/40 hover:bg-destructive/10"
                onClick={() => {
                  stopRef.current = true;
                  toast.info('Arrêt demandé : la relecture s\'arrête après le chapitre en cours.');
                }}
              >
                <StopCircle className="h-4 w-4" />
                Arrêter la relecture
              </Button>
            ) : (
              <>
                <Button type="button" size="sm" className="gap-2" onClick={acceptAll} disabled={doneCount === 0}>
                  <CheckCircle2 className="h-4 w-4" />
                  Accepter le livre corrigé
                </Button>
                {failedCount > 0 && (
                  <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => void run()}>
                    <RefreshCw className="h-4 w-4" />
                    Relancer les {failedCount} chapitre(s) en échec
                  </Button>
                )}
                {doneCount > 0 && failedCount === 0 && (
                  <Button type="button" variant="ghost" size="sm" className="gap-2" onClick={() => void run()}>
                    <RefreshCw className="h-4 w-4" />
                    Relancer la relecture
                  </Button>
                )}
              </>
            )}
            {applied && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                Appliqué au livre
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Votre livre corrigé, chapitre par chapitre
        </div>
        {items.map((chapter, index) => {
          const isOpen = openChapter === index;
          const isActive = running && index === currentIndex;
          return (
            <Collapsible
              key={chapter.chapterId}
              open={isOpen}
              onOpenChange={() => setOpenChapter(isOpen ? null : index)}
            >
              <div
                className={[
                  'rounded-lg border transition-all',
                  chapter.status === 'done' ? 'border-emerald-500/40 bg-emerald-500/5' :
                  chapter.status === 'failed' ? 'border-destructive/40 bg-destructive/5' :
                  isActive ? 'border-primary bg-primary/5' : 'border-border bg-muted/20',
                ].join(' ')}
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center gap-3 p-3 cursor-pointer">
                    <div className="shrink-0">
                      {chapter.status === 'done' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> :
                       chapter.status === 'failed' ? <AlertCircle className="h-4 w-4 text-destructive" /> :
                       isActive ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> :
                       <span className="block h-4 w-4 rounded-full border" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold truncate">
                        {index + 1}. {chapter.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {chapter.status === 'done'
                          ? `${chapter.corrections?.length || 0} correction(s) · qualité ${chapter.quality || 0}%`
                          : chapter.status === 'failed'
                            ? chapter.error || 'Chapitre non corrigé'
                            : isActive ? 'Relecture en cours…' : 'En attente'}
                      </div>
                    </div>
                    {chapter.status === 'done' && (
                      <Badge variant={chapter.accepted ? 'default' : 'outline'} className="shrink-0">
                        {chapter.accepted ? 'Version corrigée' : 'Original conservé'}
                      </Badge>
                    )}
                    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-3 pb-3 space-y-3">
                    {chapter.status === 'done' ? (
                      <>
                        <div className="grid gap-3 md:grid-cols-2">
                          <div>
                            <div className="text-[11px] font-semibold text-muted-foreground mb-1">Avant</div>
                            <div className="max-h-64 overflow-auto rounded-md border bg-background p-3 text-xs whitespace-pre-wrap">
                              {chapter.original}
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 mb-1">Après correction</div>
                            <div className="max-h-64 overflow-auto rounded-md border border-emerald-500/40 bg-emerald-500/5 p-3 text-xs whitespace-pre-wrap">
                              {effectiveText({ ...chapter, accepted: true })}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {chapter.accepted ? (
                            <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => toggleAccept(index, false)}>
                              <Undo2 className="h-4 w-4" />
                              Garder mon texte d'origine
                            </Button>
                          ) : (
                            <Button type="button" size="sm" className="gap-2" onClick={() => toggleAccept(index, true)}>
                              <CheckCircle2 className="h-4 w-4" />
                              Garder la version corrigée
                            </Button>
                          )}
                        </div>
                      </>
                    ) : chapter.status === 'failed' ? (
                      <div className="text-xs text-muted-foreground">
                        Ce chapitre n'a pas pu être corrigé ({chapter.error || 'erreur inconnue'}). Le texte d'origine
                        est conservé, vous pouvez relancer la relecture sans perdre les autres chapitres.
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">Relecture pas encore effectuée sur ce chapitre.</div>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </CardContent>
    </Card>
  );
}
