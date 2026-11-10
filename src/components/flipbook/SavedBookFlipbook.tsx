import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import IllustratedFlipbook, { type FlipPage } from './IllustratedFlipbook';
import { savedFlipbookPages } from '@/lib/flipbookPages';

export default function SavedBookFlipbook({ book, onClose }: { book: { id: string; title: string }; onClose: () => void }) {
  const [pages, setPages] = useState<FlipPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: auth } = await supabase.auth.getUser();
        if (!auth.user) throw new Error('Connectez-vous pour feuilleter votre livre.');
        const { data, error: loadError } = await supabase.from('ebook_projects').select('chapters,ebook_images').eq('id', book.id).eq('user_id', auth.user.id).single();
        if (loadError) throw new Error('Ce livre ne peut pas être chargé. Fermez puis réessayez.');
        let result = savedFlipbookPages(data.chapters, data.ebook_images);
        if (!result.length) {
          const { data: versions, error: versionError } = await supabase.from('ebook_project_versions').select('chapters').eq('project_id', book.id).order('version_number', { ascending: false });
          if (versionError) throw new Error('Les sauvegardes ne peuvent pas être chargées.');
          for (const version of versions || []) {
            result = savedFlipbookPages(version.chapters, data.ebook_images);
            if (result.length) break;
          }
        }
        if (!cancelled) setPages(result);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Lecture indisponible.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [book.id]);
  return <Dialog open onOpenChange={open => { if (!open) onClose(); }}>
    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
      <DialogTitle>{book.title}</DialogTitle>
      {loading ? <p role="status">Chargement de votre livre…</p> : error ? <p role="alert">{error}</p> : pages.length ? <IllustratedFlipbook bookTitle={book.title} pages={pages} /> : <p>Ce brouillon ne contient pas encore de pages à feuilleter.</p>}
    </DialogContent>
  </Dialog>;
}