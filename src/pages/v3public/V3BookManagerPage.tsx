import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, BookOpen, FileDown, X, Wand2, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BackButton } from "@/components/v3/BackButton";
import V3ExportPanel from '@/components/admin/V3ExportPanel';
import { normalizeManuscript } from '@/utils/manuscriptNormalizer';
import type { Chapter } from '@/hooks/useSubscriptionGeneration';

type Book = {
  id: string;
  title: string;
  author_name?: string | null;
  kdp_description?: string | null;
  chapters?: unknown;
  number_of_chapters?: number | null;
};


const hasChapterContent = (chapters: unknown): chapters is Record<string, unknown>[] =>
  Array.isArray(chapters) && chapters.some((raw) => {
    const chapter = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {};
    return String(chapter.content || chapter.contenu || '').trim().length > 0;
  });

export default function V3BookManagerPage() {
  const nav = useNavigate();
  const location = useLocation();
  const correctedOnly = location.pathname.endsWith('/livres-corriges');
  const [rows, setRows] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Book | null>(null);
  const [exporting, setExporting] = useState<Book | null>(null);
  const [exportLoadingId, setExportLoadingId] = useState<string | null>(null);

  const load = async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) { nav('/v3/auth'); return; }
    let query = supabase.from('ebook_projects')
      .select('id,title,author_name,kdp_description,chapters,number_of_chapters,project_type')
      .eq('user_id', auth.user.id);
    if (correctedOnly) query = query.eq('project_type', 'corrected');
    const { data, error } = await query.order('updated_at', { ascending: false });
    if (error) toast.error(`Chargement impossible : ${error.message}`);
    setRows((data as Book[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []); // eslint-disable-line

  const remove = async (id: string) => {
    if (!confirm('Supprimer ce livre ? Cette action est définitive.')) return;
    const { error } = await supabase.from('ebook_projects').delete().eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('Livre supprimé');
    load();
  };

  /** Chapitres structurés prêts pour l'export : titres réels conservés, aucun re-découpage du texte. */
  const exportChapters = (book: Book): Chapter[] => {
    const raw = Array.isArray(book.chapters) ? book.chapters : [];
    const expected = Number(book.number_of_chapters) > 0 ? Number(book.number_of_chapters) : undefined;
    return normalizeManuscript(raw, { expectedCount: expected, bookTitle: book.title })
      .map((chapter) => ({
        id: `ch-${chapter.number}`,
        title: chapter.title || `Chapitre ${chapter.number}`,
        subChapters: [],
        content: chapter.content,
      }));
  };


  const openExport = async (book: Book) => {
    setExportLoadingId(book.id);
    try {
      let exportBook = book;
      if (!hasChapterContent(book.chapters)) {
        const { data, error } = await supabase
          .from('ebook_project_versions')
          .select('title,author_name,kdp_description,chapters')
          .eq('project_id', book.id)
          .order('version_number', { ascending: false });
        if (error) throw error;
        const completeVersion = (data || []).find((version) => hasChapterContent(version.chapters));
        if (completeVersion) exportBook = { ...book, ...completeVersion, id: book.id };
      }

      if (!hasChapterContent(exportBook.chapters)) {
        toast.error('Aucun manuscrit terminé n’est disponible pour cet export.');
        return;
      }
      setExporting(exportBook);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sauvegarde du manuscrit introuvable.';
      toast.error(`Export impossible : ${message}`);
    } finally {
      setExportLoadingId(null);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-5 md:px-8 py-14">
      <div className="max-w-6xl mx-auto px-4 pt-4"><BackButton /></div>
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="v3-serif text-4xl font-bold">{correctedOnly ? 'Livres corrigés' : 'Mes livres'}</h1>
          <p className="text-sm text-[var(--v3-muted)] mt-1">{correctedOnly ? 'Retrouvez ici les manuscrits enregistrés après leur correction complète.' : 'Ouvre un livre pour retrouver le manuscrit, le sommaire et les exports.'}</p>
        </div>
        <button onClick={() => nav(correctedOnly ? '/v3/corriger' : '/v3/create')} className="v3-btn v3-btn-primary"><Plus className="w-4 h-4" /> {correctedOnly ? 'Corriger un livre' : 'Ajouter'}</button>
      </div>

      {loading ? (
        <div className="mt-12 text-center text-[var(--v3-muted)]">Chargement…</div>
      ) : rows.length === 0 ? (
        <div className="v3-card mt-10 text-center py-14">
          <BookOpen className="w-8 h-8 text-[var(--v3-orange)] mx-auto" />
          {correctedOnly ? (
            <div className="mt-4 max-w-xl mx-auto">
              <p className="text-sm font-semibold">Aucun livre corrigé pour l’instant.</p>
              <p className="mt-2 text-sm text-[var(--v3-muted)]">
                Un livre apparaît ici automatiquement dès qu’une correction complète est terminée.
                Ouvrez « Corriger mon livre », importez votre document (ou cliquez sur « Corriger ce livre »
                depuis Mes livres), puis lancez la correction : l’enregistrement se fait tout seul.
              </p>
              <button onClick={() => nav('/v3/corriger')} className="v3-btn v3-btn-primary mt-5">
                <Plus className="w-4 h-4" /> Corriger un livre
              </button>
              <button onClick={() => nav('/v3/mes-livres')} className="v3-btn v3-btn-outline mt-5 ml-2">
                <BookOpen className="w-4 h-4" /> Voir mes livres
              </button>
            </div>
          ) : (
            <p className="mt-4 text-sm text-[var(--v3-muted)]">Aucun livre publié pour l’instant.</p>
          )}
        </div>

      ) : (
        <div className="mt-10 space-y-3">
          {rows.map((b) => {
            const chapterCount = Array.isArray(b.chapters) ? b.chapters.length : 0;
            return (
            <div key={b.id} className="v3-card flex items-center gap-4">
              <div className="w-14 h-20 rounded bg-[var(--v3-ink)] shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{b.title}</div>
                {b.author_name && <div className="text-xs text-[var(--v3-muted)]">par {b.author_name}</div>}
                <div className="mt-1 text-xs font-semibold text-[var(--v3-muted)]">
                  {chapterCount > 0 ? `${chapterCount} chapitre${chapterCount > 1 ? 's' : ''} · Export disponible` : 'Brouillon · récupération des sauvegardes à l’ouverture'}
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                {!correctedOnly && (
                  <button onClick={() => nav(`/v3/corriger?projectId=${b.id}`)} className="v3-btn v3-btn-outline text-xs">
                    <Wand2 className="w-3.5 h-3.5" /> Corriger ce livre
                  </button>
                )}
                <button
                  onClick={() => void openExport(b)}
                  disabled={exportLoadingId === b.id}
                  className="v3-btn v3-btn-outline text-xs"
                >
                  <FileDown className="w-3.5 h-3.5" /> {exportLoadingId === b.id ? 'Chargement…' : 'Exporter'}
                </button>
                <button onClick={() => nav(`/v3/donnees-kdp?projectId=${b.id}`)} className="v3-btn v3-btn-outline text-xs">
                  <BarChart3 className="w-3.5 h-3.5" /> Données KDP
                </button>
                <button onClick={() => nav(`/v3/create?projectId=${b.id}`)} className="v3-btn v3-btn-primary text-xs">
                  <BookOpen className="w-3.5 h-3.5" /> Ouvrir le livre
                </button>
                <button onClick={() => setEditing(b)} className="v3-btn v3-btn-outline text-xs"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => remove(b.id)} className="v3-btn v3-btn-ghost text-xs text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          );})}
        </div>
      )}

      {exporting && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 px-4 py-8" onClick={() => setExporting(null)}>
          <div className="mx-auto w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-3 flex justify-end">
              <button type="button" onClick={() => setExporting(null)} className="v3-btn v3-btn-primary">
                <X className="h-4 w-4" /> Fermer
              </button>
            </div>
            <V3ExportPanel
              chapters={exportChapters(exporting)}
              expectedChapterCount={Number(exporting.number_of_chapters) || undefined}
              title={exporting.title}
              author={exporting.author_name || ''}
            />

          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4" onClick={() => setEditing(null)}>
          <div className="v3-card w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="v3-serif text-2xl font-bold mb-4">Éditer le livre</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--v3-muted)]">Titre</label>
                <input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="mt-1 w-full h-10 rounded-lg border border-black/10 px-3 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--v3-muted)]">Auteur</label>
                <input
                  value={editing.author_name || ''}
                  onChange={(e) => setEditing({ ...editing, author_name: e.target.value })}
                  className="mt-1 w-full h-10 rounded-lg border border-black/10 px-3 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--v3-muted)]">Description</label>
                <textarea
                  rows={4}
                  value={editing.kdp_description || ''}
                  onChange={(e) => setEditing({ ...editing, kdp_description: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="v3-btn v3-btn-ghost">Annuler</button>
              <button
                onClick={async () => {
                  const { error } = await supabase.from('ebook_projects')
                    .update({ title: editing.title, author_name: editing.author_name, kdp_description: editing.kdp_description })
                    .eq('id', editing.id);
                  if (error) return toast.error(error.message);
                  toast.success('Modifications enregistrées ✓');
                  setEditing(null); load();
                }}
                className="v3-btn v3-btn-primary"
              >Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
