import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  FileText, FileType2, Globe, ClipboardPaste, Upload, Loader2, Wand2, ShieldCheck,
  CheckCircle2, AlertTriangle, RefreshCw, FileDown, Sparkles, StopCircle,
  Pencil, Save, Undo2, RotateCcw, BookOpen, Trash2,
} from 'lucide-react';

import { BackButton } from '@/components/v3/BackButton';
import { importManuscript } from '@/lib/bookperfect/importManuscript';
import { importFromPdf } from '@/lib/import/importFromPdf';
import { importFromUrl } from '@/lib/import/importFromUrl';
import { buildManuscriptFromText } from '@/lib/import/buildManuscriptFromText';
import { readPendingManuscript, clearPendingManuscript } from '@/lib/import/pendingManuscript';
import { deleteAutosaveAsync, readAutosaveAsync, requestPersistentStorage, writeAutosaveAsync } from '@/lib/ebookProjectStorage';
import type { Manuscript } from '@/lib/bookperfect/types';
import { diffWords } from '@/lib/bookperfect/textDiff';
import {
  proofreadChapters, proofreadChapter, correctionBreakdown, effectiveText,
  setProofreadWaitNotifier,
  CORRECTION_TYPE_LABELS, type ChapterProofread, type ProofreadMode,
} from '@/lib/correcteur/proofreadBook';


import { exportProfessionalDocx } from '@/utils/docxExportEngine';
import { exportEbookToPdf } from '@/lib/ebookPdfExporter';
import { useV3Mode } from '@/hooks/useV3Mode';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { normalizeManuscript } from '@/utils/manuscriptNormalizer';
import { getActiveAIKey, getProvider, validateKeyFormat } from '@/services/aiWritingService';

type Source = 'doc' | 'pdf' | 'url' | 'paste';

const CORRECTOR_RECOVERY_SCOPE = 'v3-correcteur-current-book';

interface CorrectorRecovery {
  manuscript: Manuscript;
  chapters: ChapterProofread[];
  mode: ProofreadMode;
  manualReview: boolean;
  savedAt: number;
  cloudProjectId?: string;
}

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAdmin } = useV3Mode();
  const [source, setSource] = useState<Source>('doc');
  const [importing, setImporting] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const [pasteValue, setPasteValue] = useState('');
  const [pasteTitle, setPasteTitle] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);

  const [manuscript, setManuscript] = useState<Manuscript | null>(null);
  const [mode, setMode] = useState<ProofreadMode>('strict');
  /** Décoché par défaut : les corrections sont appliquées automatiquement. */
  const [manualReview, setManualReview] = useState(false);
  const [chapters, setChapters] = useState<ChapterProofread[]>([]);

  const [running, setRunning] = useState(false);
  const [current, setCurrent] = useState(0);
  const [waitInfo, setWaitInfo] = useState<{ seconds: number; reason: string } | null>(null);
  const [openChapter, setOpenChapter] = useState<string | null>(null);

  const [editingChapter, setEditingChapter] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState('');
  const [retrying, setRetrying] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [savingToLibrary, setSavingToLibrary] = useState(false);
  const [savedToLibrary, setSavedToLibrary] = useState(false);
  const [cloudProjectId, setCloudProjectId] = useState<string | null>(null);
  const autoSavePendingRef = useRef(false);
  const stopRef = useRef(false);
  const recoveryReadyRef = useRef(false);
  const [recoveredAt, setRecoveredAt] = useState<number | null>(null);
  const [resetting, setResetting] = useState(false);


  const doneCount = chapters.filter((c) => c.status === 'done').length;
  const failedCount = chapters.filter((c) => c.status === 'failed').length;
  const acceptedCount = chapters.filter((c) => c.accepted).length;
  const totalCorrections = chapters.reduce((s, c) => s + c.corrections.length, 0);
  const breakdown = useMemo(() => correctionBreakdown(chapters), [chapters]);
  const latinRemoved = chapters.reduce((s, c) => s + (c.latinRemoved || 0), 0);
  const latinRemaining = useMemo(
    () => chapters
      .filter((c) => (c.latinRemaining?.length || 0) > 0)
      .map((c) => ({ label: c.title || `Chapitre ${c.index + 1}`, items: c.latinRemaining as string[] })),
    [chapters],
  );
  const avgQuality = doneCount
    ? Math.round(chapters.filter((c) => c.status === 'done').reduce((s, c) => s + (c.quality || 0), 0) / doneCount)
    : 0;
  const endingsFixed = chapters.filter((c) => c.endingFixed).length;
  const endingIssues = chapters.filter((c) => c.endingIssue);
  const blockFailures = chapters.reduce((s, c) => s + (c.blockFailures || 0), 0);


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

  /** Charge un livre déjà présent dans « Mes livres » (?projectId=…), sans réimport de fichier. */
  const loadFromProject = useCallback(async (projectId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('ebook_projects')
      .select('id,title,chapters,number_of_chapters')
      .eq('id', projectId)
      .maybeSingle();
    if (error || !data) {
      toast.error('Ce livre est introuvable — importez le document à la place.');
      return false;
    }
    const normalized = normalizeManuscript(Array.isArray(data.chapters) ? data.chapters : [], {
      expectedCount: Number(data.number_of_chapters) || undefined,
      bookTitle: data.title,
    }).filter((c) => (c.content || '').trim().length > 0);
    if (normalized.length === 0) {
      toast.error('Ce livre n’a pas encore de texte à corriger.');
      return false;
    }
    const chaptersForManuscript = normalized.map((c, i) => ({
      id: `proj-${c.number || i + 1}`,
      index: i,
      title: c.title || `Chapitre ${i + 1}`,
      content: c.content,
      wordCount: c.content.trim().split(/\s+/).filter(Boolean).length,
    }));
    const rawText = chaptersForManuscript.map((c) => `${c.title}\n\n${c.content}`).join('\n\n');
    loadManuscript({
      id: data.id,
      fileName: `${data.title}.docx`,
      title: data.title,
      rawText,
      chapters: chaptersForManuscript,
      wordCount: chaptersForManuscript.reduce((s, c) => s + c.wordCount, 0),
      pageEstimate: Math.max(1, Math.round(chaptersForManuscript.reduce((s, c) => s + c.wordCount, 0) / 280)),
      importedAt: Date.now(),
    });
    return true;
  }, [loadManuscript]);

  // Livre choisi depuis « Mes livres », sinon nouvel import, sinon dernier
  // travail du correcteur. IndexedDB conserve même les manuscrits volumineux.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const projectId = searchParams.get('projectId');
      const fromProject = projectId ? await loadFromProject(projectId) : false;
      if (cancelled) return;
      if (!fromProject) {
        const pending = readPendingManuscript();
        if (pending) {
          if (!cancelled) {
            loadManuscript(pending);
            // Cet import est consommé une seule fois. Aux visites suivantes,
            // la sauvegarde du correcteur (avec les textes corrigés) est prioritaire.
            clearPendingManuscript();
          }
        } else {
          const saved = await readAutosaveAsync<CorrectorRecovery>(CORRECTOR_RECOVERY_SCOPE);
          if (!cancelled && saved?.manuscript && Array.isArray(saved.chapters) && saved.chapters.length > 0) {
            setManuscript(saved.manuscript);
            setChapters(saved.chapters);
            setMode(saved.mode || 'strict');
            setManualReview(Boolean(saved.manualReview));
            setCloudProjectId(saved.cloudProjectId || null);
            setRecoveredAt(saved.savedAt || Date.now());
            toast.success(`Livre retrouvé : ${saved.manuscript.title}`);
          }
        }
      }
      recoveryReadyRef.current = true;
      void requestPersistentStorage();
    })();
    return () => { cancelled = true; };
  }, [loadManuscript, loadFromProject, searchParams]);


  // Sauvegarde automatique après chaque chapitre corrigé, validation ou édition.
  useEffect(() => {
    if (!recoveryReadyRef.current || !manuscript || chapters.length === 0) return;
    const timer = window.setTimeout(() => {
      void writeAutosaveAsync<CorrectorRecovery>(CORRECTOR_RECOVERY_SCOPE, {
        manuscript,
        chapters,
        mode,
        manualReview,
        savedAt: Date.now(),
        cloudProjectId: cloudProjectId || undefined,
      });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [manuscript, chapters, mode, manualReview, cloudProjectId]);

  const runImport = useCallback(async (fn: () => Promise<Manuscript>) => {
    setImporting(true);
    try {
      clearPendingManuscript();
      loadManuscript(await fn());
    } catch (e: any) {
      toast.error(e?.message || 'Import impossible.');
    } finally {
      setImporting(false);
    }
  }, [loadManuscript]);

  // Affichage des temps d'attente (limite de débit) pendant la correction.
  useEffect(() => {
    setProofreadWaitNotifier((info) => setWaitInfo(info));
    return () => setProofreadWaitNotifier(null);
  }, []);

  const startCorrection = useCallback(async (onlyFailed = false) => {
    if (!chapters.length) return;
    const provider = getProvider();
    const activeKey = getActiveAIKey();
    if (!activeKey || !validateKeyFormat(provider, activeKey)) {
      toast.error('Correction non lancée : aucune clé IA valide.', {
        description: 'Ajoutez ou vérifiez votre clé dans Fonctionnalités → Paramétrage des clés. Aucun crédit n’a été consommé.',
      });
      return;
    }
    stopRef.current = false;
    setRunning(true);
    setSavedToLibrary(false);
    autoSavePendingRef.current = true;
    const working = chapters.map((c) => (
      onlyFailed && c.status === 'failed' ? { ...c, status: 'pending' as const, error: undefined } : { ...c }
    ));
    try {
      await proofreadChapters(
        working,
        mode,
        ({ index, chapter }) => {
          // Mode automatique : la correction est retenue d'office pour l'export.
          // Mode relecture : l'auteur valide lui-même chaque chapitre.
          working[index] = chapter.status === 'done' ? { ...chapter, accepted: !manualReview } : chapter;
          setCurrent(index);
          setChapters(working.map((c) => ({ ...c })));
        },
        () => stopRef.current,
      );
      const ko = working.filter((c) => c.status === 'failed').length;
      const latin = working.reduce((s, c) => s + (c.latinRemoved || 0), 0);
      const stuck = working.reduce((s, c) => s + (c.latinRemaining?.length || 0), 0);
      const ends = working.filter((c) => c.endingFixed).length;
      const corrs = working.reduce((s, c) => s + c.corrections.length, 0);
      const extra = [
        latin ? `${latin} expression(s) latine(s) supprimée(s)` : '',
        ends ? `${ends} fin(s) de chapitre complétée(s)` : '',
      ].filter(Boolean).join(' · ');
      if (stopRef.current) toast.info('Correction interrompue — le travail déjà fait est conservé.');
      else if (ko) toast.warning(`Correction terminée avec ${ko} chapitre(s) en échec — utilisez « Reprendre les chapitres en échec ».`);
      else if (manualReview) toast.success('Correction terminée. Relisez chapitre par chapitre puis exportez.');
      else toast.success(
        `Livre corrigé et appliqué · ${corrs} correction(s)${extra ? ` · ${extra}` : ''}. Vous pouvez exporter.`,
      );
      if (stuck > 0) toast.warning(`${stuck} expression(s) en latin résistent — la liste est affichée sous la progression.`);
    } finally {
      setWaitInfo(null);
      setRunning(false);
    }
  }, [chapters, mode, manualReview]);

  const resetCorrection = useCallback(async () => {
    if (!manuscript || running || resetting) return;
    const confirmed = window.confirm(
      'Effacer toute la correction en cours ?\n\n' +
      'Les chapitres corrigés, les erreurs et la progression seront supprimés. ' +
      'Votre manuscrit original et vos livres enregistrés resteront intacts.',
    );
    if (!confirmed) return;

    setResetting(true);
    try {
      // Ferme d'abord la porte à l'ancienne sauvegarde, puis inscrit un état vierge.
      recoveryReadyRef.current = false;
      await deleteAutosaveAsync(CORRECTOR_RECOVERY_SCOPE);
      clearPendingManuscript();

      const freshChapters: ChapterProofread[] = manuscript.chapters.map((chapter, index) => ({
        chapterId: chapter.id,
        index,
        title: chapter.title,
        original: chapter.content,
        corrected: '',
        corrections: [],
        quality: 0,
        status: 'pending',
        accepted: false,
      }));

      setChapters(freshChapters);
      setCurrent(0);
      setWaitInfo(null);
      setOpenChapter(null);
      setEditingChapter(null);
      setEditDraft('');
      setRetrying(null);
      setSavedToLibrary(false);
      setRecoveredAt(null);
      autoSavePendingRef.current = false;

      await writeAutosaveAsync<CorrectorRecovery>(CORRECTOR_RECOVERY_SCOPE, {
        manuscript,
        chapters: freshChapters,
        mode,
        manualReview,
        savedAt: Date.now(),
        cloudProjectId: cloudProjectId || undefined,
      });
      recoveryReadyRef.current = true;
      toast.success('Correction effacée. Vous pouvez relancer tout le livre depuis le chapitre 1.');
    } finally {
      recoveryReadyRef.current = true;
      setResetting(false);
    }
  }, [cloudProjectId, manuscript, manualReview, mode, resetting, running]);


  const retryChapter = useCallback(async (id: string) => {
    const target = chapters.find((c) => c.chapterId === id);
    if (!target) return;
    setRetrying(id);
    try {
      const res = await proofreadChapter(target.title, target.original, mode);
      setChapters((prev) => prev.map((c) => c.chapterId === id
        ? {
            ...c, status: 'done', corrected: res.corrected, corrections: res.corrections,
            quality: res.quality, latinRemoved: res.latinRemoved, latinRemaining: res.latinRemaining,
            accepted: !manualReview, rejected: [], edited: undefined, error: undefined,
          }
        : c));
      toast.success(`Chapitre corrigé : ${target.title || `Chapitre ${target.index + 1}`}`);
    } catch (e: any) {
      toast.error(e?.message || 'Correction impossible.');
    } finally {
      setRetrying(null);
    }
  }, [chapters, mode, manualReview]);


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

  const saveCorrectedBook = useCallback(async () => {
    if (!manuscript || doneCount === 0) return;
    setSavingToLibrary(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Reconnectez-vous pour enregistrer ce livre.');
        return;
      }
      const payload = {
        user_id: user.id,
        title: `${manuscript.title} — corrigé`,
        author_name: '',
        project_type: 'corrected',
        chapters: finalChapters.map((chapter, index) => ({
          id: `corrected-${index + 1}`,
          number: index + 1,
          title: chapter.title,
          content: chapter.content,
          subChapters: [],
        })),
        number_of_chapters: finalChapters.length,
        book_summary: `Livre corrigé le ${new Date().toLocaleDateString('fr-FR')} · ${totalCorrections} correction(s)`,
      };
      const request = cloudProjectId
        ? supabase.from('ebook_projects').update(payload).eq('id', cloudProjectId).select('id').single()
        : supabase.from('ebook_projects').insert(payload).select('id').single();
      const { data, error } = await request;
      if (error) throw error;
      setCloudProjectId(data.id);
      setSavedToLibrary(true);
      toast.success('Livre enregistré dans « Livres corrigés ».');
      if (latinRemaining.length > 0) {
        toast.warning('Des passages latins restent signalés : relancez les chapitres concernés puis mettez à jour.');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Enregistrement impossible.');
    } finally {
      setSavingToLibrary(false);
    }
  }, [manuscript, doneCount, latinRemaining.length, finalChapters, totalCorrections, cloudProjectId]);

  // Enregistrement automatique dès qu'une correction complète est terminée :
  // l'auteur retrouve son livre dans « Livres corrigés » sans rien cliquer.
  useEffect(() => {
    if (!autoSavePendingRef.current || running || !manuscript || doneCount === 0 || savingToLibrary) return;
    autoSavePendingRef.current = false;
    void saveCorrectedBook();
  }, [running, manuscript, doneCount, savingToLibrary, saveCorrectedBook]);

  const progressPct = chapters.length ? Math.round(((doneCount + failedCount) / chapters.length) * 100) : 0;


  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-8">
      <BackButton
        to={isAdmin ? '/admin' : '/v3/hub'}
        label={isAdmin ? 'Tableau de bord admin' : 'Tableau de bord'}
      />

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

      {/* Mode d'emploi visible : 3 étapes, sans jargon. */}
      <div className="mb-6 rounded-2xl border p-5" style={{ borderColor: 'var(--v3-line)', background: '#fbfaf7' }}>
        <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--v3-emerald)' }}>
          <Sparkles className="h-4 w-4" /> Comment ça marche
        </div>
        <ol className="mt-3 grid gap-3 sm:grid-cols-3 text-[13px]" style={{ color: 'var(--v3-muted)' }}>
          <li><span className="font-semibold" style={{ color: 'var(--v3-ink)' }}>1. Choisissez le livre</span><br />Importez un document (Word, PDF, texte) ou ouvrez un livre déjà présent dans « Mes livres » avec le bouton « Corriger ce livre ».</li>
          <li><span className="font-semibold" style={{ color: 'var(--v3-ink)' }}>2. Cliquez sur « Corriger tout le livre »</span><br />L'IA corrige chaque chapitre, applique les corrections et supprime les mots latins.</li>
          <li><span className="font-semibold" style={{ color: 'var(--v3-ink)' }}>3. C'est enregistré tout seul</span><br />Le livre corrigé apparaît dans <button type="button" onClick={() => navigate('/v3/livres-corriges')} className="underline font-semibold" style={{ color: 'var(--v3-emerald)' }}>Livres corrigés</button> et s'exporte en Word ou PDF.</li>
        </ol>
      </div>

      {savedToLibrary && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border p-4" style={{ borderColor: '#a7f3d0', background: '#ecfdf5' }}>
          <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: '#047857' }} />
          <div className="text-sm font-semibold" style={{ color: '#065f46' }}>
            Livre enregistré dans « Livres corrigés »{latinRemaining.length > 0 ? ' — quelques passages latins restent à revoir.' : '.'}
          </div>
          <button onClick={() => navigate('/v3/livres-corriges')} className="v3-btn-outline ml-auto inline-flex items-center gap-2 text-xs">
            <BookOpen className="h-3.5 w-3.5" /> Voir mes livres corrigés
          </button>
        </div>
      )}

      {recoveredAt && manuscript && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border p-4" style={{ borderColor: 'var(--v3-gold)', background: 'var(--v3-gold-soft, #f7f2e3)' }}>
          <Save className="mt-0.5 h-5 w-5 shrink-0" style={{ color: 'var(--v3-emerald)' }} />
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--v3-ink)' }}>Votre livre corrigé a été retrouvé automatiquement</div>
            <div className="mt-0.5 text-xs" style={{ color: 'var(--v3-muted)' }}>
              {manuscript.title} · {doneCount} chapitre(s) corrigé(s). Le travail reste disponible après un changement de page ou une actualisation.
            </div>
          </div>
        </div>
      )}

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

          <label className="mt-5 flex items-start gap-2.5 cursor-pointer">
            <input type="checkbox" checked={manualReview} disabled={running}
              onChange={(e) => setManualReview(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[var(--v3-emerald)]" />
            <span className="text-[13px]" style={{ color: 'var(--v3-muted)' }}>
              <strong style={{ color: 'var(--v3-ink)' }}>Je veux relire chapitre par chapitre avant d'appliquer.</strong><br />
              Par défaut, les corrections sont appliquées automatiquement : un seul clic et votre livre corrigé est prêt à exporter.
            </span>
          </label>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {!running ? (
              <button onClick={() => void startCorrection()} className="v3-btn-primary inline-flex items-center gap-2">
                <Wand2 className="w-4 h-4" /> {doneCount ? 'Reprendre la correction' : 'Corriger tout le livre'}
              </button>
            ) : (
              <button onClick={() => { stopRef.current = true; }} className="v3-btn-outline inline-flex items-center gap-2">
                <StopCircle className="w-4 h-4" /> Interrompre
              </button>
            )}
            <button
              type="button"
              onClick={() => void resetCorrection()}
              disabled={running || resetting}
              className="v3-btn-outline inline-flex items-center gap-2 border-destructive/40 text-destructive disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resetting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Effacer la correction et repartir à zéro
            </button>
            <span className="text-[12px]" style={{ color: 'var(--v3-muted)' }}>
              {manualReview
                ? "Rien n'est écrasé : le texte original reste intact jusqu'à votre validation."
                : 'Orthographe, grammaire, ponctuation et suppression du latin — appliqués automatiquement.'}
            </span>
          </div>

        </section>
      )}

      {/* ÉTAPE 3 — Progression + relecture */}
      {chapters.length > 0 && (doneCount > 0 || failedCount > 0 || running) && (
        <section className="mt-6 rounded-2xl border bg-white p-6" style={{ borderColor: 'var(--v3-line)' }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="v3-serif text-xl font-semibold" style={{ color: 'var(--v3-emerald)' }}>
              {manualReview ? '3 · Relire les corrections' : '3 · Corrections appliquées'}
            </h2>
            {manualReview && (
              <button onClick={acceptAll} disabled={!doneCount} className="v3-btn-outline text-[12px] disabled:opacity-50">
                Tout accepter
              </button>
            )}
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
              <span>{acceptedCount} appliqué(s)</span>
              {latinRemoved > 0 && <span style={{ color: 'var(--v3-emerald)' }}>{latinRemoved} expression(s) latine(s) supprimée(s)</span>}
              {endingsFixed > 0 && <span style={{ color: 'var(--v3-emerald)' }}>{endingsFixed} fin(s) de chapitre complétée(s)</span>}
              {blockFailures > 0 && <span style={{ color: '#b45309' }}>{blockFailures} passage(s) non corrigé(s)</span>}
              {running && (
                <span>
                  En cours : chapitre {current + 1} / {chapters.length}
                  {waitInfo ? ` · ${waitInfo.reason} — nouvelle tentative dans ${waitInfo.seconds} s` : '…'}
                </span>
              )}
            </div>
          </div>

          {!running && failedCount > 0 && (
            <div className="mt-4 rounded-xl border p-4 flex flex-wrap items-center justify-between gap-3"
              style={{ borderColor: '#f0c98a', background: '#fdf7ec' }}>
              <p className="text-[13px]" style={{ color: '#92400e' }}>
                <strong>{failedCount} chapitre(s) n'ont pas pu être corrigés</strong> — le plus souvent une limite de
                requêtes ou un quota de clé IA. Le reste du livre est bien corrigé.
              </p>
              <button onClick={() => void startCorrection(true)} className="v3-btn-outline inline-flex items-center gap-2 text-[12.5px]">
                <RefreshCw className="w-4 h-4" /> Reprendre les chapitres en échec
              </button>
            </div>
          )}


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

          {!running && latinRemaining.length > 0 && (
            <div className="mt-4 rounded-xl border p-4" style={{ borderColor: '#f0c98a', background: '#fdf7ec' }}>
              <p className="text-[13px] font-semibold" style={{ color: '#92400e' }}>
                Expressions en latin encore détectées — à corriger à la main dans les chapitres concernés :
              </p>
              <ul className="mt-2 space-y-1">
                {latinRemaining.map((r) => (
                  <li key={r.label} className="text-[12.5px]" style={{ color: '#92400e' }}>
                    <strong>{r.label}</strong> : {r.items.slice(0, 8).join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!running && endingIssues.length > 0 && (
            <div className="mt-4 rounded-xl border p-4" style={{ borderColor: '#f0c98a', background: '#fdf7ec' }}>
              <p className="text-[13px] font-semibold" style={{ color: '#92400e' }}>
                Fins de chapitre encore incomplètes — elles doivent se terminer par une phrase ponctuée :
              </p>
              <ul className="mt-2 space-y-1">
                {endingIssues.map((c) => (
                  <li key={c.chapterId} className="text-[12.5px]" style={{ color: '#92400e' }}>
                    <strong>{c.title || `Chapitre ${c.index + 1}`}</strong> : {c.endingIssue}
                  </li>
                ))}
              </ul>
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
                        {c.status === 'done' && (
                          <>
                            {c.corrections.length} correction(s)
                            {(c.blockCount || 1) > 1 && ` · ${c.blockCount} tronçons`}
                            {c.endingFixed && ' · fin de chapitre complétée'}
                            {(c.blockFailures || 0) > 0 && (
                              <span style={{ color: '#b45309' }}>
                                {' '}· {c.blockFailures} passage(s) non corrigé(s)
                              </span>
                            )}
                            {c.endingIssue && (
                              <span style={{ color: '#b45309' }}> · fin à revoir : {c.endingIssue.toLowerCase()}</span>
                            )}
                          </>
                        )}
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
          {manualReview && acceptedCount < doneCount && (
            <div className="mt-3 flex items-start gap-2 text-[12.5px] rounded-lg border p-3"
              style={{ borderColor: '#fcd34d', background: '#fffbeb', color: '#92400e' }}>
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {doneCount - acceptedCount} chapitre(s) corrigés ne sont pas encore validés — ils seront exportés dans leur version d'origine.
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={saveCorrectedBook} disabled={savingToLibrary || exporting} className="v3-btn-primary inline-flex items-center gap-2 disabled:opacity-50">
              {savingToLibrary ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {cloudProjectId ? 'Mettre à jour dans Livres corrigés' : 'Enregistrer dans Livres corrigés'}
            </button>
            <button onClick={exportWord} disabled={exporting} className="v3-btn-primary inline-flex items-center gap-2 disabled:opacity-50">
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />} Exporter en Word
            </button>
            <button onClick={() => navigate('/v3/livres-corriges')} className="v3-btn-outline inline-flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Voir mes livres corrigés
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
