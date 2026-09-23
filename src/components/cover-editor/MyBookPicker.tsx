/**
 * Encart très visible « Partir d'un de mes livres » : l'abonné choisit un livre
 * déjà enregistré et les champs de la couverture se remplissent automatiquement.
 * Aucune donnée inventée : seulement ce que l'abonné a enregistré.
 */
import { useEffect, useState } from 'react';
import { BookOpen, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { listMyBooks, type MyBookOption } from '@/lib/cover-editor/myBooks';

interface MyBookPickerProps {
  /** Appelé quand l'abonné choisit un livre. */
  onSelect: (book: MyBookOption) => void;
  /** Texte d'aide affiché sous la liste. */
  hint?: string;
}

export default function MyBookPicker({ onSelect, hint }: MyBookPickerProps) {
  const [books, setBooks] = useState<MyBookOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState('');

  const load = () => {
    setLoading(true);
    void listMyBooks()
      .then(setBooks)
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleChange = (raw: string) => {
    setValue(raw);
    const [kind, id] = raw.split(':');
    const book = books.find((b) => b.kind === kind && b.id === id);
    if (book) onSelect(book);
  };

  return (
    <section className="rounded-xl border-2 border-primary/50 bg-primary/5 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
          <BookOpen className="h-5 w-5 text-primary" />
          Partir d’un de mes livres
        </h2>
        <Button type="button" variant="ghost" size="sm" className="gap-1" onClick={load}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Actualiser
        </Button>
      </div>

      <select
        className="mt-3 w-full rounded-md border bg-background px-3 py-2 text-sm"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        aria-label="Choisir un livre enregistré"
      >
        <option value="">
          {loading
            ? 'Chargement de vos livres…'
            : books.length
              ? `Choisir un livre enregistré (${books.length})`
              : 'Aucun livre enregistré pour l’instant'}
        </option>
        {books.map((book) => (
          <option key={`${book.kind}-${book.id}`} value={`${book.kind}:${book.id}`}>
            {book.title}
          </option>
        ))}
      </select>

      <p className="mt-2 text-xs text-muted-foreground">
        {hint ?? 'Le titre, le sous-titre, l’auteur et le synopsis se remplissent depuis votre livre. Vous pouvez tout corriger ensuite.'}
      </p>
    </section>
  );
}
