import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BackButton } from "@/components/v3/BackButton";

type Book = { id: string; title: string; author_name?: string | null; kdp_description?: string | null; chapters?: unknown };

export default function V3BookManagerPage() {
  const nav = useNavigate();
  const [rows, setRows] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Book | null>(null);

  const load = async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) { nav('/v3/auth'); return; }
    const { data, error } = await supabase.from('ebook_projects')
      .select('id,title,author_name,kdp_description,chapters')
      .eq('user_id', auth.user.id).order('updated_at', { ascending: false });
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

  return (
    <section className="max-w-5xl mx-auto px-5 md:px-8 py-14">
      <div className="max-w-6xl mx-auto px-4 pt-4"><BackButton /></div>
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="v3-serif text-4xl font-bold">Mes livres</h1>
          <p className="text-sm text-[var(--v3-muted)] mt-1">Ouvre un livre pour retrouver le manuscrit, le sommaire et les exports.</p>
        </div>
        <button onClick={() => nav('/v3/create')} className="v3-btn v3-btn-primary"><Plus className="w-4 h-4" /> Ajouter</button>
      </div>

      {loading ? (
        <div className="mt-12 text-center text-[var(--v3-muted)]">Chargement…</div>
      ) : rows.length === 0 ? (
        <div className="v3-card mt-10 text-center py-14">
          <BookOpen className="w-8 h-8 text-[var(--v3-orange)] mx-auto" />
          <p className="mt-4 text-sm text-[var(--v3-muted)]">Aucun livre publié pour l'instant.</p>
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
              <div className="flex gap-2">
                <button onClick={() => nav(`/v3/create?projectId=${b.id}`)} className="v3-btn v3-btn-primary text-xs">
                  <BookOpen className="w-3.5 h-3.5" /> {chapterCount > 0 ? 'Ouvrir & exporter' : 'Ouvrir'}
                </button>
                <button onClick={() => setEditing(b)} className="v3-btn v3-btn-outline text-xs"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => remove(b.id)} className="v3-btn v3-btn-ghost text-xs text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          );})}
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
