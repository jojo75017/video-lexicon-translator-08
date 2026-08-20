import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BarChart3, BookOpen, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { BackButton } from '@/components/v3/BackButton';
import V3KdpPublishPanel from '@/components/v3public/V3KdpPublishPanel';
import { normalizeManuscript } from '@/utils/manuscriptNormalizer';

type BookRow = {
  id: string;
  title: string;
  author_name?: string | null;
  narrative_format?: string | null;
  kdp_description?: string | null;
  kdp_keywords?: string | null;
  kdp_categories?: string | null;
  number_of_chapters?: number | null;
  chapters?: unknown;
  ebook_images?: unknown;
  cover_concepts?: string | null;
};

const hasChapterContent = (chapters: unknown) =>
  Array.isArray(chapters) && chapters.some((raw) => {
    const chapter = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
    return String(chapter.content || chapter.contenu || '').trim().length > 0;
  });

/**
 * « Données KDP » — la fiche de publication d'un livre déjà enregistré.
 * On recharge le manuscrit sauvegardé (avec repli sur l'historique des versions)
 * pour que l'abonné retrouve description, mots-clés, catégories et export ZIP
 * sans avoir à relancer la moindre génération.
 */
export default function V3KdpDataPage() {
  const [params] = useSearchParams();
  const projectId = params.get('projectId') || '';
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState<BookRow | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!projectId) { setLoading(false); return; }
      setLoading(true);
      try {
        const { data: auth } = await supabase.auth.getUser();
        if (!auth.user) {
          toast.error('Connectez-vous pour retrouver les données KDP de votre livre.');
          return;
        }

        const { data, error } = await supabase
          .from('ebook_projects')
          .select('*')
          .eq('id', projectId)
          .eq('user_id', auth.user.id)
          .maybeSingle();
        if (error) throw error;
        if (!data) { toast.error('Livre introuvable dans Mes livres.'); return; }

        let resolved = data as BookRow;
        if (!hasChapterContent(resolved.chapters)) {
          const { data: versions } = await supabase
            .from('ebook_project_versions')
            .select('*')
            .eq('project_id', projectId)
            .eq('user_id', auth.user.id)
            .order('version_number', { ascending: false });
          const complete = (versions || []).find((version) => hasChapterContent((version as any).chapters));
          if (complete) resolved = { ...resolved, ...(complete as any), id: resolved.id };
        }

        if (!cancelled) setBook(resolved);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Chargement impossible.';
        toast.error(`Données KDP indisponibles : ${message}`);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => { cancelled = true; };
  }, [projectId]);

  const manuscript = book
    ? normalizeManuscript(Array.isArray(book.chapters) ? book.chapters : [], {
        expectedCount: Number(book.number_of_chapters) > 0 ? Number(book.number_of_chapters) : undefined,
        bookTitle: book.title,
      })
        .map((chapter) => `# Chapitre ${chapter.number} – ${chapter.title}\n\n${chapter.content}`)
        .join('\n\n')
    : '';

  const images = Array.isArray(book?.ebook_images) ? (book?.ebook_images as any[]) : [];
  const coverUrl = images.find((image) => image?.type === 'front_cover')?.url || book?.cover_concepts || null;
  const subtitle = String(book?.narrative_format || '').replace(/^Sous-titre\s*:\s*/i, '');
  const splitList = (value?: string | null) =>
    String(value || '')
      .split(/[,;\n|]/)
      .map((word) => word.trim())
      .filter(Boolean);
  const keywords = splitList(book?.kdp_keywords);
  const categories = splitList(book?.kdp_categories);


  return (
    <section className="max-w-5xl mx-auto px-5 md:px-8 py-10">
      <BackButton to="/v3/mes-livres" />

      <header className="mt-4">
        <span className="v3-chip v3-chip-gold">
          <BarChart3 className="w-3.5 h-3.5" /> Données KDP
        </span>
        <h1 className="v3-serif text-3xl md:text-4xl font-bold mt-3" style={{ color: 'var(--v3-ink)' }}>
          {book?.title || 'Les données KDP de votre livre'}
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--v3-muted)' }}>
          Description commerciale, mots-clés, catégories BISAC et dossier prêt à téléverser sur KDP.
        </p>
      </header>

      {loading ? (
        <div className="mt-14 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--v3-orange)]" /></div>
      ) : !projectId ? (
        <div className="v3-card mt-8 text-center py-12">
          <BookOpen className="w-8 h-8 mx-auto text-[var(--v3-orange)]" />
          <p className="mt-3 text-sm font-semibold">Choisissez d’abord un livre.</p>
          <Link to="/v3/mes-livres" className="v3-btn v3-btn-primary mt-5 inline-flex">Ouvrir « Mes livres »</Link>
        </div>
      ) : !book ? (
        <div className="v3-card mt-8 text-center py-12">
          <p className="text-sm font-semibold">Ce livre n’a pas été retrouvé.</p>
          <Link to="/v3/mes-livres" className="v3-btn v3-btn-primary mt-5 inline-flex">Retour à « Mes livres »</Link>
        </div>
      ) : !manuscript.trim() ? (
        <div className="v3-card mt-8 text-center py-12">
          <p className="text-sm font-semibold">Le manuscrit de ce livre n’est pas encore terminé.</p>
          <p className="mt-2 text-sm" style={{ color: 'var(--v3-muted)' }}>
            Reprenez la rédaction : les données KDP se remplissent dès que les chapitres sont écrits.
          </p>
          <Link to={`/v3/create?projectId=${book.id}`} className="v3-btn v3-btn-primary mt-5 inline-flex">
            Reprendre la rédaction
          </Link>
        </div>
      ) : (
        <div className="mt-6">
          <V3KdpPublishPanel
            title={book.title}
            subtitle={subtitle === 'Workflow V3 complet' ? '' : subtitle}
            author={book.author_name || 'Auteur Ebookstudio'}
            category={book.kdp_categories || ''}
            coverUrl={coverUrl}
            initialDescription={book.kdp_description || ''}
            initialKeywords={keywords}
            manuscript={manuscript}
          />

          <div className="mt-5 flex flex-wrap gap-2">
            <Link to={`/v3/create?projectId=${book.id}`} className="v3-btn v3-btn-outline text-xs">
              <BookOpen className="w-3.5 h-3.5" /> Ouvrir le livre
            </Link>
            <Link to={`/v3/corriger?projectId=${book.id}`} className="v3-btn v3-btn-outline text-xs">
              Corriger ce livre
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
