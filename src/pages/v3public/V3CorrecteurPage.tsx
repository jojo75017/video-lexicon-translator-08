import { useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  FileText, FileType2, Globe, ClipboardPaste, Upload, Loader2, Wand2, ShieldCheck,
  CheckCircle2, AlertTriangle, RefreshCw, FileDown, Sparkles, StopCircle,
  Pencil, Save, Undo2, RotateCcw,
} from 'lucide-react';

import { BackButton } from '@/components/v3/BackButton';
import { importManuscript } from '@/lib/bookperfect/importManuscript';
import { importFromPdf } from '@/lib/import/importFromPdf';
import { importFromUrl } from '@/lib/import/importFromUrl';
import { buildManuscriptFromText } from '@/lib/import/buildManuscriptFromText';
import type { Manuscript } from '@/lib/bookperfect/types';
import { diffWords } from '@/lib/bookperfect/textDiff';
import {
  proofreadChapters, proofreadChapter, correctionBreakdown, effectiveText,
  CORRECTION_TYPE_LABELS, type ChapterProofread, type ProofreadMode,
} from '@/lib/correcteur/proofreadBook';

import { exportProfessionalDocx } from '@/utils/docxExportEngine';
import { exportEbookToPdf } from '@/lib/ebookPdfExporter';

type Source = 'doc' | 'pdf' | 'url' | 'paste';

const SOURCES: { id: Source; icon: any; title: string; formats: string }[] = [
  { id: 'doc', icon: FileText, title: 'Document', formats: '.docx · .md · .txt' },
  { id: 'pdf', icon: FileType2, title: 'PDF', formats: '.pdf (texte)' },
  { id: 'url', icon: Globe, title: 'Article web', formats: 'https://…' },
  { id: 'paste', icon: ClipboardPaste, title: 'Coller le texte', formats: 'Texte libre' },
];

const MODES: { id: ProofreadMode; title: string; desc: string; bullets: string[] }[] = [
  {
    id: 'strict',
    title: 'Correction stricte',
    desc: 'Votre style reste identique, mot pour mot.',
    bullets: ['Orthographe, grammaire, accords', 'Ponctuation et dialogues', 'Anglicismes involontaires', 'Zéro réécriture, zéro ajout'],
  },
  {
    id: 'polish',
    title: 'Correction + polissage',
    desc: 'La correction stricte, plus un allègement mesuré.',
    bullets: ['Tout ce que fait la correction stricte', 'Répétitions et lourdeurs allégées', 'Temps narratifs harmonisés', 'Enchaînements fluidifiés'],
  },
];

export default function V3CorrecteurPage() {
  const [source, setSource] = useState<Source>('doc');
  const [importing, setImporting] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const [pasteValue, setPasteValue] = useState('');
  const [pasteTitle, setPasteTitle] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);

  const [manuscript, setManuscript] = useState<Manuscript | null>(null);
  const [mode, setMode] = useState<ProofreadMode>('strict');
  const [chapters, setChapters] = useState<ChapterProofread[]>([]);
  const [running, setRunning] = useState(false);
  const [current, setCurrent] = useState(0);
  const [openChapter, setOpenChapter] = useState<string | null>(null);
  const [editingChapter, setEditingChapter] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState('');
  const [retrying, setRetrying] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const stopRef = useRef(false);


  const doneCount = chapters.filter((c) => c.status === 'done').length;
  const failedCount = chapters.filter((c) => c.status === 'failed').length;
  const acceptedCount = chapters.filter((c) => c.accepted).length;
  const totalCorrections = chapters.reduce((s, c) => s + c.corrections.length, 0);
  const breakdown = useMemo(() => correctionBreakdown(chapters), [chapters]);
  const avgQuality = doneCount
    ? Math.round(chapters.filter((c) => c.status === 'done').reduce((s, c) => s + (c.quality || 0), 0) / doneCount)
    : 0;

  const loadManuscript = useCallback((m: Manuscript) => {
    setManuscript(m);
    setChapters(m.chapters.map((c, i) => ({
      chapterId: c.id,
      index: i,
      title: c.title,
      original: c.content,
      corrected: '',
      corrections: [],
      quality: 0,
      status: 'pending',
      accepted: false,
    })));
    setOpenChapter(null);
    setCurrent(0);
    toast.success(`${m.chapters.length} chapitre(s) importés · ${m.wordCount.toLocaleString('fr-FR')} mots.`);
  }, []);

  const runImport = useCallback(async (fn: () => Promise<Manuscript>) => {
    setImporting(true);
    try {
      loadManuscript(await fn());
    } catch (e: any) {
      toast.error(e?.message || 'Import impossible.');
    } finally {
      setImporting(false);
    }
  }, [loadManuscript]);

  const startCorrection = useCallback(async () => {
    if (!chapters.length) return;
    stopRef.current = false;
    setRunning(true);
    const working = chapters.map((c) => ({ ...c }));
    try {
      await proofreadChapters(
        working,
        mode,
        ({ index, chapter }) => {
          // Un chapitre corrigé est retenu par défaut : l'auteur peut refuser ensuite.
          working[index] = chapter.status === 'done' ? { ...chapter, accepted: true } : chapter;
          setCurrent(index);
          setChapters(working.map((c) => ({ ...c })));
        },
        () => stopRef.current,
      );
      const ko = working.filter((c) => c.status === 'failed').length;
      if (stopRef.current) toast.info('Correction interrompue — le travail déjà fait est conservé.');
      else if (ko) toast.warning(`Correction terminée avec ${ko} chapitre(s) en échec — relancez-les individuellement.`);
      else toast.success('Correction terminée. Relisez chapitre par chapitre puis exportez.');
    } finally {
      setRunning(false);
    }
  }, [chapters, mode]);

  const retryChapter = useCallback(async (id: string) => {
    const target = chapters.find((c) => c.chapterId === id);
    if (!target) return;
    setRetrying(id);
    try {
      const res = await proofreadChapter(target.title, target.original, mode);
      setChapters((prev) => prev.map((c) => c.chapterId === id
        ? { ...c, status: 'done', corrected: res.corrected, corrections: res.corrections, quality: res.quality, accepted: true, rejected: [], edited: undefined, error: undefined }
        : c));
      toast.success(`Chapitre corrigé : ${target.title || `Chapitre ${target.index + 1}`}`);
    } catch (e: any) {
      toast.error(e?.message || 'Correction impossible.');
    } finally {
      setRetrying(null);
    }
  }, [chapters, mode]);

  const setAccepted = (id: string, accepted: boolean) =>
    setChapters((prev) => prev.map((c) => (c.chapterId === id ? { ...c, accepted } : c)));

  const acceptAll = () => {
    setChapters((prev) => prev.map((c) => (c.status === 'done' ? { ...c, accepted: true } : c)));
    toast.success('Toutes les corrections sont retenues pour l\'export.');
  };

  /** Refuse (ou rétablit) une correction précise : le mot d'origine revient dans le texte. */
  const toggleCorrection = (id: string, corrIndex: number) =>
    setChapters((prev) => prev.map((c) => {
      if (c.chapterId !== id) return c;
      const rejected = c.rejected || [];
      const next = rejected.includes(corrIndex)
        ? rejected.filter((i) => i !== corrIndex)
        : [...rejected, corrIndex];
      return { ...c, rejected: next, accepted: true };
    }));

  const openEditor = (c: ChapterProofread) => {
    setEditingChapter(c.chapterId);
    setEditDraft(effectiveText(c));
  };

  const saveEdit = (id: string) => {
    setChapters((prev) => prev.map((c) => (c.chapterId === id ? { ...c, edited: editDraft, accepted: true } : c)));
    setEditingChapter(null);
    toast.success('Votre version manuelle est enregistrée pour ce chapitre.');
  };

  const resetEdit = (id: string) => {
    setChapters((prev) => prev.map((c) => (c.chapterId === id ? { ...c, edited: undefined } : c)));
    setEditingChapter(null);
    toast.info('Version manuelle supprimée — la correction IA est rétablie.');
  };

  /** Texte retenu pour l'export : version manuelle, puis corrigé accepté, sinon l'original. */
  const finalChapters = useMemo(
    () => chapters.map((c) => ({
      title: c.title || `Chapitre ${c.index + 1}`,
      content: effectiveText(c),
      subChapters: [] as { title: string; content?: string }[],
    })),
    [chapters],
  );


  const exportWord = useCallback(async () => {
    if (!manuscript) return;
    setExporting(true);
    try {
      await exportProfessionalDocx({
        title: `${manuscript.title} (corrigé)`,
        chapters: finalChapters,
        includeTableOfContents: true,
        includeCoverPage: true,
        includePageNumbers: true,
        expectedChapterCount: finalChapters.length,
      });
      toast.success('Word exporté.');
    } catch (e: any) {
      toast.error(e?.message || 'Export Word impossible.');
    } finally {
      setExporting(false);
    }
  }, [manuscript, finalChapters]);

  const exportPdf = useCallback(async () => {
    if (!manuscript) return;
    setExporting(true);
    try {
      await exportEbookToPdf({
        filename: `${manuscript.title.replace(/\s+/g, '_')}_corrige.pdf`,
        documentTitle: `${manuscript.title} (corrigé)`,
        sections: finalChapters.map((c) => ({
          title: c.title,
          blocks: c.content.split(/\n\s*\n/).filter(Boolean).map((p) => ({ text: p.trim() })),
        })),
      });
      toast.success('PDF exporté.');
    } catch (e: any) {
      toast.error(e?.message || 'Export PDF impossible.');
    } finally {
      setExporting(false);
    }
  }, [manuscript, finalChapters]);

  const progressPct = chapters.length ? Math.round(((doneCount + failedCount) / chapters.length) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-8">
      <BackButton />

      <input ref={fileRef} type="file" accept=".docx,.md,.txt,.rtf" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) runImport(() => importManuscript(f)); e.target.value = ''; }} />
      <input ref={pdfRef} type="file" accept="application/pdf,.pdf" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) runImport(() => importFromPdf(f)); e.target.value = ''; }} />

      <header className="mt-4 mb-8">
        <div className="text-[10px] uppercase tracking-[0.22em] font-semibold" style={{ color: 'var(--v3-gold-600)' }}>
          Écrire · Nouveau
        </div>
        <h1 className="v3-serif text-3xl md:text-4xl font-semibold mt-1" style={{ color: 'var(--v3-emerald)' }}>
          Corriger mon livre
        </h1>
        <p className="mt-2 text-[14px] max-w-2xl" style={{ color: 'var(--v3-muted)' }}>
          Importez votre manuscrit terminé : l'IA le corrige chapitre par chapitre, vous relisez chaque
          correction, puis vous exportez un livre prêt pour Amazon KDP.
        </p>
      </header>

      {/* ÉTAPE 1 — Import */}
      <section className="rounded-2xl border bg-white p-6" style={{ borderColor: 'var(--v3-line)' }}>
        <h2 className="v3-serif text-xl font-semibold" style={{ color: 'var(--v3-emerald)' }}>1 · Importer le manuscrit</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {SOURCES.map((s) => {
            const Icon = s.icon;
            const active = source === s.id;
            return (
              <button key={s.id} type="button" onClick={() => setSource(s.id)}
                className={`text-left rounded-xl border p-3 transition-all ${active ? 'shadow-sm' : 'hover:-translate-y-0.5'}`}
                style={{ borderColor: active ? 'var(--v3-gold)' : 'var(--v3-line)', background: active ? 'var(--v3-gold-soft, #f7f2e3)' : '#fff' }}>
                <Icon className="w-5 h-5" style={{ color: 'var(--v3-emerald)' }} />
                <div className="mt-2 text-sm font-semibold" style={{ color: 'var(--v3-ink)' }}>{s.title}</div>
                <div className="text-[11px]" style={{ color: 'var(--v3-muted)' }}>{s.formats}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          {importing ? (
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--v3-emerald)' }}>
              <Loader2 className="w-4 h-4 animate-spin" /> Import et découpage en chapitres…
            </div>
          ) : source === 'doc' ? (
            <button onClick={() => fileRef.current?.click()} className="v3-btn-primary inline-flex items-center gap-2">
              <Upload className="w-4 h-4" /> Choisir un document
            </button>
          ) : source === 'pdf' ? (
            <button onClick={() => pdfRef.current?.click()} className="v3-btn-primary inline-flex items-center gap-2">
              <Upload className="w-4 h-4" /> Choisir un PDF
            </button>
          ) : source === 'url' ? (
            <div className="flex flex-wrap gap-3">
              <input type="url" value={urlValue} onChange={(e) => setUrlValue(e.target.value)}
                placeholder="https://exemple.com/mon-texte"
                className="flex-1 min-w-[240px] rounded-xl border px-4 py-2.5 text-sm outline-none"
                style={{ borderColor: 'var(--v3-line)' }} />
              <button onClick={() => runImport(() => importFromUrl(urlValue.trim()))} disabled={!urlValue.trim()}
                className="v3-btn-primary inline-flex items-center gap-2 disabled:opacity-50">
                <Globe className="w-4 h-4" /> Importer
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <input type="text" value={pasteTitle} onChange={(e) => setPasteTitle(e.target.value)}
                placeholder="Titre du livre (facultatif)"
                className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none" style={{ borderColor: 'var(--v3-line)' }} />
              <textarea value={pasteValue} onChange={(e) => setPasteValue(e.target.value)} rows={8}
                placeholder="Collez votre manuscrit ici. Les lignes « Chapitre X » ou « ## Titre » sont détectées automatiquement."
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none font-mono" style={{ borderColor: 'var(--v3-line)' }} />
              <button onClick={() => runImport(() => buildManuscriptFromText(pasteValue, `${pasteTitle || 'manuscrit'}.md`, pasteTitle || undefined))}
                disabled={pasteValue.trim().length < 200}
                className="v3-btn-primary inline-flex items-center gap-2 disabled:opacity-50">
                <ClipboardPaste className="w-4 h-4" /> Importer ce texte
              </button>
            </div>
          )}
        </div>

        {manuscript && (
          <div className="mt-5 rounded-xl border p-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]"
            style={{ borderColor: 'var(--v3-line)', background: '#f8fbf9' }}>
            <span className="font-semibold" style={{ color: 'var(--v3-emerald)' }}>{manuscript.title}</span>
            <span style={{ color: 'var(--v3-muted)' }}>{chapters.length} chapitre(s)</span>
            <span style={{ color: 'var(--v3-muted)' }}>{manuscript.wordCount.toLocaleString('fr-FR')} mots</span>
            <span style={{ color: 'var(--v3-muted)' }}>≈ {manuscript.pageEstimate} pages</span>
          </div>
        )}
      </section>

      {/* ÉTAPE 2 — Mode */}
      {manuscript && (
        <section className="mt-6 rounded-2xl border bg-white p-6" style={{ borderColor: 'var(--v3-line)' }}>
          <h2 className="v3-serif text-xl font-semibold" style={{ color: 'var(--v3-emerald)' }}>2 · Choisir le niveau de correction</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {MODES.map((m) => {
              const active = mode === m.id;
              return (
                <button key={m.id} type="button" onClick={() => setMode(m.id)} disabled={running}
                  className="text-left rounded-2xl border p-5 transition-all disabled:opacity-60"
                  style={{ borderColor: active ? 'var(--v3-gold)' : 'var(--v3-line)', background: active ? 'var(--v3-gold-soft, #f7f2e3)' : '#fff' }}>
                  <div className="flex items-center gap-2">
                    {m.id === 'strict' ? <ShieldCheck className="w-5 h-5" style={{ color: 'var(--v3-emerald)' }} />
                      : <Sparkles className="w-5 h-5" style={{ color: 'var(--v3-emerald)' }} />}
                    <span className="v3-serif text-lg font-semibold" style={{ color: 'var(--v3-ink)' }}>{m.title}</span>
                  </div>
                  <p className="mt-1 text-[13px]" style={{ color: 'var(--v3-muted)' }}>{m.desc}</p>
                  <ul className="mt-3 space-y-1">
                    {m.bullets.map((b) => (
                      <li key={b} className="text-[12.5px] flex items-start gap-1.5" style={{ color: 'var(--v3-muted)' }}>
                        <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--v3-gold)' }} /> {b}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {!running ? (
              <button onClick={startCorrection} className="v3-btn-primary inline-flex items-center gap-2">
                <Wand2 className="w-4 h-4" /> {doneCount ? 'Reprendre la correction' : 'Lancer la correction du livre'}
              </button>
            ) : (
              <button onClick={() => { stopRef.current = true; }} className="v3-btn-outline inline-flex items-center gap-2">
                <StopCircle className="w-4 h-4" /> Interrompre
              </button>
            )}
            <span className="text-[12px]" style={{ color: 'var(--v3-muted)' }}>
              Rien n'est écrasé : le texte original reste intact jusqu'à votre validation.
            </span>
          </div>
        </section>
      )}

      {/* ÉTAPE 3 — Progression + relecture */}
      {chapters.length > 0 && (doneCount > 0 || failedCount > 0 || running) && (
        <section className="mt-6 rounded-2xl border bg-white p-6" style={{ borderColor: 'var(--v3-line)' }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="v3-serif text-xl font-semibold" style={{ color: 'var(--v3-emerald)' }}>3 · Relire les corrections</h2>
            <button onClick={acceptAll} disabled={!doneCount} className="v3-btn-outline text-[12px] disabled:opacity-50">
              Tout accepter
            </button>
          </div>

          <div className="mt-4">
            <div className="h-2 rounded-full overflow-hidden" style={{ background: '#e8efec' }}>
              <div className="h-full transition-all" style={{ width: `${progressPct}%`, background: 'var(--v3-emerald)' }} />
            </div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
              <span>{doneCount}/{chapters.length} chapitres corrigés</span>
              <span>{totalCorrections} correction(s)</span>
              {avgQuality > 0 && <span>Qualité orthographique : {avgQuality}/100</span>}
              {failedCount > 0 && <span style={{ color: '#b45309' }}>{failedCount} à relancer</span>}
              <span>{acceptedCount} validé(s)</span>
              {running && <span>En cours : chapitre {current + 1}…</span>}
            </div>
          </div>

          {breakdown.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {breakdown.map((b) => (
                <span key={b.type} className="text-[11.5px] rounded-full border px-2.5 py-1"
                  style={{ borderColor: 'var(--v3-line)', color: 'var(--v3-emerald)', background: '#f8fbf9' }}>
                  {b.label} · {b.count}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 space-y-3">
            {chapters.map((c) => {
              const label = c.title || `Chapitre ${c.index + 1}`;
              const isOpen = openChapter === c.chapterId;
              return (
                <div key={c.chapterId} className="rounded-xl border" style={{ borderColor: 'var(--v3-line)' }}>
                  <div className="flex flex-wrap items-center gap-3 p-3">
                    <button className="flex-1 min-w-[180px] text-left"
                      onClick={() => setOpenChapter(isOpen ? null : c.chapterId)}>
                      <span className="text-sm font-semibold" style={{ color: 'var(--v3-ink)' }}>
                        {c.index + 1}. {label}
                      </span>
                      <span className="ml-2 text-[12px]" style={{ color: 'var(--v3-muted)' }}>
                        {c.status === 'done' && `${c.corrections.length} correction(s)`}
                        {c.status === 'running' && 'correction en cours…'}
                        {c.status === 'pending' && 'en attente'}
                        {c.status === 'failed' && (c.error || 'échec')}
                      </span>
                    </button>

                    {c.status === 'running' && <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--v3-emerald)' }} />}
                    {c.status === 'failed' && (
                      <button onClick={() => retryChapter(c.chapterId)} disabled={retrying === c.chapterId}
                        className="v3-btn-outline text-[12px] inline-flex items-center gap-1.5 disabled:opacity-50">
                        {retrying === c.chapterId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                        Relancer
                      </button>
                    )}
                    {c.status === 'done' && (
                      <>
                        <button onClick={() => { setOpenChapter(c.chapterId); openEditor(c); }}
                          className="v3-btn-outline text-[12px] inline-flex items-center gap-1.5">
                          <Pencil className="w-3.5 h-3.5" /> Corriger à la main
                        </button>
                        {c.accepted ? (
                          <button onClick={() => setAccepted(c.chapterId, false)} className="v3-btn-outline text-[12px] inline-flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#0b6e4c' }} /> Retenu — refuser
                          </button>
                        ) : (
                          <button onClick={() => setAccepted(c.chapterId, true)} className="v3-btn-primary text-[12px]">
                            Accepter ce chapitre
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  {isOpen && c.status === 'done' && (
                    <div className="border-t p-4 space-y-4" style={{ borderColor: 'var(--v3-line)' }}>
                      <div>
                        <div className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--v3-gold-600)' }}>
                          Avant / après {c.edited ? '(version manuelle)' : ''}
                        </div>
                        <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap">
                          {diffWords(c.original, effectiveText(c)).map((seg, i) => (
                            <span key={i}
                              style={
                                seg.type === 'removed'
                                  ? { background: '#fee2e2', textDecoration: 'line-through', color: '#991b1b' }
                                  : seg.type === 'added'
                                    ? { background: '#dcfce7', color: '#065f46' }
                                    : { color: 'var(--v3-ink)' }
                              }>
                              {seg.text}
                            </span>
                          ))}
                        </p>
                      </div>

                      {/* Édition manuelle du chapitre */}
                      {editingChapter === c.chapterId ? (
                        <div>
                          <div className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--v3-gold-600)' }}>
                            Votre version (texte final du chapitre)
                          </div>
                          <textarea value={editDraft} onChange={(e) => setEditDraft(e.target.value)} rows={16}
                            className="w-full rounded-xl border px-4 py-3 text-[13.5px] leading-relaxed outline-none"
                            style={{ borderColor: 'var(--v3-line)' }} />
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button onClick={() => saveEdit(c.chapterId)} className="v3-btn-primary text-[12px] inline-flex items-center gap-1.5">
                              <Save className="w-3.5 h-3.5" /> Enregistrer ma version
                            </button>
                            <button onClick={() => setEditingChapter(null)} className="v3-btn-outline text-[12px]">Annuler</button>
                            {c.edited && (
                              <button onClick={() => resetEdit(c.chapterId)} className="v3-btn-outline text-[12px]">
                                Revenir à la correction IA
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => openEditor(c)} className="v3-btn-outline text-[12px] inline-flex items-center gap-1.5">
                          <Pencil className="w-3.5 h-3.5" /> Modifier le texte de ce chapitre
                        </button>
                      )}

                      {c.corrections.length > 0 && (
                        <div>
                          <div className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--v3-gold-600)' }}>
                            Détail des corrections — refusez celles qui n'ont pas lieu d'être
                          </div>
                          <ul className="space-y-2">
                            {c.corrections.map((corr, i) => {
                              const isRejected = (c.rejected || []).includes(i);
                              return (
                                <li key={i} className="text-[12.5px] rounded-lg border p-2.5"
                                  style={{ borderColor: 'var(--v3-line)', background: isRejected ? '#f8f8f8' : '#fff', opacity: isRejected ? 0.7 : 1 }}>
                                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <span className="font-semibold" style={{ color: 'var(--v3-emerald)' }}>
                                      {CORRECTION_TYPE_LABELS[(corr.type || '').toLowerCase()] || 'Correction'}
                                    </span>
                                    <span style={{ color: '#991b1b', textDecoration: 'line-through' }}>{corr.original}</span>
                                    <span style={{ color: '#065f46', textDecoration: isRejected ? 'line-through' : undefined }}>{corr.corrige}</span>
                                    <button onClick={() => toggleCorrection(c.chapterId, i)}
                                      className="v3-btn-outline text-[11.5px] ml-auto inline-flex items-center gap-1.5">
                                      {isRejected ? <><RotateCcw className="w-3.5 h-3.5" /> Rétablir la correction</> : <><Undo2 className="w-3.5 h-3.5" /> Garder mon mot</>}
                                    </button>
                                  </div>
                                  {corr.explication && (
                                    <div className="mt-1" style={{ color: 'var(--v3-muted)' }}>{corr.explication}</div>
                                  )}
                                  {isRejected && (
                                    <div className="mt-1 text-[11.5px]" style={{ color: '#92400e' }}>
                                      Correction refusée : « {corr.original} » est conservé dans le texte final.
                                    </div>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ÉTAPE 4 — Export */}
      {doneCount > 0 && (
        <section className="mt-6 rounded-2xl border bg-white p-6" style={{ borderColor: 'var(--v3-line)' }}>
          <h2 className="v3-serif text-xl font-semibold" style={{ color: 'var(--v3-emerald)' }}>4 · Exporter le livre corrigé</h2>
          <p className="mt-2 text-[13px]" style={{ color: 'var(--v3-muted)' }}>
            Les chapitres validés partent en version corrigée ; les autres conservent votre texte d'origine.
          </p>
          {acceptedCount < doneCount && (
            <div className="mt-3 flex items-start gap-2 text-[12.5px] rounded-lg border p-3"
              style={{ borderColor: '#fcd34d', background: '#fffbeb', color: '#92400e' }}>
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {doneCount - acceptedCount} chapitre(s) corrigés ne sont pas encore validés — ils seront exportés dans leur version d'origine.
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={exportWord} disabled={exporting} className="v3-btn-primary inline-flex items-center gap-2 disabled:opacity-50">
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />} Exporter en Word
            </button>
            <button onClick={exportPdf} disabled={exporting} className="v3-btn-outline inline-flex items-center gap-2 disabled:opacity-50">
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />} Exporter en PDF
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
