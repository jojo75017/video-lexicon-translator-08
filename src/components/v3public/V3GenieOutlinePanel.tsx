import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ListOrdered, History, RotateCcw, PenLine, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getProvider, getProviderKey } from '@/services/aiWritingService';
import { BOOK_BRIEF_EVENT, readBookBrief, writeBookBrief, type BookBrief } from '@/lib/v3/bookBrief';
import { loadOutlineVersions, type OutlineVersion } from '@/lib/v3/genieThread';
import {
  readWrittenProgress, replaceWrittenChapter, WRITTEN_CHAPTERS_EVENT, type WrittenProgress,
} from '@/lib/v3/writtenChapters';
import V3OutlinePanel from './V3OutlinePanel';

/**
 * Colonne de droite : « Sommaire » (ce que l'IA a compris, versions restaurables)
 * et « Déjà écrit » (les chapitres rédigés, relisibles et corrigeables) — visible
 * pendant toute la rédaction, et qui s'ouvre d'elle-même sur le texte dès que la
 * rédaction commence.
 */
export default function V3GenieOutlinePanel({ outlineMode }: { outlineMode?: 'full' | 'guided' }) {
  const [brief, setBrief] = useState<BookBrief>({});
  const [versions, setVersions] = useState<OutlineVersion[]>([]);
  const [tab, setTab] = useState<'outline' | 'written'>('outline');
  const [progress, setProgress] = useState<WrittenProgress>({ chapters: [], total: 0, activeIndex: -1 });
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [fixing, setFixing] = useState<number | null>(null);
  const [showStory, setShowStory] = useState(false);
  const autoSwitched = useRef(false);

  useEffect(() => {
    const sync = () => setBrief(readBookBrief() || {});
    sync();
    window.addEventListener(BOOK_BRIEF_EVENT, sync);
    return () => window.removeEventListener(BOOK_BRIEF_EVENT, sync);
  }, []);

  useEffect(() => {
    const sync = () => setProgress(readWrittenProgress());
    sync();
    window.addEventListener(WRITTEN_CHAPTERS_EVENT, sync);
    return () => window.removeEventListener(WRITTEN_CHAPTERS_EVENT, sync);
  }, []);

  // Dès le premier chapitre rédigé, la colonne montre le texte sans qu'on cherche.
  useEffect(() => {
    if (autoSwitched.current || progress.chapters.length === 0) return;
    autoSwitched.current = true;
    setTab('written');
    setOpenIndex(progress.chapters[progress.chapters.length - 1].index);
  }, [progress.chapters.length]);

  useEffect(() => {
    loadOutlineVersions(brief.projectId || null).then(setVersions);
  }, [brief.projectId, brief.outlineValidated, (brief.outline || []).length]);

  const patch = (values: Partial<BookBrief>) => {
    setBrief((prev) => {
      const next = { ...prev, ...values };
      writeBookBrief(next);
      return next;
    });
  };

  const restore = (version: OutlineVersion) => {
    patch({ outline: version.chapters, chapters: version.chapters.length, outlineValidated: true });
    toast.success(`Sommaire v${version.version} restauré (${version.chapters.length} chapitres).`);
  };

  const correctChapter = async (chapter: WrittenChapter) => {
    setFixing(chapter.index);
    try {
      const provider = getProvider();
      const { data, error } = await supabase.functions.invoke('strict-proofread', {
        body: {
          chapterTitle: chapter.title,
          chapterContent: chapter.content,
          mode: 'strict',
          userProvider: provider,
          userApiKey: getProviderKey(provider),
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const corrected = String((data as any)?.texteCorrige || '').trim();
      if (!corrected) throw new Error('La correction est revenue vide.');
      replaceWrittenChapter(chapter.index, corrected);
      toast.success(`« ${chapter.title} » corrigé (${(data as any)?.nombreCorrections || 0} corrections).`);
    } catch (e: any) {
      toast.error(e?.message || 'Correction impossible pour le moment.');
    } finally {
      setFixing(null);
    }
  };

  const outline = brief.outline || [];
  const totalWords = written.reduce((sum, c) => sum + c.words, 0);
  const writtenTitles = new Set(written.map((c) => c.title.toLowerCase().trim()));

  return (
    <div className="space-y-4">
      <div className="rounded-[22px] border p-4 md:p-5" style={{ borderColor: 'var(--v3-border)', background: '#fff' }}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="v3-chip v3-chip-orange text-[11px]"><ListOrdered className="h-3 w-3" /> Votre livre en direct</span>
          <span className="text-[11px]" style={{ color: 'var(--v3-muted)' }}>
            {written.length
              ? `${written.length} chapitre(s) écrit(s) sur ${outline.length || brief.chapters || '?'} · ${totalWords.toLocaleString('fr-FR')} mots`
              : outline.length ? `${outline.length} chapitres${brief.outlineValidated ? ' · validé' : ' · à valider'}` : 'aucun chapitre pour le moment'}
          </span>
        </div>

        <h3 className="v3-serif mt-2 text-xl font-bold" style={{ color: 'var(--v3-ink)' }}>
          {brief.title?.trim() || 'Projet sans titre'}
        </h3>
        <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
          {[brief.category, brief.tone, brief.author ? `par ${brief.author}` : null,
            brief.wordsPerChapter ? `${brief.wordsPerChapter} mots / chapitre` : null,
          ].filter(Boolean).map((chip) => (
            <span key={String(chip)} className="rounded-full border px-2.5 py-1"
              style={{ borderColor: 'rgba(201,168,76,0.6)', color: 'var(--v3-ink)' }}>{chip}</span>
          ))}
        </div>

        {/* Onglets */}
        <div className="mt-3 flex gap-2">
          {([['outline', 'Sommaire'], ['written', `Déjà écrit${written.length ? ` (${written.length})` : ''}`]] as const).map(([id, label]) => (
            <button key={id} type="button" onClick={() => setTab(id)}
              className="rounded-full border px-3 py-1.5 text-[11.5px] transition"
              style={{
                borderColor: tab === id ? 'var(--v3-gold, #c9a84c)' : 'rgba(0,0,0,0.12)',
                background: tab === id ? 'rgba(201,168,76,0.12)' : '#fff',
                color: 'var(--v3-ink)',
              }}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'outline' ? (
          outline.length > 0 ? (
            <ol className="mt-3 max-h-72 space-y-1 overflow-y-auto pr-1 text-[13px]" style={{ color: 'var(--v3-ink)' }}>
              {outline.map((c, i) => {
                const done = writtenTitles.has(String(c.titre || '').toLowerCase().trim()) || i < written.length;
                return (
                  <li key={`${c.numero}-${i}`} className="rounded-xl border px-3 py-2" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                    <strong>{i + 1}.</strong> {c.titre}
                    <span className="ml-1 text-[10.5px]" style={{ color: done ? '#0f766e' : 'var(--v3-muted)' }}>
                      · {done ? 'écrit' : 'à écrire'}
                    </span>
                    {c.objectif ? <span className="block text-[11px]" style={{ color: 'var(--v3-muted)' }}>{c.objectif}</span> : null}
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="mt-3 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
              Dites au Génie de quoi parle votre livre : vous construisez le sommaire ensemble, 3 chapitres à la fois.
            </p>
          )
        ) : (
          written.length > 0 ? (
            <div className="mt-3 max-h-[28rem] space-y-2 overflow-y-auto pr-1">
              {written.map((c) => (
                <div key={c.index} className="rounded-xl border px-3 py-2 text-[12.5px]" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                  <button type="button" onClick={() => setOpenIndex(openIndex === c.index ? null : c.index)}
                    className="w-full text-left">
                    <strong style={{ color: 'var(--v3-ink)' }}>{c.index + 1}. {c.title}</strong>
                    <span className="block text-[10.5px]" style={{ color: 'var(--v3-muted)' }}>
                      {c.words.toLocaleString('fr-FR')} mots · {openIndex === c.index ? 'replier' : 'lire'}
                    </span>
                  </button>
                  <p className="mt-1 whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
                    {openIndex === c.index ? c.content : `${c.content.slice(0, 220)}…`}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button type="button" disabled={fixing === c.index} onClick={() => correctChapter(c)}
                      className="v3-btn v3-btn-outline text-[11px] disabled:opacity-50">
                      {fixing === c.index ? <Loader2 className="h-3 w-3 animate-spin" /> : <PenLine className="h-3 w-3" />}
                      Corriger ce chapitre
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
              <Sparkles className="mr-1 inline h-3.5 w-3.5" />
              Dès que la rédaction démarre, chaque chapitre écrit apparaît ici : vous le relisez et
              vous le faites corriger sans quitter la page.
            </p>
          )
        )}

        {versions.length > 0 && (
          <div className="mt-4 border-t pt-3" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
              <History className="h-3.5 w-3.5" /> Versions du sommaire
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {versions.map((v) => (
                <button key={v.id} type="button" onClick={() => restore(v)}
                  className="rounded-full border px-3 py-1.5 text-[11px] transition hover:opacity-80"
                  style={{ borderColor: 'rgba(201,168,76,0.6)', color: 'var(--v3-ink)' }}>
                  <RotateCcw className="mr-1 inline h-3 w-3" /> v{v.version} · {v.chapters.length} ch. ·{' '}
                  {new Date(v.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Réglage avancé : générer ou coller un sommaire complet d'un coup */}
      <details className="rounded-[22px] border p-3" style={{ borderColor: 'var(--v3-border)', background: '#fff' }}>
        <summary className="cursor-pointer text-[11.5px] font-semibold" style={{ color: 'var(--v3-muted)' }}>
          Sommaire complet d’un coup (avancé)
        </summary>
        <div className="mt-3">
          <V3OutlinePanel brief={brief} onChange={patch} initialMode={outlineMode} />
        </div>
      </details>
    </div>
  );
}
