import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Check, ListOrdered, Loader2, Plus, RefreshCw, Save, ShieldCheck, Sparkles, Undo2, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getProvider, getProviderKey } from '@/services/aiWritingService';
import {
  BOOK_BRIEF_EVENT, countWords, hasEmojis, insertSourcePassage, listSourcePassages, missingProtectedTerms,
  narrativeForBook, passageForBook, readBookBrief, replaceSourcePassage, stripEmojis, suggestChapterCount, upsertPolished,
  updateCorrectedPassage, writeBookBrief, type BookBrief,
} from '@/lib/v3/bookBrief';
import { saveBookDraftToCloud } from '@/lib/v3/bookDraftCloud';


/** Papier crème : la couleur du livre validé, à l'écran comme dans l'aperçu. */
const CREAM = '#FBF6E8';

/**
 * « Comme Copilot » : l'auteur écrit ses idées telles qu'elles viennent, le Génie
 * les lui rend corrigées et développées, et chaque passage validé est enregistré
 * pour finir dans le livre. L'original n'est jamais écrasé.
 */
export default function V3PassageCorrector({ mode = 'book', onDone }: {
  mode?: 'book' | 'biography';
  /** « J'ai fini de raconter » : ouvre l'étape ② Mon sommaire. */
  onDone?: () => void;
}) {
  const [brief, setBrief] = useState<BookBrief>({});
  const [busy, setBusy] = useState<number | null>(null);
  const [runningAll, setRunningAll] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [draftText, setDraftText] = useState('');
  const [addingAfter, setAddingAfter] = useState<number | null>(null);
  const [addition, setAddition] = useState('');
  const [editingCorrection, setEditingCorrection] = useState<number | null>(null);
  const [correctedDraft, setCorrectedDraft] = useState('');
  const [autoState, setAutoState] = useState<'idle' | 'working' | 'error'>('idle');
  const [showBook, setShowBook] = useState(false);
  const attemptedAuto = useRef<Set<number>>(new Set());


  useEffect(() => {
    const sync = () => setBrief(readBookBrief() || {});
    sync();
    window.addEventListener(BOOK_BRIEF_EVENT, sync);
    return () => window.removeEventListener(BOOK_BRIEF_EVENT, sync);
  }, []);

  const passages = useMemo(() => listSourcePassages(brief.sourceText || ''), [brief.sourceText]);
  const polished = brief.polished || [];
  const entryFor = (index: number) => polished.find((p) => p.index === index);
  const validatedList = polished
    .filter((p) => Boolean(p.validatedAt) && Boolean(p.corrected?.trim()))
    .slice()
    .sort((a, b) => a.index - b.index);
  const validatedCount = validatedList.length;

  const originalWords = passages.reduce((t, p) => t + countWords(p), 0);
  const bookWords = countWords(narrativeForBook(brief));

  const patch = (values: Partial<BookBrief>) => {
    const next = { ...(readBookBrief() || {}), ...values };
    setBrief(next);
    writeBookBrief(next);
    return next;
  };

  const persist = async (next: BookBrief) => {
    const result = await saveBookDraftToCloud(next);
    if (result.error && result.error !== 'not-authenticated') toast.error('Le texte reste sur cet appareil, mais la sauvegarde du compte a échoué.');
  };

  const saveOriginalEdit = (index: number) => {
    const next = replaceSourcePassage(readBookBrief() || {}, index, draftText);
    patch(next);
    void persist(next);
    setEditing(null);
    toast.success(`Texte ${index} modifié et enregistré. L’ancienne correction a été retirée.`);
  };

  /**
   * Passage oublié : il est inséré à sa place, puis corrigé tout seul et raccordé
   * au texte qui le précède (voir `pendingPolishIndex`).
   */
  const addPassage = (afterIndex: number) => {
    if (!addition.trim()) return;
    const inserted = insertSourcePassage(readBookBrief() || {}, afterIndex, addition);
    const newIndex = afterIndex + 1;
    attemptedAuto.current.delete(newIndex);
    const next = patch({ ...inserted, pendingPolishIndex: newIndex });
    void persist(next);
    setAddingAfter(null);
    setAddition('');
    toast.success('Passage ajouté. Le Génie le corrige et le raccorde à votre récit…');
  };

  const saveCorrectedEdit = (index: number) => {
    const current = readBookBrief() || {};
    const entry = (current.polished || []).find((passage) => passage.index === index);
    if (!entry) return;
    const missing = missingProtectedTerms(entry.original, correctedDraft);
    if (missing.length) {
      toast.error(`Impossible d’enregistrer : il manque ${missing.join(', ')}.`);
      return;
    }
    const next = updateCorrectedPassage(current, index, correctedDraft);
    patch(next);
    void persist(next);
    setEditingCorrection(null);
    toast.success('Votre version corrigée est enregistrée et reste à valider.');
  };

  /** Demande au Génie la version corrigée d'un passage (jamais moins de mots). */
  const correct = useCallback(async (index: number, automatic = false): Promise<boolean> => {
    const original = passages[index - 1];
    if (!original) return false;
    setBusy(index);
    if (automatic) setAutoState('working');
    try {
      const provider = getProvider();
      const userApiKey = provider === 'gemini' ? getProviderKey('gemini') : '';
      const { data, error } = await supabase.functions.invoke('v3-genie-brief', {
        body: {
          mode: 'polish-passage',
          kind: mode === 'biography' ? 'biography' : 'book',
          passage: original,
          passageIndex: index,
          bookTitle: brief.title || '',
          tone: brief.tone || '',
          language: brief.language || 'fr',
          factMemory: brief.factMemory || [],
          // Raccord : le passage doit s'enchaîner avec le texte qui le précède.
          previousPassage: index > 1 ? (passages[index - 2] || '').slice(-3000) : '',
          emojis: brief.emojis === true,
          userApiKey,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const corrected = String((data as any)?.corrected || '').trim();
      if (!corrected) throw new Error('Réponse illisible, réessayez.');
      const missing = missingProtectedTerms(original, corrected);
      if (missing.length) throw new Error(`Correction refusée : le Génie a oublié ${missing.join(', ')}.`);
      const current = readBookBrief() || {};
      const next = patch({
        polished: upsertPolished(current, { index, original, corrected }),
        pendingPolishIndex: current.pendingPolishIndex === index ? undefined : current.pendingPolishIndex,
      });
      void persist(next);
      if (automatic) setAutoState('idle');
      if ((data as any)?.shorter) {
        toast.warning(`Texte ${index} : la version corrigée est plus courte, relancez la correction.`);
      }
      return true;
    } catch (e: any) {
      if (automatic) {
        const current = readBookBrief() || {};
        const next = { ...current, pendingPolishIndex: undefined };
        patch(next);
        void persist(next);
        setAutoState('error');
      }
      toast.error(e?.message || 'Le Génie est indisponible pour le moment.');
      return false;
    } finally {
      setBusy(null);
    }
  }, [brief.author, brief.category, brief.emojis, brief.factMemory, brief.language, brief.title, brief.tone, mode, passages]);

  useEffect(() => {
    const pending = Number(brief.pendingPolishIndex) || 0;
    if (!pending || busy !== null || entryFor(pending)?.corrected || attemptedAuto.current.has(pending)) return;
    attemptedAuto.current.add(pending);
    void correct(pending, true);
  }, [brief.pendingPolishIndex, busy, correct, polished]);

  const correctAll = async () => {
    setRunningAll(true);
    for (let i = 1; i <= passages.length; i++) {
      const entry = entryFor(i);
      if (entry?.corrected) continue;
      // eslint-disable-next-line no-await-in-loop
      const ok = await correct(i);
      if (!ok) break;
    }
    setRunningAll(false);
  };

  const validate = (index: number) => {
    const current = readBookBrief() || {};
    const entry = (current.polished || []).find((p) => p.index === index);
    if (!entry?.corrected) return;
    if (countWords(entry.corrected) < countWords(entry.original)) {
      toast.error('Cette version contient moins de mots que votre texte : relancez la correction.');
      return;
    }
    const next = patch({ polished: upsertPolished(current, { ...entry, validatedAt: new Date().toISOString() }) });
    void persist(next);
    toast.success(`Texte ${index} validé — il entrera dans le livre ainsi.`);
  };

  const keepOriginal = (index: number) => {
    const current = readBookBrief() || {};
    const next = patch({ polished: (current.polished || []).filter((p) => p.index !== index) });
    void persist(next);
    toast.success(`Texte ${index} : vos mots d’origine sont conservés.`);
  };

  /** Retire les emojis d'un passage, sans appel IA ni crédit. */
  const removeEmojis = (index: number) => {
    const current = readBookBrief() || {};
    const entry = (current.polished || []).find((p) => p.index === index);
    if (entry?.corrected) {
      const cleaned = stripEmojis(entry.corrected);
      const next = patch({ polished: upsertPolished(current, { ...entry, corrected: cleaned }) });
      void persist(next);
    } else {
      const original = passages[index - 1] || '';
      const next = patch(replaceSourcePassage(current, index, stripEmojis(original)));
      void persist(next);
    }
    toast.success(`Texte ${index} : emojis retirés.`);
  };

  const validateAll = () => {
    const current = readBookBrief() || {};
    const now = new Date().toISOString();
    const next = (current.polished || []).map((p) =>
      p.corrected && countWords(p.corrected) >= countWords(p.original)
        ? { ...p, validatedAt: p.validatedAt || now }
        : p,
    );
    const saved = patch({ polished: next });
    void persist(saved);
    toast.success('Toutes les corrections prêtes sont validées.');
  };

  const suggested = suggestChapterCount(originalWords, brief.wordsPerChapter);

  if (!passages.length) {
    return (
      <div className="rounded-[22px] border p-4" style={{ borderColor: 'var(--v3-border)', background: '#fff' }}>
        <span className="v3-chip v3-chip-orange text-[11px]">
          <Wand2 className="h-3 w-3" /> Mes envois — rien ne s’efface
        </span>
        <p className="mt-2 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
          Écrivez vos souvenirs ou vos idées ci-dessus, même avec des fautes : chaque envoi apparaîtra
          ici sous le nom « Texte 1 », « Texte 2 »… et le Génie vous le rendra corrigé et développé,
          jamais résumé. N’essayez pas de faire un plan : le sommaire viendra tout seul après.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-[22px] border p-4" style={{ borderColor: 'rgba(201,168,76,0.55)', background: '#fff' }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="v3-chip v3-chip-orange text-[11px]">
          <Wand2 className="h-3 w-3" /> Votre livre en cours
        </span>
        <span className="text-[11px]" style={{ color: 'var(--v3-muted)' }}>
          {validatedCount}/{passages.length} texte(s) validé(s) · {originalWords.toLocaleString('fr-FR')} mots écrits →{' '}
          <strong style={{ color: '#0f6b4a' }}>{bookWords.toLocaleString('fr-FR')} mots dans le livre</strong>
        </span>
      </div>

      {/* Le livre, toujours visible : chaque texte y figure, validé ou non. */}
      <div className="mt-3 rounded-2xl border p-3" style={{ borderColor: 'rgba(201,168,76,0.5)', background: CREAM }}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[12.5px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
            Votre livre : {passages.length} texte(s) · {bookWords.toLocaleString('fr-FR')} mots · {validatedCount} validé(s)
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-1.5 text-[11.5px]" style={{ color: 'var(--v3-ink)' }}>
              <input type="checkbox" checked={brief.emojis === true}
                onChange={(event) => {
                  const next = patch({ emojis: event.target.checked });
                  void persist(next);
                  toast.success(event.target.checked
                    ? 'Le Génie pourra glisser au maximum un emoji discret par texte.'
                    : 'Le Génie n’ajoutera plus aucun emoji.');
                }} />
              Quelques emojis dans mon texte
            </label>
            <button type="button" onClick={() => setShowBook((value) => !value)} className="v3-btn v3-btn-outline text-[11px]">
              <BookOpen className="h-3 w-3" /> {showBook ? 'Replier la lecture' : 'Agrandir la lecture'}
            </button>
          </div>
        </div>

        <div className={`mt-3 space-y-4 overflow-y-auto rounded-xl border p-4 ${showBook ? 'max-h-[80vh]' : 'max-h-[26rem]'}`}
          style={{ borderColor: 'rgba(201,168,76,0.45)', background: '#fffdf6' }}>
          {passages.map((original, i) => {
            const index = i + 1;
            const entry = entryFor(index);
            const validated = Boolean(entry?.validatedAt);
            const text = passageForBook(brief, index, original);
            return (
              <div key={`book-${index}`}>
                <div className="text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: validated ? '#0f6b4a' : 'var(--v3-muted)' }}>
                  Texte {index} — {validated ? 'Validé dans le livre' : entry?.corrected ? 'Correction à valider' : 'Vos mots'}
                </div>
                <p className="mt-1 whitespace-pre-wrap text-[13.5px] leading-7" style={{ color: 'var(--v3-ink)' }}>{text}</p>
              </div>
            );
          })}
        </div>
      </div>


      {autoState === 'working' && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs" style={{ borderColor: 'rgba(201,168,76,0.5)', color: '#8a6d1f' }}>
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Votre dernier texte est enregistré. Le Génie prépare maintenant sa version corrigée…
        </p>
      )}
      {autoState === 'error' && (
        <p className="mt-3 text-xs" style={{ color: '#b45309' }}>La correction automatique n’a pas abouti. Votre texte est conservé : utilisez « Corriger ce texte » pour réessayer.</p>
      )}

      <p className="mt-2 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
        Vous écrivez comme vous parlez. Le Génie corrige l’orthographe, la ponctuation et développe
        vos phrases sans jamais retirer un fait ni écrire moins de mots que vous. Chaque texte validé
        est enregistré et servira à la rédaction du livre.
      </p>

      <p className="mt-2 rounded-xl border px-2.5 py-2 text-[11.5px]"
        style={{ borderColor: 'rgba(15,107,74,0.35)', background: 'rgba(15,107,74,0.06)', color: 'var(--v3-ink)' }}>
        Ce ne sont pas encore des chapitres : les chapitres viennent à l’étape ② Mon sommaire.
        Avec {originalWords.toLocaleString('fr-FR')} mots écrits, cela fera environ{' '}
        <strong>{suggested} chapitre(s)</strong> — et ce nombre s’ajustera tout seul si vous écrivez plus.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={correctAll} disabled={runningAll || busy !== null}
          className="v3-btn v3-btn-primary text-xs disabled:opacity-50">
          {runningAll ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          Corriger tous mes textes
        </button>
        <button type="button" onClick={validateAll} className="v3-btn v3-btn-outline text-xs">
          <ShieldCheck className="h-3.5 w-3.5" /> Tout valider
        </button>
        {onDone && (
          <button type="button" onClick={onDone} className="v3-btn v3-btn-outline text-xs">
            <ListOrdered className="h-3.5 w-3.5" /> J’ai fini de raconter → construire mon sommaire
          </button>
        )}
      </div>


      <p className="mt-4 text-[11px]" style={{ color: 'var(--v3-muted)' }}>
        Modifier, corriger et valider chaque texte, un par un :
      </p>
      <div className="mt-2 max-h-[60vh] space-y-3 overflow-y-auto pr-1">

        {passages.map((original, i) => {
          const index = i + 1;
          const entry = entryFor(index);
          const validated = Boolean(entry?.validatedAt);
          return (
            <div key={index} className="rounded-2xl border p-3"
              style={{
                borderColor: validated ? 'rgba(201,168,76,0.75)' : 'rgba(201,168,76,0.35)',
                background: validated ? CREAM : entry?.corrected ? 'rgba(201,168,76,0.06)' : '#fff',
              }}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#8a6d1f' }}>
                  Texte {index}
                </span>

                <span className="text-[11px]" style={{ color: validated ? '#0f6b4a' : 'var(--v3-muted)' }}>
                  {validated
                    ? 'Validé — entre dans le livre'
                    : entry?.corrected
                      ? 'Correction proposée, à valider'
                      : `${countWords(original)} mots écrits`}
                </span>
              </div>

              <div className="mt-2 grid gap-2 md:grid-cols-2">
                <div className="rounded-xl border bg-white p-2.5" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                  <div className="text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: 'var(--v3-muted)' }}>
                    Vos mots ({countWords(original)})
                  </div>
                  {editing === index ? (
                    <textarea value={draftText} onChange={(event) => setDraftText(event.target.value)} rows={7}
                      className="mt-1 w-full rounded-lg border px-2 py-2 text-[12.5px] leading-relaxed outline-none"
                      style={{ borderColor: 'rgba(201,168,76,0.6)', color: 'var(--v3-ink)' }} />
                  ) : (
                    <p className="mt-1 whitespace-pre-wrap text-[12.5px] leading-relaxed" style={{ color: 'var(--v3-ink)' }}>{original}</p>
                  )}
                </div>
                <div className="rounded-xl border bg-white p-2.5" style={{ borderColor: 'rgba(201,168,76,0.5)' }}>
                  <div className="text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: '#8a6d1f' }}>
                    Version corrigée {entry?.corrected ? `(${countWords(entry.corrected)})` : ''}
                  </div>
                  {entry?.corrected ? editingCorrection === index ? (
                    <textarea value={correctedDraft} onChange={(event) => setCorrectedDraft(event.target.value)} rows={7}
                      className="mt-1 w-full rounded-lg border px-2 py-2 text-[12.5px] leading-relaxed outline-none"
                      style={{ borderColor: 'rgba(201,168,76,0.6)', color: 'var(--v3-ink)' }} />
                  ) : (
                    <p className="mt-1 whitespace-pre-wrap text-[12.5px] leading-relaxed" style={{ color: 'var(--v3-ink)' }}>{entry.corrected}</p>
                  ) : (
                    <p className="mt-1 text-[12px]" style={{ color: 'var(--v3-muted)' }}>
                      Pas encore corrigé.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {editing === index ? (
                  <button type="button" onClick={() => saveOriginalEdit(index)} className="v3-btn v3-btn-primary text-[11px]">
                    <Save className="h-3 w-3" /> Enregistrer mes modifications
                  </button>
                ) : (
                  <button type="button" onClick={() => { setEditing(index); setDraftText(original); }} className="v3-btn v3-btn-outline text-[11px]">
                    Modifier mes mots
                  </button>
                )}
                <button type="button" onClick={() => correct(index)} disabled={busy === index || runningAll}
                  className="v3-btn v3-btn-outline text-[11px] disabled:opacity-50">
                  {busy === index ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                  {entry?.corrected ? 'Recorriger' : 'Corriger ce texte'}
                </button>
                {entry?.corrected && !validated && (
                  <button type="button" onClick={() => validate(index)} className="v3-btn v3-btn-primary text-[11px]">
                    <Check className="h-3 w-3" /> Valider pour le livre
                  </button>
                )}
                {entry?.corrected && (editingCorrection === index ? (
                  <button type="button" onClick={() => saveCorrectedEdit(index)} className="v3-btn v3-btn-primary text-[11px]">
                    <Save className="h-3 w-3" /> Enregistrer ma correction
                  </button>
                ) : (
                  <button type="button" onClick={() => { setEditingCorrection(index); setCorrectedDraft(entry.corrected); }} className="v3-btn v3-btn-outline text-[11px]">
                    Modifier la proposition
                  </button>
                ))}
                {(entry?.corrected || validated) && (
                  <button type="button" onClick={() => keepOriginal(index)} className="v3-btn v3-btn-ghost text-[11px]">
                    <Undo2 className="h-3 w-3" /> Garder mon texte original
                  </button>
                )}
                <button type="button" onClick={() => setAddingAfter(addingAfter === index ? null : index)} className="v3-btn v3-btn-ghost text-[11px]">
                  <Plus className="h-3 w-3" /> Ajouter un passage ici
                </button>
              </div>
              {addingAfter === index && (
                <div className="mt-2 rounded-xl border bg-white p-2.5" style={{ borderColor: 'rgba(201,168,76,0.5)' }}>
                  <textarea value={addition} onChange={(event) => setAddition(event.target.value)} rows={4}
                    placeholder="Écrivez le souvenir ou le détail oublié…"
                    className="w-full resize-y bg-transparent text-[12.5px] outline-none" style={{ color: 'var(--v3-ink)' }} />
                  <button type="button" disabled={!addition.trim()} onClick={() => addPassage(index)} className="v3-btn v3-btn-primary mt-2 text-[11px] disabled:opacity-50">
                    <Plus className="h-3 w-3" /> Ajouter au récit
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
