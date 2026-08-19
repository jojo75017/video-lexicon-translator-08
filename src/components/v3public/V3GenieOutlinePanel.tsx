import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ListOrdered, History, RotateCcw, Sparkles, Wand2, SlidersHorizontal, Lock, BarChart3, Star,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  BOOK_BRIEF_EVENT, dedupeSourceText, isFieldLocked, lockField, readBookBrief, unlockField, writeBookBrief,
  type BookBrief, type LockableField,
} from '@/lib/v3/bookBrief';
import { countTextWords, loadOutlineVersions, type OutlineVersion } from '@/lib/v3/genieThread';
import {
  readWrittenProgress, WRITTEN_CHAPTERS_EVENT, type WrittenProgress,
} from '@/lib/v3/writtenChapters';
import V3OutlinePanel from './V3OutlinePanel';
import V3WrittenBookTab from './V3WrittenBookTab';
import V3BookLivePreview from './V3BookLivePreview';


/** Une ligne de réglage : le champ, et le cadenas quand l'auteur a décidé. */
function SettingField({
  label, field, locked, onUnlock, children,
}: {
  label: string;
  field: LockableField;
  locked: boolean;
  onUnlock: (field: LockableField) => void;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between gap-2 text-[10.5px]" style={{ color: 'var(--v3-muted)' }}>
        <span>{label}</span>
        {locked && (
          <button type="button" onClick={() => onUnlock(field)} className="inline-flex items-center gap-1 underline">
            <Lock className="h-3 w-3" /> Laisser le Génie proposer
          </button>
        )}
      </span>
      <span className="mt-0.5 block">{children}</span>
    </label>
  );
}

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
  
  // Le récit doit être visible immédiatement : ne jamais donner l'impression
  // qu'il a été remplacé par le court synopsis de l'IA.
  const [showStory, setShowStory] = useState(true);
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

  useEffect(() => {
    const showWritten = () => {
      setTab('written');
      const current = readWrittenProgress();
      const latest = current.chapters[current.chapters.length - 1];
      if (latest) setOpenIndex(latest.index);
      document.getElementById('sommaire-ia')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    window.addEventListener('v3:show-written-book', showWritten);
    return () => window.removeEventListener('v3:show-written-book', showWritten);
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




  const outline = brief.outline || [];
  const written = progress.chapters;
  const totalChapters = outline.length || progress.total || brief.chapters || 0;
  const totalWords = written.reduce((sum, c) => sum + c.words, 0);
  const writtenTitles = new Set(written.map((c) => c.title.toLowerCase().trim()));
  const writing = progress.activeIndex >= 0 && progress.activeIndex < totalChapters;

  // Affichage garanti sans répétition : un même souvenir n'apparaît qu'une fois.
  const sourceText = dedupeSourceText(String(brief.sourceText || ''));
  const sourceWords = countTextWords(sourceText);
  const estimatedTotal = (Number(brief.chapters) || 0) * (Number(brief.wordsPerChapter) || 0);

  /** Saisie d'un réglage : on enregistre et on verrouille le champ. */
  const setSetting = (field: LockableField, raw: string) => {
    const current = readBookBrief() || {};
    let value: string | number | undefined;
    if (field === 'chapters') {
      const n = Number(raw);
      value = raw.trim() === '' ? undefined : Math.min(40, Math.max(3, Math.round(n) || 3));
    } else if (field === 'wordsPerChapter') {
      const n = Number(raw);
      value = raw.trim() === '' ? undefined : Math.min(3500, Math.max(800, Math.round(n) || 800));
    } else {
      value = raw;
    }
    const next: BookBrief = { ...current, [field]: value, lockedFields: lockField(current, field) } as BookBrief;
    setBrief(next);
    writeBookBrief(next);
  };

  const unlock = (field: LockableField) => {
    const current = readBookBrief() || {};
    const next: BookBrief = { ...current, lockedFields: unlockField(current, field) };
    setBrief(next);
    writeBookBrief(next);
    toast.success('Le Génie pourra de nouveau proposer cette valeur.');
  };


  return (
    <div className="space-y-4">
      <div className="rounded-[22px] border p-4 md:p-5" style={{ borderColor: 'var(--v3-border)', background: '#fff' }}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="v3-chip v3-chip-orange text-[11px]"><ListOrdered className="h-3 w-3" /> Votre livre en direct</span>
          <span className="text-[11px]" style={{ color: 'var(--v3-muted)' }}>
            {written.length
              ? `${written.length} chapitre(s) écrit(s) sur ${totalChapters || '?'} · ${totalWords.toLocaleString('fr-FR')} mots`
              : outline.length ? `${outline.length} chapitres${brief.outlineValidated ? ' · validé' : ' · à valider'}` : 'aucun chapitre pour le moment'}
          </span>
        </div>

        <h3 className="v3-serif mt-2 text-xl font-bold" style={{ color: 'var(--v3-ink)' }}>
          {brief.title?.trim() || 'Projet sans titre'}
        </h3>
        <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
          {[brief.category, brief.tone, brief.author ? `par ${brief.author}` : null,
          ].filter(Boolean).map((chip) => (
            <span key={String(chip)} className="rounded-full border px-2.5 py-1"
              style={{ borderColor: 'rgba(201,168,76,0.6)', color: 'var(--v3-ink)' }}>{chip}</span>
          ))}
        </div>

        {/* Réglages du livre : c'est l'auteur qui décide, l'IA ne les touche plus */}
        <div className="mt-3 rounded-2xl border p-3" style={{ borderColor: 'rgba(201,168,76,0.45)', background: 'rgba(201,168,76,0.06)' }}>
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
              <SlidersHorizontal className="h-3.5 w-3.5" /> Réglages du livre
            </span>
            <span className="text-[10.5px]" style={{ color: 'var(--v3-muted)' }}>
              ≈ {estimatedTotal.toLocaleString('fr-FR')} mots au total
            </span>
          </div>

          <div className="mt-2 space-y-2">
            <SettingField label="Titre" field="title" locked={isFieldLocked(brief, 'title')} onUnlock={unlock}>
              <input type="text" value={brief.title || ''} placeholder="Le titre de votre livre"
                onChange={(e) => setSetting('title', e.target.value)}
                className="w-full rounded-lg border px-2.5 py-1.5 text-[12.5px]"
                style={{ borderColor: 'rgba(0,0,0,0.15)', color: 'var(--v3-ink)' }} />
            </SettingField>

            <SettingField label="Sous-titre" field="subtitle" locked={isFieldLocked(brief, 'subtitle')} onUnlock={unlock}>
              <input type="text" value={brief.subtitle || ''} placeholder="Sous-titre (facultatif)"
                onChange={(e) => setSetting('subtitle', e.target.value)}
                className="w-full rounded-lg border px-2.5 py-1.5 text-[12.5px]"
                style={{ borderColor: 'rgba(0,0,0,0.15)', color: 'var(--v3-ink)' }} />
            </SettingField>

            <div className="grid grid-cols-2 gap-2">
              <SettingField label="Chapitres" field="chapters" locked={isFieldLocked(brief, 'chapters')} onUnlock={unlock}>
                <input type="number" min={3} max={40} value={brief.chapters ?? ''} placeholder="12"
                  onChange={(e) => setSetting('chapters', e.target.value)}
                  className="w-full rounded-lg border px-2.5 py-1.5 text-[12.5px]"
                  style={{ borderColor: 'rgba(0,0,0,0.15)', color: 'var(--v3-ink)' }} />
              </SettingField>
              <SettingField label="Mots / chapitre" field="wordsPerChapter" locked={isFieldLocked(brief, 'wordsPerChapter')} onUnlock={unlock}>
                <input type="number" min={800} max={3500} step={100} value={brief.wordsPerChapter ?? ''} placeholder="2500"
                  onChange={(e) => setSetting('wordsPerChapter', e.target.value)}
                  className="w-full rounded-lg border px-2.5 py-1.5 text-[12.5px]"
                  style={{ borderColor: 'rgba(0,0,0,0.15)', color: 'var(--v3-ink)' }} />
              </SettingField>
            </div>
          </div>
          <p className="mt-2 text-[10.5px]" style={{ color: 'var(--v3-muted)' }}>
            Dès que vous saisissez une valeur, elle est verrouillée : le Génie ne la remplacera plus.
          </p>
        </div>

        {/* Vos souvenirs : les mots exacts de l'auteur, intégralement conservés */}
        {sourceText ? (
          <div className="mt-3 rounded-2xl border p-3" style={{ borderColor: 'rgba(0,0,0,0.10)' }}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11.5px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
                Vos souvenirs — texte intégral
              </span>
              <span className="text-[10.5px]" style={{ color: 'var(--v3-muted)' }}>
                {sourceWords.toLocaleString('fr-FR')} mots · aucun mot supprimé
              </span>
            </div>
            <p className="mt-1.5 whitespace-pre-wrap text-[12px] leading-relaxed" style={{ color: 'var(--v3-ink)' }}>
              {showStory ? sourceText : `${sourceText.slice(0, 320)}${sourceText.length > 320 ? '…' : ''}`}
            </p>
            {sourceText.length > 320 && (
              <button type="button" onClick={() => setShowStory((v) => !v)} className="mt-1 text-[11px] underline"
                style={{ color: 'var(--v3-muted)' }}>
                {showStory ? 'Replier temporairement' : 'Afficher mon récit intégral'}
              </button>
            )}
          </div>
        ) : null}

        {/* Résumé court généré par l'IA : simple étiquette, jamais votre récit */}
        {(brief.description || '').trim() && (
          <details className="mt-2 text-[12px]" style={{ color: 'var(--v3-muted)' }}>
            <summary className="cursor-pointer text-[11.5px]">Résumé du livre (généré par l’IA)</summary>
            <p className="mt-1 whitespace-pre-wrap leading-relaxed">{brief.description}</p>
          </details>
        )}

        {/* Progression de la rédaction */}
        {(written.length > 0 || writing) && (
          <div className="mt-3">
            <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: 'rgba(201,168,76,0.15)' }}>
              <div className="h-full rounded-full transition-all"
                style={{ width: `${totalChapters ? Math.min(100, Math.round((written.length / totalChapters) * 100)) : 0}%`, background: 'var(--v3-orange-600, #c9a84c)' }} />
            </div>
            <p className="mt-1 text-[11px]" style={{ color: 'var(--v3-muted)' }}>
              {writing && written.length < totalChapters
                ? `Chapitre ${Math.min(totalChapters, written.length + 1)} sur ${totalChapters} en cours · ${totalWords.toLocaleString('fr-FR')} mots écrits`
                : `${written.length} chapitre(s) sur ${totalChapters || '?'} · ${totalWords.toLocaleString('fr-FR')} mots`}
            </p>
          </div>
        )}

        {/* Onglets */}
        <div className="mt-3 flex gap-2">
          {([['outline', 'Sommaire'], ['written', `Mon livre${written.length ? ` (${written.length})` : ''}`]] as const).map(([id, label]) => (
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
                const inProgress = !done && writing && i === written.length;
                return (
                  <li key={`${c.numero}-${i}`} className="rounded-xl border px-3 py-2" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                    <strong>{i + 1}.</strong> {c.titre}
                    <span className="ml-1 text-[10.5px]" style={{ color: done ? '#0f766e' : 'var(--v3-muted)' }}>
                      · {done ? 'écrit' : inProgress ? 'en cours…' : 'à écrire'}
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
          <V3WrittenBookTab progress={progress} brief={brief} openIndex={openIndex} onToggle={setOpenIndex} />
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

      {/* Aperçu réel du livre, juste sous la fiche du projet */}
      <V3BookLivePreview brief={brief} />

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
