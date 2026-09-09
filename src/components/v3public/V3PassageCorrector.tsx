import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Check, ListOrdered, Loader2, Plus, RefreshCw, Save, ShieldCheck, Sparkles, Trash2, Undo2, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getProvider, getProviderKey } from '@/services/aiWritingService';
import {
  BOOK_BRIEF_EVENT, bookTypography, countWords, dedupeFactMemory, hasEmojis, insertSourcePassage, listSourcePassages,
  missingProtectedTerms, narrativeForBook, readBookBrief, removeSourcePassage, replaceSourcePassage, stripEmojis,
  upsertPolished, updateCorrectedPassage, writeBookBrief, type BookBrief,
} from '@/lib/v3/bookBrief';
import { saveBookDraftToCloud } from '@/lib/v3/bookDraftCloud';
import V3TypographyBar from '@/components/v3public/V3TypographyBar';
import V3NextStepCard from '@/components/v3public/V3NextStepCard';


/** Papier crème : la couleur du livre, à l'écran comme dans l'aperçu. */
const CREAM = '#FBF6E8';

/** Emojis sobres proposés à l'auteur pour en placer lui-même. */
const MANUAL_EMOJIS = ['🙂', '❤️', '✨', '🌿', '📖', '🎶', '☀️', '🕊️'];

/**
 * Un seul livre à l'écran : chaque passage est lisible sur papier crème, et les
 * actions (modifier, corriger, valider, supprimer) apparaissent sous le passage
 * choisi. L'original de l'auteur n'est jamais écrasé.
 */
export default function V3PassageCorrector({ mode = 'book', onDone }: {
  mode?: 'book' | 'biography';
  /** « J'ai fini de raconter » : ouvre l'étape ② Mon sommaire. */
  onDone?: () => void;
}) {
  const [brief, setBrief] = useState<BookBrief>({});
  const [busy, setBusy] = useState<number | null>(null);
  const [runningAll, setRunningAll] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [draftText, setDraftText] = useState('');
  const [addingAfter, setAddingAfter] = useState<number | null>(null);
  const [addition, setAddition] = useState('');
  const [editingCorrection, setEditingCorrection] = useState<number | null>(null);
  const [correctedDraft, setCorrectedDraft] = useState('');
  const [autoState, setAutoState] = useState<'idle' | 'working' | 'error'>('idle');
  const [showBook, setShowBook] = useState(false);
  const [undoBrief, setUndoBrief] = useState<BookBrief | null>(null);
  /** Passage dont la correction est revenue plus courte que les mots de l'auteur. */
  const [shortWarning, setShortWarning] = useState<number | null>(null);
  /** Le nettoyage automatique des réponses courtes n'a lieu qu'une fois par ouverture. */
  const cleanedRef = useRef(false);


  useEffect(() => {
    const sync = () => setBrief(readBookBrief() || {});
    sync();
    window.addEventListener(BOOK_BRIEF_EVENT, sync);
    return () => window.removeEventListener(BOOK_BRIEF_EVENT, sync);
  }, []);

  const passages = useMemo(() => listSourcePassages(brief.sourceText || ''), [brief.sourceText]);
  const polished = brief.polished || [];
  const entryFor = (index: number) => polished.find((p) => p.index === index);
  const validatedCount = polished.filter((p) => Boolean(p.validatedAt) && Boolean(p.corrected?.trim())).length;

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
    toast.success(`Passage ${index} modifié et enregistré.`);
  };

  /**
   * Passage oublié : il est inséré à sa place, immédiatement enregistré.
   * La correction n'est jamais lancée toute seule : c'est un clic de l'auteur.
   */
  const addPassage = (afterIndex: number) => {
    if (!addition.trim()) return;
    const inserted = insertSourcePassage(readBookBrief() || {}, afterIndex, addition);
    const newIndex = afterIndex + 1;
    const next = patch({ ...inserted, pendingPolishIndex: undefined });
    void persist(next);
    setAddingAfter(null);
    setAddition('');
    setSelected(newIndex);
    toast.success(`Passage ${newIndex} ajouté et enregistré. Cliquez sur « Corriger ce passage » quand vous voulez.`);
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
          emojis: brief.emojis !== false,
          userApiKey,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const corrected = String((data as any)?.corrected || '').trim();
      if (!corrected) throw new Error('Réponse illisible, réessayez.');
      const missing = missingProtectedTerms(original, corrected);
      const current = readBookBrief() || {};
      const next = patch({
        polished: upsertPolished(current, { index, original, corrected }),
        pendingPolishIndex: current.pendingPolishIndex === index ? undefined : current.pendingPolishIndex,
      });
      void persist(next);
      if (automatic) setAutoState('idle');
      if ((data as any)?.shorter) {
        setShortWarning(index);
        toast.warning(`Passage ${index} : le Génie a rendu un texte plus court que le vôtre. Vos mots restent intacts.`);
      } else {
        setShortWarning((value) => (value === index ? null : value));
      }
      if (missing.length) {
        toast.warning(
          `Passage ${index} : vérifiez ${missing.join(', ')} dans la proposition. Vos mots d’origine restent intacts.`,
        );
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
    toast.success(`Passage ${index} validé — il entrera dans le livre ainsi.`);
  };

  const keepOriginal = (index: number) => {
    const current = readBookBrief() || {};
    const next = patch({ polished: (current.polished || []).filter((p) => p.index !== index) });
    void persist(next);
    toast.success(`Passage ${index} : vos mots d’origine sont conservés.`);
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
    toast.success(`Passage ${index} : emojis retirés.`);
  };

  /**
   * Sort une réponse courte du livre : elle devient une information retenue par
   * le Génie, sans jamais être perdue.
   */
  const moveToFacts = (index: number) => {
    const current = readBookBrief() || {};
    const text = (listSourcePassages(current.sourceText || '')[index - 1] || '').trim();
    if (!text) return;
    const withoutPassage = removeSourcePassage(current, index);
    const next = patch({
      ...withoutPassage,
      factMemory: dedupeFactMemory([...(current.factMemory || []), text]),
    });
    void persist(next);
    setSelected(null);
    toast.success('Cette réponse quitte le livre : le Génie la garde comme information à respecter.');
  };

  /**
   * Les réponses très courtes rangées par erreur dans le livre : on les sort
   * toutes d'un clic, avec possibilité d'annuler.
   */
  const shortAnswers = passages
    .map((text, i) => ({ index: i + 1, words: countWords(text) }))
    .filter((p) => p.words > 0 && p.words < 25);

  const cleanShortAnswers = () => {
    const before = readBookBrief() || {};
    let current: BookBrief = before;
    const facts: string[] = [...(before.factMemory || [])];
    for (const { index } of [...shortAnswers].reverse()) {
      const text = (listSourcePassages(current.sourceText || '')[index - 1] || '').trim();
      if (text) facts.push(text);
      current = removeSourcePassage(current, index);
    }
    const next = patch({ ...current, factMemory: dedupeFactMemory(facts) });
    void persist(next);
    setSelected(null);
    setUndoBrief(before);
    toast.success('Vos réponses courtes quittent le livre : le Génie les garde en mémoire.');
  };

  /**
   * Les réponses très courtes sortent du livre toutes seules, une seule fois par
   * livre : elles deviennent des informations retenues, annulable d'un clic.
   */
  useEffect(() => {
    if (!shortAnswers.length || cleanedRef.current) return;
    cleanedRef.current = true;
    cleanShortAnswers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shortAnswers.length]);

  const undoClean = () => {
    if (!undoBrief) return;
    const next = patch(undoBrief);
    void persist(next);
    setUndoBrief(null);
    toast.success('C’est revenu comme avant.');
  };

  const deletePassage = (index: number) => {
    if (!window.confirm(`Supprimer définitivement le passage ${index} de votre livre ?`)) return;
    const next = patch(removeSourcePassage(readBookBrief() || {}, index));
    void persist(next);
    setSelected(null);
    toast.success(`Passage ${index} supprimé.`);
  };

  /** Le livre lisible : uniquement ce que le Génie a corrigé (validé ou proposé). */
  const readable = passages
    .map((original, i) => {
      const index = i + 1;
      const entry = entryFor(index);
      return { index, original, entry, validated: Boolean(entry?.validatedAt), text: entry?.corrected?.trim() || '' };
    })
    .filter((item) => Boolean(item.text));

  /** Ce qui n'est pas encore corrigé : rangé sous le livre, jamais perdu. */
  const todo = passages
    .map((original, i) => ({ index: i + 1, original }))
    .filter(({ index }) => !entryFor(index)?.corrected?.trim());
  const todoWords = todo.reduce((total, item) => total + countWords(item.original), 0);

  const typography = bookTypography(brief);
  const bookStyle = {
    fontFamily: typography.fontFamily,
    fontSize: `${typography.fontSize}px`,
    lineHeight: typography.lineHeight,
    textAlign: (typography.justify ? 'justify' : 'left') as 'justify' | 'left',
    hyphens: 'auto' as const,
  };

  /** Les actions d'un morceau : identiques dans le livre et dans « À corriger ». */
  const actionsPanel = (index: number, original: string, entry: ReturnType<typeof entryFor>, validated: boolean) => (
    <>
      <div className="mt-2 flex flex-wrap gap-2">
        {editing === index ? (
          <button type="button" onClick={() => saveOriginalEdit(index)} className="v3-btn v3-btn-primary text-[11px]">
            <Save className="h-3 w-3" /> Enregistrer mes modifications
          </button>
        ) : (
          <button type="button" onClick={() => { setEditingCorrection(null); setEditing(index); setDraftText(original); }}
            className="v3-btn v3-btn-outline text-[11px]">
            Modifier mes mots
          </button>
        )}
        <button type="button" onClick={() => correct(index)} disabled={busy === index || runningAll}
          className="v3-btn v3-btn-outline text-[11px] disabled:opacity-50">
          {busy === index ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
          {entry?.corrected ? 'Recorriger' : 'Corriger ce morceau'}
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
          <button type="button" onClick={() => { setEditing(null); setEditingCorrection(index); setCorrectedDraft(entry.corrected); }}
            className="v3-btn v3-btn-outline text-[11px]">
            Modifier ce texte
          </button>
        ))}
        {(entry?.corrected || validated) && (
          <button type="button" onClick={() => keepOriginal(index)} className="v3-btn v3-btn-ghost text-[11px]">
            <Undo2 className="h-3 w-3" /> Garder mes mots d’origine
          </button>
        )}
        {hasEmojis(entry?.corrected || original) && (
          <button type="button" onClick={() => removeEmojis(index)} className="v3-btn v3-btn-ghost text-[11px]">
            Retirer les emojis
          </button>
        )}
        <button type="button" onClick={() => setAddingAfter(addingAfter === index ? null : index)} className="v3-btn v3-btn-ghost text-[11px]">
          <Plus className="h-3 w-3" /> Ajouter un passage ici
        </button>
        <button type="button" onClick={() => moveToFacts(index)} className="v3-btn v3-btn-ghost text-[11px]">
          Ce n’est pas du récit → information à retenir
        </button>
        <button type="button" onClick={() => deletePassage(index)} className="v3-btn v3-btn-ghost text-[11px]" style={{ color: '#b42318' }}>
          <Trash2 className="h-3 w-3" /> Supprimer
        </button>
      </div>

      {(editing === index || editingCorrection === index) && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px]" style={{ color: 'var(--v3-muted)' }}>Ajouter un emoji :</span>
          {MANUAL_EMOJIS.map((emoji) => (
            <button key={emoji} type="button" className="rounded-lg border px-2 py-1 text-[13px]"
              style={{ borderColor: 'rgba(201,168,76,0.5)', background: '#fff' }}
              onClick={() => {
                if (editingCorrection === index) setCorrectedDraft((value) => `${value} ${emoji}`);
                else setDraftText((value) => `${value} ${emoji}`);
              }}>
              {emoji}
            </button>
          ))}
        </div>
      )}

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
    </>
  );

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

  if (!passages.length) {
    return (
      <div className="rounded-[22px] border p-4" style={{ borderColor: 'var(--v3-border)', background: '#fff' }}>
        <span className="v3-chip v3-chip-orange text-[11px]">
          <Wand2 className="h-3 w-3" /> Votre livre — rien ne s’efface
        </span>
        <p className="mt-2 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
          Écrivez ou collez votre texte ci-dessus, même avec des fautes. Chaque envoi devient un
          passage de votre livre, que le Génie vous rend corrigé et développé, jamais résumé.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-[22px] border p-4" style={{ borderColor: 'rgba(201,168,76,0.55)', background: '#fff' }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="v3-chip v3-chip-orange text-[11px]">
          <Wand2 className="h-3 w-3" /> Votre livre
        </span>
        <span className="text-[11px]" style={{ color: 'var(--v3-muted)' }}>
          {passages.length} passage(s) · {originalWords.toLocaleString('fr-FR')} mots écrits →{' '}
          <strong style={{ color: '#0f6b4a' }}>{bookWords.toLocaleString('fr-FR')} mots dans le livre</strong>
          {validatedCount > 0 ? ` · ${validatedCount} corrigé(s) et validé(s)` : ''}
        </span>
      </div>

      {shortAnswers.length > 0 && (
        <div className="mt-3 rounded-2xl border p-3" style={{ borderColor: 'rgba(201,168,76,0.6)', background: '#FBF6E8' }}>
          <p className="text-[12.5px]" style={{ color: 'var(--v3-ink)' }}>
            {shortAnswers.length} réponse(s) très courte(s) se trouvent dans votre livre
            (passage{shortAnswers.length > 1 ? 's' : ''} {shortAnswers.map((p) => p.index).join(', ')}).
            Ce sont des précisions données au Génie, pas du récit.
          </p>
          <button type="button" onClick={cleanShortAnswers} className="v3-btn v3-btn-primary mt-2 text-[11.5px]">
            Sortir ces réponses du livre
          </button>
        </div>
      )}

      {undoBrief && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px]" style={{ color: 'var(--v3-muted)' }}>
          Vos réponses courtes ont quitté le livre.
          <button type="button" onClick={undoClean} className="v3-btn v3-btn-ghost text-[11.5px]">Annuler</button>
        </div>
      )}



      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[12px]" style={{ color: 'var(--v3-muted)' }}>
          Cliquez sur un passage pour le modifier, le corriger ou le supprimer.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex items-center gap-1.5 text-[11.5px]" style={{ color: 'var(--v3-ink)' }}>
            <input type="checkbox" checked={brief.emojis !== false}
              onChange={(event) => {
                const next = patch({ emojis: event.target.checked });
                void persist(next);
                toast.success(event.target.checked
                  ? 'Le Génie pourra glisser au maximum un emoji discret par passage.'
                  : 'Le Génie n’ajoutera plus aucun emoji.');
              }} />
            Quelques emojis dans mon texte
          </label>
          <button type="button" onClick={() => setShowBook((value) => !value)} className="v3-btn v3-btn-outline text-[11px]">
            <BookOpen className="h-3 w-3" /> {showBook ? 'Réduire la lecture' : 'Agrandir la lecture'}
          </button>
        </div>
      </div>

      {/* Le livre : un seul texte continu, sur papier crème, avec ses actions. */}
      {shortWarning !== null && (
        <p className="mt-3 rounded-xl border px-3 py-2 text-[12px]" style={{ borderColor: '#b45309', color: '#8a4b09', background: '#fff7ed' }}>
          Passage {shortWarning} : la version rendue était plus courte que vos mots. Vos mots d’origine
          sont conservés — relancez « Corriger ce passage » ou complétez-le vous-même avec « Modifier mes mots ».
        </p>
      )}

      <V3TypographyBar brief={brief} onChange={setBrief} />

      {/* Le livre : un seul texte continu, sans numéro ni étiquette. */}
      <div className={`mt-3 overflow-y-auto rounded-2xl border px-5 py-4 ${showBook ? 'max-h-[85vh]' : 'max-h-[46rem]'}`}
        style={{ borderColor: 'rgba(201,168,76,0.5)', background: CREAM }}>
        {readable.length === 0 ? (
          <p className="text-[13px]" style={{ color: 'var(--v3-muted)' }}>
            Votre livre se remplira ici dès la première correction. Vos textes sont enregistrés :
            ouvrez « À corriger » juste en dessous et cliquez sur « Tout corriger ».
          </p>
        ) : (
          readable.map(({ index, text, entry, validated }) => (
            <section key={`book-${index}`} className="mb-4 rounded-lg px-2 py-1"
              style={{ background: selected === index ? '#fffdf6' : 'transparent' }}>
              <div role="button" tabIndex={0}
                onClick={() => setSelected(selected === index ? null : index)}
                onKeyDown={(event) => { if (event.key === 'Enter') setSelected(selected === index ? null : index); }}
                className="cursor-pointer">
                {editingCorrection === index ? (
                  <textarea value={correctedDraft} onChange={(event) => setCorrectedDraft(event.target.value)} rows={12}
                    onClick={(event) => event.stopPropagation()}
                    className="w-full rounded-lg border px-2 py-2 outline-none"
                    style={{ borderColor: 'rgba(201,168,76,0.6)', color: 'var(--v3-ink)', background: '#fff', ...bookStyle }} />
                ) : (
                  <p className="whitespace-pre-wrap" style={{ color: 'var(--v3-ink)', ...bookStyle }}>{text}</p>
                )}
                {!validated && (
                  <p className="mt-1 text-[11px]" style={{ color: '#8a6d1f' }}>
                    Correction proposée par le Génie ({countWords(entry?.corrected || '')} mots) — à valider.
                  </p>
                )}
              </div>
              {selected === index && actionsPanel(index, passages[index - 1] || '', entry, validated)}
            </section>
          ))
        )}
      </div>

      {todo.length > 0 && (
        <details className="mt-3 rounded-2xl border p-3" open style={{ borderColor: 'rgba(201,168,76,0.5)', background: '#fff' }}>
          <summary className="cursor-pointer text-[12.5px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
            À corriger — {todo.length} morceau{todo.length > 1 ? 'x' : ''} de votre récit ({todoWords.toLocaleString('fr-FR')} mots)
          </summary>
          <p className="mt-1 text-[12px]" style={{ color: 'var(--v3-muted)' }}>
            Ces textes sont enregistrés mot pour mot. Ils entreront dans le livre dès qu'ils seront corrigés.
          </p>
          <button type="button" onClick={correctAll} disabled={runningAll || busy !== null}
            className="v3-btn v3-btn-primary mt-2 text-[11.5px] disabled:opacity-50">
            {runningAll ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            Tout corriger
          </button>
          <div className="mt-3 space-y-3">
            {todo.map(({ index, original }) => (
              <div key={`todo-${index}`} className="rounded-xl border p-3" style={{ borderColor: 'rgba(201,168,76,0.3)', background: CREAM }}>
                {editing === index ? (
                  <textarea value={draftText} onChange={(event) => setDraftText(event.target.value)} rows={10}
                    className="w-full rounded-lg border px-2 py-2 outline-none"
                    style={{ borderColor: 'rgba(201,168,76,0.6)', color: 'var(--v3-ink)', background: '#fff', ...bookStyle }} />
                ) : (
                  <p className="whitespace-pre-wrap" style={{ color: 'var(--v3-ink)', ...bookStyle }}>{original}</p>
                )}
                {actionsPanel(index, original, entryFor(index), false)}
              </div>
            ))}
          </div>
        </details>
      )}

      <V3NextStepCard brief={brief} onOutline={onDone} />

      {autoState === 'working' && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs" style={{ borderColor: 'rgba(201,168,76,0.5)', color: '#8a6d1f' }}>
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Votre dernier passage est enregistré. Le Génie prépare sa version corrigée…
        </p>
      )}
      {autoState === 'error' && (
        <p className="mt-3 text-xs" style={{ color: '#b45309' }}>La correction automatique n’a pas abouti. Votre texte est conservé : ouvrez le passage et utilisez « Corriger ce passage ».</p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={correctAll} disabled={runningAll || busy !== null}
          className="v3-btn v3-btn-primary text-xs disabled:opacity-50">
          {runningAll ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          Corriger tout mon livre
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
    </div>
  );
}
