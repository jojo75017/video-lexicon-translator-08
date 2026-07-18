import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type Row = { id: string; title: string; project_type?: string | null };

const GENRES = ['Tous', 'Roman', 'Romance', 'Thriller', 'Fantasy', 'Jeunesse', 'Non-fiction'];

export default function V3GalleryPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState('');
  const [genre, setGenre] = useState('Tous');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('ebook_projects')
        .select('id,title,project_type')
        .order('created_at', { ascending: false })
        .limit(60);
      setRows((data as Row[]) || []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => rows.filter((r) => {
    if (q && !r.title.toLowerCase().includes(q.toLowerCase())) return false;
    if (genre !== 'Tous' && !(r.project_type || '').toLowerCase().includes(genre.toLowerCase())) return false;
    return true;
  }), [rows, q, genre]);

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-14">
      <h1 className="v3-serif text-4xl font-bold">Galerie</h1>
      <p className="text-sm text-[var(--v3-muted)] mt-1">Explore les histoires écrites dans l'atelier.</p>

      <div className="mt-8 flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--v3-muted)]" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un titre…"
            className="w-full h-11 rounded-full border border-black/10 pl-10 pr-4 text-sm outline-none focus:border-[var(--v3-orange)]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {GENRES.map((g) => (
            <button key={g} onClick={() => setGenre(g)} className={`v3-chip ${g === genre ? 'v3-chip-orange' : ''}`}>
              {g}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="mt-14 text-center text-[var(--v3-muted)]">Chargement…</div>
      ) : filtered.length === 0 ? (
        <div className="v3-card mt-10 text-center py-16 text-[var(--v3-muted)]">
          Aucune histoire ne correspond à ta recherche.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
          {filtered.map((r) => (
            <Link key={r.id} to={`/v3/book/${r.id}`} className="group">
              <div className="aspect-[3/4] rounded-lg bg-[var(--v3-ink)] text-white p-4 flex flex-col justify-end shadow-md group-hover:shadow-xl">
                <BookOpen className="w-4 h-4 text-white/40 mb-2" />
                <div className="text-[13px] font-semibold leading-tight line-clamp-3">{r.title}</div>
              </div>
              <div className="mt-2 text-[12px] font-medium truncate">{r.title}</div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
