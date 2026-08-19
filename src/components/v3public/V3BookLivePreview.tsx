/**
 * Aperçu réel du livre, affiché sous la fiche du projet : la page de titre, le
 * sommaire et les chapitres retenus (modifié > corrigé > brut) mis en page comme
 * dans le livre final. Pas d'accordéon : on lit le livre en continu.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Eye, EyeOff, Printer } from 'lucide-react';
import type { BookBrief } from '@/lib/v3/bookBrief';
import {
  effectiveChapterText, readWrittenProgress, WRITTEN_CHAPTERS_EVENT, type WrittenProgress,
} from '@/lib/v3/writtenChapters';

function paragraphsOf(text: string): string[] {
  return String(text || '')
    .split(/\n{2,}|\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function V3BookLivePreview({ brief }: { brief: BookBrief }) {
  const [progress, setProgress] = useState<WrittenProgress>({ chapters: [], total: 0, activeIndex: -1 });
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const sync = () => setProgress(readWrittenProgress());
    sync();
    window.addEventListener(WRITTEN_CHAPTERS_EVENT, sync);
    return () => window.removeEventListener(WRITTEN_CHAPTERS_EVENT, sync);
  }, []);

  const chapters = useMemo(
    () => progress.chapters
      .slice()
      .sort((a, b) => a.index - b.index)
      .map((c) => ({ ...c, text: effectiveChapterText(c) }))
      .filter((c) => c.text.trim().length > 0),
    [progress.chapters],
  );

  const totalWords = chapters.reduce((sum, c) => sum + c.words, 0);
  const pages = Math.max(1, Math.round(totalWords / 250));
  const title = brief.title?.trim() || 'Projet sans titre';

  return (
    <section className="rounded-[22px] border p-4 md:p-5" style={{ borderColor: 'var(--v3-border)', background: '#fff' }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="v3-chip v3-chip-orange text-[11px]"><BookOpen className="h-3 w-3" /> Aperçu du livre</span>
        <div className="flex items-center gap-2">
          {brief.projectId && (
            <Link to={`/v3/book/${brief.projectId}`} className="text-[11px] underline" style={{ color: 'var(--v3-muted)' }}>
              Aperçu plein écran
            </Link>
          )}
          <button type="button" onClick={() => window.print()}
            className="inline-flex items-center gap-1 text-[11px] underline" style={{ color: 'var(--v3-muted)' }}>
            <Printer className="h-3 w-3" /> Imprimer
          </button>
          <button type="button" onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1 text-[11px] underline" style={{ color: 'var(--v3-muted)' }}>
            {open ? <><EyeOff className="h-3 w-3" /> Masquer</> : <><Eye className="h-3 w-3" /> Afficher</>}
          </button>
        </div>
      </div>

      <p className="mt-1 text-[11px]" style={{ color: 'var(--v3-muted)' }}>
        {chapters.length
          ? `${chapters.length} chapitre(s) · ${totalWords.toLocaleString('fr-FR')} mots · ≈ ${pages} page(s) · version retenue (corrigée ou modifiée)`
          : 'Le livre s’affichera ici, mis en page, dès le premier chapitre rédigé.'}
      </p>

      {open && chapters.length > 0 && (
        <div
          className="mt-3 max-h-[70vh] overflow-y-auto rounded-2xl border px-5 py-6 md:px-8"
          style={{ borderColor: 'rgba(0,0,0,0.08)', background: '#fffdf7' }}
        >
          {/* Page de titre */}
          <header className="border-b pb-6 text-center" style={{ borderColor: 'rgba(201,168,76,0.4)' }}>
            <h2 className="v3-serif text-2xl font-bold leading-snug" style={{ color: 'var(--v3-ink)' }}>{title}</h2>
            {brief.subtitle?.trim() && (
              <p className="v3-serif mt-1 text-[15px] italic" style={{ color: 'var(--v3-muted)' }}>{brief.subtitle}</p>
            )}
            {brief.author?.trim() && (
              <p className="mt-3 text-[12px] uppercase tracking-[0.18em]" style={{ color: 'var(--v3-muted)' }}>
                {brief.author}
              </p>
            )}
          </header>

          {/* Sommaire */}
          <nav className="mt-6">
            <h3 className="v3-serif text-center text-[13px] uppercase tracking-[0.2em]" style={{ color: 'var(--v3-muted)' }}>
              Table des matières
            </h3>
            <ol className="mx-auto mt-3 max-w-md space-y-1 text-[13px]" style={{ color: 'var(--v3-ink)' }}>
              {chapters.map((c, i) => (
                <li key={`toc-${c.index}`} className="flex items-baseline gap-2">
                  <a href={`#apercu-ch-${c.index}`} className="flex-1 truncate hover:underline">
                    {i + 1}. {c.title}
                  </a>
                  <span className="text-[11px]" style={{ color: 'var(--v3-muted)' }}>{c.words.toLocaleString('fr-FR')} mots</span>
                </li>
              ))}
            </ol>
          </nav>

          {/* Corps du livre */}
          {chapters.map((c, i) => (
            <article key={c.index} id={`apercu-ch-${c.index}`} className="mt-8 border-t pt-6" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
              <p className="text-center text-[11px] uppercase tracking-[0.22em]" style={{ color: 'var(--v3-muted)' }}>
                Chapitre {i + 1}
              </p>
              <h4 className="v3-serif mt-1 text-center text-xl font-bold" style={{ color: 'var(--v3-ink)' }}>{c.title}</h4>
              <div className="v3-serif mt-4 space-y-3 text-[14.5px] leading-[1.8]" style={{ color: 'var(--v3-ink)' }}>
                {paragraphsOf(c.text).map((p, pi) => (
                  <p key={pi} style={pi === 0 ? undefined : { textIndent: '1.4em' }} className="text-justify">{p}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
