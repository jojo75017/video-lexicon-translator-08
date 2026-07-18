import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type Row = { id: string; title: string; updated_at: string; chapters?: any[] | null };

export default function V3LibraryPage() {
  const nav = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) { nav('/v3/auth'); return; }
      setEmail(auth.user.email || null);
      const { data } = await supabase
        .from('ebook_projects')
        .select('id,title,updated_at,chapters')
        .eq('user_id', auth.user.id)
        .order('updated_at', { ascending: false });
      setRows((data as Row[]) || []);
      setLoading(false);
    })();
  }, [nav]);

  const started = rows.filter((r) => !r.chapters || (Array.isArray(r.chapters) && r.chapters.length === 0));
  const done = rows.filter((r) => Array.isArray(r.chapters) && r.chapters.length > 0);

  return (
    <section className="max-w-6xl mx-auto px-5 md:px-8 py-14">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="v3-serif text-4xl font-bold">Ma bibliothèque</h1>
          <p className="text-sm text-[var(--v3-muted)] mt-1">{email}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/v3/parametres" className="v3-btn v3-btn-outline"><Settings className="w-4 h-4" /> Paramètres</Link>
          <Link to="/v3/create" className="v3-btn v3-btn-primary"><Sparkles className="w-4 h-4" /> Nouveau livre</Link>
        </div>
      </div>

      {loading ? (
        <div className="mt-12 text-center text-[var(--v3-muted)]">Chargement…</div>
      ) : rows.length === 0 ? (
        <div className="v3-card mt-10 text-center py-16">
          <BookOpen className="w-10 h-10 text-[var(--v3-orange)] mx-auto" />
          <h2 className="v3-serif text-2xl font-bold mt-4">Ta bibliothèque est vide</h2>
          <p className="text-sm text-[var(--v3-muted)] mt-2">Écris ton premier livre en quelques minutes.</p>
          <button onClick={() => nav('/v3/create')} className="v3-btn v3-btn-primary mt-6">Commencer</button>
        </div>
      ) : (
        <>
          {done.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-bold mb-4">Terminés</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {done.map((r) => <BookCard key={r.id} r={r} />)}
              </div>
            </div>
          )}
          {started.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-bold mb-4">En cours</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {started.map((r) => <BookCard key={r.id} r={r} />)}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function BookCard({ r }: { r: Row }) {
  return (
    <Link to={`/v3/book/${r.id}`} className="group">
      <div className="aspect-[3/4] rounded-lg bg-[var(--v3-ink)] text-white p-4 flex flex-col justify-end shadow-md group-hover:shadow-xl transition-shadow">
        <BookOpen className="w-4 h-4 text-white/40 mb-2" />
        <div className="text-[13px] font-semibold leading-tight line-clamp-3">{r.title}</div>
      </div>
      <div className="mt-2 text-[12px] font-medium truncate">{r.title}</div>
    </Link>
  );
}
