import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookPlus, ImagePlus, Loader2, Pencil, PenLine, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import robot from '@/assets/plans/vc-books-robot.png';

interface VCBook {
  id: string;
  title: string;
  author_name: string;
  theme: string;
  format: string;
  target_pages: number;
  cover_url: string | null;
  updated_at: string;
}

const FORMAT_LABELS: Record<string, string> = {
  poche: 'Poche',
  'demi-lettre': 'Demi-lettre',
  '6x9': '6 × 9 pouces',
};

export default function V3VCBooksLibraryPage() {
  const [books, setBooks] = useState<VCBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    const { data, error: loadError } = await supabase
      .from('vc_books')
      .select('id, title, author_name, theme, format, target_pages, cover_url, updated_at')
      .order('updated_at', { ascending: false });
    if (loadError) setError('Impossible de charger votre bibliothèque.');
    else setBooks(data ?? []);
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  async function remove(book: VCBook) {
    if (!window.confirm(`Supprimer « ${book.title} » ? Cette action est définitive.`)) return;
    const { error: deleteError } = await supabase.from('vc_books').delete().eq('id', book.id);
    if (deleteError) { toast.error('La suppression a échoué.'); return; }
    toast.success('Livre supprimé.');
    setBooks((previous) => previous.filter((b) => b.id !== book.id));
  }

  return (
    <main className="v3-shell py-8">
      <Button asChild variant="ghost" size="sm">
        <Link to="/v3"><ArrowLeft className="mr-2 h-4 w-4" />Accueil</Link>
      </Button>
      <header className="mb-8 mt-4 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <img src={robot} alt="Robot VC Books" className="h-20 w-20 object-contain" />
          <div>
            <p className="text-sm font-semibold text-primary">VC Books</p>
            <h1 className="v3-serif text-3xl text-foreground">Ma bibliothèque</h1>
            <p className="mt-1 text-sm text-muted-foreground">Vos livres humoristiques — choisissez-en un pour l’atelier d’images.</p>
          </div>
        </div>
        <Button asChild>
          <Link to="/v3/vc-books/creer"><BookPlus className="mr-2 h-4 w-4" />Créer un livre</Link>
        </Button>
      </header>

      {loading && <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Chargement…</p>}
      {error && <p role="alert" className="rounded-md border border-destructive p-3 text-sm text-destructive">{error}</p>}

      {!loading && !error && books.length === 0 && (
        <div className="rounded-md border border-dashed border-border p-10 text-center">
          <img src={robot} alt="" className="mx-auto mb-4 h-24 w-24 object-contain" />
          <p className="text-sm text-muted-foreground">Aucun livre VC Books pour le moment.</p>
          <Button asChild className="mt-4">
            <Link to="/v3/vc-books/creer"><BookPlus className="mr-2 h-4 w-4" />Créer mon premier livre</Link>
          </Button>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <article key={book.id} className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
            <div className="flex h-48 items-center justify-center bg-muted">
              {book.cover_url ? (
                <img src={book.cover_url} alt={`Couverture de ${book.title}`} className="h-full w-full object-contain" />
              ) : (
                <img src={robot} alt="" className="h-24 w-24 object-contain opacity-60" />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1 p-4">
              <h2 className="font-semibold text-foreground">{book.title}</h2>
              {book.author_name && <p className="text-sm text-muted-foreground">par {book.author_name}</p>}
              {book.theme && <p className="text-xs text-muted-foreground">Thème : {book.theme}</p>}
              <p className="text-xs text-muted-foreground">{FORMAT_LABELS[book.format] ?? book.format} · {book.target_pages} pages visées</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link to={`/v3/vc-books/rediger?livre=${book.id}`}><PenLine className="mr-2 h-4 w-4" />Rédiger et exporter</Link>

                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to={`/v3/vc-books/images?livre=${book.id}`}><ImagePlus className="mr-2 h-4 w-4" />Ouvrir dans l’atelier</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to={`/v3/vc-books/creer?livre=${book.id}`}><Pencil className="mr-2 h-4 w-4" />Modifier</Link>
                </Button>
                <Button size="sm" variant="ghost" onClick={() => void remove(book)} aria-label={`Supprimer ${book.title}`}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
