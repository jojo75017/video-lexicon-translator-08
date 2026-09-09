import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Loader2, RefreshCw } from 'lucide-react';

type Book = { id: string; title: string; updated_at: string };

type Props = {
  onLoaded: (book: { title: string; manuscript: string }) => void;
};

/**
 * Reprend un livre déjà écrit dans le studio et remplit le manuscrit du livre audio.
 * Lecture seule : aucune écriture en base, aucun crédit.
 */
export default function AudiobookBookPicker({ onLoaded }: Props) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('cs_projects')
      .select('id, title, updated_at')
      .order('updated_at', { ascending: false })
      .limit(30);
    if (err) setError("Impossible de lire vos livres pour le moment.");
    setBooks((data as Book[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const importBook = async (book: Book) => {
    setImporting(book.id);
    setError(null);
    const { data, error: err } = await supabase
      .from('cs_chapters')
      .select('chapter_number, title, content_markdown')
      .eq('project_id', book.id)
      .order('chapter_number', { ascending: true });
    setImporting(null);
    if (err) { setError("Ce livre n'a pas pu être chargé."); return; }
    const rows = (data as { chapter_number: number; title: string; content_markdown: string | null }[]) || [];
    const written = rows.filter((c) => (c.content_markdown || '').trim().length > 0);
    if (written.length === 0) {
      setError(`« ${book.title} » n'a encore aucun chapitre rédigé : écrivez-le d'abord.`);
      return;
    }
    const manuscript = written
      .map((c) => `## ${c.title || `Chapitre ${c.chapter_number}`}\n\n${(c.content_markdown || '').trim()}`)
      .join('\n\n');
    onLoaded({ title: book.title, manuscript });
  };

  return (
    <Card className="p-5 mb-6">
      <div className="flex items-center justify-between gap-3 mb-1">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-amber-600" />
          <h2 className="font-semibold text-[#232F3E]">Reprendre un de mes livres</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-1" /> Actualiser
        </Button>
      </div>
      <p className="text-xs text-slate-500 mb-3">
        Le livre audio ne coûte rien de plus : choisissez un livre déjà écrit, son texte se place
        automatiquement ci-dessous. Vous pouvez aussi coller un texte à la main.
      </p>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Chargement de vos livres…
        </div>
      ) : books.length === 0 ? (
        <p className="text-sm text-slate-500">
          Aucun livre enregistré pour l'instant. Collez simplement votre texte plus bas.
        </p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {books.map((b) => (
            <button
              key={b.id}
              onClick={() => importBook(b)}
              disabled={importing === b.id}
              className="text-left border rounded-lg px-3 py-2 hover:border-amber-400 hover:bg-amber-50/60 transition disabled:opacity-60"
            >
              <div className="font-medium text-sm text-[#232F3E] truncate">{b.title || 'Sans titre'}</div>
              <div className="text-xs text-slate-500">
                {importing === b.id ? 'Chargement…' : 'Utiliser ce livre'}
              </div>
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
    </Card>
  );
}
