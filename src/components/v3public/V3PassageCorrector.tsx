import { useEffect, useMemo, useState } from 'react';
import { Check, Loader2, RefreshCw, ShieldCheck, Sparkles, Undo2, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getProvider, getProviderKey } from '@/services/aiWritingService';
import {
  BOOK_BRIEF_EVENT, countWords, listSourcePassages, narrativeForBook, readBookBrief,
  upsertPolished, writeBookBrief, type BookBrief,
} from '@/lib/v3/bookBrief';

/**
 * « Comme Copilot » : l'auteur écrit ses idées telles qu'elles viennent, le Génie
 * les lui rend corrigées et développées, et chaque passage validé est enregistré
 * pour finir dans le livre. L'original n'est jamais écrasé.
 */
export default function V3PassageCorrector({ mode = 'book' }: { mode?: 'book' | 'biography' }) {
  const [brief, setBrief] = useState<BookBrief>({});
  const [busy, setBusy] = useState<number | null>(null);
  const [runningAll, setRunningAll] = useState(false);

  useEffect(() => {
    const sync = () => setBrief(readBookBrief() || {});
    sync();
    window.addEventListener(BOOK_BRIEF_EVENT, sync);
    return () => window.removeEventListener(BOOK_BRIEF_EVENT, sync);
  }, []);

  const passages = useMemo(() => listSourcePassages(brief.sourceText || ''), [brief.sourceText]);
  const polished = brief.polished || [];
  const entryFor = (index: number) => polished.find((p) => p.index === index);
  const validatedCount = polished.filter((p) => p.validatedAt).length;

  const originalWords = passages.reduce((t, p) => t + countWords(p), 0);
  const bookWords = countWords(narrativeForBook(brief));

  const patch = (values: Partial<BookBrief>) => {
    const next = { ...(readBookBrief() || {}), ...values };
    setBrief(next);
    writeBookBrief(next);
    return next;
  };

  /** Demande au Génie la version corrigée d'un passage (jamais moins de mots). */
  const correct = async (index: number): Promise<boolean> => {
    const original = passages[index - 1];
    if (!original) return false;
    setBusy(index);
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
          userApiKey,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const corrected = String((data as any)?.corrected || '').trim();
      if (!corrected) throw new Error('Réponse illisible, réessayez.');
      const current = readBookBrief() || {};
      patch({ polished: upsertPolished(current, { index, original, corrected }) });
      if ((data as any)?.shorter) {
        toast.warning(`Passage ${index} : la version corrigée est plus courte, relancez la correction.`);
      }
      return true;
    } catch (e: any) {
      toast.error(e?.message || 'Le Génie est indisponible pour le moment.');
      return false;
    } finally {
      setBusy(null);
    }
  };

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
    patch({ polished: upsertPolished(current, { ...entry, validatedAt: new Date().toISOString() }) });
    toast.success(`Passage ${index} validé — il entrera dans le livre ainsi.`);
  };

  const keepOriginal = (index: number) => {
    const current = readBookBrief() || {};
    patch({ polished: (current.polished || []).filter((p) => p.index !== index) });
    toast.success(`Passage ${index} : vos mots d’origine sont conservés.`);
  };

  const validateAll = () => {
    const current = readBookBrief() || {};
    const now = new Date().toISOString();
    const next = (current.polished || []).map((p) =>
      p.corrected && countWords(p.corrected) >= countWords(p.original)
        ? { ...p, validatedAt: p.validatedAt || now }
        : p,
    );
    patch({ polished: next });
    toast.success('Toutes les corrections prêtes sont validées.');
  };

  if (!passages.length) {
    return (
      <div className="rounded-[22px] border p-4" style={{ borderColor: 'var(--v3-border)', background: '#fff' }}>
        <span className="v3-chip v3-chip-orange text-[11px]">
          <Wand2 className="h-3 w-3" /> Vos idées, corrigées et enregistrées
        </span>
        <p className="mt-2 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
          Écrivez vos souvenirs ou vos idées dans le dialogue, même avec des fautes : ils apparaîtront
          ici passage par passage, et le Génie vous rendra chaque passage corrigé, développé et prêt
          pour le livre. Vos mots d’origine sont toujours conservés.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[22px] border p-4" style={{ borderColor: 'rgba(201,168,76,0.55)', background: '#fff' }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="v3-chip v3-chip-orange text-[11px]">
          <Wand2 className="h-3 w-3" /> Vos idées, corrigées et enregistrées
        </span>
        <span className="text-[11px]" style={{ color: 'var(--v3-muted)' }}>
          {validatedCount}/{passages.length} passage(s) validé(s) · {originalWords} mots écrits →{' '}
          <strong style={{ color: '#0f6b4a' }}>{bookWords} mots dans le livre</strong>
        </span>
      </div>

      <p className="mt-2 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
        Vous écrivez comme vous parlez. Le Génie corrige l’orthographe, la ponctuation et développe
        vos phrases sans jamais retirer un fait ni écrire moins de mots que vous. Chaque passage
        validé est enregistré et servira à la rédaction du livre.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={correctAll} disabled={runningAll || busy !== null}
          className="v3-btn v3-btn-primary text-xs disabled:opacity-50">
          {runningAll ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          Corriger tous mes passages
        </button>
        <button type="button" onClick={validateAll} className="v3-btn v3-btn-outline text-xs">
          <ShieldCheck className="h-3.5 w-3.5" /> Tout valider
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {passages.map((original, i) => {
          const index = i + 1;
          const entry = entryFor(index);
          const validated = Boolean(entry?.validatedAt);
          return (
            <div key={index} className="rounded-2xl border p-3"
              style={{
                borderColor: validated ? 'rgba(15,107,74,0.45)' : 'rgba(201,168,76,0.45)',
                background: validated ? 'rgba(15,107,74,0.05)' : 'rgba(201,168,76,0.05)',
              }}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#8a6d1f' }}>
                  Passage {index}
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
                  <p className="mt-1 whitespace-pre-wrap text-[12.5px] leading-relaxed" style={{ color: 'var(--v3-ink)' }}>
                    {original}
                  </p>
                </div>
                <div className="rounded-xl border bg-white p-2.5" style={{ borderColor: 'rgba(201,168,76,0.5)' }}>
                  <div className="text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: '#8a6d1f' }}>
                    Version corrigée {entry?.corrected ? `(${countWords(entry.corrected)})` : ''}
                  </div>
                  {entry?.corrected ? (
                    <p className="mt-1 whitespace-pre-wrap text-[12.5px] leading-relaxed" style={{ color: 'var(--v3-ink)' }}>
                      {entry.corrected}
                    </p>
                  ) : (
                    <p className="mt-1 text-[12px]" style={{ color: 'var(--v3-muted)' }}>
                      Pas encore corrigé.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" onClick={() => correct(index)} disabled={busy === index || runningAll}
                  className="v3-btn v3-btn-outline text-[11px] disabled:opacity-50">
                  {busy === index ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                  {entry?.corrected ? 'Recorriger' : 'Corriger ce passage'}
                </button>
                {entry?.corrected && !validated && (
                  <button type="button" onClick={() => validate(index)} className="v3-btn v3-btn-primary text-[11px]">
                    <Check className="h-3 w-3" /> Valider pour le livre
                  </button>
                )}
                {(entry?.corrected || validated) && (
                  <button type="button" onClick={() => keepOriginal(index)} className="v3-btn v3-btn-ghost text-[11px]">
                    <Undo2 className="h-3 w-3" /> Garder mon texte original
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
