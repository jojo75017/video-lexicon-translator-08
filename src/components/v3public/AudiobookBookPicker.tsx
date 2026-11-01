import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Loader2, RefreshCw } from 'lucide-react';
import { listAudioBooks, loadAudioBook, type AudioBookContent, type AudioBookOption } from '@/lib/audiobook/bookImport';
import { useSearchParams } from 'react-router-dom';

type Book = AudioBookOption;

type Props = {
  onLoaded: (book: AudioBookContent) => void;
};

/**
 * Reprend un livre déjà écrit dans le studio et remplit le manuscrit du livre audio.
 * Lecture seule : aucune écriture en base, aucun crédit.
 */
export default function AudiobookBookPicker({ onLoaded }: Props) {
  const [params] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAudioBooks();
      setBooks(data);
      const id = params.get('livre') || params.get('book');
      const selected = data.find(b => b.id === id);
      if (selected) onLoaded(await loadAudioBook(selected));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible de lire vos livres.');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const importBook = async (book: Book) => {
    setImporting(book.id);
    setError(null);
    try { onLoaded(await loadAudioBook(book)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Ce livre ne peut pas être chargé.'); }
    finally { setImporting(null); }
  };

  return (
    <section className="py-5 mb-6 border-b">
      <div className="flex items-center justify-between gap-3 mb-1">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Reprendre un de mes livres</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-1" /> Actualiser
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Chargement de vos livres…
        </div>
      ) : books.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucun livre enregistré pour l'instant. Collez simplement votre texte plus bas.
        </p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {books.map((b) => (
            <Button
              key={`${b.source}-${b.id}`}
              variant="outline"
              onClick={() => importBook(b)}
              disabled={importing === b.id}
              className="h-auto min-w-0 flex-col items-start text-left px-3 py-2"
            >
              <div className="font-medium text-sm text-foreground w-full truncate">{b.title || 'Sans titre'}</div>
              <div className="text-xs text-muted-foreground">
                {importing === b.id ? 'Chargement…' : 'Utiliser ce livre'}
              </div>
            </Button>
          ))}
        </div>
      )}

      {error && <p role="alert" className="text-sm text-destructive mt-3">{error}</p>}
    </section>
  );
}
