import { useEffect, useState } from 'react';
import { ListOrdered, History, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { BOOK_BRIEF_EVENT, readBookBrief, writeBookBrief, type BookBrief } from '@/lib/v3/bookBrief';
import { loadOutlineVersions, type OutlineVersion } from '@/lib/v3/genieThread';
import V3OutlinePanel from './V3OutlinePanel';

/**
 * « Votre sommaire en cours » — affiché juste sous le dialogue Génie.
 * On voit le livre tel que l'IA l'a compris, le sommaire numéroté, et chaque
 * version validée reste restaurable (un livre de vie s'écrit sur des semaines).
 */
export default function V3GenieOutlinePanel({ outlineMode }: { outlineMode?: 'full' | 'guided' }) {
  const [brief, setBrief] = useState<BookBrief>({});
  const [versions, setVersions] = useState<OutlineVersion[]>([]);

  useEffect(() => {
    const sync = () => setBrief(readBookBrief() || {});
    sync();
    window.addEventListener(BOOK_BRIEF_EVENT, sync);
    return () => window.removeEventListener(BOOK_BRIEF_EVENT, sync);
  }, []);

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

  const outline = brief.outline || [];

  return (
    <div className="space-y-4">
      <div className="rounded-[22px] border p-4 md:p-5" style={{ borderColor: 'var(--v3-border)', background: '#fff' }}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="v3-chip v3-chip-orange text-[11px]"><ListOrdered className="h-3 w-3" /> Votre sommaire en cours</span>
          <span className="text-[11px]" style={{ color: 'var(--v3-muted)' }}>
            {outline.length ? `${outline.length} chapitres${brief.outlineValidated ? ' · validé' : ' · à valider'}` : 'aucun chapitre pour le moment'}
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

        {outline.length > 0 ? (
          <ol className="mt-3 max-h-72 space-y-1 overflow-y-auto pr-1 text-[13px]" style={{ color: 'var(--v3-ink)' }}>
            {outline.map((c, i) => (
              <li key={`${c.numero}-${i}`} className="rounded-xl border px-3 py-2" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                <strong>{i + 1}.</strong> {c.titre}
                {c.objectif ? <span className="block text-[11px]" style={{ color: 'var(--v3-muted)' }}>{c.objectif}</span> : null}
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
            Dites au Génie de quoi parle votre livre : il construit le sommaire avec vous, chapitre par chapitre.
          </p>
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

      {/* Génération / validation du sommaire (aucune fiche à remplir) */}
      <V3OutlinePanel brief={brief} onChange={patch} initialMode={outlineMode} />
    </div>
  );
}
