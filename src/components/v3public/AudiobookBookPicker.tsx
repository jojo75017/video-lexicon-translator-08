import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Loader2, RefreshCw } from 'lucide-react';

type Source = 'ebook' | 'studio';

type Book = {
  key: string;
  id: string;
  source: Source;
  title: string;
  author: string | null;
  chapters: number;
  updated_at: string;
};

type EbookChapter = {
  title?: string | null;
  content?: string | null;
  subChapters?: { title?: string | null; content?: string | null }[] | null;
};

type Props = {
  onLoaded: (book: { title: string; author?: string | null; manuscript: string }) => void;
};

const hasText = (v?: string | null) => (v || '').trim().length > 0;

/**
 * Reprend un livre déjà écrit (générateur d'ebook ou studio) et remplit
 * le manuscrit du livre audio. Lecture seule : aucune écriture, aucun crédit.
 */
export default function AudiobookBookPicker({ onLoaded }: Props) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    const [ebooks, studio] = await Promise.all([
      supabase
        .from('ebook_projects')
        .select('id, title, author_name, chapters, updated_at')
        .order('updated_at', { ascending: false })
        .limit(60),
      supabase
        .from('cs_projects')
        .select('id, title, updated_at')
        .order('updated_at', { ascending: false })
        .limit(60),
    ]);

    if (ebooks.error && studio.error) {
      setError("Impossible de lire vos livres pour le moment.");
      setBooks([]);
      setLoading(false);
      return;
    }

    const list: Book[] = [];

    for (const row of (ebooks.data as { id: string; title: string | null; author_name: string | null; chapters: unknown; updated_at: string }[]) || []) {
      const chapters = Array.isArray(row.chapters) ? (row.chapters as EbookChapter[]) : [];
      const written = chapters.filter(
        (c) => hasText(c?.content) || (c?.subChapters || []).some((s) => hasText(s?.content)),
      );
      if (written.length === 0) continue;
      list.push({
        key: `ebook-${row.id}`,
        id: row.id,
        source: 'ebook',
        title: row.title || 'Sans titre',
        author: row.author_name,
        chapters: written.length,
        updated_at: row.updated_at,
      });
    }

    const studioRows = (studio.data as { id: string; title: string | null; updated_at: string }[]) || [];
    if (studioRows.length > 0) {
      const { data: chapterRows } = await supabase
        .from('cs_chapters')
        .select('project_id, content_markdown')
        .in('project_id', studioRows.map((r) => r.id));
      const counts = new Map<string, number>();
      for (const c of (chapterRows as { project_id: string; content_markdown: string | null }[]) || []) {
        if (hasText(c.content_markdown)) counts.set(c.project_id, (counts.get(c.project_id) || 0) + 1);
      }
      for (const row of studioRows) {
        const n = counts.get(row.id) || 0;
        if (n === 0) continue;
        list.push({
          key: `studio-${row.id}`,
          id: row.id,
          source: 'studio',
          title: row.title || 'Sans titre',
          author: null,
          chapters: n,
          updated_at: row.updated_at,
        });
      }
    }

    list.sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));
    setBooks(list);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const importBook = async (book: Book) => {
    setImporting(book.key);
    setError(null);
    try {
      if (book.source === 'ebook') {
        const { data, error: err } = await supabase
          .from('ebook_projects')
          .select('title, author_name, chapters')
          .eq('id', book.id)
          .maybeSingle();
        if (err || !data) throw new Error('read');
        const chapters = Array.isArray((data as { chapters: unknown }).chapters)
          ? ((data as { chapters: EbookChapter[] }).chapters)
          : [];
        const parts: string[] = [];
        chapters.forEach((c, i) => {
          const body = (c?.content || '').trim();
          const subs = (c?.subChapters || []).filter((s) => hasText(s?.content));
          if (!body && subs.length === 0) return;
          parts.push(`## ${(c?.title || `Chapitre ${i + 1}`).trim()}`);
          if (body) parts.push(body);
          subs.forEach((s, j) => {
            parts.push(`### ${(s?.title || `Section ${j + 1}`).trim()}`);
            parts.push((s?.content || '').trim());
          });
        });
        if (parts.length === 0) throw new Error('empty');
        onLoaded({
          title: (data as { title: string | null }).title || book.title,
          author: (data as { author_name: string | null }).author_name,
          manuscript: parts.join('\n\n'),
        });
        return;
      }

      const { data, error: err } = await supabase
        .from('cs_chapters')
        .select('chapter_number, title, content_markdown')
        .eq('project_id', book.id)
        .order('chapter_number', { ascending: true });
      if (err) throw new Error('read');
      const rows = (data as { chapter_number: number; title: string; content_markdown: string | null }[]) || [];
      const written = rows.filter((c) => hasText(c.content_markdown));
      if (written.length === 0) throw new Error('empty');
      onLoaded({
        title: book.title,
        manuscript: written
          .map((c) => `## ${c.title || `Chapitre ${c.chapter_number}`}\n\n${(c.content_markdown || '').trim()}`)
          .join('\n\n'),
      });
    } catch (e) {
      setError(
        (e as Error).message === 'empty'
          ? `« ${book.title} » n'a encore aucun chapitre rédigé : écrivez-le d'abord.`
          : "Ce livre n'a pas pu être chargé.",
      );
    } finally {
      setImporting(null);
    }
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
        Tous vos livres déjà rédigés apparaissent ici. Choisissez-en un : son texte se place
        automatiquement ci-dessous. Les livres encore vides ne sont pas proposés.
      </p>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Chargement de vos livres…
        </div>
      ) : books.length === 0 ? (
        <p className="text-sm text-slate-500">
          Aucun livre rédigé pour l'instant. Collez simplement votre texte plus bas.
        </p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {books.map((b) => (
            <button
              key={b.key}
              onClick={() => importBook(b)}
              disabled={importing === b.key}
              className="text-left border rounded-lg px-3 py-2 hover:border-amber-400 hover:bg-amber-50/60 transition disabled:opacity-60"
            >
              <div className="font-medium text-sm text-[#232F3E] truncate">{b.title}</div>
              <div className="text-xs text-slate-500">
                {importing === b.key
                  ? 'Chargement…'
                  : `${b.chapters} chapitre${b.chapters > 1 ? 's' : ''} rédigé${b.chapters > 1 ? 's' : ''}${b.author ? ` · ${b.author}` : ''}`}
              </div>
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
    </Card>
  );
}
