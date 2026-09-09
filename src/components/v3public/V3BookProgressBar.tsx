import { useMemo } from 'react';
import { BookOpen, PenLine } from 'lucide-react';
import { countWords, listSourcePassages, suggestChapterCount, type BookBrief } from '@/lib/v3/bookBrief';

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

/**
 * Avancement réel du livre : ce qui est écrit, ce que le Génie a corrigé,
 * et ce que l'auteur a validé. Aucun calcul inventé : tout vient du brouillon.
 */
export default function V3BookProgressBar({ brief, onResume }: {
  brief: BookBrief;
  /** Ramène l'auteur au premier passage qui attend encore quelque chose. */
  onResume?: () => void;
}) {
  const stats = useMemo(() => {
    const passages = listSourcePassages(brief.sourceText || '');
    const polished = brief.polished || [];
    const writtenWords = passages.reduce((total, passage) => total + countWords(passage), 0);
    const perChapter = Math.min(3500, Math.max(1200, Number(brief.wordsPerChapter) || 2500));
    const chapters = Math.max(3, Number(brief.chapters) || suggestChapterCount(writtenWords, perChapter));
    const targetWords = chapters * perChapter;
    const corrected = polished.filter((p) => Boolean(p.corrected?.trim())).length;
    const validated = polished.filter((p) => Boolean(p.validatedAt) && Boolean(p.corrected?.trim())).length;
    return {
      passages: passages.length,
      writtenWords,
      targetWords,
      written: clamp(targetWords ? (writtenWords / targetWords) * 100 : 0),
      corrected: clamp(passages.length ? (corrected / passages.length) * 100 : 0),
      validated: clamp(passages.length ? (validated / passages.length) * 100 : 0),
      validatedCount: validated,
      correctedCount: corrected,
    };
  }, [brief]);

  const rows = [
    { label: 'Écrit', value: stats.written, color: '#c9a84c', detail: `${stats.writtenWords.toLocaleString('fr-FR')} mots sur ~${stats.targetWords.toLocaleString('fr-FR')} prévus` },
    { label: 'Corrigé', value: stats.corrected, color: '#0f6b4a', detail: `${stats.correctedCount} passage(s) sur ${stats.passages}` },
    { label: 'Validé', value: stats.validated, color: '#064e3b', detail: `${stats.validatedCount} passage(s) sur ${stats.passages}` },
  ];

  return (
    <div className="mt-3 rounded-2xl border p-3" style={{ borderColor: 'rgba(201,168,76,0.55)', background: '#FFFDF7' }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
          <BookOpen className="h-3.5 w-3.5" /> Avancement de votre livre
        </span>
        {onResume && (
          <button type="button" onClick={onResume} className="v3-btn v3-btn-primary text-[11.5px]">
            <PenLine className="h-3.5 w-3.5" /> Reprendre mon livre
          </button>
        )}
      </div>

      <div className="mt-2 space-y-2">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-center justify-between text-[11.5px]" style={{ color: 'var(--v3-muted)' }}>
              <span><strong style={{ color: 'var(--v3-ink)' }}>{row.label}</strong> — {row.detail}</span>
              <span className="font-semibold" style={{ color: row.color }}>{row.value} %</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full" style={{ background: 'rgba(201,168,76,0.18)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${row.value}%`, background: row.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
