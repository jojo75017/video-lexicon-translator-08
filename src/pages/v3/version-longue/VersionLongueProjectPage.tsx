import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowDown, ArrowLeft, ArrowUp, Download, FileText, Image as ImageIcon,
  Loader2, Lock, Plus, Sparkles, Trash2, Wand2,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import useEbookLongFormAccess from '@/hooks/useEbookLongFormAccess';
import { isLongFormProject, type LongFormProjectRow } from '@/lib/longform/longFormProjects';
import {
  countWords, exportDocx, exportMarkdown, exportPdf, type LongFormBook,
} from '@/lib/longform/longFormExport';

type Tab = 'plan' | 'chapitres' | 'couverture' | 'export';

interface Chapter {
  id: string;
  project_id: string;
  chapter_number: number;
  title: string;
  content_markdown: string | null;
  key_takeaways: string[] | null;
  status: string | null;
}

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'plan', label: '1. Plan' },
  { id: 'chapitres', label: '2. Chapitres' },
  { id: 'couverture', label: '3. Couverture' },
  { id: 'export', label: '4. Export' },
];

export default function VersionLongueProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const { loading: accessLoading, hasAccess } = useEbookLongFormAccess();

  const [project, setProject] = useState<LongFormProjectRow | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('plan');
  const [outlineLoading, setOutlineLoading] = useState(false);
  const [writing, setWriting] = useState<string | null>(null);
  const [writingAll, setWritingAll] = useState(false);
  const [openChapter, setOpenChapter] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverLoading, setCoverLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const autoOutlineDone = useRef(false);
  const saveTimers = useRef<Record<string, number>>({});

  const targetLength = params.get('longueur') === 'standard' ? 'standard' : 'long';
  const requestedChapters = Math.min(40, Math.max(3, Number(params.get('chapitres')) || 12));

  const load = useCallback(async () => {
    if (!id) return;
    const [projRes, chRes] = await Promise.all([
      supabase.from('cs_projects').select('*').eq('id', id).maybeSingle(),
      supabase.from('cs_chapters').select('*').eq('project_id', id).order('chapter_number', { ascending: true }),
    ]);
    setProject((projRes.data as LongFormProjectRow) ?? null);
    setChapters((chRes.data as Chapter[]) ?? []);
    if (projRes.data?.cover_image_url) {
      const { data: signed } = await supabase.storage
        .from('contentstudio')
        .createSignedUrl(projRes.data.cover_image_url, 3600);
      setCoverUrl(signed?.signedUrl ?? null);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (hasAccess) void load();
    else if (!accessLoading) setLoading(false);
  }, [hasAccess, accessLoading, load]);

  const generateOutline = useCallback(async (count: number) => {
    if (!project || !id) return;
    setOutlineLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('cs-generate-outline', {
        body: {
          title: project.title,
          subtitle: project.subtitle ?? undefined,
          target_audience: project.target_audience ?? undefined,
          tone: project.tone ?? 'professionnel',
          language_code: project.language_code ?? 'fr',
          chapters_count: count,
        },
      });
      if (error || !data?.chapters?.length) {
        throw new Error(error?.message || data?.error || 'Plan vide');
      }
      await supabase.from('cs_chapters').delete().eq('project_id', id);
      const rows = data.chapters.map((c: { chapter_number: number; title: string; key_takeaways?: string[] }) => ({
        project_id: id,
        chapter_number: c.chapter_number,
        title: c.title,
        key_takeaways: c.key_takeaways ?? [],
        status: 'draft',
      }));
      const { error: insErr } = await supabase.from('cs_chapters').insert(rows);
      if (insErr) throw new Error(insErr.message);
      await load();
      toast.success(`Plan généré : ${rows.length} chapitres.`);
    } catch (e) {
      toast.error(`Plan indisponible : ${e instanceof Error ? e.message : 'erreur inconnue'}`);
    } finally {
      setOutlineLoading(false);
    }
  }, [project, id, load]);

  // Génération automatique du plan juste après la création du manuscrit.
  useEffect(() => {
    if (autoOutlineDone.current) return;
    if (!project || loading || chapters.length > 0) return;
    if (params.get('nouveau') !== '1') return;
    autoOutlineDone.current = true;
    void generateOutline(requestedChapters);
  }, [project, loading, chapters.length, params, generateOutline, requestedChapters]);

  const persistChapter = (chapterId: string, patch: Partial<Chapter>) => {
    window.clearTimeout(saveTimers.current[chapterId]);
    saveTimers.current[chapterId] = window.setTimeout(async () => {
      const { error } = await supabase.from('cs_chapters').update(patch).eq('id', chapterId);
      if (error) toast.error(`Enregistrement impossible : ${error.message}`);
    }, 700);
  };

  const renameChapter = (chapterId: string, title: string) => {
    setChapters((cs) => cs.map((c) => (c.id === chapterId ? { ...c, title } : c)));
    persistChapter(chapterId, { title });
  };

  const editContent = (chapterId: string, content: string) => {
    setChapters((cs) => cs.map((c) => (c.id === chapterId ? { ...c, content_markdown: content } : c)));
    persistChapter(chapterId, { content_markdown: content });
  };

  const renumber = async (list: Chapter[]) => {
    const next = list.map((c, index) => ({ ...c, chapter_number: index + 1 }));
    setChapters(next);
    await Promise.all(
      next.map((c) => supabase.from('cs_chapters').update({ chapter_number: c.chapter_number }).eq('id', c.id)),
    );
  };

  const moveChapter = async (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= chapters.length) return;
    const list = [...chapters];
    [list[index], list[target]] = [list[target], list[index]];
    await renumber(list);
  };

  const deleteChapter = async (chapterId: string) => {
    const { error } = await supabase.from('cs_chapters').delete().eq('id', chapterId);
    if (error) {
      toast.error(`Suppression impossible : ${error.message}`);
      return;
    }
    await renumber(chapters.filter((c) => c.id !== chapterId));
  };

  const addChapter = async () => {
    if (!id) return;
    const { data, error } = await supabase
      .from('cs_chapters')
      .insert({
        project_id: id,
        chapter_number: chapters.length + 1,
        title: `Chapitre ${chapters.length + 1}`,
        key_takeaways: [],
        status: 'draft',
      })
      .select()
      .single();
    if (error || !data) {
      toast.error(`Ajout impossible : ${error?.message ?? 'erreur inconnue'}`);
      return;
    }
    setChapters((cs) => [...cs, data as Chapter]);
  };

  const writeChapter = useCallback(async (chapter: Chapter) => {
    if (!project || !id) return false;
    setWriting(chapter.id);
    const previous = chapters.find((c) => c.chapter_number === chapter.chapter_number - 1);
    const { data, error } = await supabase.functions.invoke('cs-write-chapter', {
      body: {
        project_id: id,
        chapter_id: chapter.id,
        chapter_title: chapter.title,
        chapter_number: chapter.chapter_number,
        tone: project.tone,
        language_code: project.language_code,
        previous_context: previous?.content_markdown?.slice(-1500) || undefined,
        target_length: targetLength,
      },
    });
    setWriting(null);
    if (error || !data?.content) {
      toast.error(`Rédaction impossible : ${error?.message ?? data?.error ?? 'erreur inconnue'}`);
      return false;
    }
    setChapters((cs) =>
      cs.map((c) => (c.id === chapter.id ? { ...c, content_markdown: data.content, status: 'completed' } : c)),
    );
    return true;
  }, [project, id, chapters, targetLength]);

  const writeAll = async () => {
    setWritingAll(true);
    for (const chapter of chapters) {
      if (chapter.content_markdown?.trim()) continue;
      const ok = await writeChapter(chapter);
      if (!ok) break;
    }
    setWritingAll(false);
  };

  const generateCover = async () => {
    if (!project || !id) return;
    setCoverLoading(true);
    const { data, error } = await supabase.functions.invoke('cs-generate-cover', {
      body: {
        project_id: id,
        title: project.title,
        subtitle: project.subtitle ?? undefined,
        target_audience: project.target_audience ?? undefined,
        tone: project.tone ?? 'professionnel',
        language_code: project.language_code ?? 'fr',
      },
    });
    setCoverLoading(false);
    if (error || data?.error) {
      const message = error?.message ?? data?.error ?? 'erreur inconnue';
      toast.error(
        message === 'CREDITS_EXHAUSTED'
          ? 'Crédits d’illustration épuisés pour le moment.'
          : `Couverture indisponible : ${message}`,
      );
      return;
    }
    await load();
    toast.success('Couverture générée.');
  };

  const book: LongFormBook = useMemo(() => ({
    title: project?.title ?? 'Manuscrit',
    subtitle: project?.subtitle,
    chapters: chapters.map((c) => ({
      chapter_number: c.chapter_number,
      title: c.title,
      content_markdown: c.content_markdown,
    })),
  }), [project, chapters]);

  const totalWords = useMemo(() => countWords(book), [book]);
  const writtenCount = chapters.filter((c) => c.content_markdown?.trim()).length;

  const runExport = async (kind: 'docx' | 'pdf' | 'md') => {
    setExporting(true);
    try {
      if (kind === 'docx') await exportDocx(book);
      else if (kind === 'pdf') exportPdf(book);
      else exportMarkdown(book);
      toast.success('Fichier téléchargé.');
    } catch (e) {
      toast.error(`Export impossible : ${e instanceof Error ? e.message : 'erreur inconnue'}`);
    } finally {
      setExporting(false);
    }
  };

  if (accessLoading || loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 text-center space-y-5">
        <Lock className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="text-2xl font-bold text-foreground">Outil Version Longue réservé</h1>
        <Link
          to="/v3/offre-version-longue"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          Débloquer pour 47 €
        </Link>
      </div>
    );
  }

  if (!project || !isLongFormProject(project)) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
        <p className="text-sm text-muted-foreground">Ce manuscrit est introuvable.</p>
        <Link to="/v3/version-longue" className="text-sm font-semibold text-primary underline">
          Retour à mes manuscrits
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/v3/version-longue"
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Mes manuscrits
        </Link>
        <p className="text-sm text-muted-foreground">
          {writtenCount}/{chapters.length} chapitres rédigés · {totalWords.toLocaleString('fr-FR')} mots
        </p>
      </div>

      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-foreground">{project.title}</h1>
        {project.subtitle && <p className="text-muted-foreground">{project.subtitle}</p>}
      </header>

      <nav className="flex flex-wrap gap-2 border-b border-border pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-md px-3 py-2 text-sm font-semibold ${
              tab === t.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'plan' && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => generateOutline(chapters.length || requestedChapters)}
              disabled={outlineLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {outlineLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {chapters.length ? 'Régénérer le plan' : 'Générer le plan'}
            </button>
            <button
              onClick={addChapter}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground"
            >
              <Plus className="h-4 w-4" /> Ajouter un chapitre
            </button>
          </div>

          {chapters.length === 0 && !outlineLoading && (
            <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Aucun chapitre pour le moment. Générez le plan pour démarrer.
            </p>
          )}

          <ul className="space-y-2">
            {chapters.map((chapter, index) => (
              <li key={chapter.id} className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
                <span className="w-8 shrink-0 text-sm font-semibold text-muted-foreground">{chapter.chapter_number}</span>
                <input
                  value={chapter.title}
                  onChange={(e) => renameChapter(chapter.id, e.target.value)}
                  className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
                <button onClick={() => moveChapter(index, -1)} aria-label="Monter" className="rounded-md border border-border p-2 text-muted-foreground">
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button onClick={() => moveChapter(index, 1)} aria-label="Descendre" className="rounded-md border border-border p-2 text-muted-foreground">
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button onClick={() => deleteChapter(chapter.id)} aria-label="Supprimer" className="rounded-md border border-border p-2 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === 'chapitres' && (
        <section className="space-y-4">
          <button
            onClick={writeAll}
            disabled={writingAll || chapters.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {writingAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            Tout rédiger
          </button>

          <div className="space-y-3">
            {chapters.map((chapter) => {
              const words = chapter.content_markdown?.trim().split(/\s+/).filter(Boolean).length ?? 0;
              const isOpen = openChapter === chapter.id;
              return (
                <div key={chapter.id} className="rounded-lg border border-border bg-card p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Chapitre {chapter.chapter_number} — {chapter.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {words.toLocaleString('fr-FR')} mots · environ {Math.max(1, Math.round(words / 300))} pages
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => writeChapter(chapter)}
                        disabled={writing === chapter.id || writingAll}
                        className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground disabled:opacity-60"
                      >
                        {writing === chapter.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        {chapter.content_markdown?.trim() ? 'Réécrire' : 'Rédiger'}
                      </button>
                      <button
                        onClick={() => setOpenChapter(isOpen ? null : chapter.id)}
                        className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground"
                      >
                        <FileText className="h-4 w-4" /> {isOpen ? 'Fermer' : 'Modifier'}
                      </button>
                    </div>
                  </div>
                  {isOpen && (
                    <textarea
                      value={chapter.content_markdown ?? ''}
                      onChange={(e) => editContent(chapter.id, e.target.value)}
                      rows={16}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm leading-relaxed"
                      placeholder="Le texte du chapitre s’affichera ici après la rédaction."
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {tab === 'couverture' && (
        <section className="space-y-4">
          <button
            onClick={generateCover}
            disabled={coverLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {coverLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
            {coverUrl ? 'Générer une autre couverture' : 'Générer la couverture'}
          </button>
          {coverUrl ? (
            <img src={coverUrl} alt={`Couverture de ${project.title}`} className="w-full max-w-xs rounded-lg border border-border" />
          ) : (
            <p className="text-sm text-muted-foreground">Aucune couverture générée pour ce manuscrit.</p>
          )}
          <p className="text-sm text-muted-foreground">
            Pour composer les textes et exporter un fichier Kindle,{' '}
            <Link to="/v3/mes-couvertures" className="font-semibold text-primary underline">
              ouvrez le studio de couverture
            </Link>.
          </p>
        </section>
      )}

      {tab === 'export' && (
        <section className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {writtenCount}/{chapters.length} chapitres rédigés · {totalWords.toLocaleString('fr-FR')} mots ·
            environ {Math.max(1, Math.round(totalWords / 300))} pages. Les fichiers sont générés dans votre navigateur.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => runExport('docx')}
              disabled={exporting || chapters.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> Word (.docx)
            </button>
            <button
              onClick={() => runExport('pdf')}
              disabled={exporting || chapters.length === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> PDF
            </button>
            <button
              onClick={() => runExport('md')}
              disabled={exporting || chapters.length === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> Markdown
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
